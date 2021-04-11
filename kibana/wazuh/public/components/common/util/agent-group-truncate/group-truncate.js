"use strict";
/*
 * Wazuh app - React Component to cut text strings of several elements that exceed a certain number of length.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupTruncate = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
class GroupTruncate extends react_1.default.Component {
    constructor(props) {
        super(props);
        this._isMount = false;
        this.state = {
            groups: '',
            popoverOpen: false,
        };
    }
    filterAction(group) {
        this.props.filterAction(group);
    }
    action(index, group) {
        switch (this.props.action) {
            case 'redirect':
                return this.props.goGroups(this.props.agent, index);
            case 'filter':
                return this.filterAction(group);
            default:
                console.error('Wrong property in GroupTruncate component');
                break;
        }
    }
    renderButton(auxIndex) {
        return (react_1.default.createElement(eui_1.EuiLink, { style: { textDecoration: 'none' }, className: 'no-focus', onMouseDown: (ev) => { ev.stopPropagation(); }, onClick: (ev) => {
                ev.stopPropagation();
                this.setState({ popoverOpen: !this.state.popoverOpen });
            } },
            "\u00A0",
            `+${auxIndex} ${this.props.label}`));
    }
    renderBadge(group, index) {
        return (react_1.default.createElement(eui_1.EuiBadge, { color: 'hollow', key: `agent-group-${index}`, onClickAriaLabel: `agent-group-${index}`, onMouseDown: (ev) => { ev.stopPropagation(); }, onClick: (ev) => {
                ev.stopPropagation();
                this.action(index, group);
            } }, group));
    }
    renderGroups(groups) {
        const { length } = this.props;
        let auxGroups = [];
        let tooltipGroups = [];
        let auxLength = 0;
        let auxIndex = 0;
        if (groups.length >= 2 && groups.toString().length >= length) {
            groups.map((group, index) => {
                auxLength = auxLength + group.length;
                if (auxLength >= length) {
                    tooltipGroups.push(react_1.default.createElement(eui_1.EuiFlexItem, { grow: 1, key: `agent-group-${index}` }, this.renderBadge(group, index)));
                    ++auxIndex;
                }
                else {
                    auxGroups.push(this.renderBadge(group, index));
                }
            });
        }
        else {
            groups.map((group, index) => {
                auxGroups.push(this.renderBadge(group, index));
            });
        }
        const button = this.renderButton(auxIndex);
        return (react_1.default.createElement("span", { style: { display: 'inline' } },
            react_1.default.createElement(react_1.Fragment, null, auxGroups),
            auxIndex > 0 &&
                react_1.default.createElement(eui_1.EuiPopover, { button: button, isOpen: this.state.popoverOpen, closePopover: () => this.setState({ popoverOpen: false }) },
                    react_1.default.createElement(eui_1.EuiFlexGroup, { style: { maxWidth: '500px' }, gutterSize: "none" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiFlexGrid, { columns: 4, gutterSize: 's' }, tooltipGroups))))));
    }
    render() {
        const groups = this.renderGroups(this.props.groups);
        return (groups);
    }
}
exports.GroupTruncate = GroupTruncate;
