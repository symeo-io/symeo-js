"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const yamljs_1 = __importDefault(require("yamljs"));
const sync_fetch_1 = __importDefault(require("sync-fetch"));
let config;
exports.config = config;
const apiUrl = process.env.SYMEO_API_URL;
const apiKey = process.env.SYMEO_API_KEY;
const localConfigFilePath = process.env.SYMEO_LOCAL_CONFIGURATION_FILE;
if (apiUrl && apiKey) {
    const response = (0, sync_fetch_1.default)(apiUrl, {
        headers: {
            'X-API-KEY': apiKey,
        },
    });
    if (response.status !== 200) {
        console.error('Error when fetching config: ', response.statusText);
        process.exit(1);
    }
    exports.config = config = response.json().values;
}
else if (localConfigFilePath) {
    exports.config = config = yamljs_1.default.load(localConfigFilePath);
}
else {
    console.error('Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? E.g symeo -- node index.js');
    process.exit(1);
}
//# sourceMappingURL=index.js.map