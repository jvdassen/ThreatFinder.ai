import { isProduction } from "./isProduction";
/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production Dokku URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
    const prodUrl = "https://www.csg.uzh.ch/api-threatfinder/";
    const devUrl = process.env.REACT_APP_SERVER_IP
        ? "http://" + process.env.REACT_APP_SERVER_IP + ":8080"
        : "http://localhost:8080";
    return isProduction() ? prodUrl : devUrl;
};
