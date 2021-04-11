"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalBreadcrumb = void 0;
/*
 * Wazuh app - React hook to manage global breadcrumb
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
const react_redux_1 = require("react-redux");
const globalBreadcrumbActions_1 = require("../../../redux/actions/globalBreadcrumbActions");
// It updates global breadcrumb
exports.useGlobalBreadcrumb = (breadcrumb = []) => {
    const dispatch = react_redux_1.useDispatch();
    react_1.useEffect(() => {
        dispatch(globalBreadcrumbActions_1.updateGlobalBreadcrumb(breadcrumb));
    });
};
