"use strict";
/*
 * Wazuh app - DevTools history component
 * version, OS, registration date, last keep alive.
 *
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
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
exports.DevToolsHistory = void 0;
const react_1 = __importStar(require("react"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const eui_1 = require("@elastic/eui");
function DevToolsHistory({ localStorage, closeHistory, addRequest }) {
    const [selectedRequest, setSelectedRequest] = react_1.useState(false);
    const [hoverRequest, setHoverRequest] = react_1.useState(false);
    react_1.useEffect(() => {
        const initialReq = getHistoryFromLocalStorageOrdered()[0];
        if (initialReq)
            setSelectedRequest(localStorage[initialReq[0]]);
    }, []);
    const getHistoryFromLocalStorageOrdered = () => {
        const wazuhHistoryElems = Object.keys(localStorage).filter(x => x.startsWith('wazuh:history.elem_')).flatMap(x => {
            const time = x.split("_")[1];
            return [[x, parseInt(time)]];
        }).sort(function (a, b) { return b[1] - a[1]; });
        while (wazuhHistoryElems.length > 150) { // we only maintain the last 150 requests
            const lastEl = wazuhHistoryElems[wazuhHistoryElems.length - 1];
            window.localStorage.removeItem(lastEl[0]);
            wazuhHistoryElems.pop();
        }
        return wazuhHistoryElems;
    };
    const formatElem = (elem) => {
        const elJson = JSON.parse(elem);
        return `${elJson.endpoint}   (${moment_timezone_1.default(elJson.time).fromNow()})`;
    };
    const tryRequest = (isActive, req) => {
        if (isActive) {
            addRequest(JSON.parse(req));
        }
    };
    const showHistoryList = () => {
        const wazuhElements = getHistoryFromLocalStorageOrdered();
        const elements = wazuhElements.map(x => {
            const currentElement = localStorage[x[0]];
            const isActive = currentElement === selectedRequest;
            return react_1.default.createElement("li", { onMouseEnter: () => { setHoverRequest(currentElement); }, onMouseLeave: () => { setHoverRequest(false); }, onClick: () => { setSelectedRequest(currentElement); tryRequest(isActive, currentElement); }, className: isActive ? "history-list-item history-list-item-active" : 'history-list-item' },
                formatElem(currentElement),
                " ",
                react_1.default.createElement(eui_1.EuiIcon, { style: { float: 'right' }, type: "arrowRight" }),
                "        ");
        });
        return wazuhElements.length ? react_1.default.createElement("ul", { className: "history-list" }, elements) : react_1.default.createElement(react_1.default.Fragment, null);
    };
    const codeEditorOptions = {
        fontSize: '14px',
        displayIndentGuides: false,
        indentedSoftWrap: false,
        behavioursEnabled: false,
        animatedScroll: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        useWorker: false,
        enableLiveAutocompletion: false
    };
    const formatReq = (req) => {
        const reqJson = JSON.parse(req);
        return `${reqJson.method} ${reqJson.endpoint} ${reqJson.data}`;
    };
    const showOutputEditor = () => {
        return (react_1.default.createElement(eui_1.EuiCodeEditor
        // theme="textmate"
        , { 
            // theme="textmate"
            width: "100%", height: "100%", value: hoverRequest ? formatReq(hoverRequest) : selectedRequest ? formatReq(selectedRequest) : "No history available", mode: "json", isReadOnly: true, wrapEnabled: true, setOptions: codeEditorOptions, "aria-label": "Code Editor" }));
    };
    const removeHistory = () => {
        Object.keys(localStorage).filter(x => x.startsWith('wazuh:history.elem_')).forEach(item => {
            window.localStorage.removeItem(item);
        });
        setSelectedRequest(false);
    };
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s", style: { margin: "0px 8px" } },
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                    react_1.default.createElement("h3", null, "History")))),
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: 2 }, showHistoryList()),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: 2, style: { height: '25vh' } }, showOutputEditor())),
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "danger", onClick: () => removeHistory() }, "Clear history")),
            react_1.default.createElement(eui_1.EuiFlexItem, null),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: () => closeHistory() }, "Close")),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { disabled: !selectedRequest, fill: true, onClick: () => addRequest(JSON.parse(selectedRequest)) }, "Apply")))));
}
exports.DevToolsHistory = DevToolsHistory;
