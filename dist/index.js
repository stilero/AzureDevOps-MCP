"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const config_1 = require("./config");
const WorkItemTools_1 = require("./Tools/WorkItemTools");
const BoardsSprintsTools_1 = require("./Tools/BoardsSprintsTools");
const ProjectTools_1 = require("./Tools/ProjectTools");
const GitTools_1 = require("./Tools/GitTools");
const TestingCapabilitiesTools_1 = require("./Tools/TestingCapabilitiesTools");
const zod_1 = require("zod");
async function main() {
    try {
        // Log startup info
        console.log('Starting MCP server for Azure DevOps...');
        // Load configuration
        const azureDevOpsConfig = (0, config_1.getAzureDevOpsConfig)();
        console.log('Successfully loaded Azure DevOps configuration');
        // Initialize tools
        const workItemTools = new WorkItemTools_1.WorkItemTools(azureDevOpsConfig);
        const boardsSprintsTools = new BoardsSprintsTools_1.BoardsSprintsTools(azureDevOpsConfig);
        const projectTools = new ProjectTools_1.ProjectTools(azureDevOpsConfig);
        const gitTools = new GitTools_1.GitTools(azureDevOpsConfig);
        const testingCapabilitiesTools = new TestingCapabilitiesTools_1.TestingCapabilitiesTools(azureDevOpsConfig);
        console.log('Initialized tools');
        // Create MCP server
        const server = new mcp_js_1.McpServer({
            name: 'azure-devops-mcp',
            version: '1.0.0',
            description: 'MCP server for Azure DevOps integration',
        });
        // Register Work Item Tools
        server.tool("listWorkItems", "List work items based on a WIQL query", {
            query: zod_1.z.string().describe("WIQL query to get work items")
        }, async (params, extra) => {
            const result = await workItemTools.listWorkItems({ query: params.query });
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getWorkItemById", "Get a specific work item by ID", {
            id: zod_1.z.number().describe("Work item ID")
        }, async (params, extra) => {
            const result = await workItemTools.getWorkItemById({ id: params.id });
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("searchWorkItems", "Search for work items by text", {
            searchText: zod_1.z.string().describe("Text to search for in work items"),
            top: zod_1.z.number().optional().describe("Maximum number of work items to return")
        }, async (params, extra) => {
            const result = await workItemTools.searchWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getRecentlyUpdatedWorkItems", "Get recently updated work items", {
            top: zod_1.z.number().optional().describe("Maximum number of work items to return"),
            skip: zod_1.z.number().optional().describe("Number of work items to skip")
        }, async (params, extra) => {
            const result = await workItemTools.getRecentlyUpdatedWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getMyWorkItems", "Get work items assigned to you", {
            state: zod_1.z.string().optional().describe("Filter by work item state"),
            top: zod_1.z.number().optional().describe("Maximum number of work items to return")
        }, async (params, extra) => {
            const result = await workItemTools.getMyWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createWorkItem", "Create a new work item", {
            workItemType: zod_1.z.string().describe("Type of work item to create"),
            title: zod_1.z.string().describe("Title of the work item"),
            description: zod_1.z.string().optional().describe("Description of the work item"),
            assignedTo: zod_1.z.string().optional().describe("User to assign the work item to"),
            state: zod_1.z.string().optional().describe("Initial state of the work item"),
            areaPath: zod_1.z.string().optional().describe("Area path for the work item"),
            iterationPath: zod_1.z.string().optional().describe("Iteration path for the work item"),
            additionalFields: zod_1.z.record(zod_1.z.any()).optional().describe("Additional fields to set on the work item")
        }, async (params, extra) => {
            const result = await workItemTools.createWorkItem(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("updateWorkItem", "Update an existing work item", {
            id: zod_1.z.number().describe("ID of the work item to update"),
            fields: zod_1.z.record(zod_1.z.any()).describe("Fields to update on the work item")
        }, async (params, extra) => {
            const result = await workItemTools.updateWorkItem(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("addWorkItemComment", "Add a comment to a work item", {
            id: zod_1.z.number().describe("ID of the work item"),
            text: zod_1.z.string().describe("Comment text")
        }, async (params, extra) => {
            const result = await workItemTools.addWorkItemComment(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("updateWorkItemState", "Update the state of a work item", {
            id: zod_1.z.number().describe("ID of the work item"),
            state: zod_1.z.string().describe("New state for the work item"),
            comment: zod_1.z.string().optional().describe("Comment explaining the state change")
        }, async (params, extra) => {
            const result = await workItemTools.updateWorkItemState(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("assignWorkItem", "Assign a work item to a user", {
            id: zod_1.z.number().describe("ID of the work item"),
            assignedTo: zod_1.z.string().describe("User to assign the work item to")
        }, async (params, extra) => {
            const result = await workItemTools.assignWorkItem(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createLink", "Create a link between work items", {
            sourceId: zod_1.z.number().describe("ID of the source work item"),
            targetId: zod_1.z.number().describe("ID of the target work item"),
            linkType: zod_1.z.string().describe("Type of link to create"),
            comment: zod_1.z.string().optional().describe("Comment explaining the link")
        }, async (params, extra) => {
            const result = await workItemTools.createLink(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("bulkCreateWorkItems", "Create or update multiple work items in a single operation", {
            workItems: zod_1.z.array(zod_1.z.any()).describe("Array of work items to create or update")
        }, async (params, extra) => {
            const result = await workItemTools.bulkCreateWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        // Register Boards & Sprints Tools
        server.tool("getBoards", "Get all boards for a team", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getBoards(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getBoardColumns", "Get columns for a specific board", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)"),
            boardId: zod_1.z.string().describe("ID of the board")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getBoardColumns(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getBoardItems", "Get items on a specific board", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)"),
            boardId: zod_1.z.string().describe("ID of the board")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getBoardItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("moveCardOnBoard", "Move a card on a board", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)"),
            boardId: zod_1.z.string().describe("ID of the board"),
            workItemId: zod_1.z.number().describe("ID of the work item to move"),
            columnId: zod_1.z.string().describe("ID of the column to move to"),
            position: zod_1.z.number().optional().describe("Position within the column")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.moveCardOnBoard(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getSprints", "Get all sprints for a team", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getSprints(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getCurrentSprint", "Get the current sprint", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getCurrentSprint(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getSprintWorkItems", "Get work items in a specific sprint", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)"),
            sprintId: zod_1.z.string().describe("ID of the sprint")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getSprintWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getSprintCapacity", "Get capacity for a specific sprint", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)"),
            sprintId: zod_1.z.string().describe("ID of the sprint")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getSprintCapacity(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getTeamMembers", "Get members of a team", {
            teamId: zod_1.z.string().optional().describe("Team ID (uses default team if not specified)")
        }, async (params, extra) => {
            const result = await boardsSprintsTools.getTeamMembers(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        // Register Project Tools
        server.tool("listProjects", "List all projects", {
            stateFilter: zod_1.z.enum(['all', 'createPending', 'deleted', 'deleting', 'new', 'unchanged', 'wellFormed']).optional().describe("Filter by project state"),
            top: zod_1.z.number().optional().describe("Maximum number of projects to return"),
            skip: zod_1.z.number().optional().describe("Number of projects to skip")
        }, async (params, extra) => {
            const result = await projectTools.listProjects(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getProjectDetails", "Get details of a specific project", {
            projectId: zod_1.z.string().describe("ID of the project"),
            includeCapabilities: zod_1.z.boolean().optional().describe("Include project capabilities"),
            includeHistory: zod_1.z.boolean().optional().describe("Include project history")
        }, async (params, extra) => {
            const result = await projectTools.getProjectDetails(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createProject", "Create a new project", {
            name: zod_1.z.string().describe("Name of the project"),
            description: zod_1.z.string().optional().describe("Description of the project"),
            visibility: zod_1.z.enum(['private', 'public']).optional().describe("Visibility of the project"),
            capabilities: zod_1.z.record(zod_1.z.any()).optional().describe("Project capabilities"),
            processTemplateId: zod_1.z.string().optional().describe("Process template ID")
        }, async (params, extra) => {
            const result = await projectTools.createProject(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getAreas", "Get areas for a project", {
            projectId: zod_1.z.string().describe("ID of the project"),
            depth: zod_1.z.number().optional().describe("Maximum depth of the area hierarchy")
        }, async (params, extra) => {
            const result = await projectTools.getAreas(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getIterations", "Get iterations for a project", {
            projectId: zod_1.z.string().describe("ID of the project"),
            includeDeleted: zod_1.z.boolean().optional().describe("Include deleted iterations")
        }, async (params, extra) => {
            const result = await projectTools.getIterations(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createArea", "Create a new area in a project", {
            projectId: zod_1.z.string().describe("ID of the project"),
            name: zod_1.z.string().describe("Name of the area"),
            parentPath: zod_1.z.string().optional().describe("Path of the parent area")
        }, async (params, extra) => {
            const result = await projectTools.createArea(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createIteration", "Create a new iteration in a project", {
            projectId: zod_1.z.string().describe("ID of the project"),
            name: zod_1.z.string().describe("Name of the iteration"),
            parentPath: zod_1.z.string().optional().describe("Path of the parent iteration"),
            startDate: zod_1.z.string().optional().describe("Start date of the iteration"),
            finishDate: zod_1.z.string().optional().describe("End date of the iteration")
        }, async (params, extra) => {
            const result = await projectTools.createIteration(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getProcesses", "Get all processes", {
            expandIcon: zod_1.z.boolean().optional().describe("Include process icons")
        }, async (params, extra) => {
            const result = await projectTools.getProcesses(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getWorkItemTypes", "Get work item types for a process", {
            processId: zod_1.z.string().describe("ID of the process")
        }, async (params, extra) => {
            const result = await projectTools.getWorkItemTypes(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getWorkItemTypeFields", "Get fields for a work item type", {
            processId: zod_1.z.string().describe("ID of the process"),
            witRefName: zod_1.z.string().describe("Reference name of the work item type")
        }, async (params, extra) => {
            const result = await projectTools.getWorkItemTypeFields(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        // Register Git Tools
        server.tool("listRepositories", "List all repositories", {
            projectId: zod_1.z.string().optional().describe("Filter by project"),
            includeHidden: zod_1.z.boolean().optional().describe("Include hidden repositories"),
            includeAllUrls: zod_1.z.boolean().optional().describe("Include all URLs")
        }, async (params, extra) => {
            const result = await gitTools.listRepositories(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getRepository", "Get details of a specific repository", {
            projectId: zod_1.z.string().describe("ID of the project"),
            repositoryId: zod_1.z.string().describe("ID of the repository")
        }, async (params, extra) => {
            const result = await gitTools.getRepository(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createRepository", "Create a new repository", {
            name: zod_1.z.string().describe("Name of the repository"),
            projectId: zod_1.z.string().describe("ID of the project")
        }, async (params, extra) => {
            const result = await gitTools.createRepository(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("listBranches", "List branches in a repository", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            filter: zod_1.z.string().optional().describe("Filter branches by name"),
            top: zod_1.z.number().optional().describe("Maximum number of branches to return")
        }, async (params, extra) => {
            const result = await gitTools.listBranches(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("searchCode", "Search for code in repositories", {
            searchText: zod_1.z.string().describe("Text to search for"),
            projectId: zod_1.z.string().optional().describe("ID of the project"),
            repositoryId: zod_1.z.string().optional().describe("ID of the repository"),
            fileExtension: zod_1.z.string().optional().describe("File extension to filter by"),
            top: zod_1.z.number().optional().describe("Maximum number of results to return")
        }, async (params, extra) => {
            const result = await gitTools.searchCode(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("browseRepository", "Browse the contents of a repository", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            path: zod_1.z.string().optional().describe("Path within the repository"),
            versionDescriptor: zod_1.z.object({
                version: zod_1.z.string().optional().describe("Version (branch, tag, or commit)"),
                versionOptions: zod_1.z.string().optional().describe("Version options"),
                versionType: zod_1.z.string().optional().describe("Version type")
            }).optional().describe("Version descriptor")
        }, async (params, extra) => {
            const result = await gitTools.browseRepository(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getFileContent", "Get the content of a file", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            path: zod_1.z.string().describe("Path to the file"),
            versionDescriptor: zod_1.z.object({
                version: zod_1.z.string().optional().describe("Version (branch, tag, or commit)"),
                versionOptions: zod_1.z.string().optional().describe("Version options"),
                versionType: zod_1.z.string().optional().describe("Version type")
            }).optional().describe("Version descriptor")
        }, async (params, extra) => {
            const result = await gitTools.getFileContent(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getCommitHistory", "Get commit history for a repository", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            itemPath: zod_1.z.string().optional().describe("Path to filter commits by"),
            top: zod_1.z.number().optional().describe("Maximum number of commits to return"),
            skip: zod_1.z.number().optional().describe("Number of commits to skip")
        }, async (params, extra) => {
            const result = await gitTools.getCommitHistory(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("listPullRequests", "List pull requests", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            status: zod_1.z.enum(['abandoned', 'active', 'all', 'completed', 'notSet']).optional().describe("Filter by status"),
            creatorId: zod_1.z.string().optional().describe("Filter by creator"),
            reviewerId: zod_1.z.string().optional().describe("Filter by reviewer"),
            top: zod_1.z.number().optional().describe("Maximum number of pull requests to return"),
            skip: zod_1.z.number().optional().describe("Number of pull requests to skip")
        }, async (params, extra) => {
            const result = await gitTools.listPullRequests(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createPullRequest", "Create a new pull request", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            sourceRefName: zod_1.z.string().describe("Source branch"),
            targetRefName: zod_1.z.string().describe("Target branch"),
            title: zod_1.z.string().describe("Title of the pull request"),
            description: zod_1.z.string().optional().describe("Description of the pull request"),
            reviewers: zod_1.z.array(zod_1.z.string()).optional().describe("List of reviewers")
        }, async (params, extra) => {
            const result = await gitTools.createPullRequest(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getPullRequest", "Get details of a specific pull request", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            pullRequestId: zod_1.z.number().describe("ID of the pull request")
        }, async (params, extra) => {
            const result = await gitTools.getPullRequest(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getPullRequestComments", "Get comments on a pull request", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            pullRequestId: zod_1.z.number().describe("ID of the pull request"),
            threadId: zod_1.z.number().optional().describe("ID of a specific thread"),
            top: zod_1.z.number().optional().describe("Maximum number of comments to return"),
            skip: zod_1.z.number().optional().describe("Number of comments to skip")
        }, async (params, extra) => {
            const result = await gitTools.getPullRequestComments(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("approvePullRequest", "Approve a pull request", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            pullRequestId: zod_1.z.number().describe("ID of the pull request")
        }, async (params, extra) => {
            const result = await gitTools.approvePullRequest(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("mergePullRequest", "Merge a pull request", {
            repositoryId: zod_1.z.string().describe("ID of the repository"),
            pullRequestId: zod_1.z.number().describe("ID of the pull request"),
            mergeStrategy: zod_1.z.enum(['noFastForward', 'rebase', 'rebaseMerge', 'squash']).optional().describe("Merge strategy"),
            comment: zod_1.z.string().optional().describe("Comment for the merge commit")
        }, async (params, extra) => {
            const result = await gitTools.mergePullRequest(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        // Register Testing Capabilities Tools
        server.tool("runAutomatedTests", "Execute automated test suites", {
            testSuiteId: zod_1.z.number().optional().describe("ID of the test suite to run"),
            testPlanId: zod_1.z.number().optional().describe("ID of the test plan to run"),
            testEnvironment: zod_1.z.string().optional().describe("Environment to run tests in"),
            parallelExecution: zod_1.z.boolean().optional().describe("Whether to run tests in parallel")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.runAutomatedTests(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getTestAutomationStatus", "Check status of automated test execution", {
            testRunId: zod_1.z.number().describe("ID of the test run to check status for")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.getTestAutomationStatus(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("configureTestAgents", "Configure and manage test agents", {
            agentName: zod_1.z.string().describe("Name of the test agent to configure"),
            capabilities: zod_1.z.record(zod_1.z.any()).optional().describe("Capabilities to set for the agent"),
            enabled: zod_1.z.boolean().optional().describe("Whether the agent should be enabled")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.configureTestAgents(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createTestDataGenerator", "Generate test data for automated tests", {
            name: zod_1.z.string().describe("Name of the test data generator"),
            dataSchema: zod_1.z.record(zod_1.z.any()).describe("Schema for the test data to generate"),
            recordCount: zod_1.z.number().optional().describe("Number of records to generate")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.createTestDataGenerator(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("manageTestEnvironments", "Manage test environments for different test types", {
            environmentName: zod_1.z.string().describe("Name of the test environment"),
            action: zod_1.z.enum(['create', 'update', 'delete']).describe("Action to perform"),
            properties: zod_1.z.record(zod_1.z.any()).optional().describe("Properties for the environment")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.manageTestEnvironments(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getTestFlakiness", "Analyze and report on test flakiness", {
            testId: zod_1.z.number().optional().describe("ID of a specific test to analyze"),
            testRunIds: zod_1.z.array(zod_1.z.number()).optional().describe("Specific test runs to analyze"),
            timeRange: zod_1.z.string().optional().describe("Time range for analysis (e.g., '30d')")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.getTestFlakiness(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getTestGapAnalysis", "Identify gaps in test coverage", {
            areaPath: zod_1.z.string().optional().describe("Area path to analyze"),
            codeChangesOnly: zod_1.z.boolean().optional().describe("Only analyze recent code changes")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.getTestGapAnalysis(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("runTestImpactAnalysis", "Determine which tests to run based on code changes", {
            buildId: zod_1.z.number().describe("ID of the build to analyze"),
            changedFiles: zod_1.z.array(zod_1.z.string()).optional().describe("List of changed files")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.runTestImpactAnalysis(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getTestHealthDashboard", "View overall test health metrics", {
            timeRange: zod_1.z.string().optional().describe("Time range for metrics (e.g., '90d')"),
            includeTrends: zod_1.z.boolean().optional().describe("Include trend data")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.getTestHealthDashboard(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("runTestOptimization", "Optimize test suite execution for faster feedback", {
            testPlanId: zod_1.z.number().describe("ID of the test plan to optimize"),
            optimizationGoal: zod_1.z.enum(['time', 'coverage', 'reliability']).describe("Optimization goal")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.runTestOptimization(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("createExploratorySessions", "Create new exploratory testing sessions", {
            title: zod_1.z.string().describe("Title of the exploratory session"),
            description: zod_1.z.string().optional().describe("Description of the session"),
            areaPath: zod_1.z.string().optional().describe("Area path for the session")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.createExploratorySessions(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("recordExploratoryTestResults", "Record findings during exploratory testing", {
            sessionId: zod_1.z.number().describe("ID of the exploratory session"),
            findings: zod_1.z.array(zod_1.z.string()).describe("List of findings to record"),
            attachments: zod_1.z.array(zod_1.z.any()).optional().describe("Attachments for the findings")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.recordExploratoryTestResults(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("convertFindingsToWorkItems", "Convert exploratory test findings to work items", {
            sessionId: zod_1.z.number().describe("ID of the exploratory session"),
            findingIds: zod_1.z.array(zod_1.z.number()).describe("IDs of findings to convert"),
            workItemType: zod_1.z.string().optional().describe("Type of work item to create")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.convertFindingsToWorkItems(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        server.tool("getExploratoryTestStatistics", "Get statistics on exploratory testing activities", {
            timeRange: zod_1.z.string().optional().describe("Time range for statistics (e.g., '90d')"),
            userId: zod_1.z.string().optional().describe("Filter by specific user")
        }, async (params, extra) => {
            const result = await testingCapabilitiesTools.getExploratoryTestStatistics(params);
            return {
                content: result.content,
                rawData: result.rawData,
                isError: result.isError
            };
        });
        console.log(`Registered tools`);
        // Create a transport (use stdio for simplicity)
        console.log('Creating StdioServerTransport');
        const transport = new stdio_js_1.StdioServerTransport();
        // Connect to the transport and start listening
        console.log('Connecting to transport...');
        await server.connect(transport);
        console.log('Connected to transport');
    }
    catch (error) {
        console.error('Error starting MCP server:', error);
        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}
// Set an environment variable to indicate we're in MCP mode
// This helps prevent console.log from interfering with stdio communication
process.env.MCP_MODE = 'true';
// Run the server
main();
//# sourceMappingURL=index.js.map