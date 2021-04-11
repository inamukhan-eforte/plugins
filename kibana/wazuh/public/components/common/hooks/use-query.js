"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
/*
 * Wazuh app - React hook for get query of Kibana searchBar
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
const modules_helper_1 = require("../modules/modules-helper");
function useQuery() {
    const [query, setQuery] = react_1.useState({ language: 'kuery', query: '' });
    react_1.useEffect(() => {
        let subscription;
        modules_helper_1.ModulesHelper.getDiscoverScope()
            .then(scope => {
            setQuery(scope.state.query);
            subscription = scope.$watchCollection('fetchStatus', () => { setQuery(scope.state.query); });
        });
        return () => { subscription && subscription(); };
    }, []);
    const updateQuery = (query) => {
        modules_helper_1.ModulesHelper.getDiscoverScope()
            .then(scope => {
            scope.updateQuery({ query });
        });
    };
    return [query, updateQuery];
}
exports.useQuery = useQuery;
