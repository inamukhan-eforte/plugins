"use strict";
/*
 * Wazuh app - Component to group some components within another
 *
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
exports.useParentWidth = void 0;
const react_1 = require("react");
exports.useParentWidth = () => {
    const ref = react_1.useRef(null);
    const [parentWidth, setParentWidth] = react_1.useState(0);
    react_1.useEffect(() => {
        setParentWidth((((ref || {}).current || {}).parentNode || {}).offsetWidth || 0);
    });
    return { parentWidth, ref };
};
