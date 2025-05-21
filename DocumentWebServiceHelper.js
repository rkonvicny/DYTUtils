define("DS/DYTUtils/DocumentWebServiceHelper", ["DS/DYTUtils/Connector3DSpace", "DS/DYTUtils/DYTLogger"], function (
  Connector3DSpace,
  logger
) {
  "use strict";

  const module = {
    /**
     * Vyhledá dokumenty podle zadaného řetězce.
     * @param {string} searchStr - Řetězec pro vyhledávání dokumentů.
     * @returns {Promise<Object>} - Odpověď z API. Objekt obsahující nalezené dokumenty.
     */
    searchDocuments: async function (searchStr) {
      // /resources/v1/modeler/documents/search
      const options = {
        url: `/resources/v1/modeler/documents/search?searchStr=${encodeURIComponent(searchStr)}`,
        method: "GET",
      };

      try {
        const response = await Connector3DSpace.callService(options, false);
        return response.dataResp.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Vytvoří nový dokument s daným názvem.
     * @param {string} documentTitle
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující vytvořený dokument.
     * @throws {Error} Pokud dojde k chybě při vytváření dokumentu.
     */
    createNewDocument: async function (documentTitle) {
      // /resources/v1/modeler/documents
      const docDetails = {
        data: [
          {
            dataelements: {
              title: documentTitle,
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

    /**
     * Rezervuje dokument podle jeho ID (UC-007).
     * @param {string} docId
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující informace o rezervaci.
     * @throws {Error} Pokud dojde k chybě při rezervaci.
     */
    reserveDocument: async function (docId) {
      // PUT /resources/v1/modeler/documents/{docId}/reserve
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/reserve`,
        method: "PUT",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp; // Nebo nějaký indikátor úspěchu
      } catch (error) {
        throw error;
      }
    },

    /**
     * Získá metadata souborů pro daný dokument.
     * @param {string} docId
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující metadata souborů.
     */
    getFilesMetadata: async function (docId) {
      // /resources/v1/modeler/documents/{docId}/files
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files`,
        method: "GET",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Odstraní soubor z dokumentu.
     * @param {string} docId - ID dokumentu.
     * @param {string} fileId - ID souboru.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující informace o odstranění.
     * @throws {Error} Pokud dojde k chybě při odstraňování souboru.
     */
    deleteFile: async function (docId, fileId) {
      // /resources/v1/modeler/documents/{docId}/files/{fileId}
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files/${fileId}`,
        method: "DELETE",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Získá ticket pro check-in souboru.
     * @param {string} docId - ID dokumentu.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující informace o check-in ticketu.
     * @throws {Error} Pokud dojde k chybě při získávání ticketu.
     */
    getCheckinTicket: async function (docId) {
      // PUT /resources/v1/modeler/documents/{docId}/files/CheckinTicket
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files/CheckinTicket`,
        method: "PUT",
        contentType: "application/json",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Získá potvrzení o nahrání souboru.
     * @param {Object} checkinTicket - Ticket pro check-in.
     * @param {Object} jsonDataObject - Data ve formátu JSON.
     * @param {string} filename - Název souboru.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující potvrzení o nahrání.
     * @throws {Error} Pokud dojde k chybě při získávání potvrzení.
     */
    getUploadReceipt: async function (checkinTicket, jsonDataObject, filename) {
      const jsonString = JSON.stringify(jsonDataObject, null, 2);
      const fileBlob = new Blob([jsonString], { type: "application/json" });
      const objFile = new File([fileBlob], filename);

      const url = checkinTicket.data[0].dataelements.ticketURL;
      const ticketParamName = checkinTicket.data[0].dataelements.ticketparamname;
      const ticket = checkinTicket.data[0].dataelements.ticket;
      let formData = new FormData();
      formData.append(ticketParamName, ticket);
      formData.append("file_0", objFile);
      const requestInfo = {
        method: "POST",
        body: formData,
      };
      const dataResp = await fetch(url, requestInfo);
      return await dataResp.text();
    },

    /**
     * Nahrává soubor do dokumentu.
     * @param {string} docId - ID dokumentu.
     * @param {string} filename - Název souboru.
     * @param {string} uploadReceipt - Potvrzení o nahrání.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující informace o nahraném souboru.
     * @throws {Error} Pokud dojde k chybě při nahrávání.
     */
    uploadFile: async function (docId, filename, uploadReceipt) {
      // POST /resources/v1/modeler/documents/{docId}/files
      const uploadData = {
        data: [
          {
            dataelements: {
              title: filename,
              fileType: "json",
              receipt: uploadReceipt,
            },
          },
        ],
      };
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(uploadData),
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Uvolní zámek dokumentu.
     * @param {string} docId - ID dokumentu.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující informace o uvolnění zámku.
     * @throws {Error} Pokud dojde k chybě při uvolňování zámku.
     */
    unreserveDocument: async function (docId) {
      // PUT /resources/v1/modeler/documents/{docId}/unreserve
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/unreserve`,
        method: "PUT",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Získá ticket pro stažení souboru.
     * @param {string} docId - ID dokumentu.
     * @param {string} fileId - ID souboru.
     * @returns {Promise<Object>} Odpověď z API. Objekt obsahující ticket pro stažení.
     * @throws {Error} Pokud dojde k chybě při získávání ticketu.
     */
    getDownloadTicket: async function (docId, fileId) {
      // PUT /resources/v1/modeler/documents/{docId}/files/{fileId}/DownloadTicket
      const options = {
        url: `/resources/v1/modeler/documents/${docId}/files/${fileId}/DownloadTicket`,
        method: "PUT",
      };
      try {
        const response = await Connector3DSpace.callService(options, true);
        return response.dataResp;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Stažení souboru z dokumentu.
     * @param {Object} downloadTicketResultInfo - Odpověď z API obsahující informace o stažení.
     * @returns {Promise<Object>} Odpověď z API. Binární data souboru.
     * @throws {Error} Pokud dojde k chybě při stahování souboru.
     */
    downloadFile: async function (downloadTicketResultInfo) {
      const url = downloadTicketResultInfo.data[0].dataelements.ticketURL;
      const downloadOptions = {
        url: url,
        method: "GET",
        type: "blob", // Chceme binární data jako Blob
      };
      try {
        const fileDataResponse = await Connector3DSpace.proxyCall(downloadOptions, false);
        return fileDataResponse.dataResp;
      } catch (error) {
        throw error;
      }
    },
  };

  return module;
});
