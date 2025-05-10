/**
 * @author DSIS
 */

define("DS/DYTUtils/Connector3DSpace", [
  "DS/i3DXCompassServices/i3DXCompassServices",
  "DS/WAFData/WAFData",
  "DS/DYTUtils/DYTLogger",
  "DS/DYTUtils/DYTPreferences",
], function (i3DXCompassServices, WAFData, logger, preferences) {
  var connector3DSpace = widget.connector3DSpace; //Makes it a single object on the widget level
  if (typeof connector3DSpace === "undefined") {
    connector3DSpace = {
      _Url3DSpace: "",
      _Url3DPassport: "",
      _SecCtxLoaded: false,
      _arrSecCtxs: [],
      _widgetPref4Ctx: "scContext",
      _tenant: "",
      _currentCSRF: null,
      _preferedCtx: "",

      initConnector: async function () {
        if (connector3DSpace._Url3DSpace.length <= 1) {
          logger.log(
            -1,
            "connector3DSpace.call3DSpace:connector3DSpace._Url3DSpace.length <= 1"
          );
          await connector3DSpace.load3DSpaceURL();
        }
        if (!connector3DSpace._SecCtxLoaded) {
          logger.log(
            -1,
            "connector3DSpace.call3DSpace:!connector3DSpace._SecCtxLoaded"
          );
          await connector3DSpace.loadSecCtx();
        }
      },
      load3DSpaceURL: function () {
        return new Promise(function (resolve, reject) {
          i3DXCompassServices.getServiceUrl({
            serviceName: "3DSpace",
            platformId: widget.getValue("x3dPlatformId") || "",
            onComplete: function (response) {
              var URLResult = response;

              if (typeof URLResult === "string") {
                connector3DSpace._Url3DSpace = URLResult;
                
              } else if (typeof URLResult !== "undefined") {
                connector3DSpace._Url3DSpace = URLResult[0].url;
                connector3DSpace._tenant = URLResult[0].platformId;
              } else {
                console.warn("Fallback to determine 3DSpace URL");
                connector3DSpace._tenant = "OnPremise";
                connector3DSpace._Url3DSpace = widget.uwaUrl.substring(
                  0,
                  widget.uwaUrl.lastIndexOf("/")
                ); //Widget Folder
                connector3DSpace._Url3DSpace =
                  connector3DSpace._Url3DSpace.substring(
                    0,
                    connector3DSpace._Url3DSpace.lastIndexOf("/")
                  ); //webappsFolder
                connector3DSpace._Url3DSpace =
                  connector3DSpace._Url3DSpace.substring(
                    0,
                    connector3DSpace._Url3DSpace.lastIndexOf("/")
                  ); //3DSpace root folder
              }
              connector3DSpace._tenant = widget.getValue("x3dPlatformId")||"";
              resolve();
            },
            onFailure: function (error) {
              alert("Impossible to retrieve 3DSpace Service URL" + error);
              reject();
            },
          });
        });
      },
      load3DPassportURL: function () {
        return new Promise(function (resolve, reject) {
          i3DXCompassServices.getServiceUrl({
            serviceName: "3DPassport",
            platformId: widget.getValue("x3dPlatformId") || "",
            onComplete: function (response) {
              var URLResult = response;

              if (typeof URLResult === "string") {
                connector3DSpace._Url3DPassport = URLResult;
              } else if (typeof URLResult !== "undefined") {
                connector3DSpace._Url3DPassport = URLResult[0].url;
              } else {
                console.warn("Fallback to determine 3DSpace URL");
                connector3DSpace._Url3DPassport = widget.uwaUrl.substring(
                  0,
                  widget.uwaUrl.lastIndexOf("/")
                ); //Widget Folder
                connector3DSpace._Url3DPassport =
                  connector3DSpace._Url3DPassport.substring(
                    0,
                    connector3DSpace._Url3DPassport.lastIndexOf("/")
                  ); //webappsFolder
                connector3DSpace._Url3DPassport =
                  connector3DSpace._Url3DPassport.substring(
                    0,
                    connector3DSpace._Url3DPassport.lastIndexOf("/")
                  ); //3DSpace root folder
              }
              resolve();
            },
            onFailure: function (error) {
              alert("Impossible to retrieve 3DPassport Service URL" + error);
              reject();
            },
          });
        });
      },

      loadSecCtx: async function () {
        let options = {
          url: "/resources/modeler/pno/person?current=true&select=preferredcredentials&select=collabspaces",
          method: "GET",
        };

        try {
          let dataObject = await connector3DSpace.call3DSpace(options);
          logger.log(
            -1,
            "Connector3DSpace.loadSecCtx.success: Got response: " +
              dataObject.dataResp
          );

          logger.log(
            -1,
            "connector3DSpace.loadSecCtx.onComplete: Operation started"
          );
          var personObj = dataObject.dataResp; //JSON.parse(dataResp);
          _preferedCtx = connector3DSpace.getPreferredSecContextString(
            personObj.preferredcredentials
          );
          logger.log(
            -1,
            "connector3DSpace.loadSecCtx.onComplete: Context: " + _preferedCtx
          );
          var allContext = connector3DSpace.getAllSecurityContextsStringArray(
            personObj.collabspaces
          );
          connector3DSpace._arrSecCtxs = allContext;
          connector3DSpace._SecCtxLoaded = true;

          preferences.initPreferences({
            name: connector3DSpace._widgetPref4Ctx,
            type: "list",
            label: "Security Context",
            defaultValue: _preferedCtx,
            options: allContext,
          });

          var lastCtxSelected = preferences.getValue(
            connector3DSpace._widgetPref4Ctx
          );

          //console.log("lastCtxSelected:"+lastCtxSelected);
          if (connector3DSpace._arrSecCtxs.indexOf(lastCtxSelected) === -1) {
            //In case of removed Context / Widget is shared...
            lastCtxSelected = "";
            connector3DSpace.updateSecurityContexts();
          }

          return dataObject;
        } catch (error) {
          logger.log(
            1,
            "Connector3DSpace.loadSecCtx.error: Got response: " + error.error
          );
          return error;
        }
      },
      updateSecurityContexts: function () {
        let newOptions = [];
        let newdefaultValue = "";

        for (var i = 0; i < connector3DSpace._arrSecCtxs.length; i++) {
          var arrSec = connector3DSpace._arrSecCtxs[i];
          newOptions.push({
            value: arrSec.value,
            label: arrSec.label,
          });
        }
        let lastCtxSelected = preferences.getValue(
          connector3DSpace._widgetPref4Ctx
        );
        if (
          typeof lastCtxSelected === "undefined" ||
          lastCtxSelected.value === ""
        ) {
          newdefaultValue = newOptions[0].value;
        } else {
          newdefaultValue = lastCtxSelected;
        }

        preferences.updateOptions(
          connector3DSpace._widgetPref4Ctx,
          newOptions,
          newdefaultValue
        );
      },
      getPreferredSecContextString: function (credentialsObj) {
        logger.log(
          -1,
          "connector3DSpace.getPreferredSecContextString: Operation started"
        );
        try {
          logger.log(
            -1,
            "connector3DSpace.getPreferredSecContextString: Operation finished"
          );
          //return role + "." + organization + "." + collabspace;
          return connector3DSpace.getSecurityContextObject(
            credentialsObj.role,
            credentialsObj.collabspace,
            credentialsObj.organization
          );
        } catch {
          return "";
        }
      },
      getAllSecurityContextsStringArray: function (collabspaces) {
        logger.log(
          -1,
          "connector3DSpace.getAllSecurityContextsStringArray: Operation started"
        );
        var contexts = [];
        collabspaces.forEach(function (collabObj) {
          var collabData = collabObj.couples;
          for (const collabInfo of collabData) {
            contexts.push(
              connector3DSpace.getSecurityContextObject(
                collabInfo.role,
                collabObj,
                collabInfo.organization
              )
            );
          }
        });
        logger.log(
          -1,
          "connector3DSpace.getAllSecurityContextsStringArray: Operation finished"
        );
        return contexts;
      },
      getSecurityContextObject: function (role, collabSpace, organization) {
        return {
          label: collabSpace.title + " ● " + role.nls,
          value: role.name + "." + organization.name + "." + collabSpace.name,
        };
      },
      getSecurityContextVaule: function () {
        var strCtx = widget.getValue("scContext");
        if (typeof strCtx === "object") {
          strCtx = strCtx.value;
        }
        if (strCtx && strCtx.length > 0 && strCtx.indexOf("ctx::") !== 0) {
          strCtx = "ctx::" + strCtx;
        }
        return strCtx;
      },
      /**
       * Call 3DSpace sevice
       * The url of 3DSpace will be automatically retrieved and prepend to the url given in the options.
       *
       * @param {Object} options
       */
      call3DSpace: async function (options) {
        /*
         * options :
         * url
         * method
         * data
         * type
         * callbackData
         * onComplete
         * onFailure
         * forceReload
         */

        if (connector3DSpace._Url3DSpace.length <= 1)
          await connector3DSpace.initConnector();

        {
          return new Promise(function (resolve, reject) {
            logger.log(
              -1,
              "connector3DSpace.call3DSpace:call3DSpace start " + options.url
            );
            var urlWAF = connector3DSpace._Url3DSpace + options.url;
            urlWAF  = urlWAF +  (urlWAF.indexOf("?") > -1 ? "&" : "?") + "tenant="+connector3DSpace._tenant;
            var dataWAF = options.data || {};

            var strCtx = connector3DSpace.getSecurityContextVaule();
            var headerWAF = options.headers || {};
            var requestHeaders = {
              Accept: "application/json",
              SecurityContext: strCtx,
              "Content-Type": options.contentType || "application/json",
            };

            var methodWAF = options.method || "GET";

            var contentTypeWAF = options.contentType || "application/json";

            var finalRequestObject = {};

            finalRequestObject.headers = UWA.extend(requestHeaders, headerWAF);
            finalRequestObject["Content-Type"] = contentTypeWAF;
            finalRequestObject.data = dataWAF;
            finalRequestObject.method = methodWAF;
            finalRequestObject.query = options.query;
            finalRequestObject.type = options.type;
            finalRequestObject.timeout = 25e4;

            finalRequestObject.onComplete = function (dataResp, headerResp) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onCompleate start " +
                  dataResp
              );
              dataResp = JSON.parse(dataResp);
              if (
                dataResp &&
                dataResp.csrf &&
                dataResp.csrf.name === "ENO_CSRF_TOKEN"
              ) {
                connector3DSpace._currentCSRF = dataResp.csrf;
              } else {
                connector3DSpace._currentCSRF = null;
              }
              var responseObj = {
                dataResp: dataResp,
                header: headerResp,
              };
              resolve(responseObj);
            };
            finalRequestObject.onFailure = function (
              error,
              responseDOMString,
              headerResp
            ) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onFailure start " +
                  error
              );
              var errorObj = {
                error: error,
                dataResp: responseDOMString,
                headerResp: headerResp,
              };
              reject(errorObj);
            };

            WAFData.authenticatedRequest(urlWAF, finalRequestObject);
          });
        }
      },
      call3DSpaceWithCSRF: async function (options) {
        if (!options.data) {
          options.data = {};
        }

        if (
          (!connector3DSpace._currentCSRF ||
            connector3DSpace._currentCSRF === null) &&
          options.method !== "GET"
        ) {
          let csrfOptions = {
            url: "/resources/v1/application/CSRF",
            method: "GET",
          };
          let dataObject = await connector3DSpace.call3DSpace(csrfOptions);
          connector3DSpace._currentCSRF = dataObject.dataResp.csrf;
          return connector3DSpace.call3DSpaceWithCSRF(options);
        }

        if (options.method !== "GET") {
          options.headers = options.headers || {};
          options.headers["ENO_CSRF_TOKEN"] =
            connector3DSpace._currentCSRF.value;
        }
        return connector3DSpace.call3DSpace(options);
      },
      callService: async function (options, csfr) {
        try {
          let dataObject = csfr
            ? await connector3DSpace.call3DSpaceWithCSRF(options)
            : await connector3DSpace.call3DSpace(options);
          logger.log(
            -1,
            "connector3DSpace.callService.success: Got response: " +
              dataObject.dataResp
          );
          return dataObject;
        } catch (error) {
          logger.log(
            1,
            "connector3DSpace.callService.error: Got response: " + error.error
          );
          return error;
        }
      },
      proxyCall: async function (options, withContext) {
        /*
         * options :
         * url
         * method
         * data
         * type
         * callbackData
         * onComplete
         * onFailure
         * forceReload
         */

        {
          return new Promise(function (resolve, reject) {
            logger.log(
              -1,
              "connector3DSpace.call3DSpace:call3DSpace start " + options.url
            );
            var urlWAF = options.url;
            var dataWAF = options.data || {};

            var headerWAF = options.headers || {};
            var requestHeaders = {
              Accept: "application/json",
              "Content-Type": options.contentType || "application/json",
            };

            if(withContext){
              requestHeaders["SecurityContext"] = connector3DSpace.getSecurityContextVaule();
            }

            var methodWAF = options.method || "GET";

            var contentTypeWAF = options.contentType || "application/json";

            var finalRequestObject = {};

            finalRequestObject.headers = UWA.extend(requestHeaders, headerWAF);
            finalRequestObject["Content-Type"] = contentTypeWAF;
            finalRequestObject.data = dataWAF;
            finalRequestObject.method = methodWAF;
            finalRequestObject.query = options.query;
            finalRequestObject.type = options.type;
            finalRequestObject.timeout = 25e4;

            finalRequestObject.onComplete = function (dataResp, headerResp) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onCompleate start " +
                  dataResp
              );
              var responseObj = {
                dataResp: dataResp,
                header: headerResp,
              };
              resolve(responseObj);
            };
            finalRequestObject.onFailure = function (
              error,
              responseDOMString,
              headerResp
            ) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onFailure start " +
                  error
              );
              var errorObj = {
                error: error,
                dataResp: responseDOMString,
                headerResp: headerResp,
              };
              reject(errorObj);
            };

            WAFData.proxifiedRequest(urlWAF, finalRequestObject);
          });
        }
      },
      call3DPassport: async function (options) {
        /*
         * options :
         * url
         * method
         * data
         * type
         * callbackData
         * onComplete
         * onFailure
         * forceReload
         */

        if (connector3DSpace._Url3DPassport.length <= 1)
          await connector3DSpace.load3DPassportURL();

        {
          return new Promise(function (resolve, reject) {
            logger.log(
              -1,
              "connector3DSpace.call3DSpace:_Url3DPassport start " + options.url
            );
            var urlWAF = connector3DSpace._Url3DPassport + options.url;
            if (options?.redirectService) {
              if (options.redirectService === "3dspace") {
                urlWAF = urlWAF + "?service=" + connector3DSpace._Url3DSpace+"?tenant="+connector3DSpace._tenant;
              }
            }

            var dataWAF = options.data || {};

            var headerWAF = options.headers || {};
            var requestHeaders = {
              Accept: "application/json",
              "Content-Type": options.contentType || "application/json",
            };

            var methodWAF = options.method || "GET";

            var contentTypeWAF = options.contentType || "application/json";

            var finalRequestObject = {};

            finalRequestObject.headers = UWA.extend(requestHeaders, headerWAF);
            finalRequestObject["Content-Type"] = contentTypeWAF;
            finalRequestObject.data = dataWAF;
            finalRequestObject.method = methodWAF;
            finalRequestObject.query = options.query;
            finalRequestObject.type = options.type;
            finalRequestObject.timeout = 25e4;

            finalRequestObject.onComplete = function (dataResp, headerResp) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onCompleate start " +
                  dataResp
              );
              dataResp = JSON.parse(dataResp);
              var responseObj = {
                dataResp: dataResp,
                header: headerResp,
              };
              resolve(responseObj);
            };
            finalRequestObject.onFailure = function (
              error,
              responseDOMString,
              headerResp
            ) {
              logger.log(
                -1,
                "connector3DSpace.call3DSpace:call3DSpace onFailure start " +
                  error
              );
              var errorObj = {
                error: error,
                dataResp: responseDOMString,
                headerResp: headerResp,
              };
              reject(errorObj);
            };

            WAFData.authenticatedRequest(urlWAF, finalRequestObject);
          });
        }
      },
    };
    widget.connector3DSpace = connector3DSpace;
    widget.connector3DSpace.initConnector();
    return connector3DSpace;
  }
});
