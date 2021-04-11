"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApiRequest = void 0;
const react_1 = require("react");
const wz_request_1 = require("../../../react-services/wz-request");
function useApiRequest(method, path, params) {
    const [items, setItems] = react_1.useState({ affected_items: [], failed_items: [], total_affected_items: 0, total_failed_items: 0 });
    const [loading, setLoading] = react_1.useState(true);
    const [error, setError] = react_1.useState();
    react_1.useEffect(() => {
        setLoading(true);
        setError(undefined);
        wz_request_1.WzRequest.apiReq(method, path, { params })
            .then(response => {
            setItems(response.data.data);
            setLoading(false);
        })
            .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, [path, params]);
    return [loading, items, error];
}
exports.useApiRequest = useApiRequest;
