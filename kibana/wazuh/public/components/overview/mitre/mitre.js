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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mitre = void 0;
/*
 * Wazuh app - Mitre alerts components
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const react_1 = __importStar(require("react"));
const components_1 = require("./components");
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
const notify_1 = require("ui/notify");
const lib_1 = require("./lib");
//@ts-ignore
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
const kbn_search_bar_1 = require("../../kbn-search-bar");
const modules_helper_1 = require("../../common/modules/modules-helper");
class Mitre extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.onQuerySubmit = (payload) => {
            const { query, dateRange } = payload;
            const { filters } = this.state.filterParams;
            const filterParams = { query, time: dateRange, filters };
            this.setState({ filterParams, isLoading: true }, () => this.setState({ isLoading: false }));
        };
        this.onFiltersUpdated = (filters) => {
            const { query, time } = this.state.filterParams;
            const filterParams = { query, time, filters };
            this.setState({ filterParams, isLoading: true }, () => this.setState({ isLoading: false }));
        };
        this.showToast = (color, title, text, time) => {
            notify_1.toastNotifications.add({
                color: color,
                title: title,
                text: text,
                toastLifeTimeMs: time
            });
        };
        this.onChangeSelectedTactics = (selectedTactics) => {
            this.setState({ selectedTactics });
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.filterManager = this.KibanaServices.filterManager;
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            tacticsObject: {},
            selectedTactics: {},
            isLoading: true,
            filterParams: {
                filters: this.filterManager.getFilters() || [],
                query: { language: 'kuery', query: '' },
                time: this.timefilter.getTime(),
            },
        };
        this.onChangeSelectedTactics.bind(this);
        this.onQuerySubmit.bind(this);
        this.onFiltersUpdated.bind(this);
    }
    async componentDidMount() {
        this._isMount = true;
        this.indexPattern = await lib_1.getIndexPattern();
        const scope = await modules_helper_1.ModulesHelper.getDiscoverScope();
        const query = scope.state.query;
        const { filters, time } = this.state.filterParams;
        this.setState({ filterParams: { query, filters, time } });
        await this.buildTacticsObject();
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    async buildTacticsObject() {
        try {
            const data = await wz_request_1.WzRequest.apiReq('GET', '/mitre', {
                params: {
                    select: "phase_name"
                }
            });
            const result = (((data || {}).data || {}).data || {}).affected_items;
            const tacticsObject = {};
            result && result.forEach(item => {
                const { id, phase_name } = item;
                phase_name.forEach((tactic) => {
                    if (!tacticsObject[tactic]) {
                        tacticsObject[tactic] = [];
                    }
                    tacticsObject[tactic].push(id);
                });
            });
            this._isMount && this.setState({ tacticsObject, isLoading: false });
        }
        catch (err) {
            this.showToast('danger', 'Error', `Mitre data could not be fetched: ${err}`, 3000);
        }
    }
    render() {
        const { isLoading } = this.state;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement("div", { className: 'wz-discover hide-filter-control' },
                        react_1.default.createElement(kbn_search_bar_1.KbnSearchBar, { onQuerySubmit: this.onQuerySubmit, onFiltersUpdated: this.onFiltersUpdated, isLoading: isLoading })))),
            react_1.default.createElement(eui_1.EuiFlexGroup, { style: { margin: '0 8px' } },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "none" },
                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { width: "15%", minWidth: 145, height: "calc(100vh - 280px)", overflowX: "hidden" } },
                                react_1.default.createElement(components_1.Tactics, Object.assign({ indexPattern: this.indexPattern, onChangeSelectedTactics: this.onChangeSelectedTactics, filters: this.state.filterParams }, this.state))),
                            react_1.default.createElement(eui_1.EuiFlexItem, null,
                                react_1.default.createElement(components_1.Techniques, Object.assign({ indexPattern: this.indexPattern, filters: this.state.filterParams, onSelectedTabChanged: (id) => this.props.onSelectedTabChanged(id) }, this.state)))))))));
    }
}
exports.Mitre = Mitre;
