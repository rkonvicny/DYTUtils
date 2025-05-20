define("DS/DYTUtils/DYTLoggingService/FunctionWrapper", ["DS/DYTUtils/DYTLoggingService/DYTEventBus"], function (
  DYTEventBus
) {
  "use strict";

  return function wrapMethod(fn, methodName, moduleName) {
    if (typeof fn !== "function") {
      return fn; // Neobalovat nic, co není funkce
    }

    const isAsync = fn.constructor.name === "AsyncFunction";

    if (isAsync) {
      return async function (...args) {
        const eventData = { moduleName, methodName, args, timestamp: new Date().toISOString() };
        DYTEventBus.emit("method:before", { ...eventData });
        try {
          const result = await fn.apply(this, args);
          DYTEventBus.emit("method:success", { ...eventData, result });
          return result;
        } catch (error) {
          DYTEventBus.emit("method:error", {
            ...eventData,
            error: { message: error.message, stack: error.stack, name: error.name },
          });
          throw error;
        }
      };
    } else {
      return function (...args) {
        const eventData = { moduleName, methodName, args, timestamp: new Date().toISOString() };
        DYTEventBus.emit("method:before", { ...eventData });
        try {
          const result = fn.apply(this, args);
          DYTEventBus.emit("method:success", { ...eventData, result });
          return result;
        } catch (error) {
          DYTEventBus.emit("method:error", {
            ...eventData,
            error: { message: error.message, stack: error.stack, name: error.name },
          });
          throw error;
        }
      };
    }
  };
});
