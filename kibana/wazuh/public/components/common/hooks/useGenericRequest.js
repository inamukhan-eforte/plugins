"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGenericRequest = void 0;
const react_1 = require("react");
const generic_request_1 = require("../../../react-services/generic-request");
function useGenericRequest(method, path, params, formatFunction) {
    const [items, setItems] = react_1.useState({});
    const [isLoading, setisLoading] = react_1.useState(true);
    const [error, setError] = react_1.useState("");
    react_1.useEffect(() => {
        try {
            setisLoading(true);
            const fetchData = async () => {
                const response = await generic_request_1.GenericRequest.request(method, path, params);
                setItems(response);
                setisLoading(false);
            };
            fetchData();
        }
        catch (err) {
            setError(error);
            setisLoading(false);
        }
    }, [params]);
    return { isLoading, data: formatFunction(items), error };
}
exports.useGenericRequest = useGenericRequest;
