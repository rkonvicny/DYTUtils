define("DS/DYTUtils/DocumentWebServiceHelper", [
  "DS/DYTUtils/Connector3DSpace",
  "DS/DYTUtils/DYTLogger", // Může být stále potřeba pro specifické logy mimo wrapper
  "DS/DYTUtils/FunctionWrapper"  // Importujeme náš nový wrapper
], (
  Connector3DSpace,
  logger, // Instance loggeru, pokud ji stále někde potřebujeme (např. pro logErrorObject)
  wrapMethod // Naše funkce pro obalení
) => {
  "use strict"; // Je dobré ponechat pro lepší kontrolu chyb

  const moduleName = "DocumentWebServiceHelper"; // Název modulu pro logování

  const originalMethods = {
    // Nová metoda pro získání detailů dokumentu podle ID
    getDocumentDetailsById: async function (docId) {
      const options = {
        url: `/resources/v1/modeler/documents/${docId}?$fields=all&$include=all`, // Získání všech detailů včetně souborů
        method: "GET",
      };

      try {
        const response = await Connector3DSpace.callService(options, false);

        // Odpověď pro /documents/{docId} by měla vracet jeden objekt dokumentu v response.dataResp.data[0]
        if (response.dataResp && response.dataResp.data && response.dataResp.data.length > 0) {
          return response.dataResp.data[0]; // Vracíme objekt dokumentu
        }
        // Pokud dokument není nalezen nebo odpověď je neplatná, vyhodíme chybu
        throw new Error(`Document with ID "${docId}" not found or invalid response.`);
      } catch (error) {
        throw error;
      }
    },

    // Upravená metoda searchDocumentByTitle, která nyní provede 2 kroky
    searchDocumentByTitle: async function (documentTitle) {
      // Původní logy jsou odstraněny
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
          // Druhý krok: zavoláme novou metodu pro získání plných detailů včetně souborů
          const detailedDoc = await this.getDocumentDetailsById(firstFoundDocStub.id);
          // Vracíme pole s jedním detailním dokumentem, aby volající kód mohl stále očekávat pole
          return detailedDoc ? [detailedDoc] : [];
        }
        return []; // Vracíme prázdné pole, pokud dokument nebyl nalezen
      } catch (error) {
        throw error;
      }
    },
    createNewDocument: async function (documentTitle) {
      // Krok 1: Zkontrolovat, zda dokument s tímto názvem již neexistuje
      const existingDocuments = await this.searchDocumentByTitle(documentTitle); // Použijeme this pro volání jiné metody modulu

      if (existingDocuments && existingDocuments.length > 0) {
        const errorMsg = `Document with title "${documentTitle}" already exists. ID: ${existingDocuments[0].id}. Creation aborted.`;
        logger.log(1, `DocumentWebServiceHelper.createNewDocument: ${errorMsg}`);
        throw new Error(errorMsg); // Vyhodíme chybu, kterou zachytí volající kód
      }

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
        return response.dataResp.data[0]; // Vracíme vytvořený dokument
      } catch (error) {
        throw error;
      }
    },

    // Nová pomocná metoda: Získání fyzického ID souboru podle názvu
    _getPhysicalFileIdByName: async function (docId, filename) {
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
        // Pokud soubor není nalezen, je to pro tuto operaci chyba
        throw new Error(errorMsg);
      }

      // Předpokládáme, že 'id' je vlastnost obsahující fyzické ID souboru.
      // Může být potřeba upravit, pokud je fyzické ID uloženo pod jiným názvem (např. physicalid).
      const physicalFileId = targetFileObject.id;
      if (!physicalFileId) {
        const errorMsg = `Physical ID not found for file named "${filename}" in document ID "${docId}". File object: ${JSON.stringify(
          targetFileObject
        )}`;
        throw new Error(errorMsg);
      }
      return physicalFileId;
    },

    // Nová pomocná metoda: Získání upload ticketu (UC-015)
    _getCheckinTicket: async function (docId, filename) {
      const ticketOptions = {
        url: `/resources/v1/modeler/documents/${docId}/files/CheckinTicket`,
        method: "PUT",
        contentType: "application/json",
        // data: JSON.stringify({
        //   data: [
        //     {
        //       dataelements: {
        //         title: filename, // Název souboru pro ticket
        //       },
        //     },
        //   ],
        // }),
      };
      const ticketResponse = await Connector3DSpace.callService(ticketOptions, true); // PUT vyžaduje CSRF

      if (!ticketResponse.dataResp || !ticketResponse.dataResp.data || ticketResponse.dataResp.data.length === 0) {
        const errorMsg = `Could not get upload ticket for file "${filename}" in document "${docId}". Response: ${JSON.stringify(
          ticketResponse.dataResp
        )}`;
        throw new Error(errorMsg);
      }
      return ticketResponse.dataResp.data[0]; // Vracíme objekt s ticketem (obsahuje ticketURL, objectId, etc.)
    },
    // Nová pomocná metoda: Získání download ticketu
    _getDownloadTicket: async function (docId, physicalFileId) {
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
        throw new Error(errorMsg);
      }
      return ticketResponse.dataResp.data[0].dataelements.ticketURL;
    },

    // Metoda downloadFileContentByName zůstává nezměněna
    downloadFileContentByName: async function (docId, filename) {
      // Změna parametru z fileId na filename
      try {
        // Krok 1: Získání fyzického ID
        const physicalFileId = await this._getPhysicalFileIdByName(docId, filename);

        // Krok 2: Získání download ticketu
        const fcsDownloadUrl = await this._getDownloadTicket(docId, physicalFileId);

        // Krok 2: Stažení souboru z FCS (nahrazeno voláním pomocné funkce)
        const fileBlob = await this._downloadFileFromFCS(fcsDownloadUrl);

        // Krok 3: Převedení Blob na text
        const fileContentString = await this._blobToString(fileBlob);
        return fileContentString;
      } catch (error) {
        throw error;
      }
    },

    // Nová pomocná metoda: Nahrání souboru na FCS (UC-016)
    _uploadFileToFCS: async function (checkinTicket, filename, jsonDataObject) {
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
      if (!fetchResult.ok) {
        throw new Error(`FCS upload failed: ${fetchResult.status} ${fetchResult.statusText}`);
      }
      const uploadResponse = await fetchResult.text();
      return uploadResponse; // Vracíme textovou odpověď z FCS
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
      return fileDataResponse.dataResp;
    },

    // Nová pomocná metoda: Převod Blob na text
    _blobToString: async function (blob) {
      try {
        const fileContentString = await blob.text();
        return fileContentString;
      } catch (error) {
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
      try {
        // Krok 1: Získání upload ticketu
        const checkinTicket = await this._getCheckinTicket(docId, filename);

        // Krok 2: Nahrání souboru na FCS
        const uploadResult = await this._uploadFileToFCS(checkinTicket, filename, jsonDataObject);
        return checkinTicket; // Vracíme ticket, který obsahuje objectId (ID souboru) a další info
      } catch (error) {
        throw error;
      }
    },

    // Nová metoda pro získání metadat souborů dokumentu podle ID (odpovídá UC-013)
    getDocumentFilesMetadata: async function (docId) {
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files`, // Endpoint specified by UC-013
        method: "GET",
      };

      try {
        const response = await Connector3DSpace.callService(options, false);

        // Odpověď pro /documents/{docId}/files by měla vracet pole objektů souborů v response.dataResp.data
        if (response.dataResp && response.dataResp.data && Array.isArray(response.dataResp.data)) {
          return response.dataResp.data; // Vracíme pole objektů souborů
        }
        throw new Error(`Invalid response fetching file metadata for doc ID "${docId}".`);
      } catch (error) {
        throw error;
      }
    },
    reserveDocument: async function (docId) {
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
        return response.dataResp; // Nebo nějaký indikátor úspěchu
      } catch (error) {
        throw error;
      }
    },

    unreserveDocument: async function (docId) {
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/unreserve`,
        method: "PUT",
        // contentType: "application/json", // Pokud API vyžaduje
        // data: JSON.stringify({}),      // Pokud API vyžaduje
      };

      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    // Nová pomocná metoda: Smazání souboru podle ID
    _deleteFileById: async function (docId, fileId) {
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files/${fileId}`,
        method: "DELETE",
      };

      try {
        // DELETE požadavky obvykle vyžadují CSRF token
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp; // Nebo jiný indikátor úspěchu
      } catch (error) {
        throw error;
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
