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
exports.MultipleAgentSelector = void 0;
/*
 * Wazuh app - Multiple agent selector component
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
const error_handler_1 = require("../../../react-services/error-handler");
const wz_request_1 = require("../../../react-services/wz-request");
require("./multiple-agent-selector.less");
const jquery_1 = __importDefault(require("jquery"));
const search_1 = require("../../common/search");
class MultipleAgentSelector extends react_1.Component {
    constructor(props) {
        super(props);
        this.moveItem = (item, from, to, type) => {
            if (Array.isArray(item)) {
                item.forEach(elem => this.moveItem(elem, from, to, type));
                this.checkLimit();
            }
            else {
                item = JSON.parse(item);
                const idx = from.findIndex(x => x.key === item.key);
                if (idx !== -1) {
                    from.splice(idx, 1);
                    item.type = !item.type ? type : '';
                    to.push(item);
                }
            }
            jquery_1.default('#wzMultipleSelectorLeft').val('');
            jquery_1.default('#wzMultipleSelectorRight').val('');
        };
        this.moveAll = (from, to, type) => {
            from.forEach(item => {
                item.type = !item.type ? type : '';
                to.push(item);
            });
            from.length = 0;
            this.checkLimit();
        };
        this.sort = a => {
            return parseInt(a.key);
        };
        this.scrollList = async (target) => {
            if (target === 'left') {
                await this.reload('left', this.state.availableFilter, false);
            }
            else {
                await this.reload('right', this.state.selectedFilter, false);
            }
        };
        this.state = {
            availableAgents: {
                loaded: false,
                data: [],
                offset: 0,
                loadedAll: false
            },
            selectedAgents: {
                loaded: false,
                data: [],
                offset: 0,
                loadedAll: false
            },
            availableItem: [],
            selectedElement: [],
            selectedFilter: '',
            currentAdding: 0,
            currentDeleting: 0,
            moreThan500: false,
            load: false,
            savingChanges: false
        };
    }
    async componentDidMount() {
        this.setState({ load: true });
        try {
            while (!this.state.selectedAgents.loadedAll) {
                await this.loadSelectedAgents();
                this.setState({
                    selectedAgents: {
                        ...this.state.selectedAgents,
                        offset: this.state.selectedAgents.offset + 499,
                    }
                });
            }
            this.firstSelectedList = [...this.state.selectedAgents.data];
            await this.loadAllAgents("", true);
            this.setState({
                load: false
            });
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Error adding agents');
        }
    }
    async loadAllAgents(searchTerm, start) {
        try {
            const params = {
                limit: 500,
                offset: !start ? this.state.availableAgents.offset : 0,
                select: ['id', 'name'].toString()
            };
            if (searchTerm) {
                params.search = searchTerm;
            }
            const req = await wz_request_1.WzRequest.apiReq('GET', '/agents', {
                params: params
            });
            const totalAgents = req.data.data.total_affected_items;
            const mapped = req.data.data.affected_items
                .filter(item => {
                return (this.state.selectedAgents.data.filter(selected => {
                    return selected.key == item.id;
                }).length == 0 && item.id !== '000');
            })
                .map(item => {
                return { key: item.id, value: item.name };
            });
            if (start) {
                this.setState({
                    availableAgents: {
                        ...this.state.availableAgents,
                        data: mapped,
                    }
                });
            }
            else {
                this.setState({
                    availableAgents: {
                        ...this.state.availableAgents,
                        data: (this.state.availableAgents.data || []).concat(mapped)
                    }
                });
            }
            if (this.state.availableAgents.data.length < 10 && !searchTerm) {
                if (this.state.availableAgents.offset >= totalAgents) {
                    this.setState({
                        availableAgents: {
                            ...this.state.availableAgents,
                            loadedAll: true,
                        }
                    });
                }
                if (!this.state.availableAgents.loadedAll) {
                    this.setState({
                        availableAgents: {
                            ...this.state.availableAgents,
                            offset: this.state.availableAgents.offset + 499,
                        }
                    });
                    await this.loadAllAgents(searchTerm);
                }
            }
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Error fetching all available agents');
        }
    }
    async loadSelectedAgents(searchTerm) {
        try {
            let params = {
                offset: !searchTerm ? this.state.selectedAgents.offset : 0,
                select: ['id', 'name'].toString()
            };
            if (searchTerm) {
                params.search = searchTerm;
            }
            const result = await wz_request_1.WzRequest.apiReq('GET', `/groups/${this.props.currentGroup.name}/agents`, {
                params
            });
            this.setState({ totalSelectedAgents: result.data.data.total_affected_items });
            const mapped = result.data.data.affected_items.map(item => {
                return { key: item.id, value: item.name };
            });
            this.firstSelectedList = mapped;
            if (searchTerm) {
                this.setState({
                    selectedAgents: {
                        ...this.state.selectedAgents,
                        data: mapped,
                        loadedAll: true
                    }
                });
            }
            else {
                this.setState({
                    selectedAgents: {
                        ...this.state.selectedAgents,
                        data: (this.state.selectedAgents.data || []).concat(mapped)
                    }
                });
            }
            if (this.state.selectedAgents.data.length === 0 ||
                this.state.selectedAgents.data.length < 500 ||
                this.state.selectedAgents.offset >= this.state.totalSelectedAgents) {
                this.setState({
                    selectedAgents: {
                        ...this.state.selectedAgents,
                        loadedAll: true
                    }
                });
            }
        }
        catch (error) {
            error_handler_1.ErrorHandler.handle(error, 'Error fetching group agents');
        }
        this.setState({
            selectedAgents: {
                ...this.state.selectedAgents,
                loaded: true
            }
        });
    }
    getItemsToSave() {
        const original = this.firstSelectedList;
        const modified = this.state.selectedAgents.data;
        const deletedAgents = [];
        const addedAgents = [];
        modified.forEach(mod => {
            if (original.filter(e => e.key === mod.key).length === 0) {
                addedAgents.push(mod);
            }
        });
        original.forEach(orig => {
            if (modified.filter(e => e.key === orig.key).length === 0) {
                deletedAgents.push(orig);
            }
        });
        const addedIds = [...new Set(addedAgents.map(x => x.key))];
        const deletedIds = [...new Set(deletedAgents.map(x => x.key))];
        return { addedIds, deletedIds };
    }
    groupBy(collection, property) {
        try {
            const values = [];
            const result = [];
            for (const item of collection) {
                const index = values.indexOf(item[property]);
                if (index > -1)
                    result[index].push(item);
                else {
                    values.push(item[property]);
                    result.push([item]);
                }
            }
            return result.length ? result : false;
        }
        catch (error) {
            return false;
        }
    }
    async saveAddAgents() {
        const itemsToSave = this.getItemsToSave();
        const failedIds = [];
        try {
            this.setState({ savingChanges: true });
            if (itemsToSave.addedIds.length) {
                const addResponse = await wz_request_1.WzRequest.apiReq('PUT', `/agents/group`, {
                    params: {
                        group_id: this.props.currentGroup.name,
                        agents_list: itemsToSave.addedIds.toString()
                    }
                });
                if (addResponse.data.data.failed_ids) {
                    failedIds.push(...addResponse.data.data.failed_ids);
                }
            }
            if (itemsToSave.deletedIds.length) {
                const deleteResponse = await wz_request_1.WzRequest.apiReq('DELETE', `/agents/group`, {
                    params: {
                        group_id: this.props.currentGroup.name,
                        agents_list: itemsToSave.deletedIds.toString()
                    }
                });
                if (deleteResponse.data.data.total_failed_items) {
                    failedIds.push(...deleteResponse.data.data.failed_items);
                }
            }
            if (failedIds.length) {
                const failedErrors = failedIds.map(item => ({
                    id: ((item || {}).error || {}).code,
                    message: ((item || {}).error || {}).message,
                }));
                this.failedErrors = this.groupBy(failedErrors, 'message') || false;
                error_handler_1.ErrorHandler.info(`Group has been updated but an error has occurred with ${failedIds.length} agents`, '', { warning: true });
            }
            else {
                error_handler_1.ErrorHandler.info('Group has been updated');
            }
            this.setState({ savingChanges: false });
            this.props.cancelButton();
        }
        catch (err) {
            this.setState({ savingChanges: false });
            error_handler_1.ErrorHandler.handle(err, 'Error applying changes');
        }
        return;
    }
    clearFailedErrors() {
        this.failedErrors = false;
    }
    checkLimit() {
        if (this.firstSelectedList) {
            const itemsToSave = this.getItemsToSave();
            const currentAdding = itemsToSave.addedIds.length;
            const currentDeleting = itemsToSave.deletedIds.length;
            this.setState({
                currentAdding,
                currentDeleting,
                moreThan500: currentAdding > 500 || currentDeleting > 500
            });
        }
    }
    async reload(element, searchTerm, start = false, addOffset = 0) {
        if (element === 'left') {
            const callbackLoadAgents = async () => {
                try {
                    await this.loadAllAgents(searchTerm, start);
                }
                catch (error) {
                    error_handler_1.ErrorHandler.handle(error, 'Error fetching all available agents');
                }
                ;
            };
            if (!this.state.availableAgents.loadedAll) {
                if (start) {
                    this.setState({
                        availableAgents: {
                            ...this.state.availableAgents,
                            offset: 0,
                        },
                        selectedAgents: {
                            ...this.state.selectedAgents,
                            offset: 0,
                        }
                    }, callbackLoadAgents);
                }
                else {
                    this.setState({
                        availableAgents: {
                            ...this.state.availableAgents,
                            offset: this.state.availableAgents.offset + 500,
                        }
                    }, callbackLoadAgents);
                }
            }
            else {
                callbackLoadAgents();
            }
        }
        else {
            if (!this.state.selectedAgents.loadedAll) {
                this.setState({
                    selectedAgents: {
                        ...this.state.selectedAgents,
                        offset: this.state.selectedAgents.offset + addOffset + 1,
                    }
                });
                try {
                    await this.loadSelectedAgents(searchTerm);
                }
                catch (error) {
                    error_handler_1.ErrorHandler.handle(error, 'Error fetching all selected agents');
                }
            }
        }
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiPage, { style: { background: 'transparent' } },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    this.state.load && (react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiProgress, { size: 'xs', color: 'primary' }),
                            react_1.default.createElement(eui_1.EuiSpacer, { size: 'l' })))),
                    !this.state.load && (react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(eui_1.EuiPanel, null,
                                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                                        react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 0 } },
                                                react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": "Back", style: { paddingTop: 8 }, color: "primary", iconSize: "l", iconType: "arrowLeft", onClick: () => this.props.cancelButton() })),
                                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                                react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                                                    react_1.default.createElement("h1", null,
                                                        "Manage agents of group ",
                                                        this.props.currentGroup.name))))),
                                    react_1.default.createElement(eui_1.EuiFlexItem, null),
                                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                        !this.state.moreThan500 && (react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: () => this.saveAddAgents(), isLoading: this.state.savingChanges, isDisabled: this.state.currentDeleting === 0 && this.state.currentAdding === 0 }, "Apply changes")),
                                        this.state.moreThan500 && (react_1.default.createElement("span", { className: 'error-msg' },
                                            react_1.default.createElement("i", { className: "fa fa-exclamation-triangle" }),
                                            "\u00A0Changes cannot be applied with more than 500 additions or removals")))),
                                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                    react_1.default.createElement(eui_1.EuiFlexItem, { style: { marginTop: 30 } },
                                        react_1.default.createElement("div", { id: 'wzMultipleSelector' },
                                            react_1.default.createElement("div", { className: 'wzMultipleSelectorLeft' },
                                                react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m" },
                                                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                                                            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                                                                react_1.default.createElement("h4", null, "Available agents"))),
                                                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                                            react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": "Back", color: "primary", iconType: "refresh", onClick: () => this.reload("left", this.state.availableFilter, true) }))),
                                                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                                                    react_1.default.createElement(search_1.WzFieldSearchDelay, { placeholder: "Filter...", onChange: (searchValue) => {
                                                            this.setState({ availableFilter: searchValue, availableItem: [] });
                                                        }, onSearch: async (searchValue) => {
                                                            try {
                                                                await this.reload("left", searchValue, true);
                                                            }
                                                            catch (error) { }
                                                        }, isClearable: true, fullWidth: true, "aria-label": "Filter" }),
                                                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                                                    react_1.default.createElement("select", { id: "wzMultipleSelectorLeft", size: '15', multiple: true, onChange: (e) => {
                                                            this.setState({
                                                                availableItem: Array.from(e.target.selectedOptions, option => option.value),
                                                                selectedElement: []
                                                            }, () => { this.checkLimit(); });
                                                        }, className: 'wzMultipleSelectorSelect', onDoubleClick: () => {
                                                            this.moveItem(this.state.availableItem, this.state.availableAgents.data, this.state.selectedAgents.data, "a");
                                                            this.setState({ availableItem: [] });
                                                        } }, this.state.availableAgents.data.sort(this.sort).map((item, index) => (react_1.default.createElement("option", { key: index, className: item.type === 'a' ? 'wzMultipleSelectorAdding' : item.type === 'r' ? 'wzMultipleSelectorRemoving' : '', value: JSON.stringify(item) }, `${item.key} - ${item.value}`)))),
                                                    (!this.state.availableAgents.loadedAll &&
                                                        !this.state.loadingAvailableAgents && (react_1.default.createElement(react_1.default.Fragment, null,
                                                        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                                                        react_1.default.createElement("p", { className: "wz-load-extra", onClick: () => {
                                                                this.setState({ loadingAvailableAgents: true }, async () => {
                                                                    await this.scrollList('left');
                                                                    this.setState({ loadingAvailableAgents: false });
                                                                });
                                                            } },
                                                            ' ',
                                                            react_1.default.createElement(eui_1.EuiIcon, { type: "refresh" }),
                                                            " \u00A0 Click here to load more agents")))) ||
                                                        (this.state.loadingAvailableAgents && (react_1.default.createElement(react_1.default.Fragment, null,
                                                            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                                                            react_1.default.createElement("p", { className: "wz-load-extra" },
                                                                ' ',
                                                                react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "m" }),
                                                                " \u00A0 Loading...")))))),
                                            react_1.default.createElement(eui_1.EuiKeyPadMenu, { className: "wzMultipleSelectorButtons" },
                                                react_1.default.createElement(eui_1.EuiKeyPadMenuItem, { label: "Add all items", onClick: () => {
                                                        this.moveAll(this.state.availableAgents.data, this.state.selectedAgents.data, "a");
                                                        this.setState({ availableItem: [], availableFilter: '' }, () => { this.reload("left", this.state.availableFilter, true); });
                                                    }, isDisabled: this.state.availableAgents.data.length === 0 || this.state.availableAgents.data.length > 500 },
                                                    react_1.default.createElement(eui_1.EuiIcon, { type: "editorRedo", color: 'primary', size: "l" })),
                                                react_1.default.createElement(eui_1.EuiKeyPadMenuItem, { label: "Add selected items", onClick: () => {
                                                        this.moveItem(this.state.availableItem, this.state.availableAgents.data, this.state.selectedAgents.data, "a");
                                                        this.setState({ availableItem: [], availableFilter: '' });
                                                    }, isDisabled: !this.state.availableItem.length || this.state.availableItem.length > 500 },
                                                    react_1.default.createElement(eui_1.EuiIcon, { type: "arrowRight", color: 'primary', size: "l" })),
                                                react_1.default.createElement(eui_1.EuiKeyPadMenuItem, { label: "Remove selected items", onClick: () => {
                                                        this.moveItem(this.state.selectedElement, this.state.selectedAgents.data, this.state.availableAgents.data, "r");
                                                        this.setState({ selectedFilter: "", selectedElement: [] });
                                                    }, isDisabled: !this.state.selectedElement.length || this.state.selectedElement.length > 500 },
                                                    react_1.default.createElement(eui_1.EuiIcon, { type: "arrowLeft", color: 'primary', size: "l" })),
                                                react_1.default.createElement(eui_1.EuiKeyPadMenuItem, { label: "Remove all items", onClick: () => {
                                                        this.moveAll(this.state.selectedAgents.data, this.state.availableAgents.data, "r");
                                                        this.setState({ selectedElement: [], selectedFilter: "" }, () => { this.reload("right"); });
                                                    }, isDisabled: this.state.selectedAgents.data.length === 0 || this.state.selectedAgents.data.length > 500 },
                                                    react_1.default.createElement(eui_1.EuiIcon, { type: "editorUndo", color: 'primary', size: "l" }))),
                                            react_1.default.createElement("div", { className: 'wzMultipleSelectorRight' },
                                                react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m" },
                                                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                                                            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                                                                react_1.default.createElement("h4", null,
                                                                    "Current agents in the group (",
                                                                    this.state.totalSelectedAgents,
                                                                    ")"))),
                                                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 0 } },
                                                            react_1.default.createElement(eui_1.EuiBadge, { color: '#017D73' },
                                                                "Added: ",
                                                                this.state.currentAdding)),
                                                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                                            react_1.default.createElement(eui_1.EuiBadge, { color: '#BD271E' },
                                                                "Removed: ",
                                                                this.state.currentDeleting))),
                                                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                                                    react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: "Filter...", onChange: (ev) => this.setState({ selectedFilter: ev.target.value, selectedElement: [] }), onSearch: value => { this.setState({ selectedFilter: value }); }, isClearable: true, fullWidth: true, "aria-label": "Filter" }),
                                                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                                                    react_1.default.createElement("select", { id: "wzMultipleSelectorRight", size: '15', multiple: true, onChange: (e) => {
                                                            this.setState({
                                                                selectedElement: Array.from(e.target.selectedOptions, option => option.value),
                                                                availableItem: []
                                                            }, () => { this.checkLimit(); });
                                                        }, className: 'wzMultipleSelectorSelect', onDoubleClick: (e) => {
                                                            this.moveItem(this.state.selectedElement, this.state.selectedAgents.data, this.state.availableAgents.data, "r");
                                                            this.setState({ selectedElement: [] });
                                                        } }, this.state.selectedAgents.data
                                                        .filter(x => !this.state.selectedFilter || x.key.includes(this.state.selectedFilter) || x.value.includes(this.state.selectedFilter))
                                                        .sort(this.sort)
                                                        .map((item, index) => (react_1.default.createElement("option", { key: index, className: item.type === 'a' ? 'wzMultipleSelectorAdding' : item.type === 'r' ? 'wzMultipleSelectorRemoving' : '', value: JSON.stringify(item) }, `${item.key} - ${item.value}`))))))),
                                        react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })))))))))));
    }
}
exports.MultipleAgentSelector = MultipleAgentSelector;
;
