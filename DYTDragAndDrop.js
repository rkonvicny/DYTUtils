define("DS/DYTUtils/DYTDragAndDrop", ["DS/DataDragAndDrop/DataDragAndDrop", "DS/DYTUtils/DYTLogger"], function (DataDragAndDrop, logger) {
  var DYTMBOMDragAndDrop = {
    makeElementDroppable: function (elements, configObject) {
      for (const element of elements) {
        if (element.droppable) continue;
        //DataDragAndDrop.clean(element, "drop");
        DataDragAndDrop.droppable(element, {
          drop: function (dropedString, targetElement, event) {
            let dropContentObject = DYTMBOMDragAndDrop.get3DXContentObject(dropedString);
            //DYTRouteStarterWidget.executeDropFunction(dropedString, eventDiv)
            configObject?.dropFunction && configObject?.dropFunction(dropContentObject, targetElement);
          },
          enter: function (targetElement, event) {
            targetElement.addClass("k-state-hover");
            configObject?.enterFunction && configObject?.enterFunction();
          },
          leave: function (targetElement, event) {
            targetElement.removeClass("k-state-hover");
            configObject?.leaveFunction && configObject?.leaveFunction();
          },
        });
      }
    },
    makeElementDraggable: function (elements, configObject) {
      for (const element of elements) {
        if (element.draggable) continue;
        DataDragAndDrop.clean(element, "drag");
        DataDragAndDrop.draggable(element, {
          start: function (sourceElement, event) {
            let dataObject = configObject?.startFunction && configObject?.startFunction(sourceElement, event);
            event.dataTransfer.setData("text/plain", JSON.stringify(DYTMBOMDragAndDrop.create3DXContentObject(dataObject)));
          },
          stop: function (sourceElement, event) {
            configObject?.stopFunction && configObject?.stopFunction();
          },
        });
      }
    },
    get3DXContentObject: function (dropedString) {
      let droppedObject;
      try {
        droppedObject = JSON.parse(dropedString);
        if (droppedObject.protocol !== "3DXContent") {
          logger.log("DYTProjectAssignerDragAndDrop.get3DXContentObject.Wrong dropped object.");
          logger.showNotification("Unsupported data format. Please try again.", "error");
        }
      } catch (error) {
        logger.log("DYTProjectAssignerDragAndDrop.get3DXContentObject.JSON Parse Error: " + error);
        logger.showNotification("Unable to parse dropped data. Please try again with differnt object.", "error");
      }
      return droppedObject;
    },
    create3DXContentObject: function (dataObject) {
      let securityContext = widget.getValue("scContext");
      let platform = widget.data.x3dPlatformId;
      let contentObject = {
        protocol: "3DXContent",
        version: "2.0",
        source: widget.data.appId,
        widgetId: widget.id,
        data: {
          items: [],
        },
      };
      for (const obj of dataObject.data) {
        if (dataObject.mode ? obj.engphysicalId : obj.physicalId) contentObject.data.items.push(DYTMBOMDragAndDrop.create3DXContentDataItem(platform, securityContext, obj, dataObject.mode));
      }

      return contentObject;
    },
    create3DXContentDataItem: function (platform, securityContext, dataObject, mode) {
      return {
        envId: platform,
        serviceId: "3DSpace",
        contextId: securityContext, //security Context VPLMProjectLeader.MyCompany.Common Space
        objectId: mode ? dataObject.engphysicalId : dataObject.physicalId, //object id
        objectType: mode ? dataObject.engtype : dataObject.type,
        displayName: mode ? dataObject.engtitle : dataObject.title,
        displayType: mode ? dataObject.engdisplayType : dataObject.displayType,
      };
    },
  };

  return DYTMBOMDragAndDrop;
});