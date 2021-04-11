"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzButtonModalConfirm = exports.WzButtonOpenOnClick = void 0;
/*
 * Wazuh app - React component for button that opens a modal
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const react_1 = __importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const hocs_1 = require("../hocs");
const button_1 = require("./button");
exports.WzButtonOpenOnClick = hocs_1.withButtonOpenOnClick(button_1.WzButton);
;
exports.WzButtonModalConfirm = ({ onConfirm, onCancel, modalTitle, modalConfirmText = 'Confirm', modalCancelText = 'Cancel', modalProps = {}, ...rest }) => {
    return (react_1.default.createElement(exports.WzButtonOpenOnClick, Object.assign({}, rest, { render: ({ close }) => {
            const onModalConfirm = () => {
                close();
                onConfirm && onConfirm();
            };
            const onModalCancel = () => {
                close();
                onCancel && onCancel();
            };
            return (react_1.default.createElement(eui_1.EuiOverlayMask, { onClick: close },
                react_1.default.createElement(eui_1.EuiConfirmModal, Object.assign({ title: modalTitle, onCancel: onModalCancel, onConfirm: onModalConfirm, cancelButtonText: modalCancelText, confirmButtonText: modalConfirmText, defaultFocusedButton: modalProps.defaultFocusedButton || "confirm" }, modalProps))));
        } })));
};
