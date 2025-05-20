define("DS/DYTUtils/DYTLoggingService/DYTLoggingService", [
  "DS/DYTUtils/DYTLoggingService/DYTEventBus",
  "DS/DYTUtils/DYTLogger", // Váš existující, nemodifikovaný logger
], function (
  eventBus,
  dytLogger // Přejmenováno pro srozumitelnost
) {
  "use strict";

  function formatArgs(args) {
    if (!args || args.length === 0) return "";
    return args
      .map((arg) => {
        try {
          if (arg === undefined) return "undefined";
          if (arg === null) return "null";
          if (arg instanceof Blob) return `[Blob type:${arg.type}, size:${arg.size}]`;
          if (arg instanceof File) return `[File name:${arg.name}, type:${arg.type}, size:${arg.size}]`;
          if (typeof arg === "string" && arg.length > 100) return `"${arg.substring(0, 97)}..."`;
          if (typeof arg === "object") {
            const preview = JSON.stringify(arg); // Jednoduchý náhled
            return preview.length > 100 ? preview.substring(0, 97) + "..." : preview;
          }
          return String(arg);
        } catch (e) {
          return "[Unserializable Arg]";
        }
      })
      .join(", ");
  }

  function formatResult(result) {
    if (result === undefined) return "[No Result]";
    try {
      if (result === null) return "null";
      if (result instanceof Blob) return `[Blob type:${result.type}, size:${result.size}]`;
      if (result instanceof File) return `[File name:${result.name}, type:${result.type}, size:${result.size}]`;
      if (typeof result === "string" && result.length > 150) return `"${result.substring(0, 147)}..."`;
      if (typeof result === "object") {
        const preview = JSON.stringify(result);
        return preview.length > 150 ? preview.substring(0, 147) + "..." : preview;
      }
      return String(result);
    } catch (e) {
      return "[Unserializable Result]";
    }
  }

  function initialize() {
    // Používáme dytLogger.logLevel pro respektování jeho konfigurace
    // Úrovně pro dytLogger: -1 (debug/info), 0 (warn), 1 (error), 2 (dialog)
    eventBus.on("method:before", (data) => {
      if (dytLogger.enabled && dytLogger.logLevel <= -1) {
        const argsString = formatArgs(data.args);
        dytLogger.log(-1, `CALL: ${data.moduleName}.${data.methodName}(${argsString})`);
      }
    });

    eventBus.on("method:success", (data) => {
      if (dytLogger.enabled && dytLogger.logLevel <= -1) {
        const resultString = formatResult(data.result);
        dytLogger.log(-1, `SUCCESS: ${data.moduleName}.${data.methodName} -> ${resultString}`);
      }
    });

    eventBus.on("method:error", (data) => {
      if (dytLogger.enabled) {
        let errorMessage = `ERROR: ${data.moduleName}.${data.methodName} FAILED. Message: ${
          data.error ? data.error.message : "Unknown error"
        }`;
        dytLogger.log(1, errorMessage);
        if (data.error && data.error.stack) {
          console.error("Stack trace:", data.error.stack); // Stack trace logujeme zvlášť
        }
      }
    });
    dytLogger.log(-1, "DYTLoggingService initialized and listening to method events.");
  }
  initialize(); // Služba se sama inicializuje při načtení
  return {}; // Tento modul nemusí nic exportovat, pokud je jen listener
});
