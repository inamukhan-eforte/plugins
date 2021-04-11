"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKbnLoadingIndicator = void 0;
/*
 * Wazuh app - React hook hidde or show the Kibana loading indicator
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
const react_1 = require("react");
//@ts-ignore
const chrome_1 = __importDefault(require("ui/chrome"));
exports.useKbnLoadingIndicator = () => {
    const [loading, setLoading] = react_1.useState(false);
    const [flag, setFlag] = react_1.useState(false);
    const [visible, setVisible] = react_1.useState(0);
    react_1.useEffect(() => {
        const subscription = chrome_1.default.loadingCount.subscribe(count => { setVisible(count); !count && setFlag(false); });
        return subscription;
    }, []);
    react_1.useEffect(() => {
        if (loading && visible <= 0) {
            chrome_1.default.loadingCount.increment();
            setFlag(true);
        }
        if (!loading && flag && visible > 0) {
            chrome_1.default.loadingCount.decrement();
        }
    }, [visible, loading]);
    return [loading, setLoading, visible > 0];
};
