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
exports.GitService = void 0;
const azdev = __importStar(require("azure-devops-node-api"));
class GitService {
    constructor(config) {
        this.config = config;
        this.connection = new azdev.WebApi(config.orgUrl, azdev.getPersonalAccessTokenHandler(config.personalAccessToken));
    }
    /**
     * Get the Git API client
     */
    async getGitApi() {
        return await this.connection.getGitApi();
    }
    /**
     * List all repositories
     */
    async listRepositories(params) {
        try {
            const gitApi = await this.getGitApi();
            const repositories = await gitApi.getRepositories(params.projectId || this.config.project, params.includeHidden, params.includeAllUrls);
            return repositories;
        }
        catch (error) {
            console.error('Error listing repositories:', error);
            throw error;
        }
    }
    /**
     * Get repository details
     */
    async getRepository(params) {
        try {
            const gitApi = await this.getGitApi();
            const repository = await gitApi.getRepository(params.repositoryId, params.projectId || this.config.project);
            return repository;
        }
        catch (error) {
            console.error(`Error getting repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Create a repository
     */
    async createRepository(params) {
        try {
            const gitApi = await this.getGitApi();
            const repository = await gitApi.createRepository({
                name: params.name,
                project: {
                    id: params.projectId || this.config.project
                }
            }, params.projectId || this.config.project);
            return repository;
        }
        catch (error) {
            console.error(`Error creating repository ${params.name}:`, error);
            throw error;
        }
    }
    /**
     * List branches
     */
    async listBranches(params) {
        try {
            const gitApi = await this.getGitApi();
            const branches = await gitApi.getBranches(params.repositoryId, params.filter);
            if (params.top && branches.length > params.top) {
                return branches.slice(0, params.top);
            }
            return branches;
        }
        catch (error) {
            console.error(`Error listing branches for repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Search code (Note: This uses a simplified approach as the full-text search API
     * might require additional setup)
     */
    async searchCode(params) {
        try {
            const gitApi = await this.getGitApi();
            // This is a simplified implementation using item search
            // For more comprehensive code search, you'd use the Search API
            const items = await gitApi.getItems(params.repositoryId || "", undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, undefined);
            // Simple filter based on the search text and file extension
            let filteredItems = items;
            if (params.searchText) {
                filteredItems = filteredItems.filter(item => item.path && item.path.toLowerCase().includes(params.searchText.toLowerCase()));
            }
            if (params.fileExtension) {
                filteredItems = filteredItems.filter(item => item.path && item.path.endsWith(params.fileExtension || ""));
            }
            // Limit results if top is specified
            if (params.top && filteredItems.length > params.top) {
                filteredItems = filteredItems.slice(0, params.top);
            }
            return filteredItems;
        }
        catch (error) {
            console.error(`Error searching code in repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Browse repository
     */
    async browseRepository(params) {
        try {
            const gitApi = await this.getGitApi();
            const items = await gitApi.getItems(params.repositoryId, undefined, params.path, undefined, true, undefined, undefined, undefined, undefined, undefined);
            return items;
        }
        catch (error) {
            console.error(`Error browsing repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Get file content
     */
    async getFileContent(params) {
        try {
            const gitApi = await this.getGitApi();
            // Get the file content as a stream
            const content = await gitApi.getItemContent(params.repositoryId, params.path, undefined, undefined);
            // Convert content to string
            let fileContent = '';
            // Handle different content types
            if (Buffer.isBuffer(content)) {
                fileContent = content.toString('utf8');
            }
            else if (typeof content === 'string') {
                fileContent = content;
            }
            else {
                // If it's a stream or other type, return a placeholder
                fileContent = "[Content not available in this format]";
            }
            return {
                content: fileContent
            };
        }
        catch (error) {
            console.error(`Error getting file content for ${params.path}:`, error);
            throw error;
        }
    }
    /**
     * Get commit history
     */
    async getCommitHistory(params) {
        try {
            const gitApi = await this.getGitApi();
            // Get commits without search criteria
            const commits = await gitApi.getCommits(params.repositoryId, {} // Empty search criteria
            );
            // Filter by path if provided
            let filteredCommits = commits;
            if (params.itemPath) {
                filteredCommits = commits.filter(commit => commit.comment && commit.comment.includes(params.itemPath || ""));
            }
            // Apply pagination if specified
            if (params.skip && params.skip > 0) {
                filteredCommits = filteredCommits.slice(params.skip);
            }
            if (params.top && params.top > 0) {
                filteredCommits = filteredCommits.slice(0, params.top);
            }
            return filteredCommits;
        }
        catch (error) {
            console.error(`Error getting commit history for repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Get commits
     */
    async getCommits(params) {
        try {
            const gitApi = await this.getGitApi();
            // Get commits without search criteria
            const commits = await gitApi.getCommits(params.repositoryId, {} // Empty search criteria
            );
            // Filter by path if provided
            let filteredCommits = commits;
            if (params.path) {
                filteredCommits = commits.filter(commit => commit.comment && commit.comment.includes(params.path || ""));
            }
            return filteredCommits;
        }
        catch (error) {
            console.error(`Error getting commits for repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Get pull requests
     */
    async getPullRequests(params) {
        try {
            const gitApi = await this.getGitApi();
            // Create search criteria with proper types
            const searchCriteria = {
                repositoryId: params.repositoryId,
                creatorId: params.creatorId,
                reviewerId: params.reviewerId,
                sourceRefName: params.sourceRefName,
                targetRefName: params.targetRefName
            };
            // Convert string status to number if provided
            if (params.status) {
                if (params.status === 'active')
                    searchCriteria.status = 1;
                else if (params.status === 'abandoned')
                    searchCriteria.status = 2;
                else if (params.status === 'completed')
                    searchCriteria.status = 3;
                else if (params.status === 'notSet')
                    searchCriteria.status = 0;
                // 'all' doesn't need to be set
            }
            const pullRequests = await gitApi.getPullRequests(params.repositoryId, searchCriteria);
            return pullRequests;
        }
        catch (error) {
            console.error(`Error getting pull requests for repository ${params.repositoryId}:`, error);
            throw error;
        }
    }
    /**
     * Create pull request
     */
    async createPullRequest(params) {
        try {
            const gitApi = await this.getGitApi();
            const pullRequest = {
                sourceRefName: params.sourceRefName,
                targetRefName: params.targetRefName,
                title: params.title,
                description: params.description,
                reviewers: params.reviewers ? params.reviewers.map(id => ({ id })) : undefined
            };
            const createdPullRequest = await gitApi.createPullRequest(pullRequest, params.repositoryId, this.config.project);
            return createdPullRequest;
        }
        catch (error) {
            console.error('Error creating pull request:', error);
            throw error;
        }
    }
    /**
     * Get pull request by ID
     */
    async getPullRequest(params) {
        try {
            const gitApi = await this.getGitApi();
            const pullRequest = await gitApi.getPullRequest(params.repositoryId, params.pullRequestId, this.config.project);
            return pullRequest;
        }
        catch (error) {
            console.error(`Error getting pull request ${params.pullRequestId}:`, error);
            throw error;
        }
    }
    /**
     * Get pull request comments
     */
    async getPullRequestComments(params) {
        try {
            const gitApi = await this.getGitApi();
            if (params.threadId) {
                const thread = await gitApi.getPullRequestThread(params.repositoryId, params.pullRequestId, params.threadId, this.config.project);
                return thread;
            }
            else {
                const threads = await gitApi.getThreads(params.repositoryId, params.pullRequestId, this.config.project);
                return threads;
            }
        }
        catch (error) {
            console.error(`Error getting comments for pull request ${params.pullRequestId}:`, error);
            throw error;
        }
    }
    /**
     * Approve pull request
     */
    async approvePullRequest(params) {
        try {
            const gitApi = await this.getGitApi();
            const vote = {
                vote: 10
            };
            const result = await gitApi.createPullRequestReviewer(vote, params.repositoryId, params.pullRequestId, "me", this.config.project);
            return result;
        }
        catch (error) {
            console.error(`Error approving pull request ${params.pullRequestId}:`, error);
            throw error;
        }
    }
    /**
     * Merge pull request
     */
    async mergePullRequest(params) {
        try {
            const gitApi = await this.getGitApi();
            // Convert string merge strategy to number
            let mergeStrategy = 1; // Default to noFastForward
            if (params.mergeStrategy === 'rebase')
                mergeStrategy = 2;
            else if (params.mergeStrategy === 'rebaseMerge')
                mergeStrategy = 3;
            else if (params.mergeStrategy === 'squash')
                mergeStrategy = 4;
            const result = await gitApi.updatePullRequest({
                status: 3, // 3 = completed in PullRequestStatus enum
                completionOptions: {
                    mergeStrategy: mergeStrategy
                }
            }, params.repositoryId, params.pullRequestId, this.config.project);
            return result;
        }
        catch (error) {
            console.error(`Error merging pull request ${params.pullRequestId}:`, error);
            throw error;
        }
    }
    /**
     * Complete pull request
     */
    async completePullRequest(params) {
        try {
            const gitApi = await this.getGitApi();
            // Get the current pull request
            const pullRequest = await gitApi.getPullRequestById(params.pullRequestId);
            // Convert string merge strategy to number
            let mergeStrategy = 1; // Default to noFastForward
            if (params.mergeStrategy === 'rebase')
                mergeStrategy = 2;
            else if (params.mergeStrategy === 'rebaseMerge')
                mergeStrategy = 3;
            else if (params.mergeStrategy === 'squash')
                mergeStrategy = 4;
            // Update the pull request to completed status
            const updatedPullRequest = await gitApi.updatePullRequest({
                status: 3, // 3 = completed in PullRequestStatus enum
                completionOptions: {
                    mergeStrategy: mergeStrategy,
                    deleteSourceBranch: params.deleteSourceBranch
                }
            }, params.repositoryId, params.pullRequestId);
            return updatedPullRequest;
        }
        catch (error) {
            console.error(`Error completing pull request ${params.pullRequestId}:`, error);
            throw error;
        }
    }
}
exports.GitService = GitService;
//# sourceMappingURL=GitService.js.map