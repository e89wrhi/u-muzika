export const logger = {
  // log info
  info: ({
    message,
    source,
    details = {},
  }: {
    message: string; // function name
    source: string; // page name
    details?: Record<string, string>;
  }) => {
    // more detail infos
    console.info(
      JSON.stringify({
        level: "Info",
        message,
        source,
        timestamp: new Date().toISOString(),
        exception: null,
        details,
      }),
    );
  },

  // log warning
  warn: ({
    message,
    source,
    details = {},
  }: {
    message: string; // function name
    source: string; // page name
    details?: Record<string, string>;
  }) => {
    // more detail infos
    console.warn(
      JSON.stringify({
        level: "Warning",
        message,
        source,
        timestamp: new Date().toISOString(),
        exception: null,
        details,
      }),
    );
  },

  // log error
  error: ({
    message,
    source,
    exception,
    details = {},
  }: {
    message: string; // function name
    source: string; // page name
    exception?: string; // error message detail
    details?: Record<string, string>;
  }) => {
    // more detail infos
    console.error(
      JSON.stringify({
        level: "Error",
        message,
        source,
        timestamp: new Date().toISOString(),
        exception: exception ?? null,
        details,
      }),
    );
  },
};
