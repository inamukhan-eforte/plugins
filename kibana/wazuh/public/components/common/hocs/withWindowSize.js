"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWindowSize = void 0;
/*
 * Wazuh app - React HOC to include the window size
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
const useWindowSize_1 = require("../hooks/useWindowSize");
exports.withWindowSize = (WrappedComponent) => (props) => {
    const windowSize = useWindowSize_1.useWindowSize();
    return react_1.default.createElement(WrappedComponent, Object.assign({}, props, { windowSize: windowSize }));
};
