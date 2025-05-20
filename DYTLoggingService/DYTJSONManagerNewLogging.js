define("DS/DYTUtils/DYTJSONManager", [
  "DS/DYTUtils/DocumentWebServiceHelper",
  "DS/DYTUtils/DYTLogger", // Může být stále potřeba pro specifické logy
  "DS/DYTUtils/FunctionWrapper"  // Importujeme náš nový wrapper
], function (DocumentWebServiceHelper,
    logger, // Instance loggeru
    wrapMethod // Naše funkce pro obalení
  ) {
    const moduleName = "DYTJSONManager"; // Název modulu pro logování

    const originalMethods = {
      /**
       * Uloží JSON data do souboru v dokumentu.
       * Implementuje logiku podle RD-002_Save_JSON_Data.plantuml,
       * využívá DocumentWebServiceHelper pro nízkoúrovňové operace.
       */
      saveJsonToDocument: async function (documentTitle, jsonFilename, jsonDataObject) {
        // Původní logy jsou odstraněny
        let docId = null;
        let isLocked = false;

        try {
          // Krok 1: Zajištění existence dokumentu (UC-010 EnsureDocExistsSvc)
          logger.log(-1, `DYTJSONManager.saveJsonToDocument: Ensuring document "${documentTitle}" exists...`);
          const existingDocs = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);
          if (existingDocs && existingDocs.length > 0) {
            docId = existingDocs[0].id;
          } else {
            const newDocument = await DocumentWebServiceHelper.createNewDocument(documentTitle);
            docId = newDocument.id;
          }

          // Krok 2: Zamčení dokumentu (UC-007 LockDocSvc)
          await DocumentWebServiceHelper.reserveDocument(docId);
          isLocked = true;

          // Krok 3: Smazání existujícího souboru se zadaným názvem (UC-009 DeleteFileSvc)
          try {
            const existingFileId = await DocumentWebServiceHelper._getPhysicalFileIdByName(docId, jsonFilename);
            if (existingFileId) { // Ujistíme se, že existingFileId není null/undefined
              await DocumentWebServiceHelper._deleteFileById(docId, existingFileId);
            }
          } catch (e) {
            // Pokud _getPhysicalFileIdByName vyhodí chybu (soubor nenalezen), ignorujeme ji zde,
            // protože to znamená, že soubor není třeba mazat.
            // Ostatní chyby (např. problém s DocumentWebServiceHelper.getDocumentDetailsById) by měly být propagovány.
            if (!e.message.includes("not found in document")) { // Jednoduchá kontrola, zda chyba je "file not found"
              throw e; // Propagovat jiné chyby
            }
            // Pokud je to "file not found", pokračujeme dál.
          }

          // Krok 4: Nahrání nového souboru (UC-015 GetUploadTicketSvc + UC-016 CompleteFileUploadSvc)
          // Voláme novou metodu uploadFile z DocumentWebServiceHelper
          const uploadedFileMetadata = await DocumentWebServiceHelper.uploadFile(docId, jsonFilename, jsonDataObject);

          return uploadedFileMetadata;
        } catch (error) {
          const baseErrorMsg = `Error saving JSON data to file "${jsonFilename}" in document "${documentTitle}".`;
          logger.log(1, `DYTJSONManager.saveJsonToDocument: ${baseErrorMsg}`, error.message || error);
          // Krok 5 (část): Odemčení dokumentu v případě chyby (UC-008 UnlockDocSvc)
          if (isLocked && docId) {
            try {
              await DocumentWebServiceHelper.unreserveDocument(docId);
            } catch (unlockError) {
              // Logování chyby při odemykání je také řešeno wrapperem pro unreserveDocument
              // Zde můžeme přidat specifický log, pokud je to potřeba
              console.error("DYTJSONManager: Critical - Failed to unlock document after error during save.", unlockError);
            }
          }
          throw new Error(`${baseErrorMsg} Original error: ${error.message || error}`);
        } finally {
          // Krok 5 (hlavní): Odemčení dokumentu po úspěšné operaci (UC-008 UnlockDocSvc)
          if (isLocked && docId) {
            try {
              await DocumentWebServiceHelper.unreserveDocument(docId);
            } catch (unlockError) {
              console.error("DYTJSONManager: Critical - Failed to unlock document in finally block after save.", unlockError);
            }
          }
        }
      },
      /**
       * Načte JSON data ze souboru v dokumentu.
       */
      loadJsonFromDocument: async function (documentTitle, jsonFilename) {
        // Původní logy jsou odstraněny
        try {
          // Krok 1: Vyhledání dokumentu podle názvu (využívá DocumentWebServiceHelper.searchDocumentByTitle)
          logger.log(-1, `DYTJSONManager.loadJsonFromDocument: Searching for document "${documentTitle}"...`);
          const searchResults = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);

          if (!searchResults || searchResults.length === 0) {
            const errorMsg = `Document with title "${documentTitle}" not found. Cannot load JSON data.`;
            throw new Error(errorMsg);
          }
          const document = searchResults[0];
          const docId = document.id;

          // Krok 2: Stažení obsahu JSON souboru (využívá DocumentWebServiceHelper.downloadFileContentByName)
          const jsonStringContent = await DocumentWebServiceHelper.downloadFileContentByName(docId, jsonFilename);

          // Krok 3: Parsování JSON obsahu
          const jsonData = JSON.parse(jsonStringContent);
          return jsonData;
        } catch (error) {
          const baseErrorMsg = `Error loading JSON data from file "${jsonFilename}" in document "${documentTitle}".`;
          throw new Error(`${baseErrorMsg} Original error: ${error.message || error}`);
        }
      },
    };

    // Vytvoříme nový objekt, který bude obsahovat obalené metody
    const wrappedModule = {};
    for (const key in originalMethods) {
      if (Object.prototype.hasOwnProperty.call(originalMethods, key)) {
        wrappedModule[key] = wrapMethod(originalMethods[key], key, moduleName);
      }
    }

    return wrappedModule; // Vracíme modul s obalenými metodami
  });
