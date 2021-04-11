"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
/*
 * Wazuh app - React component to integrate Kibana search bar
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
exports.storage = {
    ...window.localStorage,
    get: (key) => JSON.parse(window.localStorage.getItem(key) || '{}'),
    set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => window.localStorage.removeItem(key)
};
