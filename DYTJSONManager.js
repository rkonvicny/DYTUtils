define("DS/DYTUtils/DYTJSONManager", ["DS/DYTUtils/DocumentWebServiceHelper", "DS/DYTUtils/DYTLogger"], (
  DocumentWebServiceHelper,
  logger
) => {
  let module = {
    /**
     * Uloží JSON data do souboru v dokumentu.
     * Implementuje logiku podle RD-002_Save_JSON_Data.plantuml,
     * využívá DocumentWebServiceHelper pro nízkoúrovňové operace.
     * @param {string} documentTitle Název cílového dokumentu.
     * @param {string} jsonFilename Název cílového JSON souboru.
     * @param {Object} jsonDataObject JavaScript objekt k uložení.
     * @returns {Promise<Object>} Objekt reprezentující metadata nahraného souboru nebo chybová zpráva.
     */
    saveJsonToDocument: async function (documentTitle, jsonFilename, jsonDataObject) {
      logger.log(
        -1,
        `DYTJSONManager.saveJsonToDocument: Saving JSON to file "${jsonFilename}" in document "${documentTitle}"`
      );
      let docId = null;
      let isLocked = false;

      try {
        // Krok 1: Zajištění existence dokumentu (UC-010 EnsureDocExistsSvc)
        logger.log(-1, `DYTJSONManager.saveJsonToDocument: Ensuring document "${documentTitle}" exists...`);
        const existingDocs = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);
        if (existingDocs && existingDocs.length > 0) {
          docId = existingDocs[0].id;
          logger.log(-1, `DYTJSONManager.saveJsonToDocument: Document "${documentTitle}" found with ID "${docId}".`);
        } else {
          logger.log(
            -1,
            `DYTJSONManager.saveJsonToDocument: Document "${documentTitle}" not found. Creating new one...`
          );
          const newDocument = await DocumentWebServiceHelper.createNewDocument(documentTitle);
          docId = newDocument.id;
          logger.log(-1, `DYTJSONManager.saveJsonToDocument: New document created with ID "${docId}".`);
        }

        // Krok 2: Zamčení dokumentu (UC-007 LockDocSvc)
        logger.log(-1, `DYTJSONManager.saveJsonToDocument: Locking document ID "${docId}"...`);
        await DocumentWebServiceHelper.reserveDocument(docId);
        isLocked = true;
        logger.log(-1, `DYTJSONManager.saveJsonToDocument: Document ID "${docId}" locked.`);

        // Krok 3: Smazání existujícího souboru se zadaným názvem (UC-009 DeleteFileSvc)
        logger.log(
          -1,
          `DYTJSONManager.saveJsonToDocument: Checking if file "${jsonFilename}" exists in document ID "${docId}" for deletion (UC-009)...`
        );
        const existingFileId = await DocumentWebServiceHelper._getPhysicalFileIdByName(docId, jsonFilename);

        if (existingFileId) {
          logger.log(
            -1,
            `DYTJSONManager.saveJsonToDocument: File "${jsonFilename}" (ID: ${existingFileId}) found. Deleting it...`
          );
          await DocumentWebServiceHelper._deleteFileById(docId, existingFileId);
          logger.log(-1, `DYTJSONManager.saveJsonToDocument: File "${jsonFilename}" deleted successfully.`);
        } else {
          logger.log(
            -1,
            `DYTJSONManager.saveJsonToDocument: File "${jsonFilename}" not found in document ID "${docId}". No deletion needed.`
          );
        }

        // Krok 4: Nahrání nového souboru (UC-015 GetUploadTicketSvc + UC-016 CompleteFileUploadSvc)
        
        // Zde by byla logika pro nahrání souboru:
        // 1. Převedení jsonDataObject na JSON string a pak na Blob.
        // 2. Využití DocumentWebServiceHelper._getUploadTicket (pokud by existoval).
        // 3. Využití DocumentWebServiceHelper._uploadFileToFCS (pokud by existoval).
        // 4. Případné potvrzení check-inu.

        

        logger.log(
          -1,
          `DYTJSONManager.saveJsonToDocument: Uploading file "${jsonFilename}" to document ID "${docId}"...`
        );
        
        // Voláme novou metodu uploadFile z DocumentWebServiceHelper
        const uploadedFileMetadata = await DocumentWebServiceHelper.uploadFile(docId, jsonFilename, jsonDataObject);

        logger.log(-1, `DYTJSONManager.saveJsonToDocument: File "${jsonFilename}" uploaded successfully. Metadata: ${JSON.stringify(
            uploadedFileMetadata,
            null,
            2
          )}`);
        return uploadedFileMetadata;
      } catch (error) {
        const baseErrorMsg = `Error saving JSON data to file "${jsonFilename}" in document "${documentTitle}".`;
        logger.log(1, `DYTJSONManager.saveJsonToDocument: ${baseErrorMsg}`, error.message || error);
        // Krok 5 (část): Odemčení dokumentu v případě chyby (UC-008 UnlockDocSvc)
        if (isLocked && docId) {
          try {
            logger.log(
              -1,
              `DYTJSONManager.saveJsonToDocument: Attempting to unlock document ID "${docId}" after error...`
            );
            await DocumentWebServiceHelper.unreserveDocument(docId);
            logger.log(-1, `DYTJSONManager.saveJsonToDocument: Document ID "${docId}" unlocked after error.`);
          } catch (unlockError) {
            logger.log(
              1,
              `DYTJSONManager.saveJsonToDocument: Failed to unlock document ID "${docId}" after error.`,
              unlockError.message || unlockError
            );
          }
        }
        throw new Error(`${baseErrorMsg} Original error: ${error.message || error}`);
      } finally {
        // Krok 5 (hlavní): Odemčení dokumentu po úspěšné operaci (UC-008 UnlockDocSvc)
        if (isLocked && docId) {
          try {
            logger.log(
              -1,
              `DYTJSONManager.saveJsonToDocument: Attempting to unlock document ID "${docId}" in finally block...`
            );
            await DocumentWebServiceHelper.unreserveDocument(docId);
            logger.log(-1, `DYTJSONManager.saveJsonToDocument: Document ID "${docId}" unlocked successfully.`);
          } catch (unlockError) {
            logger.log(
              1,
              `DYTJSONManager.saveJsonToDocument: Failed to unlock document ID "${docId}" in finally block.`,
              unlockError.message || unlockError
            );
            // Zde bychom mohli zvážit, zda původní chybu (pokud existovala) přepsat, nebo tuto chybu přidat k ní.
          }
        }
      }
    },
    /**
     * Načte JSON data ze souboru v dokumentu.
     * Využívá DocumentWebServiceHelper.loadJsonDataFromDocument.
     * @param {string} documentTitle Název dokumentu.
     * @param {string} jsonFilename Název JSON souboru.
     * @returns {Promise<Object>} Parsovaná JSON data.
     */
    loadJsonFromDocument: async function (documentTitle, jsonFilename) {
      logger.log(
        -1,
        `DYTJSONManager.loadJsonFromDocument: Loading JSON from file "${jsonFilename}" in document "${documentTitle}"`
      );
      try {
        // Krok 1: Vyhledání dokumentu podle názvu (využívá DocumentWebServiceHelper.searchDocumentByTitle)
        logger.log(-1, `DYTJSONManager.loadJsonFromDocument: Searching for document "${documentTitle}"...`);
        const searchResults = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);

        if (!searchResults || searchResults.length === 0) {
          const errorMsg = `Document with title "${documentTitle}" not found. Cannot load JSON data.`;
          logger.log(1, `DYTJSONManager.loadJsonFromDocument: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        const document = searchResults[0];
        const docId = document.id;
        logger.log(-1, `DYTJSONManager.loadJsonFromDocument: Document found with ID "${docId}".`);

        // Krok 2: Stažení obsahu JSON souboru (využívá DocumentWebServiceHelper.downloadFileContentByName)
        logger.log(
          -1,
          `DYTJSONManager.loadJsonFromDocument: Downloading content of file "${jsonFilename}" from document ID "${docId}"...`
        );
        const jsonStringContent = await DocumentWebServiceHelper.downloadFileContentByName(docId, jsonFilename);

        // Krok 3: Parsování JSON obsahu
        logger.log(-1, `DYTJSONManager.loadJsonFromDocument: Parsing JSON content from file "${jsonFilename}"...`);
        const jsonData = JSON.parse(jsonStringContent);
        logger.log(
          -1,
          `DYTJSONManager.loadJsonFromDocument: JSON data successfully loaded and parsed from "${jsonFilename}" in document "${documentTitle}".`
        );
        return jsonData;
      } catch (error) {
        logger.log(1, `DYTJSONManager.loadJsonFromDocument: Error - ${error.message}`, error);
        throw error; // Propagate the error
        const baseErrorMsg = `Error loading JSON data from file "${jsonFilename}" in document "${documentTitle}".`;
        logger.log(1, `DYTJSONManager.loadJsonFromDocument: ${baseErrorMsg}`, error.message || error);
        throw new Error(`${baseErrorMsg} Original error: ${error.message || error}`);
      }
    },
  };
  return module;
});
