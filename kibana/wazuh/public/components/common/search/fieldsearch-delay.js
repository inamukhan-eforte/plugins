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
exports.WzFieldSearchDelay = void 0;
/*
 * Wazuh app - Wazuh field search component with a delay
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
exports.WzFieldSearchDelay = ({ delay = 400, onChange, onSearch, onError, ...rest }) => {
    const [searchTerm, setSearchTerm] = react_1.useState('');
    const [loading, setLoading] = react_1.useState(false);
    const timerDelay = react_1.useRef();
    react_1.useEffect(() => {
        return () => timerDelay.current && clearTimeout(timerDelay.current);
    }, []);
    const onChangeInput = e => {
        const searchValue = e.target.value;
        onChange && onChange(searchValue);
        if (timerDelay.current) {
            clearTimeout(timerDelay.current);
        }
        ;
        setSearchTerm(searchValue);
        timerDelay.current = setTimeout(() => {
            onSearchInput(searchValue);
        }, delay);
    };
    const onSearchInput = async (searchValue) => {
        try {
            if (timerDelay.current) {
                clearTimeout(timerDelay.current);
            }
            ;
            setLoading(true);
            await onSearch(searchValue);
        }
        catch (error) {
            onError && onError(error);
        }
        setLoading(false);
    };
    return react_1.default.createElement(eui_1.EuiFieldSearch, Object.assign({}, rest, { value: searchTerm, isLoading: loading, onChange: onChangeInput, onSearch: onSearchInput }));
};
