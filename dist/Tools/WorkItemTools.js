"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemTools = void 0;
const WorkItemService_1 = require("../Services/WorkItemService");
const Common_1 = require("../Interfaces/Common");
class WorkItemTools {
    constructor(config) {
        this.workItemService = new WorkItemService_1.WorkItemService(config);
    }
    /**
     * List work items based on a WIQL query
     */
    async listWorkItems(params) {
        try {
            const response = await this.workItemService.listWorkItems(params.query);
            return (0, Common_1.formatMcpResponse)(response, `Found ${response.workItems?.length || 0} work items.`);
        }
        catch (error) {
            console.error('Error in listWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get a work item by ID
     */
    async getWorkItemById(params) {
        try {
            const workItem = await this.workItemService.getWorkItemById(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Work item ${params.id} details`);
        }
        catch (error) {
            console.error('Error in getWorkItemById tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Search work items
     */
    async searchWorkItems(params) {
        try {
            const results = await this.workItemService.searchWorkItems(params);
            return (0, Common_1.formatMcpResponse)(results, `Found ${results.workItems?.length || 0} matching work items`);
        }
        catch (error) {
            console.error('Error in searchWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get recently updated work items
     */
    async getRecentlyUpdatedWorkItems(params) {
        try {
            const results = await this.workItemService.getRecentWorkItems(params);
            return (0, Common_1.formatMcpResponse)(results, `Found ${results.workItems?.length || 0} recently updated work items`);
        }
        catch (error) {
            console.error('Error in getRecentlyUpdatedWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get work items assigned to current user
     */
    async getMyWorkItems(params) {
        try {
            const results = await this.workItemService.getMyWorkItems(params);
            return (0, Common_1.formatMcpResponse)(results, `Found ${results.workItems?.length || 0} work items assigned to you`);
        }
        catch (error) {
            console.error('Error in getMyWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create a work item
     */
    async createWorkItem(params) {
        try {
            const workItem = await this.workItemService.createWorkItem(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Created work item: ${workItem.id}`);
        }
        catch (error) {
            console.error('Error in createWorkItem tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Update a work item
     */
    async updateWorkItem(params) {
        try {
            const workItem = await this.workItemService.updateWorkItem(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Updated work item: ${params.id}`);
        }
        catch (error) {
            console.error('Error in updateWorkItem tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Add a comment to a work item
     */
    async addWorkItemComment(params) {
        try {
            const comment = await this.workItemService.addWorkItemComment(params);
            return (0, Common_1.formatMcpResponse)(comment, `Comment added to work item: ${params.id}`);
        }
        catch (error) {
            console.error('Error in addWorkItemComment tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Update work item state
     */
    async updateWorkItemState(params) {
        try {
            const workItem = await this.workItemService.updateWorkItemState(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Updated state of work item ${params.id} to "${params.state}"`);
        }
        catch (error) {
            console.error('Error in updateWorkItemState tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Assign work item to a user
     */
    async assignWorkItem(params) {
        try {
            const workItem = await this.workItemService.assignWorkItem(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Assigned work item ${params.id} to ${params.assignedTo}`);
        }
        catch (error) {
            console.error('Error in assignWorkItem tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create a link between work items
     */
    async createLink(params) {
        try {
            const workItem = await this.workItemService.createLink(params);
            return (0, Common_1.formatMcpResponse)(workItem, `Created ${params.linkType} link from work item ${params.sourceId} to ${params.targetId}`);
        }
        catch (error) {
            console.error('Error in createLink tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Bulk create or update work items
     */
    async bulkCreateWorkItems(params) {
        try {
            const results = await this.workItemService.bulkUpdateWorkItems(params);
            return (0, Common_1.formatMcpResponse)(results, `Processed ${results.count} work items`);
        }
        catch (error) {
            console.error('Error in bulkCreateWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
}
exports.WorkItemTools = WorkItemTools;
//# sourceMappingURL=WorkItemTools.js.map