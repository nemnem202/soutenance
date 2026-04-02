/** biome-ignore-all lint/suspicious/noExplicitAny: Intentional */
// const IS_DEV = process.env.NODE_ENV === "dev" || import.meta.env?.DEV;
// const IS_TEST = process.env.NODE_ENV === "test" || import.meta.env?.TEST;
// const IS_BROWSER = typeof window !== "undefined";

type LogLevel = "info" | "success" | "warn" | "error";

const colors = {
  info: "#057cc9",
  success: "#419210",
  warn: "#fdaf13",
  error: "#c70d18",
};

const formatLog = (level: LogLevel, message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  return [
    `%c[${level.toUpperCase()}] %c${timestamp} %c${message}`,
    `color: ${colors[level]}; font-weight: bold`,
    `color: gray; font-size: 10px`,
    `color: inherit`,
  ];
};

// const shouldLog = () => {
//   if (IS_TEST) return false;
//   return IS_DEV || !IS_BROWSER;
// };

// console.info("SHOULD LOG: ", shouldLog(), "Node env: ", process.env.NODE_ENV);

export const logger = {
  info: (msg: string, ...args: any[]) => {
    console.log(...formatLog("info", msg), ...args);
  },
  success: (msg: string, ...args: any[]) => {
    console.log(...formatLog("success", msg), ...args);
  },
  warn: (msg: string, ...args: any[]) => {
    console.warn(...formatLog("warn", msg), ...args);
  },
  error: (msg: string, ...args: any[]) => {
    console.error(...formatLog("error", msg), ...args);
  },
  table: (data: any, msg?: string) => {
    if (msg) console.log(...formatLog("info", msg));
    console.table(data);
  },
};
