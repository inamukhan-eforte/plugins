"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const chrome_1 = __importDefault(require("ui/chrome"));
const app_state_1 = require("../../react-services/app-state");
const pattern_handler_1 = require("../../react-services/pattern-handler");
const kibana_services_1 = require("../../../../../src/plugins/discover/public/kibana_services");
const wazuh_config_1 = require("../../react-services/wazuh-config");
const generic_request_1 = require("../../react-services/generic-request");
const wz_api_check_1 = require("../../react-services/wz-api-check");
const wz_request_1 = require("../../react-services/wz-request");
const saved_objects_1 = require("../../react-services/saved-objects");
const error_handler_1 = require("../../react-services/error-handler");
const notify_1 = require("ui/notify");
const constants_1 = require("../../../util/constants");
const lib_1 = require("./lib");
class HealthCheck extends react_1.Component {
    constructor(props) {
        super(props);
        this.showToast = (color, title, text, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                text: text,
                toastLifeTimeMs: time
            });
        };
        this.state = {
            checks: [],
            results: [],
            errors: []
        };
    }
    async componentDidMount() {
        const app = kibana_services_1.getAngularModule('app/wazuh');
        this.$rootScope = app.$injector.get('$rootScope');
        this.load();
    }
    /**
     * Manage an error
     */
    handleError(error) {
        let errors = this.state.errors;
        errors.push(error_handler_1.ErrorHandler.handle(error, 'Health Check', { silent: true }));
        this.setState({ errors });
    }
    /**
     * This validates a pattern
     */
    async checkPatterns() {
        try {
            const patternId = app_state_1.AppState.getCurrentPattern();
            let patternTitle = '';
            let results = this.state.results;
            let errors = this.state.errors;
            if (this.state.checks.pattern) {
                const i = this.state.results.map(item => item.id).indexOf(2);
                let patternData = patternId ? await saved_objects_1.SavedObject.existsIndexPattern(patternId) : false;
                if (!patternData)
                    patternData = {};
                patternTitle = patternData.title;
                /* This extra check will work as long as Wazuh monitoring index ID is wazuh-monitoring-*.
                   Currently is not possible to change that index pattern as it has always been created on our backend.
                   This extra check checks if the index pattern exists for the current logged in user
                   in case it doesn't exist, the index pattern is automatically created. This is necessary to make it work with Opendistro multinenancy
                   as every index pattern is stored in its current tenant .kibana-tenant-XX index.
                   */
                try {
                    await saved_objects_1.SavedObject.existsMonitoringIndexPattern(constants_1.WAZUH_MONITORING_PATTERN); //this checks if it exists, if not it automatically creates the index pattern
                }
                catch (err) { }
                if (!patternData.status) {
                    const patternList = await pattern_handler_1.PatternHandler.getPatternList("healthcheck");
                    if (patternList.length) {
                        const currentPattern = patternList[0].id;
                        app_state_1.AppState.setCurrentPattern(currentPattern);
                        return this.checkPatterns();
                    }
                    else {
                        errors.push('The selected index-pattern is not present.');
                        results[i].description = react_1.default.createElement("span", null,
                            react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                            " Error");
                    }
                }
                else {
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "check", color: "secondary" }),
                        " Ready");
                }
                this.setState({ results, errors });
            }
            if (this.state.checks.template) {
                if (!patternTitle) {
                    var patternData = await saved_objects_1.SavedObject.existsIndexPattern(patternId);
                    patternTitle = patternData.title;
                }
                const i = results.map(item => item.id).indexOf(3);
                const templateData = await generic_request_1.GenericRequest.request('GET', `/elastic/template/${patternTitle}`);
                if (!templateData.data.status) {
                    errors.push('No template found for the selected index-pattern.');
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                        " Error");
                }
                else {
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "check", color: "secondary" }),
                        " Ready");
                }
                this.setState({ results, errors });
            }
            return;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async trySetDefault() {
        try {
            const response = await generic_request_1.GenericRequest.request('GET', '/hosts/apis');
            const hosts = response.data;
            const errors = [];
            if (hosts.length) {
                for (var i = 0; i < hosts.length; i++) {
                    try {
                        const API = await wz_api_check_1.ApiCheck.checkApi(hosts[i], true);
                        if (API && API.data) {
                            return hosts[i].id;
                        }
                    }
                    catch (err) {
                        errors.push(`Could not connect to API with id: ${hosts[i].id}: ${err.message || err}`);
                    }
                }
                if (errors.length) {
                    let err = this.state.errors;
                    errors.forEach(error => err.push(error));
                    this.setState({ errors: err });
                    return Promise.reject('No API available to connect.');
                }
            }
        }
        catch (err) {
            return Promise.reject(`Error connecting to API: ${err}`);
        }
    }
    /**
     * This attempts to connect with API
     */
    async checkApiConnection() {
        let results = this.state.results;
        let errors = this.state.errors;
        let apiChanged = false;
        try {
            const currentApi = JSON.parse(app_state_1.AppState.getCurrentAPI() || '{}');
            if (this.state.checks.api && currentApi && currentApi.id) {
                let data;
                try {
                    data = await wz_api_check_1.ApiCheck.checkStored(currentApi.id);
                }
                catch (err) {
                    try {
                        const newApi = await this.trySetDefault();
                        data = await wz_api_check_1.ApiCheck.checkStored(newApi, true);
                        apiChanged = true;
                    }
                    catch (err2) {
                        throw err2;
                    }
                    ;
                }
                if (apiChanged) {
                    this.showToast('warning', 'Selected Wazuh API has been updated', '', 3000);
                    const api = ((data || {}).data || {}).data || {};
                    const name = (api.cluster_info || {}).manager || false;
                    app_state_1.AppState.setCurrentAPI(JSON.stringify({ name: name, id: api.id }));
                }
                //update cluster info
                const cluster_info = (((data || {}).data || {}).data || {})
                    .cluster_info;
                if (cluster_info) {
                    app_state_1.AppState.setClusterInfo(cluster_info);
                }
                const i = results.map(item => item.id).indexOf(0);
                if (data === 3099) {
                    errors.push('Wazuh not ready yet.');
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                        " Error");
                    if (this.checks.setup) {
                        const i = results.map(item => item.id).indexOf(1);
                        results[i].description = react_1.default.createElement("span", null,
                            react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                            " Error");
                    }
                    this.setState({ results, errors });
                }
                else if (data.data.error || data.data.data.apiIsDown) {
                    errors.push(data.data.data.apiIsDown ? 'Wazuh API is down.' : `Error connecting to the API.${data.data.error && data.data.error.message ? ` ${data.data.error.message}` : ''}`);
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                        " Error");
                    results[i + 1].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                        " Error");
                    this.setState({ results, errors });
                }
                else {
                    results[i].description = react_1.default.createElement("span", null,
                        react_1.default.createElement(eui_1.EuiIcon, { type: "check", color: "secondary" }),
                        " Ready");
                    this.setState({ results, errors });
                    if (this.state.checks.setup) {
                        const versionData = await wz_request_1.WzRequest.apiReq('GET', '//', {});
                        const apiVersion = versionData.data.data.api_version;
                        const setupData = await generic_request_1.GenericRequest.request('GET', '/api/setup');
                        if (!setupData.data.data['app-version']) {
                            errors.push('Error fetching app version');
                        }
                        ;
                        if (!apiVersion) {
                            errors.push('Error fetching Wazuh API version');
                        }
                        ;
                        const api = /v?(?<version>\d+)\.(?<minor>\d+)\.(?<path>\d+)/.exec(apiVersion);
                        const appSplit = setupData.data.data['app-version'].split('.');
                        const i = this.state.results.map(item => item.id).indexOf(1);
                        if (api.groups.version !== appSplit[0] || api.groups.minor !== appSplit[1]) {
                            errors.push('API version mismatch. Expected v' +
                                setupData.data.data['app-version']);
                            results[i].description = react_1.default.createElement("span", null,
                                react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                                " Error");
                            this.setState({ results, errors });
                        }
                        else {
                            results[i].description = react_1.default.createElement("span", null,
                                react_1.default.createElement(eui_1.EuiIcon, { type: "check", color: "secondary" }),
                                " Ready");
                            this.setState({ results, errors });
                        }
                    }
                }
            }
            return;
        }
        catch (error) {
            results[0].description = react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                " Error");
            results[1].description = react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                " Error");
            this.setState({ results });
            app_state_1.AppState.removeNavigation();
            if (error && error.data && error.data.code && error.data.code === 3002) {
                return error;
            }
            else {
                this.handleError(error);
            }
        }
    }
    /**
     * On controller loads
     */
    async load() {
        try {
            const wazuhConfig = new wazuh_config_1.WazuhConfig();
            const configuration = wazuhConfig.getConfig();
            lib_1.checkKibanaSettings(configuration['checks.metaFields']);
            lib_1.checkKibanaSettingsTimeFilter(configuration['checks.timeFilter']);
            app_state_1.AppState.setPatternSelector(configuration['ip.selector']);
            let checks = {};
            checks.pattern = configuration['checks.pattern'];
            checks.template = configuration['checks.template'];
            checks.api = configuration['checks.api'];
            checks.setup = configuration['checks.setup'];
            checks.fields = configuration['checks.fields'];
            const results = [];
            results.push({
                id: 0,
                title: 'Check Wazuh API connection',
                description: checks.api ? react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                    " Checking...") : 'Disabled'
            }, {
                id: 1,
                title: 'Check for Wazuh API version',
                description: checks.setup ? react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                    " Checking...") : 'Disabled'
            }, {
                id: 2,
                title: 'Check Elasticsearch index pattern',
                description: checks.pattern ? react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                    " Checking...") : 'Disabled'
            }, {
                id: 3,
                title: 'Check Elasticsearch template',
                description: checks.template ? react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                    " Checking...") : 'Disabled'
            }, {
                id: 4,
                title: 'Check index pattern fields',
                description: checks.fields ? react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                    " Checking...") : 'Disabled'
            });
            this.setState({ checks, results }, async () => {
                await Promise.all([this.checkPatterns(), this.checkApiConnection()]);
                if (checks.fields) {
                    const i = results.map(item => item.id).indexOf(4);
                    try {
                        await pattern_handler_1.PatternHandler.refreshIndexPattern();
                        results[i].description = react_1.default.createElement("span", null,
                            react_1.default.createElement(eui_1.EuiIcon, { type: "check", color: "secondary" }),
                            " Ready");
                        this.setState({ results });
                    }
                    catch (error) {
                        results[i].description = react_1.default.createElement("span", null,
                            react_1.default.createElement(eui_1.EuiIcon, { type: "alert", color: "danger" }),
                            " Error");
                        this.setState({ results }, () => this.handleError(error));
                    }
                }
                if (!this.state.errors || !this.state.errors.length) {
                    setTimeout(() => {
                        const params = this.$rootScope.previousParams || {};
                        var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                        const url = 'wazuh#' + (this.$rootScope.previousLocation || '') + '?' + queryString;
                        window.location.assign(chrome_1.default.addBasePath(url));
                        return;
                    }, 300);
                }
                return;
            });
        }
        catch (error) {
            this.handleError(error);
        }
    }
    goApp() {
        window.location.href = '/app/wazuh#/settings';
    }
    render() {
        const logo_url = chrome_1.default.addBasePath('/plugins/wazuh/img/icon_blue.svg');
        return (react_1.default.createElement("div", { className: "health-check" },
            react_1.default.createElement(eui_1.EuiLoadingSpinner, { className: "health-check-loader" }),
            react_1.default.createElement("img", { src: logo_url, className: "health-check-logo", alt: "" }),
            react_1.default.createElement("div", { className: "margin-top-30" },
                react_1.default.createElement(eui_1.EuiDescriptionList, { textStyle: "reverse", align: "center", type: "column", listItems: this.state.results })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xxl" }),
            (this.state.errors || []).map(error => (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiCallOut, { title: error, color: "danger", iconType: "alert", style: { textAlign: 'left' } }),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xxl" }),
            !!this.state.errors.length && (react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: () => this.goApp() }, "Go to App"))));
    }
}
exports.HealthCheck = HealthCheck;
;
