"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeFilter = void 0;
/*
 * Wazuh app - React hook for get Kibana time filter
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
function useTimeFilter() {
    const { timefilter, } = kibana_services_1.getServices();
    const [timeFilter, setTimeFilter] = react_1.useState(timefilter.getTime());
    const [timeHistory, setTimeHistory] = react_1.useState(timefilter._history);
    react_1.useEffect(() => {
        const subscription = timefilter.getTimeUpdate$().subscribe(() => { setTimeFilter(timefilter.getTime()); setTimeHistory(timefilter._history); });
        return () => { subscription.unsubscribe(); };
    }, []);
    return { timeFilter, setTimeFilter: timefilter.setTime, timeHistory };
}
exports.useTimeFilter = useTimeFilter;
