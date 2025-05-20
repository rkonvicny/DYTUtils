define("DS/DYTUtils/DYTLoggingService/DYTEventBus", [], function () {
  "use strict";
  const subscribers = {};

  return {
    on: function (eventName, callback) {
      if (!subscribers[eventName]) {
        subscribers[eventName] = [];
      }
      subscribers[eventName].push(callback);
    },

    off: function (eventName, callback) {
      if (subscribers[eventName]) {
        subscribers[eventName] = subscribers[eventName].filter((cb) => cb !== callback);
      }
    },

    emit: function (eventName, data) {
      if (subscribers[eventName]) {
        subscribers[eventName].forEach((callback) => {
          try {
            callback(data);
          } catch (e) {
            console.error(`Error in event bus subscriber for ${eventName}:`, e);
          }
        });
      }
    },
  };
});
