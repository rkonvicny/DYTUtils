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
          logger.log(
            -1,
            `DocumentWebServiceHelper.searchDocumentByTitle: Document stub found: ${firstFoundDocStub.id}. Fetching details...`
          );
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
    /**
     * Vytvoří nový dokument s daným názvem.
     * @param {string} documentTitle
     * @returns {Promise<Object>} Odpověď z API.
     * @throws {Error} Pokud dojde k chybě při vytváření dokumentu.
     */
    createNewDocument: async function (documentTitle) {
      logger.log(-1, `DocumentWebServiceHelper.createNewDocument: Creating new document "${documentTitle}"`);
      // Krok 1: Zkontrolovat, zda dokument s tímto názvem již neexistuje
      logger.log(
        -1,
        `DocumentWebServiceHelper.createNewDocument: Checking if document with title "${documentTitle}" already exists...`
      );
      const existingDocuments = await this.searchDocumentByTitle(documentTitle); // Použijeme this pro volání jiné metody modulu

      if (existingDocuments && existingDocuments.length > 0) {
        const errorMsg = `Document with title "${documentTitle}" already exists. ID: ${existingDocuments[0].id}. Creation aborted.`;
        logger.log(1, `DocumentWebServiceHelper.createNewDocument: ${errorMsg}`);
        throw new Error(errorMsg); // Vyhodíme chybu, kterou zachytí volající kód
      }
      logger.log(
        -1,
        `DocumentWebServiceHelper.createNewDocument: Document with title "${documentTitle}" does not exist. Proceeding with creation.`
      );

      const docDetails = {
        data: [
          {
            dataelements: {
              title: documentTitle,
              description: "Newly created document",
            },
          },
        ],
      };
      const options = {
        url: `/resources/v1/modeler/documents`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(docDetails), // Převádíme objekt na JSON,
      };

      try {
        const response = await Connector3DSpace.callService(options, true); // true pro CSRF token
        logger.log(
          -1,
          `DocumentWebServiceHelper.createNewDocument: Document created successfully. Response: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
        return response.dataResp.data[0]; // Vracíme vytvořený dokument
      } catch (error) {
        logger.log(1, `DocumentWebServiceHelper.createNewDocument: Error creating document "${documentTitle}"`, error);
        throw error;
      }
    },

    // Nová pomocná metoda: Získání fyzického ID souboru podle názvu
    _getPhysicalFileIdByName: async function (docId, filename) {
      logger.log(
        -1,
        `DocumentWebServiceHelper._getPhysicalFileIdByName: Finding physical ID for file "${filename}" in doc ID "${docId}"`
      );
      // Krok 0: Získání detailů dokumentu pro nalezení fyzického ID souboru podle jeho názvu
      const detailedDoc = await this.getDocumentDetailsById(docId);
      if (!detailedDoc || !detailedDoc.relateddata || !detailedDoc.relateddata.files) {
        const errorMsg = `Could not retrieve document details or files for document ID "${docId}" to find file "${filename}".`;
        logger.log(1, `DocumentWebServiceHelper._getPhysicalFileIdByName: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const filesInDocument = detailedDoc.relateddata.files;
      const targetFileObject = filesInDocument.find(
        (file) => file.dataelements && file.dataelements.title === filename
      );

      if (!targetFileObject) {
        const errorMsg = `File named "${filename}" not found in document ID "${docId}".`;
        logger.log(
          -1, // Změna úrovně logu, protože to nemusí být nutně chyba, ale očekávaný stav
          `DocumentWebServiceHelper._getPhysicalFileIdByName: ${errorMsg} Returning null.`
        );
        return null;
      }

      // Předpokládáme, že 'id' je vlastnost obsahující fyzické ID souboru.
      // Může být potřeba upravit, pokud je fyzické ID uloženo pod jiným názvem (např. physicalid).
      const physicalFileId = targetFileObject.id;
      if (!physicalFileId) {
        const errorMsg = `Physical ID not found for file named "${filename}" in document ID "${docId}". File object: ${JSON.stringify(
          targetFileObject
        )}`;
        logger.log(1, `DocumentWebServiceHelper._getPhysicalFileIdByName: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      logger.log(
        -1,
        `DocumentWebServiceHelper._getPhysicalFileIdByName: Found physical file ID "${physicalFileId}" for filename "${filename}".`
      );
      return physicalFileId;
    },

    /**
     * Získá upload ticket pro soubor v dokumentu.
     * @param {string} docId - ID dokumentu.
     * @param {string} filename - Název souboru.
     * @returns {Promise<Object>} Odpověď z API.
     * @throws {Error} Pokud dojde k chybě při získávání ticketu.
     */
    getCheckinTicket: async function (docId, filename) {
      logger.log(
        -1,
        `DocumentWebServiceHelper.getCheckinTicket: Getting checkin ticket for file "${filename}" in doc ID "${docId}" (UC-015)`
      );
      const ticketOptions = {
        url: `/resources/v1/modeler/documents/${docId}/files/CheckinTicket`,
        method: "PUT",
        contentType: "application/json",
      };
      const ticketResponse = await Connector3DSpace.callService(ticketOptions, true); // PUT vyžaduje CSRF

      if (!ticketResponse.dataResp || !ticketResponse.dataResp.data || ticketResponse.dataResp.data.length === 0) {
        const errorMsg = `Could not get checkin ticket for file "${filename}" in document "${docId}". Response: ${JSON.stringify(
          ticketResponse.dataResp
        )}`;
        logger.log(1, `DocumentWebServiceHelper.getCheckinTicket: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      return ticketResponse.dataResp.data[0]; // Vracíme objekt s ticketem (obsahuje ticketURL, objectId, etc.)
    },

    // Nová pomocná metoda: Získání download ticketu
    _getDownloadTicket: async function (docId, physicalFileId) {
      logger.log(
        -1,
        `DocumentWebServiceHelper._getDownloadTicket: Getting download ticket for physical file ID "${physicalFileId}" in doc ID "${docId}"`
      );
      const ticketOptions = {
        url: `/resources/v1/modeler/documents/${docId}/files/${physicalFileId}/DownloadTicket`,
        method: "PUT",
      };
      const ticketResponse = await Connector3DSpace.callService(ticketOptions, true);

      if (
        !ticketResponse.dataResp ||
        !ticketResponse.dataResp.data ||
        ticketResponse.dataResp.data.length === 0 ||
        !ticketResponse.dataResp.data[0].dataelements.ticketURL
      ) {
        const errorMsg = `Could not get download ticket for physical file ID "${physicalFileId}" in document "${docId}". Response: ${JSON.stringify(
          ticketResponse.dataResp
        )}`;
        logger.log(1, `DocumentWebServiceHelper._getDownloadTicket: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      return ticketResponse.dataResp.data[0].dataelements.ticketURL;
    },

    // Metoda downloadFileContentByName zůstává nezměněna
    downloadFileContentByName: async function (docId, filename) {
      // Změna parametru z fileId na filename
      logger.log(
        -1,
        `DocumentWebServiceHelper.downloadFileContentByName: Downloading content of file named "${filename}" from doc ID "${docId}"`
      );
      try {
        // Krok 1: Získání fyzického ID
        const physicalFileId = await this._getPhysicalFileIdByName(docId, filename);

        // Krok 2: Získání download ticketu
        const fcsDownloadUrl = await this._getDownloadTicket(docId, physicalFileId);
        logger.log(
          -1,
          `DocumentWebServiceHelper.downloadFileContentByName: FCS Download URL received for "${filename}": ${fcsDownloadUrl}`
        );

        // Krok 2: Stažení souboru z FCS (nahrazeno voláním pomocné funkce)
        const fileBlob = await this._downloadFileFromFCS(fcsDownloadUrl);
        // Logování, že Blob byl přijat, je již v _downloadFileFromFCS,
        // ale pro konzistenci s původním chováním a logováním v této funkci ho zde můžeme ponechat.
        logger.log(-1, `DocumentWebServiceHelper.downloadFileContentByName: File Blob received for "${filename}".`);

        // Krok 3: Převedení Blob na text
        const fileContentString = await this._blobToString(fileBlob);
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

    // Nová pomocná metoda: Nahrání souboru na FCS (UC-016)
    _uploadFileToFCS: async function (checkinTicket, filename, jsonDataObject) {
      logger.log(
        -1,
        `DocumentWebServiceHelper._uploadFileToFCS: Uploading to FCS URL: ${checkinTicket.ticketURL} (UC-016)`
      );
      const jsonString = JSON.stringify(jsonDataObject, null, 2);
      const fileBlob = new Blob([jsonString], { type: "application/json" });
      let fileInfoObject = {
        title: filename,
        file: new File([fileBlob], filename),
      };
      let formData = new FormData();
      formData.append(checkinTicket.dataelements.ticketparamname, checkinTicket.dataelements.ticket);
      formData.append("file_0", fileInfoObject.file);
      const uploadOptions = {
        method: "POST", // Pro nahrání souboru se obvykle používá PUT
        body: formData, // FormData pro nahrání souboru
      };
      // FCS volání jsou typicky přes proxy a nepotřebují 3DSpace kontext v hlavičce
      // const uploadResponse = await Connector3DSpace.call3DSpace(uploadOptions); // false pro withContext
      let fetchResult = await fetch(checkinTicket.dataelements.ticketURL, uploadOptions);
      const uploadResponse = await fetchResult.text();
      // Úspěšná odpověď z FCS se může lišit, často je to 200 OK nebo 204 No Content.
      // Zde předpokládáme, že úspěch znamená, že volání proběhlo bez vyhození chyby.
      logger.log(
        -1,
        `DocumentWebServiceHelper._uploadFileToFCS: File uploaded to FCS successfully. Response: ${JSON.stringify(
          uploadResponse,
          null,
          2
        )}`
      );
      return uploadResponse.dataResp; // Může obsahovat metadata z FCS
    },

    // Nová pomocná metoda: Stažení souboru z FCS (vrací Blob)
    _downloadFileFromFCS: async function (fcsDownloadUrl) {
      logger.log(-1, `DocumentWebServiceHelper._downloadFileFromFCS: Downloading from FCS URL: ${fcsDownloadUrl}`);
      const downloadOptions = {
        url: fcsDownloadUrl,
        method: "GET",
        type: "blob", // Chceme binární data jako Blob
      };
      // FCS volání jsou typicky přes proxy a nepotřebují 3DSpace kontext v hlavičce
      const fileDataResponse = await Connector3DSpace.proxyCall(downloadOptions, false); // false pro withContext

      if (!(fileDataResponse.dataResp instanceof Blob)) {
        const errorMsg = `Downloaded content from FCS is not in expected Blob format. Received: ${typeof fileDataResponse.dataResp}`;
        logger.log(1, `DocumentWebServiceHelper._downloadFileFromFCS: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      logger.log(-1, `DocumentWebServiceHelper._downloadFileFromFCS: File Blob received.`);
      return fileDataResponse.dataResp;
    },

    // Nová pomocná metoda: Převod Blob na text
    _blobToString: async function (blob) {
      logger.log(-1, `DocumentWebServiceHelper._blobToString: Converting Blob to string.`);
      try {
        const fileContentString = await blob.text();
        logger.log(-1, `DocumentWebServiceHelper._blobToString: Blob successfully converted to string.`);
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

    /**
     * Orchestruje proces nahrání souboru do existujícího dokumentu.
     * Získá upload ticket a nahraje soubor na FCS.
     * @param {string} docId ID cílového dokumentu.
     * @param {string} filename Název souboru k nahrání.
     * @param {Blob|File} fileContent Obsah souboru jako Blob nebo File objekt.
     * @returns {Promise<Object>} Metadata nahraného souboru nebo výsledek operace.
     */
    uploadFile: async function (docId, filename, jsonDataObject) {
      logger.log(
        -1,
        `DocumentWebServiceHelper.uploadFile: Starting upload process for file "${filename}" to doc ID "${docId}"`
      );
      try {
        // Krok 1: Získání upload ticketu
        const checkinTicket = await this._getCheckinTicket(docId, filename);
        const fcsUploadUrl = checkinTicket.dataelements.ticketURL;
        logger.log(-1, `DocumentWebServiceHelper.uploadFile: Received FCS Upload URL: ${fcsUploadUrl}`);
        // Krok 2: Získání receipt

        // Krok 2: Nahrání souboru na FCS
        const uploadResult = await this._uploadFileToFCS(checkinTicket, filename, jsonDataObject);
        logger.log(-1, `DocumentWebServiceHelper.uploadFile: File "${filename}" uploaded to FCS.`);
        return checkinTicket; // Vracíme ticket, který obsahuje objectId (ID souboru) a další info
      } catch (error) {
        logger.log(
          1,
          `DocumentWebServiceHelper.uploadFile: Error uploading file "${filename}" to doc ID "${docId}"`,
          error
        );
        throw error;
      }
    },

    // Nová metoda pro získání metadat souborů dokumentu podle ID (odpovídá UC-013)
    getDocumentFilesMetadata: async function (docId) {
      logger.log(-1, `DocumentWebServiceHelper.getDocumentFilesMetadata: Fetching file metadata for doc ID "${docId}"`);
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files`, // Endpoint specified by UC-013
        method: "GET",
      };

      try {
        const response = await Connector3DSpace.callService(options, false);

        // Odpověď pro /documents/{docId}/files by měla vracet pole objektů souborů v response.dataResp.data
        if (response.dataResp && response.dataResp.data && Array.isArray(response.dataResp.data)) {
          logger.log(
            -1,
            `DocumentWebServiceHelper.getDocumentFilesMetadata: File metadata fetched for doc ID "${docId}". Found ${response.dataResp.data.length} files.`
          );
          return response.dataResp.data; // Vracíme pole objektů souborů
        }
        logger.log(
          1, // Chyba, pokud odpověď není platná nebo neobsahuje pole dat
          `DocumentWebServiceHelper.getDocumentFilesMetadata: Invalid response fetching file metadata for doc ID "${docId}". Response: ${JSON.stringify(
            response.dataResp
          )}`
        );
        return []; // Vracíme prázdné pole v případě neplatné odpovědi nebo absence dat
      } catch (error) {
        logger.log(
          1,
          `DocumentWebServiceHelper.getDocumentFilesMetadata: Error fetching file metadata for doc ID "${docId}"`,
          error
        );
        throw error;
      }
    },

    /**
     * Rezervuje dokument podle jeho ID (UC-007).
     * @param {string} docId
     * @returns {Promise<Object>} Odpověď z API.
     * @throws {Error} Pokud dojde k chybě při rezervaci.
     */
    reserveDocument: async function (docId) {
      logger.log(-1, `DocumentWebServiceHelper.reserveDocument: Reserving document ID "${docId}"`);
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/reserve`,
        method: "PUT",
        // Pro PUT s prázdným tělem není potřeba contentType ani data,
        // ale pokud by API vyžadovalo prázdný JSON objekt:
        // contentType: "application/json",
        // data: JSON.stringify({}),
      };

      try {
        // Pro PUT požadavky Connector3DSpace.callService s druhým argumentem 'true' zajistí CSRF token.
        const response = await Connector3DSpace.callService(options, true);
        // Úspěšná odpověď na reserve může být 200 OK s tělem nebo 204 No Content.
        // Zde předpokládáme, že úspěch znamená, že operace proběhla.
        // Můžete přidat kontrolu response.dataResp, pokud API vrací specifická data.
        logger.log(
          -1,
          `DocumentWebServiceHelper.reserveDocument: Document ID "${docId}" reserved successfully. Response: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
        return response.dataResp; // Nebo nějaký indikátor úspěchu
      } catch (error) {
        logger.log(1, `DocumentWebServiceHelper.reserveDocument: Error reserving document ID "${docId}"`, error);
        // Zde by bylo dobré rozlišit typy chyb (např. již zamčeno jiným uživatelem, dokument neexistuje)
        // na základě chybového kódu nebo zprávy z `error.responseJSON` nebo `error.message`.
        throw error;
      }
    },

    /**
     * Uvolní rezervaci dokumentu podle jeho ID (UC-008).
     * @param {string} docId
     * @returns {Promise<Object>} Odpověď z API.
     * @throws {Error} Pokud dojde k chybě při uvolnění rezervace.
     */
    unreserveDocument: async function (docId) {
      logger.log(-1, `DocumentWebServiceHelper.unreserveDocument: Unreserving document ID "${docId}"`);
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/unreserve`,
        method: "PUT",
        // contentType: "application/json", // Pokud API vyžaduje
        // data: JSON.stringify({}),      // Pokud API vyžaduje
      };

      try {
        const response = await Connector3DSpace.callService(options, true);
        logger.log(
          -1,
          `DocumentWebServiceHelper.unreserveDocument: Document ID "${docId}" unreserved successfully. Response: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
        return response.dataResp;
      } catch (error) {
        logger.log(1, `DocumentWebServiceHelper.unreserveDocument: Error unreserving document ID "${docId}"`, error);
        // Podobně jako u reserve, zde by bylo dobré rozlišit typy chyb.
        // Např.:
        // if (error.responseJSON && error.responseJSON.error === "DOCUMENT_NOT_RESERVED_BY_YOU") {
        //   throw new Error(`Document ${docId} is not reserved by you or cannot be unreserved.`);
        // } else if (error.status === 404) {
        //   throw new Error(`Document ${docId} not found.`);
        // }
        throw error;
      }
    },

    // Nová pomocná metoda: Smazání souboru podle ID
    _deleteFileById: async function (docId, fileId) {
      logger.log(
        -1,
        `DocumentWebServiceHelper._deleteFileById: Deleting file ID "${fileId}" from document ID "${docId}"`
      );
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files/${fileId}`,
        method: "DELETE",
      };

      try {
        // DELETE požadavky obvykle vyžadují CSRF token
        const response = await Connector3DSpace.callService(options, true);
        logger.log(
          -1,
          `DocumentWebServiceHelper._deleteFileById: File ID "${fileId}" deleted successfully. Response: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
        return response.dataResp; // Nebo jiný indikátor úspěchu
      } catch (error) {
        logger.log(1, `DocumentWebServiceHelper._deleteFileById: Error deleting file ID "${fileId}"`, error);
        throw error;
      }
    },
  };
  return module;
});
