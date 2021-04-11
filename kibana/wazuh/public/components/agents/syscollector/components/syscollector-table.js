"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyscollectorTable = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const useApiRequest_1 = require("../../../common/hooks/useApiRequest");
const csv_key_equivalence_1 = require("../../../../../util/csv-key-equivalence");
const app_state_1 = require("../../../../react-services/app-state");
function SyscollectorTable({ tableParams }) {
    const [params, setParams] = react_1.useState({ limit: 10, offset: 0, });
    const [pageIndex, setPageIndex] = react_1.useState(0);
    const [searchBarValue, setSearchBarValue] = react_1.useState("");
    const [pageSize, setPageSize] = react_1.useState(10);
    const [sortField, setSortField] = react_1.useState('');
    const [timerDelaySearch, setTimerDelaySearch] = react_1.useState();
    const [sortDirection, setSortDirection] = react_1.useState('');
    const [loading, data, error] = useApiRequest_1.useApiRequest('GET', tableParams.path, params);
    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize } = page;
        const { field: sortField, direction: sortDirection } = sort;
        setPageIndex(pageIndex);
        setPageSize(pageSize);
        setSortField(sortField);
        setSortDirection(sortDirection);
        const field = (sortField === 'os_name') ? '' : sortField;
        const direction = (sortDirection === 'asc') ? '+' : '-';
        const newParams = {
            ...params,
            limit: pageSize,
            offset: Math.floor((pageIndex * pageSize) / params.limit) * params.limit,
            ...(!!field ? { sort: `${direction}${field}` } : {})
        };
        setParams(newParams);
    };
    const buildColumns = () => {
        return (tableParams.columns || []).map(item => {
            return {
                field: item.id,
                name: csv_key_equivalence_1.KeyEquivalence[item.id] || item.id,
                sortable: typeof item.sortable !== 'undefined' ? item.sortable : true,
                width: item.width || undefined,
            };
        });
    };
    const columns = buildColumns();
    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: data.total_affected_items || 0,
        pageSizeOptions: [10, 25, 50],
    };
    const sorting = {
        sort: {
            field: sortField,
            direction: sortDirection,
        }
    };
    const onChange = (e) => {
        const value = e.target.value;
        setSearchBarValue(value);
        timerDelaySearch && clearTimeout(timerDelaySearch);
        const timeoutId = setTimeout(() => {
            const newParams = { ...params, search: value };
            setParams(newParams);
            setPageIndex(0);
        }, 400);
        setTimerDelaySearch(timeoutId);
    };
    const getTotal = () => {
        if (loading)
            return react_1.default.createElement(react_1.default.Fragment, null,
                '( ',
                react_1.default.createElement(eui_1.EuiLoadingSpinner, null),
                ' )');
        else
            return `(${data.total_affected_items})`;
    };
    const downloadCsv = async () => {
        await app_state_1.AppState.downloadCsv(tableParams.path, tableParams.exportFormatted, !!params.search ? [{ name: 'search', value: params.search }] : []);
    };
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "m", style: { margin: '12px 16px 12px 16px' } },
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement("span", { style: { display: "flex" } },
                    " ",
                    react_1.default.createElement(eui_1.EuiIcon, { type: tableParams.icon, style: { marginTop: 3 } }),
                    "  \u00A0 ",
                    react_1.default.createElement(eui_1.EuiText, null,
                        tableParams.title,
                        " ",
                        tableParams.hasTotal ? getTotal() : ''),
                    " "))),
        react_1.default.createElement(eui_1.EuiHorizontalRule, { margin: "xs" }),
        tableParams.searchBar &&
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: `Filter ${tableParams.title.toLowerCase()}...`, value: searchBarValue, fullWidth: true, onChange: onChange, "aria-label": `Filter ${tableParams.title.toLowerCase()}...` }))),
        react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiBasicTable, { items: data.affected_items || [], columns: columns, pagination: pagination, loading: loading, error: error, sorting: sorting, onChange: onTableChange }))),
        tableParams.exportFormatted && tableParams.columns && (react_1.default.createElement(eui_1.EuiFlexGroup, null,
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: true }),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: downloadCsv, iconType: "importAction" }, "Download CSV"))))));
}
exports.SyscollectorTable = SyscollectorTable;
