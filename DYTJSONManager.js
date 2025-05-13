define("DS/DYTUtils/DYTJSONManager", ["DS/DYTUtils/DocumentWebServiceHelper"], (DocumentWebServiceHelper) => {
  let module = {
    saveJsonToDocument: async (documentTitle, fileName, jsonData) => {
      // Implementace ukládání JSON dat do dokumentu
      // JsonManagerController zde bude zpracovávat pole DocumentInfo[] vrácené Helperem
      let documentInfos = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);

      // Zpracování odpovědi z Helperu - kontrola, zda byl dokument nalezen
      if (!documentInfos || documentInfos.length === 0) {
        throw new Error("Document not found.");
      }
      let docId = documentInfos[0].id; // Vezmeme ID prvního nalezeného dokumentu
      await DocumentWebServiceHelper.downloadFileContentByName(docId, fileName);
      await DocumentWebServiceHelper.uploadFileToDocument(docId, fileName, jsonData);
    },
    loadJsonFromDocument: async (documentTitle, fileName) => {
      // Implementace načítání JSON dat z dokumentu
      let documentInfo = await DocumentWebServiceHelper.searchDocumentByTitle(documentTitle);
      if (!documentInfo) {
        throw new Error("Document not found.");
      }
      let docId = documentInfo.docId;
      await DocumentWebServiceHelper.downloadFileContentByName(docId, fileName);
    },
  };
  return module;
});


