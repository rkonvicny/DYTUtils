/**
 * Modul pro práci s JSON daty v dokumentech.
 * @module DS/DYTUtils/DYTJSONManager
 * @requires DS/DYTUtils/DocumentWebServiceHelper
 * @requires DS/DYTUtils/DYTLogger
 * @description Tento modul poskytuje funkce pro ukládání a načítání JSON dat do/z dokumentů v systému 3DSpace.
 */
define("DS/DYTUtils/DYTJSONManager", ["DS/DYTUtils/DocumentWebServiceHelper", "DS/DYTUtils/DYTLogger"], function (
  DocumentWebServiceHelper,
  logger
) {
  let module = {
    /**
     * Uloží JSON data do dokumentu.
     * @param {string} documentTitle - Název dokumentu.
     * @param {string} jsonFilename - Název souboru JSON.
     * @param {Object} jsonDataObject - JSON data k uložení.
     * @returns {Promise<void>}
     * @throws {Error} Pokud dojde k chybě při ukládání JSON dat.
     * @description Tato funkce slouží k ukládání JSON dat do dokumentu v systému 3DSpace.
     */
    saveJsonToDocument: async function (documentTitle, jsonFilename, jsonDataObject) {
      let docId = "";
      try {
        logger.log(-1, "Krok 1: UC-003: Vyhledání dokumentu podle názvu");
        // nutno zjednodušit
        let docInfo = await DocumentWebServiceHelper.searchDocuments(documentTitle);

        logger.log(-1, "Krok 2: UC-006: Vytvoření nového dokumentu");
        if (!docInfo || docInfo.length === 0) {
          docInfo = await DocumentWebServiceHelper.createNewDocument(documentTitle);
        }
        docId = docInfo[0].id;
        logger.log(-1, "Krok 3: UC-007: Zamčení dokumentu");
        await DocumentWebServiceHelper.reserveDocument(docId);

        logger.log(-1, "Krok 4: UC-0XX: Získání informací o souboru");
        const filesInfo = await DocumentWebServiceHelper.getFilesMetadata(docId);
        if (!filesInfo || filesInfo.data.length === 0) {
          logger.log(-1, "Soubor neexistuje");
        } else {
          const fileInfo = filesInfo.data.find((file) => file.dataelements.title === jsonFilename);
          if (!fileInfo) {
            logger.log(-1, "Soubor neexistuje");
          } else {
            const fileId = fileInfo.id;
            logger.log(-1, "Krok 5: UC-009: Smazání souboru z dokumentu - podmíněně");
            await DocumentWebServiceHelper.deleteFile(docId, fileId);
          }
        }

        logger.log(-1, "Krok 6: UC-0XX: Získání ticketu pro checkin");
        const checkinTicketResultInfo = await DocumentWebServiceHelper.getCheckinTicket(docId);

        logger.log(-1, "Krok 7: UC-0XX: Získaní receiptu pro nahrání souboru");
        const uploadReceipt = await DocumentWebServiceHelper.getUploadReceipt(
          checkinTicketResultInfo,
          jsonDataObject,
          jsonFilename
        );

        logger.log(-1, "Krok 8: UC-016: Kompletní nahrání souboru do dokumentu");
        await DocumentWebServiceHelper.uploadFile(docId, jsonFilename, uploadReceipt);
      } catch (error) {
        console.error("Error in saveJsonToDocument:", error);
      } finally {
        logger.log(-1, "Krok 9: UC-008: Odemčení dokumentu");
        await DocumentWebServiceHelper.unreserveDocument(docId);
      }
    },

    /**
     * Načte JSON data z dokumentu.
     * @param {string} documentTitle - Název dokumentu.
     * @param {string} jsonFilename - Název souboru JSON.
     * @returns {Promise<Object>} Načtená JSON data.
     * @throws {Error} Pokud dojde k chybě při načítání JSON dat.
     * @description Tato funkce slouží k načítání JSON dat z dokumentu v systému 3DSpace.
     */
    loadJsonFromDocument: async function (documentTitle, jsonFilename) {
      const docInfo = await DocumentWebServiceHelper.searchDocuments(documentTitle);
      if (!docInfo || docInfo.length === 0) {
        throw new Error(`Document with title "${documentTitle}" not found.`);
      }
      const docId = docInfo[0].id;
      const filesInfo = await DocumentWebServiceHelper.getFilesMetadata(docId);
      if (!filesInfo || filesInfo.data.length === 0) {
        logger.log(-1, "Soubor neexistuje");
      } else {
        const fileInfo = filesInfo.data.find((file) => file.dataelements.title === jsonFilename);
        if (!fileInfo) {
          logger.log(-1, "Soubor neexistuje");
        } else {
          const fileId = fileInfo.id;
          const downloadTicketResultInfo = await DocumentWebServiceHelper.getDownloadTicket(docId, fileId);
          const downloadFileResultInfo = await DocumentWebServiceHelper.downloadFile(downloadTicketResultInfo);
          try {
            const fileContentString = await downloadFileResultInfo.text();
            const jsonData = JSON.parse(fileContentString);
            return jsonData;
          } catch (error) {
            return {};
          }
        }
      }
      return {};
    },
  };
  return module;
});
