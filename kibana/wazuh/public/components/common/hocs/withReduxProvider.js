"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withReduxProvider = void 0;
/*
 * Wazuh app - React HOC to wrap a component with Wazuh Redux store
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
const wz_redux_provider_1 = __importDefault(require("../../../redux/wz-redux-provider"));
// Wrap the component with Wazuh Redux provider
exports.withReduxProvider = WrappedComponent => props => react_1.default.createElement(wz_redux_provider_1.default, null,
    react_1.default.createElement(WrappedComponent, Object.assign({}, props)));
