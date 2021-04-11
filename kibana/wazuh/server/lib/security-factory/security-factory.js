"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityObj = void 0;
const factories_1 = require("./factories");
const constants_1 = require("../../../util/constants");
function SecurityObj(platform, server) {
    switch (platform) {
        case constants_1.WAZUH_SECURITY_PLUGIN_XPACK_SECURITY:
            return new factories_1.XpackFactory(server);
        case constants_1.WAZUH_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH:
            return new factories_1.OpendistroFactory(server);
        default:
            return new factories_1.DefaultFactory(server);
    }
}
exports.SecurityObj = SecurityObj;
