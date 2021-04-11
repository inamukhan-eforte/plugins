"use strict";
/*
 * Wazuh app - Remove User Roles Service
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
const wz_request_1 = require("../../../../react-services/wz-request");
const RemoveUserRolesService = async (userId, rolesIds, removeAll = false) => {
    const response = (await wz_request_1.WzRequest.apiReq('DELETE', `/security/users/${userId}/roles?role_ids=${removeAll ? 'all' : rolesIds.join(',')}`, {}));
    const users = ((response.data || {}).data || {}).affected_items || [{}];
    return users[0];
};
exports.default = RemoveUserRolesService;
