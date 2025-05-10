define("DS/DYTUtils/DYTDataSource", ["DS/DYTUtils/DYTLogger"], function (logger) {
    var dataSources = {};
    var DYTDataSource = {
      createDataSource: function (dataSourceName, dataArray, dataSourceType = "DataSource", schema) {
        let opt = {
          data: dataArray,
          schema: schema || {
            model: {
              id: "id", //physicalId
            },
          },
        };
        var dataSource;
        switch (dataSourceType) {
          case "TreeListDataSource":
            dataSource = new kendo.data.TreeListDataSource(opt);
            break;
          default:
            dataSource = new kendo.data.DataSource(opt);
            break;
        }
  
        dataSources[dataSourceName] = dataSource;
        return dataSource;
      },
      setData: function (dataSourceName, dataObject) {
        dataSources[dataSourceName].add(dataObject);
      },
      getData: function (dataSourceName) {
        return dataSources[dataSourceName].data();
      },
      getDataByObjectId: function (dataSourceName, objectId) {
        return dataSources[dataSourceName].get(objectId);
      },
      modifyData: function (dataSourceName, data) {
        dataSources[dataSourceName].pushUpdate(data);
  
        /*dataSources[dataSourceName];
       for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          row.set(key,element);
        }
       }*/
      },
      removeData:function(dataSourceName, data){
        let toRemove = this.getDataByObjectId(dataSourceName,data.id)
        dataSources[dataSourceName].remove(toRemove);
      }
    };
  
    return DYTDataSource;
  });