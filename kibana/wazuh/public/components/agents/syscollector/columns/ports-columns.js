"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portsColumns = void 0;
const windowsColumns = [
    { id: "process" },
    { id: "local.ip", sortable: false },
    { id: "local.port", sortable: false },
    { id: "state" },
    { id: "protocol" }
];
const defaultColumns = [
    { id: "local.ip", sortable: false },
    { id: "local.port", sortable: false },
    { id: "state" },
    { id: "protocol" }
];
exports.portsColumns = {
    'windows': windowsColumns,
    'linux': defaultColumns,
    'apple': defaultColumns
};
