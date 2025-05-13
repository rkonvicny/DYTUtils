define("DS/DYTUtils/DocumentWebServiceHelper", ["DS/DYTUtils/Connector3DSpace"], (Connector3DSpace) => {
  let module = {
    ensureDocumentExists: async (documentTitle) => {
      // Implementace zajištění existence dokumentu
    },
    searchDocumentByTitle: async (documentTitle) => {
      // Implementace vyhledávání dokumentu podle názvu
      // Použijeme GET /resources/v1/modeler/documents/search
      // Parametry budou v URL query stringu
      // Sestavení URL parametrů - pouze searchStr
      const options = {
        url: `/resources/v1/modeler/documents/search?searchStr=${encodeURIComponent(documentTitle)}`,
        method: "GET",
        type: "json", // Očekáváme JSON odpověď
      };

      try {
        // Pro GET požadavky typicky nepotřebujeme CSRF token
        const response = await Connector3DSpace.callService(options, false);
        // Vrátíme celou odpověď z callService. Zpracování (mapování, kontrola prázdného pole) proběhne ve volající funkci.
        return response;
      } catch (error) {
        // V případě chyby propagujeme chybu výše, aby ji zpracoval volající
        throw error;
      }
    },
    lockDocument: async (docId) => {
      // Implementace zamčení dokumentu
    },
    unlockDocument: async (docId) => {
      // Implementace odemčení dokumentu
    },
    uploadFileToDocument: async (docId, fileName, fileContent, contentType) => {
      // Implementace nahrávání souboru do dokumentu
    },
    deleteFileByNameFromDocument: async (docId, fileName) => {
      // Implementace smazání souboru z dokumentu podle názvu
    },
    downloadFileContentByName: async (docId, fileName) => {
      // Implementace stažení obsahu souboru z dokumentu podle názvu
    },
  };
  return module;
});
