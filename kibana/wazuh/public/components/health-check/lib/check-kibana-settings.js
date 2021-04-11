"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKibanaSettings = void 0;
const react_services_1 = require("../../../react-services");
function checkKibanaSettings(removeMetaFields) {
    removeMetaFields && getKibanaSettings()
        .then(checkMetafieldSetting)
        .then(updateMetaFieldsSetting)
        .catch(error => error !== 'Unable to update config' && console.log(error));
}
exports.checkKibanaSettings = checkKibanaSettings;
async function getKibanaSettings() {
    const kibanaSettings = await react_services_1.GenericRequest.request('GET', '/api/kibana/settings');
    return kibanaSettings.data;
}
async function checkMetafieldSetting({ settings }) {
    const { metaFields } = settings;
    return !!metaFields && !!metaFields.userValue.length;
}
async function updateMetaFieldsSetting(isModified) {
    return !isModified && await react_services_1.GenericRequest.request('POST', '/api/kibana/settings', { "changes": { "metaFields": [] } });
}
