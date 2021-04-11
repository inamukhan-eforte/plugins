"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRefreshAngularDiscover = void 0;
/*
 * Wazuh app - React hook to get when Angular Discover started to loading
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
function useRefreshAngularDiscover() {
    const [refresh, setRefresh] = react_1.useState(Date.now());
    react_1.useEffect(() => {
        let subscription;
        modules_helper_1.ModulesHelper.getDiscoverScope()
            .then(scope => {
            subscription = scope.$watch('fetchStatus', (fetchStatus) => {
                (fetchStatus === 'loading') && (refresh !== Date.now()) && setRefresh(Date.now());
            });
        });
        return () => { subscription && subscription(); };
    }, []);
    return refresh;
}
exports.useRefreshAngularDiscover = useRefreshAngularDiscover;
