"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFilterManager = void 0;
/*
 * Wazuh app - React hook for get Kibana filter manager
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
const kibana_services_1 = require("../../../../../../src/plugins/discover/public/kibana_services");
exports.useFilterManager = () => {
    const [filterManager, setFilterManager] = react_1.useState(kibana_services_1.getServices().filterManager);
    return filterManager;
};
