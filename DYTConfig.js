define("DS/DYTUtils/DYTConfig", [
  "DS/DYTUtils/DYTLogger",
  "DS/DYTUtils/Connector3DSpace",
], function (logger, connector3DSpace) {
  logger.log(-1, "DYTConfig.configClass.constructor: Operation finished");
  var configClass = {
    historyLength: 10,
    widgetName: "",
    userName: "",
    expanded: true,
    userData: {
      columns: [],
      history: [],
    },

    clearHistory: function () {
      if (this.userData.history.length > 0) {
        this.userData.history = [];
        this.saveConfig();
        return true;
      } else {
        return false;
      }
    },
    clearConfig: function () {
      logger.log(-1, "DYTConfig.configClass.clearConfig: Operation started");
      logger.log(-1, this.userData);
      this.userData = {
        columns: [],
        history: [],
      }
      this.saveConfig();
      logger.log(-1, "DYTConfig.configClass.clearConfig: Operation finished");
      return true;
    },
    getFirstHistoryItem: function () {
      if (this.userData.history.length > 0) {
        return this.userData.history[0];
      } else {
        return null;
      }
    },
    addHistoryItem: function (id, type, name, revision) {
      logger.log(-1, "DYTConfig.configClass.addHistoryItem: Operation started");
      var itemToAdd = {
        id: id,
        type: type,
        name: name,
        revision: revision,
      };
      logger.log(
        0,
        "DYTConfig.configClass.addHistoryItem: Item to add defined"
      );
      logger.log(0, itemToAdd);
      var found;
      for (let i = 0; i < this.userData.history.length; i++) {
        var historyObject = this.userData.history[i];
        if (historyObject.id === itemToAdd.id) {
          found = this.userData.history.splice(i, 1);
        }
      }
      logger.log(
        -1,
        "DYTConfig.configClass.addHistoryItem: Inserting a history item"
      );
      logger.log(-1, itemToAdd);
      this.userData.history.unshift(itemToAdd);
      if (this.userData.history.length > this.historyLength) {
        logger.log(
          -1,
          "DYTConfig.configClass.addHistoryItem: Truncating the history"
        );
        this.userData.history.length = this.historyLength;
      }
      logger.log(0, "DYTConfig.configClass.addHistoryItem: Saving history");
      logger.log(0, this.userData.history);
      this.saveConfig();
      logger.log(
        -1,
        "DYTConfig.configClass.addHistoryItem: Operation finished"
      );
    },
    saveConfig: function () {
      logger.log(-1, "DYTConfig.configClass.saveConfig: Operation started");
      if (connector3DSpace) {
        this.updateSetting(
          this.widgetName,
          this.userName,
          JSON.stringify(this.userData)
        );
      } else {
        logger.log(
          1,
          "DYTConfig.configClass.saveConfig: No data object defined"
        );
      }
      logger.log(-1, "DYTConfig.configClass.saveConfig: Operation finished");
    },
    setUserConfig: function (configString) {
      logger.log(-1, "DYTConfig.configClass.setUserConfig: Operation started");
      var config = $.parseJSON(configString);

      logger.log(-1, "DYTConfig.configClass.setUserConfig: Got config");

        if (!jQuery.isEmptyObject(config)) {
          this.userData = config;
        }

      logger.log(-1, "DYTConfig.configClass.setUserConfig: Operation finished");
    },

    loadConfig: async function (widgetName, userName, defaultConfig) {
      logger.log(-1, "DYTConfig.configClass.loadConfig: Operation started");
      this.widgetName = widgetName;
      this.userName = userName;
      if (defaultConfig == true) {
        logger.log(
          -1,
          "DYTConfig.configClass.loadConfig: Loading default config"
        );
        let configObj = await this.getSetting(
          this.widgetName,
          "global"
        );
        this.setUserConfig(configObj);
      } else {
        logger.log(
          -1,
          "DYTConfig.configClass.loadConfig: Loading config for user " +
          this.userName
        );
        let test = await this.getSetting(
          this.widgetName,
          this.userName
        );
        this.setUserConfig(test);
      }
      logger.log(-1, "DYTConfig.configClass.loadConfig: Operation finisehd");
    },

    getCustomizedColumns: function () {
      logger.log(
        -1,
        "DYTConfig.configClass.getCustomizedColumns: Operation started"
      );
      if (!this.columns || this.columns.length < 1) {
        logger.log(
          2,
          "DYTConfig.DYTNavigateWidget.displayStructureTree: No columns defined in main config, leaving operation"
        );
        return new Object();
      }
      var newColumns = [];
      if (this.userData.columns) {
        logger.log(
          -1,
          "DYTConfig.configClass.getCustomizedColumns: Adding " +
          this.userData.columns.length +
          " user columns"
        );
        for (let i = 0; i < this.userData.columns.length; i++) {
          var userColumn = this.userData.columns[i];
          logger.log(
            -1,
            "DYTConfig.configClass.getCustomizedColumns: User column " +
            userColumn.field
          );
          var newColumn = this.columns.find(
            (cln) => cln.field === userColumn.field
          );
          logger.log(
            -1,
            "DYTConfig.configClass.getCustomizedColumns: Got schema column"
          );
          logger.log(-1, newColumn);
          if (newColumn) {
            logger.log(
              -1,
              "DYTConfig.configClass.getCustomizedColumns: Setting width of column: " +
              newColumn.field +
              " to " +
              userColumn.width
            );
            newColumn.width = userColumn.width;
            newColumn.hidden = userColumn.hidden || newColumn.hidden;
          }
          if (newColumn) {
            newColumns.push(newColumn);
          }
        }
        logger.log(
          -1,
          "DYTConfig.configClass.getCustomizedColumns: User columns added"
        );
        logger.log(
          -1,
          "DYTConfig.configClass.getCustomizedColumns: Adding resting system columns"
        );
        var counter = 0;
        this.columns.forEach((dataColumn) => {
          var userColumn = this.userData.columns.find(
            (cln) => cln.field === dataColumn.field
          );
          if (!userColumn) {
            counter++;
            logger.log(
              -1,
              "DYTConfig.configClass.getCustomizedColumns: Column " +
              dataColumn.field +
              " not found, adding"
            );
            newColumns.push(dataColumn);
          }
        });
      }
      logger.log(
        -1,
        "DYTConfig.configClass.getCustomizedColumns: " +
        counter +
        " system columns added"
      );
      logger.log(
        -1,
        "DYTConfig.configClass.getCustomizedColumns: Returning columns"
      );
      logger.log(-1, newColumns);
      logger.log(
        -1,
        "DYTConfig.configClass.getCustomizedColumns: Operation finished"
      );
      return newColumns;
    },

    getSetting: async function (widgetName,userName,defaultIfEmpty) {
      logger.log(-1, "DYTNavigate.DYTData.getSetting: Operation started");
      let options = {
        url: "/DSISTools/WdgConfig",
        method: "POST",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: {
          wdg: widgetName,
          action: "getConfig",
          configName: userName,
        },
      };
      let dataObject = await connector3DSpace.call3DSpace(options);

      logger.log(        -1,        "DYTNavigate.DYTData.getSetting.success: Got response: " + dataObject      );
      try {
        var json = dataObject.dataResp;
        logger.log(-1, json);
        if (json.msg !== "OK") {
          //todo: if does not exist
          logger.log(1, "Unable to get data, exception: " + json.msg);
          return;
        }
        if(json.data[0]===undefined){
          return "{}";
        }else{
          let prefs = json.data[0].prefs.userData;
          return prefs;
        }
        
      } catch (err) {
        logger.log(2, "Unable to parse response, exception: " + err);
      }

      logger.log(-1, "DYTNavigate.DYTData.getSetting: Operation finished");
    },
    updateSetting: async function (widgetName, userName, value) {
      logger.log(-1, "DYTNavigate.DYTData.updateSetting: Operation started");
      logger.log(-1,"DYTNavigate.DYTData.updateSetting: Setting '" + widgetName + "' '" + userName + "' to '" + value +"'" );

      let options = {
        url: "/DSISTools/WdgConfig",
        method: "POST",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: {
          action: "saveConfig",
          wdg: widgetName,
          configName: userName,
          "configContent[userData]": value,
        },
      };
      let dataObject = await connector3DSpace.call3DSpace(options);
      logger.log(
        -1,
        "DYTNavigate.DYTData.updateSetting.success: Got response: " +
        dataObject.dataResp
      );
      try {
        var json = dataObject.dataResp;
        if (json.msg !== "OK") {
          logger.log(2, "Unable to get data, exception: " + json.msg);
          return;
        }
      } catch (err) {
        logger.log(2, "Unable to parse response, exception: " + err);
      }

      logger.log(-1, "DYTNavigate.DYTData.updateSetting: Operation finished");
    },
  };

  return configClass;
});
