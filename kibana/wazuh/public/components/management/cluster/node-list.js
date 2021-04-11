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
exports.NodeList = void 0;
const react_1 = __importStar(require("react"));
const eui_1 = require("@elastic/eui");
const wz_request_1 = require("../../../react-services/wz-request");
class NodeList extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            loading: false
        };
    }
    async componentDidMount() {
        this.search();
    }
    async search(searchTerm = false) {
        let params = {};
        if (searchTerm) {
            params.search = searchTerm;
        }
        this.setState({ loading: true });
        try {
            const request = await wz_request_1.WzRequest.apiReq('GET', '/cluster/nodes', { params });
            this.setState({ nodes: (((request || {}).data || {}).data || {}).affected_items || [], loading: false });
        }
        catch (error) {
            this.setState({ loading: false });
        }
    }
    render() {
        const columns = [
            {
                field: 'name',
                name: 'Name',
                sortable: true,
                truncateText: true,
            },
            {
                field: 'version',
                name: 'Version',
                sortable: true,
            },
            {
                field: 'ip',
                name: 'IP',
                sortable: true,
            },
            {
                field: 'type',
                name: 'Type',
                sortable: true,
            }
        ];
        const sorting = {
            sort: {
                field: 'name',
                direction: 'asc',
            },
        };
        return (react_1.default.createElement(eui_1.EuiPanel, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, null,
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 0 } },
                            react_1.default.createElement(eui_1.EuiToolTip, { position: "right", content: `Back to groups` },
                                react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": "Back", style: { paddingTop: 8 }, color: "primary", iconSize: "l", iconType: "arrowLeft", onClick: () => this.props.goBack() }))),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiTitle, null,
                                react_1.default.createElement("h1", null, "Nodes")))))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiFieldSearch, { placeholder: "Filter nodes...", onSearch: e => this.search(e), isClearable: true, fullWidth: true, "aria-label": "Filter" }))),
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiInMemoryTable, { items: this.state.nodes, columns: columns, pagination: true, sorting: sorting, loading: this.state.loading })))));
    }
}
exports.NodeList = NodeList;
;
