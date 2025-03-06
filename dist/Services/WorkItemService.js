"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemService = void 0;
const azdev = __importStar(require("azure-devops-node-api"));
const VSSInterfaces_1 = require("azure-devops-node-api/interfaces/common/VSSInterfaces");
class WorkItemService {
    constructor(config) {
        this.config = config;
        this.connection = new azdev.WebApi(config.orgUrl, azdev.getPersonalAccessTokenHandler(config.personalAccessToken));
    }
    /**
     * Get the WorkItemTracking API client
     */
    async getWorkItemTrackingApi() {
        return await this.connection.getWorkItemTrackingApi();
    }
    /**
     * Query work items using WIQL
     */
    async listWorkItems(wiqlQuery) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            // Execute the WIQL query
            const queryResult = await witApi.queryByWiql({
                query: wiqlQuery
            }, {
                project: this.config.project
            });
            return queryResult;
        }
        catch (error) {
            console.error('Error listing work items:', error);
            throw error;
        }
    }
    /**
     * Get a work item by ID
     */
    async getWorkItemById(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const workItem = await witApi.getWorkItem(params.id, undefined, undefined, undefined, this.config.project);
            return workItem;
        }
        catch (error) {
            console.error(`Error getting work item ${params.id}:`, error);
            throw error;
        }
    }
    /**
     * Search work items using text
     */
    async searchWorkItems(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const query = `SELECT [System.Id], [System.Title], [System.State], [System.CreatedDate] 
                    FROM WorkItems 
                    WHERE [System.TeamProject] = @project 
                    AND (
                      [System.Title] CONTAINS '${params.searchText}'
                      OR [System.Description] CONTAINS '${params.searchText}'
                    )
                    ORDER BY [System.CreatedDate] DESC`;
            const queryResult = await witApi.queryByWiql({
                query
            }, {
                project: this.config.project
            });
            return queryResult;
        }
        catch (error) {
            console.error('Error searching work items:', error);
            throw error;
        }
    }
    /**
     * Get recently updated work items
     */
    async getRecentWorkItems(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const query = `SELECT [System.Id], [System.Title], [System.State], [System.ChangedDate] 
                    FROM WorkItems 
                    WHERE [System.TeamProject] = @project 
                    ORDER BY [System.ChangedDate] DESC`;
            const queryResult = await witApi.queryByWiql({
                query
            }, {
                project: this.config.project
            });
            const top = params.top || 10;
            const skip = params.skip || 0;
            if (queryResult.workItems) {
                queryResult.workItems = queryResult.workItems.slice(skip, skip + top);
            }
            return queryResult;
        }
        catch (error) {
            console.error('Error getting recent work items:', error);
            throw error;
        }
    }
    /**
     * Get work items assigned to current user
     */
    async getMyWorkItems(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            let stateCondition = '';
            if (params.state) {
                stateCondition = `AND [System.State] = '${params.state}'`;
            }
            const query = `SELECT [System.Id], [System.Title], [System.State], [System.CreatedDate] 
                    FROM WorkItems 
                    WHERE [System.TeamProject] = @project 
                    AND [System.AssignedTo] = @me
                    ${stateCondition}
                    ORDER BY [System.CreatedDate] DESC`;
            const queryResult = await witApi.queryByWiql({
                query
            }, {
                project: this.config.project
            });
            const top = params.top || 100;
            if (queryResult.workItems) {
                queryResult.workItems = queryResult.workItems.slice(0, top);
            }
            return queryResult;
        }
        catch (error) {
            console.error('Error getting my work items:', error);
            throw error;
        }
    }
    /**
     * Create a work item
     */
    async createWorkItem(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const patchDocument = [];
            // Add title
            patchDocument.push({
                op: VSSInterfaces_1.Operation.Add,
                path: "/fields/System.Title",
                value: params.title
            });
            // Add description if provided
            if (params.description) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.Description",
                    value: params.description
                });
            }
            // Add assigned to if provided
            if (params.assignedTo) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.AssignedTo",
                    value: params.assignedTo
                });
            }
            // Add state if provided
            if (params.state) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.State",
                    value: params.state
                });
            }
            // Add area path if provided
            if (params.areaPath) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.AreaPath",
                    value: params.areaPath
                });
            }
            // Add iteration path if provided
            if (params.iterationPath) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.IterationPath",
                    value: params.iterationPath
                });
            }
            // Add additional fields if provided
            if (params.additionalFields) {
                for (const [key, value] of Object.entries(params.additionalFields)) {
                    patchDocument.push({
                        op: VSSInterfaces_1.Operation.Add,
                        path: `/fields/${key}`,
                        value: value
                    });
                }
            }
            const workItem = await witApi.createWorkItem(undefined, patchDocument, this.config.project, params.workItemType);
            return workItem;
        }
        catch (error) {
            console.error('Error creating work item:', error);
            throw error;
        }
    }
    /**
     * Update a work item
     */
    async updateWorkItem(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const patchDocument = [];
            // Add fields from the params
            for (const [key, value] of Object.entries(params.fields)) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: `/fields/${key}`,
                    value: value
                });
            }
            const workItem = await witApi.updateWorkItem(undefined, patchDocument, params.id, this.config.project);
            return workItem;
        }
        catch (error) {
            console.error(`Error updating work item ${params.id}:`, error);
            throw error;
        }
    }
    /**
     * Add a comment to a work item
     */
    async addWorkItemComment(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const comment = await witApi.addComment({
                text: params.text
            }, this.config.project, params.id);
            return comment;
        }
        catch (error) {
            console.error(`Error adding comment to work item ${params.id}:`, error);
            throw error;
        }
    }
    /**
     * Update work item state
     */
    async updateWorkItemState(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const patchDocument = [
                {
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.State",
                    value: params.state
                }
            ];
            // Add comment if provided
            if (params.comment) {
                patchDocument.push({
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.History",
                    value: params.comment
                });
            }
            const workItem = await witApi.updateWorkItem(undefined, patchDocument, params.id, this.config.project);
            return workItem;
        }
        catch (error) {
            console.error(`Error updating state for work item ${params.id}:`, error);
            throw error;
        }
    }
    /**
     * Assign work item to a user
     */
    async assignWorkItem(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const patchDocument = [
                {
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/fields/System.AssignedTo",
                    value: params.assignedTo
                }
            ];
            const workItem = await witApi.updateWorkItem(undefined, patchDocument, params.id, this.config.project);
            return workItem;
        }
        catch (error) {
            console.error(`Error assigning work item ${params.id}:`, error);
            throw error;
        }
    }
    /**
     * Create a link between work items
     */
    async createLink(params) {
        try {
            const witApi = await this.getWorkItemTrackingApi();
            const patchDocument = [
                {
                    op: VSSInterfaces_1.Operation.Add,
                    path: "/relations/-",
                    value: {
                        rel: params.linkType,
                        url: `${this.config.orgUrl}/_apis/wit/workItems/${params.targetId}`,
                        attributes: {
                            comment: params.comment || ""
                        }
                    }
                }
            ];
            const workItem = await witApi.updateWorkItem(undefined, patchDocument, params.sourceId, this.config.project);
            return workItem;
        }
        catch (error) {
            console.error(`Error creating link between work items:`, error);
            throw error;
        }
    }
    /**
     * Bulk create or update work items
     */
    async bulkUpdateWorkItems(params) {
        try {
            const results = [];
            for (const workItemParams of params.workItems) {
                if ('id' in workItemParams) {
                    // It's an update
                    const result = await this.updateWorkItem(workItemParams);
                    results.push(result);
                }
                else {
                    // It's a create
                    const result = await this.createWorkItem(workItemParams);
                    results.push(result);
                }
            }
            return {
                count: results.length,
                workItems: results
            };
        }
        catch (error) {
            console.error('Error in bulk work item operation:', error);
            throw error;
        }
    }
}
exports.WorkItemService = WorkItemService;
//# sourceMappingURL=WorkItemService.js.map