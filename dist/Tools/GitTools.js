"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitTools = void 0;
const GitService_1 = require("../Services/GitService");
const Common_1 = require("../Interfaces/Common");
class GitTools {
    constructor(config) {
        this.gitService = new GitService_1.GitService(config);
    }
    /**
     * List all repositories
     */
    async listRepositories(params) {
        try {
            const repositories = await this.gitService.listRepositories(params);
            return (0, Common_1.formatMcpResponse)(repositories, `Found ${repositories.length} repositories`);
        }
        catch (error) {
            console.error('Error in listRepositories tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get repository details
     */
    async getRepository(params) {
        try {
            const repository = await this.gitService.getRepository(params);
            return (0, Common_1.formatMcpResponse)(repository, `Repository details for ${repository.name}`);
        }
        catch (error) {
            console.error('Error in getRepository tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create a repository
     */
    async createRepository(params) {
        try {
            const repository = await this.gitService.createRepository(params);
            return (0, Common_1.formatMcpResponse)(repository, `Created repository: ${repository.name}`);
        }
        catch (error) {
            console.error('Error in createRepository tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * List branches
     */
    async listBranches(params) {
        try {
            const branches = await this.gitService.listBranches(params);
            return (0, Common_1.formatMcpResponse)(branches, `Found ${branches.length} branches`);
        }
        catch (error) {
            console.error('Error in listBranches tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Search code
     */
    async searchCode(params) {
        try {
            const items = await this.gitService.searchCode(params);
            return (0, Common_1.formatMcpResponse)(items, `Found ${items.length} matching files`);
        }
        catch (error) {
            console.error('Error in searchCode tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Browse repository
     */
    async browseRepository(params) {
        try {
            const items = await this.gitService.browseRepository(params);
            return (0, Common_1.formatMcpResponse)(items, `Found ${items.length} items in repository`);
        }
        catch (error) {
            console.error('Error in browseRepository tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get file content
     */
    async getFileContent(params) {
        try {
            const file = await this.gitService.getFileContent(params);
            return (0, Common_1.formatMcpResponse)(file, `Content of file: ${params.path}`);
        }
        catch (error) {
            console.error('Error in getFileContent tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get commit history
     */
    async getCommitHistory(params) {
        try {
            const commits = await this.gitService.getCommitHistory(params);
            return (0, Common_1.formatMcpResponse)(commits, `Found ${commits.length} commits`);
        }
        catch (error) {
            console.error('Error in getCommitHistory tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * List pull requests
     */
    async listPullRequests(params) {
        try {
            const pullRequests = await this.gitService.getPullRequests(params);
            return (0, Common_1.formatMcpResponse)(pullRequests, `Found ${pullRequests.length} pull requests`);
        }
        catch (error) {
            console.error('Error in listPullRequests tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Create pull request
     */
    async createPullRequest(params) {
        try {
            const pullRequest = await this.gitService.createPullRequest(params);
            return (0, Common_1.formatMcpResponse)(pullRequest, `Created pull request: ${pullRequest.pullRequestId}`);
        }
        catch (error) {
            console.error('Error in createPullRequest tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get pull request by ID
     */
    async getPullRequest(params) {
        try {
            const pullRequest = await this.gitService.getPullRequest(params);
            return (0, Common_1.formatMcpResponse)(pullRequest, `Pull request ${params.pullRequestId} details`);
        }
        catch (error) {
            console.error('Error in getPullRequest tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Get pull request comments
     */
    async getPullRequestComments(params) {
        try {
            const comments = await this.gitService.getPullRequestComments(params);
            return (0, Common_1.formatMcpResponse)(comments, `Retrieved comments for pull request ${params.pullRequestId}`);
        }
        catch (error) {
            console.error('Error in getPullRequestComments tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Approve pull request
     */
    async approvePullRequest(params) {
        try {
            const result = await this.gitService.approvePullRequest(params);
            return (0, Common_1.formatMcpResponse)(result, `Approved pull request ${params.pullRequestId}`);
        }
        catch (error) {
            console.error('Error in approvePullRequest tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
    /**
     * Merge pull request
     */
    async mergePullRequest(params) {
        try {
            const result = await this.gitService.mergePullRequest(params);
            return (0, Common_1.formatMcpResponse)(result, `Merged pull request ${params.pullRequestId}`);
        }
        catch (error) {
            console.error('Error in mergePullRequest tool:', error);
            return (0, Common_1.formatErrorResponse)(error);
        }
    }
}
exports.GitTools = GitTools;
//# sourceMappingURL=GitTools.js.map