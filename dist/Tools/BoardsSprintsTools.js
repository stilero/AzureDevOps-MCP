"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsSprintsTools = void 0;
const BoardsSprintsService_1 = require("../Services/BoardsSprintsService");
const Common_1 = require("../Interfaces/Common");
class BoardsSprintsTools {
    constructor(config) {
        this.boardsSprintsService = new BoardsSprintsService_1.BoardsSprintsService(config);
    }
    /**
     * Get all boards
     */
    async getBoards(params) {
        try {
            const boards = await this.boardsSprintsService.getBoards(params);
            return (0, Common_1.formatMcpResponse)(boards, `Found ${boards.length} boards`);
        }
        catch (error) {
            console.error('Error in getBoards tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get board columns
     */
    async getBoardColumns(params) {
        try {
            const columns = await this.boardsSprintsService.getBoardColumns(params);
            return (0, Common_1.formatMcpResponse)(columns, `Found ${columns.length} columns for board ${params.boardId}`);
        }
        catch (error) {
            console.error('Error in getBoardColumns tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get board items
     */
    async getBoardItems(params) {
        try {
            const items = await this.boardsSprintsService.getBoardItems(params);
            return (0, Common_1.formatMcpResponse)(items, `Retrieved items for board ${params.boardId}`);
        }
        catch (error) {
            console.error('Error in getBoardItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Move a card on board
     */
    async moveCardOnBoard(params) {
        try {
            const result = await this.boardsSprintsService.moveCardOnBoard(params);
            return (0, Common_1.formatMcpResponse)(result, `Moved work item ${params.workItemId} to column ${params.columnId}`);
        }
        catch (error) {
            console.error('Error in moveCardOnBoard tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get all sprints
     */
    async getSprints(params) {
        try {
            const sprints = await this.boardsSprintsService.getSprints(params);
            return (0, Common_1.formatMcpResponse)(sprints, `Found ${sprints.length} sprints`);
        }
        catch (error) {
            console.error('Error in getSprints tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get current sprint
     */
    async getCurrentSprint(params) {
        try {
            const sprint = await this.boardsSprintsService.getCurrentSprint(params);
            return (0, Common_1.formatMcpResponse)(sprint, sprint ? `Current sprint: ${sprint.name}` : 'No current sprint found');
        }
        catch (error) {
            console.error('Error in getCurrentSprint tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get sprint work items
     */
    async getSprintWorkItems(params) {
        try {
            const workItems = await this.boardsSprintsService.getSprintWorkItems(params);
            return (0, Common_1.formatMcpResponse)(workItems, `Found ${workItems.workItems?.length || 0} work items in sprint ${params.sprintId}`);
        }
        catch (error) {
            console.error('Error in getSprintWorkItems tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get sprint capacity
     */
    async getSprintCapacity(params) {
        try {
            const capacity = await this.boardsSprintsService.getSprintCapacity(params);
            return (0, Common_1.formatMcpResponse)(capacity, `Retrieved capacity for sprint ${params.sprintId}`);
        }
        catch (error) {
            console.error('Error in getSprintCapacity tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get team members
     */
    async getTeamMembers(params) {
        try {
            const members = await this.boardsSprintsService.getTeamMembers(params);
            return (0, Common_1.formatMcpResponse)(members, `Found ${members.length} team members`);
        }
        catch (error) {
            console.error('Error in getTeamMembers tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
}
exports.BoardsSprintsTools = BoardsSprintsTools;
//# sourceMappingURL=BoardsSprintsTools.js.map