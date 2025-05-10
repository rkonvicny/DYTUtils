define("DS/DYTUtils/DYTGrid", ["DS/DYTUtils/DYTLogger", "DS/DYTUtils/DYTDataSource", "DS/DYTUtils/DYTDragAndDrop"], function (logger, DataSource, DataDragAndDrop) {
  var gridDropConfigs = {};
  var DYTGrid = {
    createKendoGrid: function (selector, options, dragAndDropConfig) {
      gridDropConfigs[selector] = dragAndDropConfig;
      let grid = $(selector).data("kendoGrid");
      if (grid === undefined) {
        let basicOptions = {
          //height: window.innerHeight,
          scrollable: true,
          scrollable: {
            virtual: true,
          },
          sortable: true,
          filterable: false,
          persistSelection: true,
          columns: [],
          //toolbar: ["excel"],
          editable: {
            confirmation: false,
            mode:"popup"
          }
        };
        UWA.extend(basicOptions, options);

        let grindElement = $(selector);
        grindElement.kendoGrid(basicOptions);
        this.updateGridData("new",selector,[]);
        if (dragAndDropConfig.dropType === "Body") DataDragAndDrop.makeElementDroppable(grindElement, dragAndDropConfig);
      }
    },
    updateGridData: function (action, grid, dataArray) {
      switch (action) {
        case "new":
          DYTGrid.initGridData(grid, dataArray);
          break;
        case "addRows":
          DYTGrid.addGridRows(grid, dataArray);
          break;
        case "removeRow":
          DYTGrid.removeGridRows(grid, dataArray);
          break;
        case "modifyRow":
          DYTGrid.modifyRow(grid, dataArray);
          break;
        default:
          break;
      }
    },
    initGridData: function (selector, dataArray) {
      var grid = $(selector).data("kendoGrid");

      let dataSource = DataSource.createDataSource(selector, dataArray, "");
      grid.setDataSource(dataSource);
      this.makeDragableDroppable(selector);
    },
    getGridDataFromElement: function (selector, element) {
      let grid = this.getGrid(selector);
      return grid.dataItem(element);
    },
    getGridData: function (selector, objectId) {
      if (objectId) {
        return DataSource.getDataByObjectId(selector, objectId);
      } else {
        return DataSource.getData(selector);
      }
    },
    addGridRows: function (selector, dataArray) {
      for (const dataObject of dataArray) {
        DataSource.setData(selector, dataObject);
      }
      this.makeDragableDroppable(selector);
    },
    removeGridRows: function (selector, dataArray) {
      for (const dataObject of dataArray) {
        DataSource.removeData(selector, dataObject);
      }
      this.makeDragableDroppable(selector);
    },
    getGrid: function (selector) {
      return $(selector).data("kendoGrid");
    },
    getGridRows: function (selector) {
      return this.getGrid(selector).items();
    },
    makeRowsDraggable: function (selector) {
      var gridItems = this.getGridRows(selector);
      DataDragAndDrop.makeElementDraggable(gridItems, gridDropConfigs[selector]);
    },
    makeRowsDroppable: function (selector) {
      var gridItems = this.getGridRows(selector);
      DataDragAndDrop.makeElementDroppable(gridItems, gridDropConfigs[selector]);
    },
    makeDragableDroppable: function (selector) {
      if (gridDropConfigs[selector].dragType === "Row") this.makeRowsDraggable(selector);
      if (gridDropConfigs[selector].dropType === "Row") this.makeRowsDroppable(selector);
    },
    modifyRow: function (selector, data) {
      DataSource.modifyData(selector, data);
      this.makeDragableDroppable(selector);
    },
    setGridHeight: function (selector, height) {
      $(selector).height(height);
      $(selector).data("kendoGrid").resize();
    },
    exportGridToExcel: function (selector) {
      $(selector).data("kendoGrid").saveAsExcel();
    },
  };

  return DYTGrid;
});