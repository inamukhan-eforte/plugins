"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const logger_1 = require("../../logger");
const get_configuration_1 = require("../../lib/get-configuration");
const DEBUG = 'debug';
const INFO = 'info';
const ERROR = 'error';
const COLOR = '\u001b[34mwazuh\u001b[39m';
const ERROR_COLOR = (errorLevel) => [COLOR, 'Cron-scheduler', errorLevel === DEBUG ? INFO : errorLevel];
function ErrorHandler(error, server) {
    const { ['logs.level']: logLevel } = get_configuration_1.getConfiguration();
    const errorLevel = ErrorLevels[error.error] || ERROR;
    logger_1.log('Cron-scheduler', error, errorLevel === ERROR ? INFO : errorLevel);
    try {
        if (errorLevel === DEBUG && logLevel !== DEBUG)
            return;
        server.log(ERROR_COLOR(errorLevel), `${JSON.stringify(error)}`);
    }
    catch (error) {
        server.log(ERROR_COLOR(ERROR), `Message to long to show in console output, check the log file`);
    }
}
exports.ErrorHandler = ErrorHandler;
const ErrorLevels = {
    401: INFO,
    403: ERROR,
    409: DEBUG,
    3005: INFO,
    3013: DEBUG,
    10001: INFO,
    10002: DEBUG,
    10003: DEBUG,
    10004: DEBUG,
    10005: DEBUG,
    10006: DEBUG,
    10007: DEBUG,
};
