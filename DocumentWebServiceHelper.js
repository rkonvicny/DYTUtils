define("DS/DYTUtils/DocumentWebServiceHelper", ["DS/DYTUtils/Connector3DSpace", "DS/DYTUtils/DYTLogger"], (
  Connector3DSpace,
  logger
) => {
  "use strict"; // Je dobré ponechat pro lepší kontrolu chyb

  const module = {
    // Nová metoda pro získání detailů dokumentu podle ID
    getDocumentDetailsById: async function (docId) {
      logger.log(-1, `DocumentWebServiceHelper.getDocumentDetailsById: Fetching details for doc ID "${docId}"`);
      const options = {
        url: `/resources/v1/modeler/documents/${docId}?$fields=all&$include=all`, // Získání všech detailů včetně souborů
        method: "GET",
      };

      try {
        const response = await Connector3DSpace.callService(options, false);

        // Odpověď pro /documents/{docId} by měla vracet jeden objekt dokumentu v response.dataResp.data[0]
        if (response.dataResp && response.dataResp.data && response.dataResp.data.length > 0) {
          logger.log(-1, `DocumentWebServiceHelper.getDocumentDetailsById: Details fetched for doc ID "${docId}"`);
          return response.dataResp.data[0]; // Vracíme objekt dokumentu
        }
        logger.log(
          1, // Chyba, pokud dokument s daným ID nebyl nalezen nebo odpověď je neplatná
          `DocumentWebServiceHelper.getDocumentDetailsById: Document with ID "${docId}" not found or invalid response.`
        );
        return null;
      } catch (error) {
        logger.log(
          1,
          `DocumentWebServiceHelper.getDocumentDetailsById: Error fetching details for doc ID "${docId}"`,
          error
        );
        throw error;
      }
    },

    // Upravená metoda searchDocumentByTitle, která nyní provede 2 kroky
    searchDocumentByTitle: async function (documentTitle) {
      logger.log(-1, `DocumentWebServiceHelper.searchDocumentByTitle: Searching for title "${documentTitle}"`);
      const options = {
        url: `/resources/v1/modeler/documents/search?searchStr=${encodeURIComponent(documentTitle)}&nresults=1`, // První krok: najít dokument podle názvu (bez $include=files)
        method: "GET",
        // Pro GET není potřeba contentType ani data
      };

      try {
        // Pro GET požadavky typicky nepotřebujeme CSRF token
        const response = await Connector3DSpace.callService(options, false);

        if (response.dataResp && response.dataResp.data && response.dataResp.data.length > 0) {
          const firstFoundDocStub = response.dataResp.data[0]; // Získáme základní info (stub)
          logger.log(-1, `DocumentWebServiceHelper.searchDocumentByTitle: Document stub found: ${firstFoundDocStub.id}. Fetching details...`);
          // Druhý krok: zavoláme novou metodu pro získání plných detailů včetně souborů
          const detailedDoc = await this.getDocumentDetailsById(firstFoundDocStub.id);
          // Vracíme pole s jedním detailním dokumentem, aby volající kód mohl stále očekávat pole
          return detailedDoc ? [detailedDoc] : [];
        }
        logger.log(
          -1,
          `DocumentWebServiceHelper.searchDocumentByTitle: Document with title "${documentTitle}" not found.`
        );
        return []; // Vracíme prázdné pole, pokud dokument nebyl nalezen
      } catch (error) {
        logger.log(
          1,
          `DocumentWebServiceHelper.searchDocumentByTitle: Error searching for document "${documentTitle}"`,
          error
        );
        throw error;
      }
    },

    // Metoda downloadFileContentByName zůstává nezměněna
    downloadFileContentByName: async function (docId, filename) { // Změna parametru z fileId na filename
      logger.log(
        -1,
        `DocumentWebServiceHelper.downloadFileContentByName: Downloading content of file named "${filename}" from doc ID "${docId}"`
      );
      try {
        // Krok 0: Získání detailů dokumentu pro nalezení fyzického ID souboru podle jeho názvu
        const detailedDoc = await this.getDocumentDetailsById(docId);
        if (!detailedDoc || !detailedDoc.relateddata || !detailedDoc.relateddata.files) {
          const errorMsg = `Could not retrieve document details or files for document ID "${docId}" to find file "${filename}".`;
          logger.log(1, `DocumentWebServiceHelper.downloadFileContentByName: ${errorMsg}`);
          throw new Error(errorMsg);
        }

        const filesInDocument = detailedDoc.relateddata.files;
        const targetFileObject = filesInDocument.find(
          (file) => file.dataelements && file.dataelements.name === filename
        );

        if (!targetFileObject) {
          const errorMsg = `File named "${filename}" not found in document ID "${docId}".`;
          logger.log(1, `DocumentWebServiceHelper.downloadFileContentByName: ${errorMsg}`);
          throw new Error(errorMsg);
        }

        // Předpokládáme, že 'id' je vlastnost obsahující fyzické ID souboru.
        // Může být potřeba upravit, pokud je fyzické ID uloženo pod jiným názvem (např. physicalid).
        const physicalFileId = targetFileObject.id;
        if (!physicalFileId) {
            const errorMsg = `Physical ID not found for file named "${filename}" in document ID "${docId}". File object: ${JSON.stringify(targetFileObject)}`;
            logger.log(1, `DocumentWebServiceHelper.downloadFileContentByName: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        logger.log(-1, `DocumentWebServiceHelper.downloadFileContentByName: Found physical file ID "${physicalFileId}" for filename "${filename}".`);


        // Krok 1: Získání download ticketu pro soubor pomocí jeho fyzického ID
        const ticketOptions = {
          url: `/resources/v1/modeler/documents/${docId}/files/${physicalFileId}/DownloadTicket`,
          method: "PUT",
        };
        // Pro PUT požadavky Connector3DSpace.callService s druhým argumentem 'true' zajistí CSRF token.
        const ticketResponse = await Connector3DSpace.callService(ticketOptions, true);

        if (
          !ticketResponse.dataResp ||
          !ticketResponse.dataResp.data ||
          ticketResponse.dataResp.data.length === 0 ||
          !ticketResponse.dataResp.data[0].dataelements.ticketURL
        ) {
          const errorMsg = `Could not get download ticket for file "${filename}" (physical ID: ${physicalFileId}) in document "${docId}". Response: ${JSON.stringify(
            ticketResponse.dataResp
          )}`;
          logger.log(1, `DocumentWebServiceHelper.downloadFileContentByName: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        const fcsDownloadUrl = ticketResponse.dataResp.data[0].dataelements.ticketURL;
        logger.log(
          -1,
          `DocumentWebServiceHelper.downloadFileContentByName: FCS Download URL received for "${filename}": ${fcsDownloadUrl}`
        );

        // Krok 2: Stažení souboru z FCS pomocí proxyCall
        const downloadOptions = {
          url: fcsDownloadUrl,
          method: "GET",
          type: "blob", // Chceme binární data jako Blob
        };
        // FCS volání jsou typicky přes proxy a nepotřebují 3DSpace kontext v hlavičce
        const fileDataResponse = await Connector3DSpace.proxyCall(downloadOptions, false); // false pro withContext

        if (!(fileDataResponse.dataResp instanceof Blob)) {
          const errorMsg = `Downloaded content from FCS for "${filename}" is not in expected Blob format. Received: ${typeof fileDataResponse.dataResp}`;
          logger.log(1, `DocumentWebServiceHelper.downloadFileContentByName: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        logger.log(-1, `DocumentWebServiceHelper.downloadFileContentByName: File Blob received for "${filename}".`);

        // Krok 3: Převedení Blob na text (protože očekáváme JSON)
        const fileContentString = await fileDataResponse.dataResp.text();
        logger.log(
          -1,
          `DocumentWebServiceHelper.downloadFileContentByName: File content converted to string for "${filename}".`
        );
        return fileContentString;
      } catch (error) {
        logger.log(
          1,
          `DocumentWebServiceHelper.downloadFileContentByName: Error downloading content of file named "${filename}" from doc ID "${docId}"`,
          error
        );
        throw error;
      }
    },
    // searchDocumentsBy6WTags a searchDocumentsByPostQuery (pokud byly přidány) zde nejsou zahrnuty v diffu, ale měly by zůstat nebo být upraveny podle potřeby
  };
  return module;
});
