import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getAzureDevOpsConfig } from './config';
import { WorkItemTools } from './Tools/WorkItemTools';
import { BoardsSprintsTools } from './Tools/BoardsSprintsTools';
import { ProjectTools } from './Tools/ProjectTools';
import { GitTools } from './Tools/GitTools';
import { z } from 'zod';

async function main() {
  try {
    // Log startup info
    console.log('Starting MCP server for Azure DevOps...');
    
    // Load configuration
    const azureDevOpsConfig = getAzureDevOpsConfig();
    console.log('Successfully loaded Azure DevOps configuration');
    
    // Initialize tools
    const workItemTools = new WorkItemTools(azureDevOpsConfig);
    const boardsSprintsTools = new BoardsSprintsTools(azureDevOpsConfig);
    const projectTools = new ProjectTools(azureDevOpsConfig);
    const gitTools = new GitTools(azureDevOpsConfig);
    
    console.log('Initialized tools');

    // Create MCP server
    const server = new McpServer({
      name: 'azure-devops-mcp',
      version: '1.0.0',
      description: 'MCP server for Azure DevOps integration',
    });

    // Register Work Item Tools
    server.tool("listWorkItems", 
      "List work items based on a WIQL query",
      {
        query: z.string().describe("WIQL query to get work items")
      },
      async (params, extra) => {
        const result = await workItemTools.listWorkItems({ query: params.query });
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getWorkItemById", 
      "Get a specific work item by ID",
      {
        id: z.number().describe("Work item ID")
      },
      async (params, extra) => {
        const result = await workItemTools.getWorkItemById({ id: params.id });
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("searchWorkItems", 
      "Search for work items by text",
      {
        searchText: z.string().describe("Text to search for in work items"),
        top: z.number().optional().describe("Maximum number of work items to return")
      },
      async (params, extra) => {
        const result = await workItemTools.searchWorkItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getRecentlyUpdatedWorkItems", 
      "Get recently updated work items",
      {
        top: z.number().optional().describe("Maximum number of work items to return"),
        skip: z.number().optional().describe("Number of work items to skip")
      },
      async (params, extra) => {
        const result = await workItemTools.getRecentlyUpdatedWorkItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getMyWorkItems", 
      "Get work items assigned to you",
      {
        state: z.string().optional().describe("Filter by work item state"),
        top: z.number().optional().describe("Maximum number of work items to return")
      },
      async (params, extra) => {
        const result = await workItemTools.getMyWorkItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createWorkItem", 
      "Create a new work item",
      {
        workItemType: z.string().describe("Type of work item to create"),
        title: z.string().describe("Title of the work item"),
        description: z.string().optional().describe("Description of the work item"),
        assignedTo: z.string().optional().describe("User to assign the work item to"),
        state: z.string().optional().describe("Initial state of the work item"),
        areaPath: z.string().optional().describe("Area path for the work item"),
        iterationPath: z.string().optional().describe("Iteration path for the work item"),
        additionalFields: z.record(z.any()).optional().describe("Additional fields to set on the work item")
      },
      async (params, extra) => {
        const result = await workItemTools.createWorkItem(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("updateWorkItem", 
      "Update an existing work item",
      {
        id: z.number().describe("ID of the work item to update"),
        fields: z.record(z.any()).describe("Fields to update on the work item")
      },
      async (params, extra) => {
        const result = await workItemTools.updateWorkItem(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("addWorkItemComment", 
      "Add a comment to a work item",
      {
        id: z.number().describe("ID of the work item"),
        text: z.string().describe("Comment text")
      },
      async (params, extra) => {
        const result = await workItemTools.addWorkItemComment(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("updateWorkItemState", 
      "Update the state of a work item",
      {
        id: z.number().describe("ID of the work item"),
        state: z.string().describe("New state for the work item"),
        comment: z.string().optional().describe("Comment explaining the state change")
      },
      async (params, extra) => {
        const result = await workItemTools.updateWorkItemState(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("assignWorkItem", 
      "Assign a work item to a user",
      {
        id: z.number().describe("ID of the work item"),
        assignedTo: z.string().describe("User to assign the work item to")
      },
      async (params, extra) => {
        const result = await workItemTools.assignWorkItem(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createLink", 
      "Create a link between work items",
      {
        sourceId: z.number().describe("ID of the source work item"),
        targetId: z.number().describe("ID of the target work item"),
        linkType: z.string().describe("Type of link to create"),
        comment: z.string().optional().describe("Comment explaining the link")
      },
      async (params, extra) => {
        const result = await workItemTools.createLink(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("bulkCreateWorkItems", 
      "Create or update multiple work items in a single operation",
      {
        workItems: z.array(z.any()).describe("Array of work items to create or update")
      },
      async (params, extra) => {
        const result = await workItemTools.bulkCreateWorkItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    // Register Boards & Sprints Tools
    server.tool("getBoards", 
      "Get all boards for a team",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getBoards(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getBoardColumns", 
      "Get columns for a specific board",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)"),
        boardId: z.string().describe("ID of the board")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getBoardColumns(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getBoardItems", 
      "Get items on a specific board",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)"),
        boardId: z.string().describe("ID of the board")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getBoardItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("moveCardOnBoard", 
      "Move a card on a board",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)"),
        boardId: z.string().describe("ID of the board"),
        workItemId: z.number().describe("ID of the work item to move"),
        columnId: z.string().describe("ID of the column to move to"),
        position: z.number().optional().describe("Position within the column")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.moveCardOnBoard(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getSprints", 
      "Get all sprints for a team",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getSprints(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getCurrentSprint", 
      "Get the current sprint",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getCurrentSprint(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getSprintWorkItems", 
      "Get work items in a specific sprint",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)"),
        sprintId: z.string().describe("ID of the sprint")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getSprintWorkItems(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getSprintCapacity", 
      "Get capacity for a specific sprint",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)"),
        sprintId: z.string().describe("ID of the sprint")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getSprintCapacity(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getTeamMembers", 
      "Get members of a team",
      {
        teamId: z.string().optional().describe("Team ID (uses default team if not specified)")
      },
      async (params, extra) => {
        const result = await boardsSprintsTools.getTeamMembers(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    // Register Project Tools
    server.tool("listProjects", 
      "List all projects",
      {
        stateFilter: z.enum(['all', 'createPending', 'deleted', 'deleting', 'new', 'unchanged', 'wellFormed']).optional().describe("Filter by project state"),
        top: z.number().optional().describe("Maximum number of projects to return"),
        skip: z.number().optional().describe("Number of projects to skip")
      },
      async (params, extra) => {
        const result = await projectTools.listProjects(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getProjectDetails", 
      "Get details of a specific project",
      {
        projectId: z.string().describe("ID of the project"),
        includeCapabilities: z.boolean().optional().describe("Include project capabilities"),
        includeHistory: z.boolean().optional().describe("Include project history")
      },
      async (params, extra) => {
        const result = await projectTools.getProjectDetails(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createProject", 
      "Create a new project",
      {
        name: z.string().describe("Name of the project"),
        description: z.string().optional().describe("Description of the project"),
        visibility: z.enum(['private', 'public']).optional().describe("Visibility of the project"),
        capabilities: z.record(z.any()).optional().describe("Project capabilities"),
        processTemplateId: z.string().optional().describe("Process template ID")
      },
      async (params, extra) => {
        const result = await projectTools.createProject(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getAreas", 
      "Get areas for a project",
      {
        projectId: z.string().describe("ID of the project"),
        depth: z.number().optional().describe("Maximum depth of the area hierarchy")
      },
      async (params, extra) => {
        const result = await projectTools.getAreas(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getIterations", 
      "Get iterations for a project",
      {
        projectId: z.string().describe("ID of the project"),
        includeDeleted: z.boolean().optional().describe("Include deleted iterations")
      },
      async (params, extra) => {
        const result = await projectTools.getIterations(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createArea", 
      "Create a new area in a project",
      {
        projectId: z.string().describe("ID of the project"),
        name: z.string().describe("Name of the area"),
        parentPath: z.string().optional().describe("Path of the parent area")
      },
      async (params, extra) => {
        const result = await projectTools.createArea(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createIteration", 
      "Create a new iteration in a project",
      {
        projectId: z.string().describe("ID of the project"),
        name: z.string().describe("Name of the iteration"),
        parentPath: z.string().optional().describe("Path of the parent iteration"),
        startDate: z.string().optional().describe("Start date of the iteration"),
        finishDate: z.string().optional().describe("End date of the iteration")
      },
      async (params, extra) => {
        const result = await projectTools.createIteration(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getProcesses", 
      "Get all processes",
      {
        expandIcon: z.boolean().optional().describe("Include process icons")
      },
      async (params, extra) => {
        const result = await projectTools.getProcesses(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getWorkItemTypes", 
      "Get work item types for a process",
      {
        processId: z.string().describe("ID of the process")
      },
      async (params, extra) => {
        const result = await projectTools.getWorkItemTypes(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getWorkItemTypeFields", 
      "Get fields for a work item type",
      {
        processId: z.string().describe("ID of the process"),
        witRefName: z.string().describe("Reference name of the work item type")
      },
      async (params, extra) => {
        const result = await projectTools.getWorkItemTypeFields(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    // Register Git Tools
    server.tool("listRepositories", 
      "List all repositories",
      {
        projectId: z.string().optional().describe("Filter by project"),
        includeHidden: z.boolean().optional().describe("Include hidden repositories"),
        includeAllUrls: z.boolean().optional().describe("Include all URLs")
      },
      async (params, extra) => {
        const result = await gitTools.listRepositories(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getRepository", 
      "Get details of a specific repository",
      {
        projectId: z.string().describe("ID of the project"),
        repositoryId: z.string().describe("ID of the repository")
      },
      async (params, extra) => {
        const result = await gitTools.getRepository(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createRepository", 
      "Create a new repository",
      {
        name: z.string().describe("Name of the repository"),
        projectId: z.string().describe("ID of the project")
      },
      async (params, extra) => {
        const result = await gitTools.createRepository(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("listBranches", 
      "List branches in a repository",
      {
        repositoryId: z.string().describe("ID of the repository"),
        filter: z.string().optional().describe("Filter branches by name"),
        top: z.number().optional().describe("Maximum number of branches to return")
      },
      async (params, extra) => {
        const result = await gitTools.listBranches(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("searchCode", 
      "Search for code in repositories",
      {
        searchText: z.string().describe("Text to search for"),
        projectId: z.string().optional().describe("ID of the project"),
        repositoryId: z.string().optional().describe("ID of the repository"),
        fileExtension: z.string().optional().describe("File extension to filter by"),
        top: z.number().optional().describe("Maximum number of results to return")
      },
      async (params, extra) => {
        const result = await gitTools.searchCode(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("browseRepository", 
      "Browse the contents of a repository",
      {
        repositoryId: z.string().describe("ID of the repository"),
        path: z.string().optional().describe("Path within the repository"),
        versionDescriptor: z.object({
          version: z.string().optional().describe("Version (branch, tag, or commit)"),
          versionOptions: z.string().optional().describe("Version options"),
          versionType: z.string().optional().describe("Version type")
        }).optional().describe("Version descriptor")
      },
      async (params, extra) => {
        const result = await gitTools.browseRepository(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getFileContent", 
      "Get the content of a file",
      {
        repositoryId: z.string().describe("ID of the repository"),
        path: z.string().describe("Path to the file"),
        versionDescriptor: z.object({
          version: z.string().optional().describe("Version (branch, tag, or commit)"),
          versionOptions: z.string().optional().describe("Version options"),
          versionType: z.string().optional().describe("Version type")
        }).optional().describe("Version descriptor")
      },
      async (params, extra) => {
        const result = await gitTools.getFileContent(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getCommitHistory", 
      "Get commit history for a repository",
      {
        repositoryId: z.string().describe("ID of the repository"),
        itemPath: z.string().optional().describe("Path to filter commits by"),
        top: z.number().optional().describe("Maximum number of commits to return"),
        skip: z.number().optional().describe("Number of commits to skip")
      },
      async (params, extra) => {
        const result = await gitTools.getCommitHistory(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("listPullRequests", 
      "List pull requests",
      {
        repositoryId: z.string().describe("ID of the repository"),
        status: z.enum(['abandoned', 'active', 'all', 'completed', 'notSet']).optional().describe("Filter by status"),
        creatorId: z.string().optional().describe("Filter by creator"),
        reviewerId: z.string().optional().describe("Filter by reviewer"),
        top: z.number().optional().describe("Maximum number of pull requests to return"),
        skip: z.number().optional().describe("Number of pull requests to skip")
      },
      async (params, extra) => {
        const result = await gitTools.listPullRequests(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("createPullRequest", 
      "Create a new pull request",
      {
        repositoryId: z.string().describe("ID of the repository"),
        sourceRefName: z.string().describe("Source branch"),
        targetRefName: z.string().describe("Target branch"),
        title: z.string().describe("Title of the pull request"),
        description: z.string().optional().describe("Description of the pull request"),
        reviewers: z.array(z.string()).optional().describe("List of reviewers")
      },
      async (params, extra) => {
        const result = await gitTools.createPullRequest(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getPullRequest", 
      "Get details of a specific pull request",
      {
        repositoryId: z.string().describe("ID of the repository"),
        pullRequestId: z.number().describe("ID of the pull request")
      },
      async (params, extra) => {
        const result = await gitTools.getPullRequest(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("getPullRequestComments", 
      "Get comments on a pull request",
      {
        repositoryId: z.string().describe("ID of the repository"),
        pullRequestId: z.number().describe("ID of the pull request"),
        threadId: z.number().optional().describe("ID of a specific thread"),
        top: z.number().optional().describe("Maximum number of comments to return"),
        skip: z.number().optional().describe("Number of comments to skip")
      },
      async (params, extra) => {
        const result = await gitTools.getPullRequestComments(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("approvePullRequest", 
      "Approve a pull request",
      {
        repositoryId: z.string().describe("ID of the repository"),
        pullRequestId: z.number().describe("ID of the pull request")
      },
      async (params, extra) => {
        const result = await gitTools.approvePullRequest(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    server.tool("mergePullRequest", 
      "Merge a pull request",
      {
        repositoryId: z.string().describe("ID of the repository"),
        pullRequestId: z.number().describe("ID of the pull request"),
        mergeStrategy: z.enum(['noFastForward', 'rebase', 'rebaseMerge', 'squash']).optional().describe("Merge strategy"),
        comment: z.string().optional().describe("Comment for the merge commit")
      },
      async (params, extra) => {
        const result = await gitTools.mergePullRequest(params);
        return {
          content: result.content,
          rawData: result.rawData,
          isError: result.isError
        };
      }
    );
    
    console.log(`Registered tools`);

    // Create a transport (use stdio for simplicity)
    console.log('Creating StdioServerTransport');
    const transport = new StdioServerTransport();
    
    // Connect to the transport and start listening
    console.log('Connecting to transport...');
    await server.connect(transport);
    console.log('Connected to transport');

  } catch (error) {
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