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
exports.ToastNotifications = void 0;
/*
 * Wazuh app - Service to show notifications
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
const store_1 = __importDefault(require("../redux/store"));
const appStateActions_1 = require("../redux/actions/appStateActions");
const notify_1 = require("ui/notify");
const eui_1 = require("@elastic/eui");
class ToastNotifications {
    static add(toast) {
        notify_1.toastNotifications.add(toast);
    }
    static success(toast) {
        ToastNotifications.add({
            ...toast,
            color: 'success',
        });
    }
    static warning(toast) {
        ToastNotifications.add({
            ...toast,
            color: 'warning',
        });
    }
    static danger(toast) {
        ToastNotifications.add({
            ...toast,
            color: 'danger',
        });
    }
    static error(path, error, title = 'Error unexpected') {
        ToastNotifications.danger({
            title,
            iconType: 'alert',
            text: (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement("p", { "data-test-subj": "errorToastMessage" }, error.message),
                react_1.default.createElement("div", { className: "eui-textRight" },
                    react_1.default.createElement(eui_1.EuiButton, { color: 'danger', onClick: () => store_1.default.dispatch(appStateActions_1.updateToastNotificationsModal({ path, error, title })), size: "s" }, "See the full error"))))
        });
    }
}
exports.ToastNotifications = ToastNotifications;
