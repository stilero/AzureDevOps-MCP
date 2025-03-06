"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTools = void 0;
const ProjectService_1 = require("../Services/ProjectService");
const Common_1 = require("../Interfaces/Common");
class ProjectTools {
    constructor(config) {
        this.projectService = new ProjectService_1.ProjectService(config);
    }
    /**
     * List all projects
     */
    async listProjects(params) {
        try {
            const projects = await this.projectService.listProjects(params);
            return (0, Common_1.formatMcpResponse)(projects, `Found ${projects.length} projects`);
        }
        catch (error) {
            console.error('Error in listProjects tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get project details
     */
    async getProjectDetails(params) {
        try {
            const project = await this.projectService.getProjectDetails(params);
            return (0, Common_1.formatMcpResponse)(project, `Project details for ${project.name}`);
        }
        catch (error) {
            console.error('Error in getProjectDetails tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create a project
     */
    async createProject(params) {
        try {
            const project = await this.projectService.createProject(params);
            return (0, Common_1.formatMcpResponse)(project, `Project ${params.name} creation initiated`);
        }
        catch (error) {
            console.error('Error in createProject tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get areas
     */
    async getAreas(params) {
        try {
            const areas = await this.projectService.getAreas(params);
            return (0, Common_1.formatMcpResponse)(areas, `Retrieved areas for project ${params.projectId}`);
        }
        catch (error) {
            console.error('Error in getAreas tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get iterations
     */
    async getIterations(params) {
        try {
            const iterations = await this.projectService.getIterations(params);
            return (0, Common_1.formatMcpResponse)(iterations, `Retrieved iterations for project ${params.projectId}`);
        }
        catch (error) {
            console.error('Error in getIterations tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create area
     */
    async createArea(params) {
        try {
            const area = await this.projectService.createArea(params);
            return (0, Common_1.formatMcpResponse)(area, `Created area ${params.name} in project ${params.projectId}`);
        }
        catch (error) {
            console.error('Error in createArea tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create iteration
     */
    async createIteration(params) {
        try {
            const iteration = await this.projectService.createIteration(params);
            return (0, Common_1.formatMcpResponse)(iteration, `Created iteration ${params.name} in project ${params.projectId}`);
        }
        catch (error) {
            console.error('Error in createIteration tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get processes
     */
    async getProcesses(params) {
        try {
            const processes = await this.projectService.getProcesses(params);
            return (0, Common_1.formatMcpResponse)(processes, `Retrieved ${processes.length} processes`);
        }
        catch (error) {
            console.error('Error in getProcesses tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get work item types
     */
    async getWorkItemTypes(params) {
        try {
            const types = await this.projectService.getWorkItemTypes(params);
            return (0, Common_1.formatMcpResponse)(types, `Retrieved work item types for process ${params.processId}`);
        }
        catch (error) {
            console.error('Error in getWorkItemTypes tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get work item type fields
     */
    async getWorkItemTypeFields(params) {
        try {
            const fields = await this.projectService.getWorkItemTypeFields(params);
            return (0, Common_1.formatMcpResponse)(fields, `Retrieved fields for work item type ${params.witRefName}`);
        }
        catch (error) {
            console.error('Error in getWorkItemTypeFields tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
}
exports.ProjectTools = ProjectTools;
//# sourceMappingURL=ProjectTools.js.map