require.config({
  paths: {
    "kendo.all.min": "Telerik/js/kendo.all.min",
  },
});

define("DS/DYTUtils/DYTLogger", ["kendo.all.min"], function (kendo) {
  var DYTLogger = {
    logLevel: -1,
    enabled: true,
    notification: undefined,
    init: function () {
      let notifEle = $("#notifications");
      if (notifEle) {
        let notifWidget = notifEle
          .kendoNotification({
            stacking: "down",
            position: {
              top: 10,
              right: 30
            },
          })
          .data("kendoNotification");
        this.notification = notifWidget;
      }
    },
    enableLog: function (enable, level) {
      if (level === undefined) {
        this.logLevel = -1;
      } else {
        this.logLevel = level;
      }
      if (enable !== undefined) {
        this.enabled = enable;
      }
    },
    logErrorObject: function(serviceErrorObject){
      try{
        let errorObject = JSON.parse(serviceErrorObject.dataResp);
        let statusCode, internalError, error;
        if(errorObject.statusCode){
          statusCode = errorObject.statusCode;
        }
        if (errorObject.internalError){
          internalError = errorObject.internalError;
        }
        if(errorObject.message){
          error = errorObject.message;
        }
        if(errorObject.status){
          statusCode = errorObject.status;
        }
        this.log(1, "Service Status Code: " + statusCode + " internal Error Message: " + internalError);
        this.showNotification(error, "error")
      }catch(error){
        this.log(1, "Service Status Code: " + serviceErrorObject.error);
        this.showNotification(serviceErrorObject.error, "error")
      }    
    },
    log: function (level, msg) {
      if (!msg) {
        msg = level;
        level = 0;
      }
      if (this.enabled && (level >= this.logLevel || level >= 2)) {
        if (level < 1) {
          console.log(msg);
        } else {
          console.error(msg);
        }
        if (level >= 2) {
          this.showWarningDialog(msg);
        }
      }
    },
    showWarningDialog: function (msg) {
      let logDialogElement = $("#logDialog");
      if (logDialogElement) {
        logDialogElement.kendoDialog({
          width: "500px",
          title: "Info",
          closable: false,
          modal: false,
          content: "<p>" + msg + "</p>",
          visible: false,
          actions: [{ text: "OK", primary: true }],
        });
        logDialogElement.data("kendoDialog").open();
      }
    },
    showNotification(message, type) {
      switch (type) {
        case "warning":
          this.notification.warning(message);
          break;
        case "error":
          this.notification.error(message);
          break;
        case "success":
          this.notification.success(message);
          break;
        default:
          this.notification.show(message);
          break;
      }
    },
  };
  DYTLogger.init();
  return DYTLogger;
});
