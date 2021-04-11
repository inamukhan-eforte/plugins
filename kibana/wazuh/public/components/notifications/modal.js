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
exports.ToastNotificationsModal = void 0;
/*
 * Wazuh app - Component that renders the toast notification modal
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
const react_redux_1 = require("react-redux");
const appStateActions_1 = require("../../redux/actions/appStateActions");
const hocs_1 = require("../common/hocs");
exports.ToastNotificationsModal = hocs_1.withReduxProvider(() => {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const toastNotification = react_redux_1.useSelector(state => state.appStateReducers.toastNotification);
    const dispatch = react_redux_1.useDispatch();
    const closeModal = () => setIsOpen(false);
    react_1.useEffect(() => {
        if (!isOpen) {
            dispatch(appStateActions_1.updateToastNotificationsModal(false));
        }
    }, [isOpen]);
    react_1.useEffect(() => {
        if (toastNotification) {
            setIsOpen(true);
        }
    }, [toastNotification]);
    if (!toastNotification) {
        return null;
    }
    ;
    const errorStack = (toastNotification.error && toastNotification.error.stack) || '';
    const calloutTitle = toastNotification.path ? `[${toastNotification.path}] > ${toastNotification.error.message}` : toastNotification.error.message;
    const copyMessage = `\`\`\`**${toastNotification.title}**
  ${calloutTitle}
  ${errorStack}
  \`\`\``;
    return (react_1.default.createElement(eui_1.EuiOverlayMask, { onClick: () => closeModal() },
        react_1.default.createElement(eui_1.EuiModal, { onClose: closeModal },
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, toastNotification.title)),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiCallOut, { size: "s", color: "danger", iconType: "alert", title: calloutTitle }),
                errorStack && (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                    react_1.default.createElement(eui_1.EuiCodeBlock /*isCopyable={true}*/, { paddingSize: "s" }, errorStack)))),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiCopy, { textToCopy: copyMessage }, copy => react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: copy }, "Copy error"))))));
});
