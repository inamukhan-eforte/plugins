"use strict";
/*
 * Wazuh app - Delete Users Service
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
const DeleteUsersService = async (userIds, deleteAll = false) => {
    const response = (await wz_request_1.WzRequest.apiReq('DELETE', `/security/users?user_ids=${deleteAll ? 'all' : userIds.join(',')}`, {}));
    const users = ((response.data || {}).data || {}).affected_items || [];
    return users;
};
exports.default = DeleteUsersService;
