"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKibanaSettingsTimeFilter = void 0;
const react_services_1 = require("../../../react-services");
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
const constants_1 = require("../../../../util/constants");
function checkKibanaSettingsTimeFilter(changeTimeDefaults) {
    changeTimeDefaults && getKibanaSettings()
        .then(checkTimeFilter)
        .then(updateTimeFilterSetting)
        .catch(error => error !== 'Unable to update config' && console.log(error));
}
exports.checkKibanaSettingsTimeFilter = checkKibanaSettingsTimeFilter;
async function getKibanaSettings() {
    const kibanaSettings = await react_services_1.GenericRequest.request('GET', '/api/kibana/settings');
    return kibanaSettings.data;
}
async function checkTimeFilter({ settings }) {
    if (!settings["timepicker:timeDefaults"]) {
        return false;
    }
    const timeFilter = settings["timepicker:timeDefaults"].userValue;
    const timeFilterObject = JSON.parse(timeFilter);
    return constants_1.WAZUH_TIME_FILTER_DEFAULT.from == timeFilterObject.from && constants_1.WAZUH_TIME_FILTER_DEFAULT.to == timeFilterObject.to;
}
async function updateTimeFilterSetting(isModified) {
    return !isModified && await react_services_1.GenericRequest.request('POST', '/api/kibana/settings', { "changes": { "timepicker:timeDefaults": JSON.stringify(constants_1.WAZUH_TIME_FILTER_DEFAULT) } }) && kibana_services_1.getServices().timefilter.setTime(constants_1.WAZUH_TIME_FILTER_DEFAULT);
}
