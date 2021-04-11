"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApiService = void 0;
const react_1 = require("react");
function useApiService(service, params) {
    const [data, setData] = react_1.useState();
    const [loading, setLoading] = react_1.useState(true);
    const [error, setError] = react_1.useState();
    react_1.useEffect(() => {
        setLoading(true);
        setError(undefined);
        service(params)
            .then(data => {
            setData(data);
            setLoading(false);
        })
            .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);
    return [loading, data, error];
}
exports.useApiService = useApiService;
