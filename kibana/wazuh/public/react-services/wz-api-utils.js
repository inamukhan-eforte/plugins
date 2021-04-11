"use strict";
/*
 * Wazuh app - Wazuh API utils service
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WzAPIUtils = void 0;
const constants_1 = require("../../util/constants");
class WzAPIUtils {
    static isReservedID(id) {
        return id < constants_1.WAZUH_API_RESERVED_ID_LOWER_THAN;
    }
}
exports.WzAPIUtils = WzAPIUtils;
