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
exports.Metrics = void 0;
/*
 * Wazuh app - Metrics component
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
const eui_1 = require("@elastic/eui");
const common_1 = require("../../../../../../src/plugins/data/common");
//@ts-ignore
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
const lib_1 = require("../mitre/lib");
const modules_helper_1 = require("../../common/modules/modules-helper");
class Metrics extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.buildTitleButton = (count, itemName) => {
            return react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: `Filter by ${itemName}` },
                react_1.default.createElement("span", { className: 'statWithLink', style: { cursor: "pointer", fontSize: count > 20 ? "2rem" : "2.25rem" }, onClick: this.state.metricsOnClicks[itemName] }, this.state.results[itemName]));
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.filterManager = this.KibanaServices.filterManager;
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            resultState: "",
            results: {},
            metricsOnClicks: {},
            loading: true,
            filterParams: {
                filters: [],
                query: { language: 'kuery', query: '' },
                time: { from: 'init', to: 'init' },
            },
        };
        this.modulesHelper = modules_helper_1.ModulesHelper;
        this.stats = react_1.default.createElement(react_1.default.Fragment, null);
        this.metricsList = {
            general: [
                { name: "Total", type: "total" },
                { name: "Level 12 or above alerts", type: "range", gte: "12", lt: null, field: "rule.level", color: "danger" },
                { name: "Authentication failure", type: "phrases", values: ["win_authentication_failed", "authentication_failed", "authentication_failures"], field: "rule.groups", color: "danger" },
                { name: "Authentication success", type: "phrase", value: "authentication_success", field: "rule.groups", color: "secondary" },
            ],
            vuls: [
                { name: "Critical Severity Alerts", type: "phrase", value: "Critical", field: "data.vulnerability.severity", color: "danger" },
                { name: "High Severity Alerts", type: "phrase", value: "High", field: "data.vulnerability.severity" },
                { name: "Medium Severity Alerts", type: "phrase", value: "Medium", field: "data.vulnerability.severity", color: "secondary" },
                { name: "Low Severity Alerts", type: "phrase", value: "Low", field: "data.vulnerability.severity", color: "subdued" },
            ],
            virustotal: [
                { name: "Total malicious", type: "phrase", value: "1", field: "data.virustotal.malicious", color: "danger" },
                { name: "Total positives", type: "phrase", value: "0", negate: true, field: "data.virustotal.positives", color: "secondary" },
                { name: "Total", type: "total" },
            ],
            osquery: [
                { name: "Agents reporting", type: "unique-count", field: "agent.id" },
            ],
            ciscat: [
                { name: "Last scan not checked", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.notchecked" } } } } }, color: "subdued" },
                { name: "Last scan pass", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.pass" } } } } }, color: "secondary" },
                { name: "Last scan score", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.score" } } } } } },
                { name: "Last scan date", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.timestamp" } } } } }, color: "secondary" },
                { name: "Last scan errors", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.error" } } } } }, color: "danger" },
                { name: "Last scan fails", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.fail" } } } } }, color: "danger" },
                { name: "Last scan unknown", type: "custom", filter: { phrase: "ciscat", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.cis.unknown" } } } } }, color: "subdued" },
            ],
            oscap: [
                { name: "Last scan score", type: "custom", filter: { phrase: "oscap-report", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "timestamp", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.oscap.scan.score" } } } } } },
                { name: "Highest scan score", type: "custom", filter: { phrase: "oscap-report", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "data.oscap.scan.score", "order": { "_term": "desc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.oscap.scan.score" } } } } }, color: "secondary" },
                { name: "Lowest scan score", type: "custom", filter: { phrase: "oscap-report", field: "rule.groups" }, agg: { "customAggResult": { "terms": { "field": "data.oscap.scan.score", "order": { "_term": "asc" }, "size": 1 }, "aggs": { "aggResult": { "terms": { "field": "data.oscap.scan.score" } } } } }, color: "danger" },
            ]
        };
    }
    async componentDidMount() {
        this.indexPattern = await lib_1.getIndexPattern();
        this.scope = await this.modulesHelper.getDiscoverScope();
        this._isMount = true;
        this.buildMetric();
    }
    async getResults(filterParams, aggs = {}) {
        const params = { size: 0, track_total_hits: true };
        const result = await lib_1.getElasticAlerts(this.indexPattern, filterParams, aggs, params);
        let totalHits = 0;
        if (Object.keys(aggs).length) {
            const agg = (((result.data || {}).aggregations || {}));
            if (agg && agg.customAggResult) { //CUSTOM AGG
                totalHits = ((((((agg.customAggResult || {}).buckets || [])[0] || {}).aggResult || {}).buckets || [])[0] || {}).key || 0;
            }
            else {
                totalHits = (agg.aggResult || {}).value || 0;
            }
        }
        else {
            totalHits = (((result.data || {}).hits || {}).total || {}).value || 0;
        }
        return totalHits;
    }
    buildMetric() {
        if (!this.metricsList[this.props.section] || !this._isMount)
            return react_1.default.createElement(react_1.default.Fragment, null);
        const newFilters = this.filterManager.filters;
        const searchBarQuery = this.scope.state.query;
        const newTime = this.timefilter.getTime();
        const filterParams = {};
        filterParams["time"] = this.timefilter.getTime();
        filterParams["query"] = searchBarQuery;
        filterParams["filters"] = this.filterManager.filters;
        this.setState({ filterParams, loading: true, results: {} });
        const newOnClick = {};
        const result = this.metricsList[this.props.section].map(async (item) => {
            let filters = [];
            if (item.type === 'range') {
                const results = {};
                const rangeFilterParams = {};
                const valuesArray = { gte: item.gte, lt: item.lt };
                const filters = {
                    ...common_1.buildRangeFilter({ name: item.field, type: "integer" }, valuesArray, this.indexPattern),
                    "$state": { "store": "appState" }
                };
                rangeFilterParams["filters"] = [...filterParams["filters"]];
                rangeFilterParams["time"] = filterParams["time"];
                rangeFilterParams["query"] = filterParams["query"];
                rangeFilterParams["filters"].push(filters);
                newOnClick[item.name] = () => { this.filterManager.addFilters(filters); };
                results[item.name] = await this.getResults(rangeFilterParams);
                return results;
            }
            else if (item.type === "phrases") {
                const results = {};
                const phrasesFilter = {};
                const filters = {
                    ...common_1.buildPhrasesFilter({ name: item.field, type: "string" }, item.values, this.indexPattern),
                    "$state": { "store": "appState" }
                };
                phrasesFilter["filters"] = [...filterParams["filters"]];
                phrasesFilter["time"] = filterParams["time"];
                phrasesFilter["query"] = filterParams["query"];
                phrasesFilter["filters"].push(filters);
                newOnClick[item.name] = () => { this.filterManager.addFilters(filters); };
                results[item.name] = await this.getResults(phrasesFilter);
                return results;
            }
            else if (item.type === "custom") {
                const results = {};
                const customFilters = {};
                customFilters["filters"] = [...filterParams["filters"]];
                customFilters["time"] = filterParams["time"];
                customFilters["query"] = filterParams["query"];
                if (item.filter.phrase) {
                    const filters = {
                        ...common_1.buildPhraseFilter({ name: item.filter.field, type: "string" }, item.filter.phrase, this.indexPattern),
                        "$state": { "store": "appState" }
                    };
                    customFilters["filters"].push(filters);
                }
                results[item.name] = await this.getResults(customFilters, item.agg);
                return results;
            }
            else if (item.type === "exists") {
                const results = {};
                const existsFilters = {};
                const filters = {
                    ...common_1.buildExistsFilter({ name: item.field, type: 'nested' }, this.indexPattern),
                    "$state": { "store": "appState" }
                };
                existsFilters["filters"] = [...filterParams["filters"]];
                existsFilters["time"] = filterParams["time"];
                existsFilters["query"] = filterParams["query"];
                existsFilters["filters"].push(filters);
                newOnClick[item.name] = () => { this.filterManager.addFilters(filters); };
                results[item.name] = await this.getResults(existsFilters);
                return results;
            }
            else if (item.type === "unique-count") {
                const results = {};
                const params = {};
                const aggs = {
                    "aggResult": {
                        "cardinality": {
                            "field": item.field
                        }
                    }
                };
                params["filters"] = [...filterParams["filters"]];
                params["time"] = filterParams["time"];
                params["query"] = filterParams["query"];
                results[item.name] = await this.getResults(params, aggs);
                return results;
            }
            else if (item.type === "phrase") {
                const results = {};
                const phraseFilter = {};
                const filters = {
                    ...common_1.buildPhraseFilter({ name: item.field, type: "string" }, item.value, this.indexPattern),
                    "$state": { "store": "appState" }
                };
                if (item.negate) {
                    filters.meta.negate = item.negate;
                }
                phraseFilter["filters"] = [...filterParams["filters"]];
                phraseFilter["time"] = filterParams["time"];
                phraseFilter["query"] = filterParams["query"];
                phraseFilter["filters"].push(filters);
                newOnClick[item.name] = () => { this.filterManager.addFilters(filters); };
                results[item.name] = await this.getResults(phraseFilter);
                return results;
            }
            else {
                const results = {};
                results[item.name] = await this.getResults(filterParams);
                return results;
            }
        });
        Promise.all(result).then((completed) => {
            const newResults = {};
            completed.forEach(item => {
                const key = Object.keys(item)[0];
                newResults[key] = item[key];
            });
            this.setState({ results: newResults, loading: false, buildingMetrics: false, metricsOnClicks: newOnClick });
        });
    }
    componentDidUpdate() {
        if (!this.state.buildingMetrics && this.props.resultState === 'ready' && this.state.resultState === 'loading') {
            this.setState({ buildingMetrics: true, resultState: this.props.resultState }, () => {
                this.stats = this.buildMetric();
            });
        }
        else if (this.props.resultState !== this.state.resultState) {
            const isLoading = this.props.resultState === 'loading' ? { loading: true } : {};
            this.setState({ resultState: this.props.resultState, ...isLoading });
        }
    }
    buildStatsComp() {
        const { section } = this.props;
        if (this.metricsList[section]) {
            return this.metricsList[section].map((item, idx) => {
                const count = (this.state.results[item.name] || []).length;
                return (react_1.default.createElement(eui_1.EuiFlexItem, { grow: count > 20 ? 3 : 1, key: `${item.name}` },
                    react_1.default.createElement(eui_1.EuiStat, { title: this.state.metricsOnClicks[item.name] ? this.buildTitleButton(count, item.name) :
                            react_1.default.createElement("span", { style: { fontSize: count > 20 ? "2rem" : "2.25rem" } }, this.state.results[item.name]), description: item.name, titleColor: this.metricsList[section][idx].color || 'primary', isLoading: this.state.loading, textAlign: "center" })));
            });
        }
    }
    render() {
        const stats = this.buildStatsComp();
        return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null),
            stats,
            react_1.default.createElement(eui_1.EuiFlexItem, null)));
    }
}
exports.Metrics = Metrics;
