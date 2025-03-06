"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAzureDevOpsConfig = getAzureDevOpsConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Try to load environment variables from .env file with multiple possible locations
function loadEnvFile() {
    // First try the current directory
    if (fs_1.default.existsSync('.env')) {
        dotenv_1.default.config();
        return;
    }
    // Try the directory of the running script
    const scriptDir = __dirname;
    const envPath = path_1.default.join(scriptDir, '..', '.env');
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
        return;
    }
    // If we still haven't loaded env vars, try a few other common locations
    const possiblePaths = [
        // One level above the dist directory
        path_1.default.join(process.cwd(), '.env'),
        // User's home directory
        path_1.default.join(process.env.HOME || '', '.azuredevops.env')
    ];
    for (const p of possiblePaths) {
        if (fs_1.default.existsSync(p)) {
            dotenv_1.default.config({ path: p });
            return;
        }
    }
    console.warn('No .env file found. Using environment variables if available.');
}
// Load environment variables
loadEnvFile();
/**
 * Get Azure DevOps configuration from environment variables
 */
function getAzureDevOpsConfig() {
    const orgUrl = process.env.AZURE_DEVOPS_ORG_URL;
    const project = process.env.AZURE_DEVOPS_PROJECT;
    const personalAccessToken = process.env.AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN;
    if (!orgUrl || !project || !personalAccessToken) {
        throw new Error('Missing required Azure DevOps configuration. Please check .env file or environment variables.');
    }
    return {
        orgUrl,
        project,
        personalAccessToken
    };
}
//# sourceMappingURL=config.js.map