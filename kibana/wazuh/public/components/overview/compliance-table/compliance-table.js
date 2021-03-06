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
exports.ComplianceTable = void 0;
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
const eui_1 = require("@elastic/eui");
//@ts-ignore
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
const requirements_1 = require("./components/requirements");
const subrequirements_1 = require("./components/subrequirements");
const lib_1 = require("../mitre/lib");
const pci_requirements_1 = require("../../../../server/integration-files/pci-requirements");
const gdpr_requirements_1 = require("../../../../server/integration-files/gdpr-requirements");
const hipaa_requirements_1 = require("../../../../server/integration-files/hipaa-requirements");
const nist_requirements_1 = require("../../../../server/integration-files/nist-requirements");
const tsc_requirements_1 = require("../../../../server/integration-files/tsc-requirements");
const kbn_search_bar_1 = require("../../kbn-search-bar");
class ComplianceTable extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.onChangeSelectedRequirements = (selectedRequirements) => {
            this.setState({ selectedRequirements });
        };
        this.onQuerySubmit = (payload) => {
            const { dateRange, query } = payload;
            const { filters } = this.state.filterParams;
            const filterParams = { time: dateRange, filters, query };
            this.setState({ filterParams, loadingAlerts: true });
        };
        this.onFiltersUpdated = (filters) => {
            const { time, query } = this.state.filterParams;
            const filterParams = { time, query, filters };
            this.setState({ filterParams, loadingAlerts: true });
        };
        this.onChangeFlyout = (flyoutOn) => {
            this.setState({ flyoutOn });
        };
        this.KibanaServices = kibana_services_1.getServices();
        this.filterManager = this.KibanaServices.filterManager;
        this.timefilter = this.KibanaServices.timefilter;
        this.state = {
            selectedRequirement: "",
            flyoutOn: true,
            complianceObject: {},
            descriptions: {},
            loadingAlerts: true,
            selectedRequirements: {},
            filterParams: {
                filters: this.filterManager.getFilters() || [],
                query: { language: 'kuery', query: '' },
                time: this.timefilter.getTime(),
            },
        };
        this.onChangeSelectedRequirements.bind(this);
        this.onQuerySubmit.bind(this);
        this.onFiltersUpdated.bind(this);
    }
    async componentDidMount() {
        this._isMount = true;
        this.filtersSubscriber = this.filterManager.updated$.subscribe(() => {
            this.onFiltersUpdated(this.filterManager.filters);
        });
        this.indexPattern = await lib_1.getIndexPattern();
        this.buildComplianceObject();
    }
    componentWillUnmount() {
        this.filtersSubscriber.unsubscribe();
    }
    buildComplianceObject() {
        try {
            let complianceRequirements = {};
            let descriptions = {};
            let selectedRequirements = {}; // all enabled by default
            if (this.props.section === 'pci') {
                descriptions = pci_requirements_1.pciRequirementsFile;
                Object.keys(pci_requirements_1.pciRequirementsFile).forEach(item => {
                    const currentRequirement = item.split(".")[0];
                    if (complianceRequirements[currentRequirement]) {
                        complianceRequirements[currentRequirement].push(item);
                    }
                    else {
                        selectedRequirements[currentRequirement] = true;
                        complianceRequirements[currentRequirement] = [];
                        complianceRequirements[currentRequirement].push(item);
                    }
                }); //forEach
            }
            if (this.props.section === 'gdpr') {
                descriptions = gdpr_requirements_1.gdprRequirementsFile;
                Object.keys(gdpr_requirements_1.gdprRequirementsFile).forEach(item => {
                    const currentRequirement = item.split("_")[0];
                    if (complianceRequirements[currentRequirement]) {
                        complianceRequirements[currentRequirement].push(item);
                    }
                    else {
                        selectedRequirements[currentRequirement] = true;
                        complianceRequirements[currentRequirement] = [];
                        complianceRequirements[currentRequirement].push(item);
                    }
                }); //forEach        
            }
            if (this.props.section === 'hipaa') {
                descriptions = hipaa_requirements_1.hipaaRequirementsFile;
                Object.keys(hipaa_requirements_1.hipaaRequirementsFile).forEach(item => {
                    const currentRequirement = item.split(".")[0] + "." + item.split(".")[1] + "." + item.split(".")[2];
                    if (complianceRequirements[currentRequirement]) {
                        complianceRequirements[currentRequirement].push(item);
                    }
                    else {
                        selectedRequirements[currentRequirement] = true;
                        complianceRequirements[currentRequirement] = [];
                        complianceRequirements[currentRequirement].push(item);
                    }
                }); //forEach        
            }
            if (this.props.section === 'nist') {
                descriptions = nist_requirements_1.nistRequirementsFile;
                Object.keys(nist_requirements_1.nistRequirementsFile).forEach(item => {
                    const currentRequirement = item.split(".")[0];
                    if (complianceRequirements[currentRequirement]) {
                        complianceRequirements[currentRequirement].push(item);
                    }
                    else {
                        selectedRequirements[currentRequirement] = true;
                        complianceRequirements[currentRequirement] = [];
                        complianceRequirements[currentRequirement].push(item);
                    }
                }); //forEach        
            }
            if (this.props.section === 'tsc') {
                descriptions = tsc_requirements_1.tscRequirementsFile;
                Object.keys(tsc_requirements_1.tscRequirementsFile).forEach(item => {
                    const currentRequirement = item.split(".")[0];
                    if (complianceRequirements[currentRequirement]) {
                        complianceRequirements[currentRequirement].push(item);
                    }
                    else {
                        selectedRequirements[currentRequirement] = true;
                        complianceRequirements[currentRequirement] = [];
                        complianceRequirements[currentRequirement].push(item);
                    }
                }); //forEach        
            }
            this._isMount && this.setState({ complianceObject: complianceRequirements, selectedRequirements, descriptions }, () => this.getRequirementsCount());
        }
        catch (err) {
            // TODO ADD showToast
            /*this.showToast(
              'danger',
              'Error',
              `Compliance (${this.props.section}) data could not be fetched: ${err}`,
              3000
            );*/
        }
    }
    async componentDidUpdate(prevProps) {
        const { filterParams, loadingAlerts } = this.state;
        if (JSON.stringify(prevProps.filterParams) !== JSON.stringify(filterParams) && loadingAlerts) {
            this.getRequirementsCount();
        }
    }
    async getRequirementsCount() {
        try {
            const { filterParams } = this.state;
            if (!this.indexPattern) {
                return;
            }
            let fieldAgg = "";
            if (this.props.section === "pci")
                fieldAgg = "rule.pci_dss";
            if (this.props.section === "gdpr")
                fieldAgg = "rule.gdpr";
            if (this.props.section === "hipaa")
                fieldAgg = "rule.hipaa";
            if (this.props.section === "nist")
                fieldAgg = "rule.nist_800_53";
            if (this.props.section === "tsc")
                fieldAgg = "rule.tsc";
            const aggs = {
                tactics: {
                    terms: {
                        field: fieldAgg,
                        size: 100,
                    }
                }
            };
            // TODO: use `status` and `statusText`  to show errors
            // @ts-ignore
            const { data, status, statusText, } = await lib_1.getElasticAlerts(this.indexPattern, filterParams, aggs);
            const { buckets } = data.aggregations.tactics;
            /*if(firstTime){
             this.initTactics(buckets); // top tactics are checked on component mount
            }*/
            this._isMount && this.setState({ requirementsCount: buckets, loadingAlerts: false, firstTime: false });
        }
        catch (err) {
            /*   this.showToast(
                 'danger',
                 'Error',
                 `Mitre alerts could not be fetched: ${err}`,
                 3000
               );*/
            this.setState({ loadingAlerts: false });
        }
    }
    closeFlyout() {
        this.setState({ flyoutOn: false });
    }
    showFlyout(requirement) {
        this.setState({
            selectedRequirement: requirement,
            flyoutOn: true
        });
    }
    render() {
        const { complianceObject, loadingAlerts } = this.state;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement("div", { className: 'wz-discover hide-filter-control' },
                        react_1.default.createElement(kbn_search_bar_1.KbnSearchBar, { onQuerySubmit: this.onQuerySubmit, onFiltersUpdated: this.onFiltersUpdated, isLoading: loadingAlerts })))),
            react_1.default.createElement(eui_1.EuiFlexGroup, { style: { margin: '0 8px' } },
                react_1.default.createElement(eui_1.EuiFlexItem, { style: { width: "calc(100% - 24px)" } },
                    react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "none" }, !!Object.keys(complianceObject).length && this.state.filterParams.time.from !== "init" &&
                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { width: "15%", minWidth: 145, maxHeight: "calc(100vh - 300px)", overflowX: "hidden" } },
                                react_1.default.createElement(requirements_1.ComplianceRequirements, Object.assign({ indexPattern: this.indexPattern, section: this.props.section, onChangeSelectedRequirements: this.onChangeSelectedRequirements }, this.state))),
                            react_1.default.createElement(eui_1.EuiFlexItem, { style: { width: "15%" } },
                                react_1.default.createElement(subrequirements_1.ComplianceSubrequirements, Object.assign({ indexPattern: this.indexPattern, filters: this.state.filterParams, section: this.props.section, onSelectedTabChanged: (id) => this.props.onSelectedTabChanged(id) }, this.state)))))))));
    }
}
exports.ComplianceTable = ComplianceTable;
