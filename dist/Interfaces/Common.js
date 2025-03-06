"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMcpResponse = formatMcpResponse;
exports.formatErrorResponse = formatErrorResponse;
/**
 * Formats a response for MCP compatibility
 * @param data The data to format
 * @param message Optional message to display
 * @param isError Whether this is an error response
 * @returns MCP-compatible response
 */
function formatMcpResponse(data, message, isError = false) {
    return {
        content: [
            {
                type: "text",
                text: message || (isError ? "Error occurred" : "Request successful")
            },
            {
                type: "text",
                text: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
            }
        ],
        rawData: data,
        isError
    };
}
/**
 * Creates an error response
 * @param error The error that occurred
 * @returns MCP-compatible error response
 */
function formatErrorResponse(error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return formatMcpResponse({ error: errorMessage }, `Error: ${errorMessage}`, true);
}
//# sourceMappingURL=Common.js.map