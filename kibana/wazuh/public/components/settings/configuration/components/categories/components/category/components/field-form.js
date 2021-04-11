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
exports.FieldForm = void 0;
/*
 * Wazuh app - React component building the configuration component.
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
const react_1 = __importStar(require("react"));
const node_cron_1 = require("node-cron");
const eui_1 = require("@elastic/eui");
exports.FieldForm = (props) => {
    const { item } = props;
    switch (item.form.type) {
        case 'text':
            return react_1.default.createElement(TextForm, Object.assign({}, props));
        case 'number':
            return react_1.default.createElement(NumberForm, Object.assign({}, props));
        case 'boolean':
            return react_1.default.createElement(BooleanForm, Object.assign({}, props));
        case 'list':
            return react_1.default.createElement(ListForm, Object.assign({}, props));
        case 'array':
            return react_1.default.createElement(ArrayForm, Object.assign({}, props));
        case 'interval':
            return react_1.default.createElement(IntervalForm, Object.assign({}, props));
        default:
            return null;
    }
};
//#region forms
const TextForm = (props) => (react_1.default.createElement(eui_1.EuiFieldText, { fullWidth: true, value: getValue(props), onChange: e => onChange(e.target.value, props) }));
const NumberForm = (props) => (react_1.default.createElement(eui_1.EuiFieldNumber, { fullWidth: true, value: getValue(props), onChange: e => onChange(e.target.value, props) }));
const BooleanForm = (props) => (react_1.default.createElement(eui_1.EuiSwitch, { label: `${getValue(props)}`, checked: getValue(props), onChange: (e) => onChange(e.target.checked, props) }));
const ListForm = (props) => (react_1.default.createElement(eui_1.EuiSelect, Object.assign({}, props.item.form.params, { value: getValue(props), onChange: (e) => onChange(e.target.value, props) })));
const IntervalForm = (props) => {
    const [interval, setInterval] = react_1.useState(getValue(props));
    const [invalid, setInvalid] = react_1.useState(false);
    react_1.useEffect(() => {
        if (node_cron_1.validate(interval)) {
            setInvalid(false);
            getValue(props) !== interval && onChange(interval, props);
        }
        else {
            setInvalid(true);
            deleteChange(props);
        }
    }, [interval]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiFieldText, { fullWidth: true, value: interval, isInvalid: invalid, onChange: e => setInterval(e.target.value) }),
        invalid && react_1.default.createElement(eui_1.EuiTextColor, { color: 'danger' }, "Invalid cron schedule expressions")));
};
const ArrayForm = (props) => {
    const [list, setList] = react_1.useState(JSON.stringify(getValue(props)));
    react_1.useEffect(() => {
        setList(JSON.stringify(getValue(props)));
    }, [props.updatedConfig]);
    const checkErrors = () => {
        try {
            const parsed = JSON.parse(list);
            onChange(parsed, props);
        }
        catch (error) {
            console.log(error);
        }
    };
    return (react_1.default.createElement(eui_1.EuiCodeEditor, { mode: 'javascript', 
        // theme='github'
        height: '50px', width: '100%', value: list, onChange: setList, onBlur: checkErrors }));
};
//#endregion
//#region Helpers
const getValue = ({ item, updatedConfig }) => typeof updatedConfig[item.setting] !== 'undefined'
    ? updatedConfig[item.setting]
    : item.value;
const onChange = (value, props) => {
    const { updatedConfig, setUpdatedConfig, item } = props;
    setUpdatedConfig({
        ...updatedConfig,
        [item.setting]: value,
    });
};
const deleteChange = (props) => {
    const { updatedConfig, setUpdatedConfig, item } = props;
    const newConfig = { ...updatedConfig };
    delete newConfig[item.setting];
    setUpdatedConfig(newConfig);
};
//#endregion
