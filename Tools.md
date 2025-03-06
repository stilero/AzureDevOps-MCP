# Azure DevOps MCP Tool Integrations

This document outlines potential Azure DevOps integrations that could be implemented in the MCP server, organized by category.

## Work Items

### Queries and Search
- **listWorkItems** - Query work items using WIQL (already implemented)
- **getWorkItemById** - Retrieve a specific work item by ID
- **searchWorkItems** - Free text search across work items
- **getRecentlyUpdatedWorkItems** - List recently updated work items
- **getMyWorkItems** - List work items assigned to the current user

### Creation and Updates
- **createWorkItem** - Create a new work item
- **updateWorkItem** - Update an existing work item
- **addWorkItemComment** - Add a comment to a work item
- **updateWorkItemState** - Change the state of a work item
- **assignWorkItem** - Assign a work item to a user
- **addAttachment** - Add an attachment to a work item
- **createLink** - Create a link between work items

### Bulk Operations
- **bulkCreateWorkItems** - Create multiple work items
- **bulkUpdateWorkItems** - Update multiple work items
- **exportWorkItems** - Export work items to CSV or JSON

## Boards and Sprints

### Boards
- **getBoards** - List all boards
- **getBoardColumns** - Get columns for a specific board
- **getBoardItems** - Get all items on a board
- **moveCardOnBoard** - Move a card to a different column

### Sprints
- **getSprints** - List all sprints
- **getCurrentSprint** - Get the current sprint
- **getSprintWorkItems** - Get work items in a sprint
- **getSprintCapacity** - Get team capacity for a sprint
- **getSprintBurndown** - Get burndown chart data for a sprint
- **forecastSprintCapacity** - Forecast team capacity based on historical data

### Team Management
- **getTeams** - List all teams
- **getTeamMembers** - Get members of a team
- **getTeamActivity** - Get recent team activity
- **getTeamCapacity** - Get capacity for a team

## Project Management

### Projects
- **listProjects** - List all projects
- **getProjectDetails** - Get details of a specific project
- **createProject** - Create a new project
- **getProjectProcessTemplate** - Get the process template for a project

### Areas and Iterations
- **getAreas** - Get the area hierarchy
- **getIterations** - Get the iteration hierarchy
- **createArea** - Create a new area
- **createIteration** - Create a new iteration

### Process
- **getProcesses** - Get all processes
- **getWorkItemTypes** - Get all work item types for a process
- **getWorkItemTypeFields** - Get all fields for a work item type
- **getWorkItemTypeStates** - Get all states for a work item type

## Code and Repositories

### Repositories
- **listRepositories** - List all Git repositories
- **getRepository** - Get details of a specific repository
- **createRepository** - Create a new repository
- **listBranches** - List all branches in a repository
- **getBranchStats** - Get stats for a branch

### Code Search and Browse
- **searchCode** - Search code across repositories
- **browseRepository** - Browse repository contents
- **getFileContent** - Get content of a specific file
- **getCommitHistory** - Get commit history for a file or branch

### Pull Requests
- **listPullRequests** - List all pull requests
- **createPullRequest** - Create a new pull request
- **getPullRequestById** - Get a specific pull request
- **getPullRequestComments** - Get comments on a pull request
- **approvePullRequest** - Approve a pull request
- **mergePullRequest** - Merge a pull request

### Build and Release

### Builds
- **listBuildDefinitions** - List all build definitions
- **getBuildDefinition** - Get a specific build definition
- **queueBuild** - Queue a new build
- **getBuilds** - Get all builds for a definition
- **getBuildLogs** - Get logs for a build
- **getBuildStatus** - Get status of a build
- **getLatestBuild** - Get the latest build for a definition

### Releases
- **listReleaseDefinitions** - List all release definitions
- **getReleaseDefinition** - Get a specific release definition
- **createRelease** - Create a new release
- **getReleases** - Get all releases for a definition
- **getReleaseStatus** - Get status of a release
- **approveRelease** - Approve a release
- **rejectRelease** - Reject a release

## Test Management

### Test Plans
- **listTestPlans** - List all test plans
- **getTestPlan** - Get a specific test plan
- **createTestPlan** - Create a new test plan
- **listTestSuites** - List test suites in a plan
- **createTestSuite** - Create a new test suite

### Test Cases
- **listTestCases** - List all test cases
- **getTestCase** - Get a specific test case
- **createTestCase** - Create a new test case
- **updateTestCase** - Update a test case

### Test Results
- **getTestResults** - Get test results
- **getTestCoverage** - Get code coverage from tests
- **getTestRuns** - Get test runs
- **createTestRun** - Create a new test run
- **updateTestResults** - Update test results

## Wiki and Documentation

### Wiki
- **listWikis** - List all wikis
- **getWikiPages** - Get all pages in a wiki
- **getWikiPageContent** - Get content of a wiki page
- **createWikiPage** - Create a new wiki page
- **updateWikiPage** - Update a wiki page
- **searchWiki** - Search wiki content

## Analytics and Dashboards

### Dashboards
- **listDashboards** - List all dashboards
- **getDashboard** - Get a specific dashboard
- **createDashboard** - Create a new dashboard
- **getWidgets** - Get widgets on a dashboard

### Analytics
- **getVelocityReport** - Get team velocity report
- **getCumulativeFlowDiagram** - Get cumulative flow diagram data
- **getLeadCycleTimeReport** - Get lead/cycle time report
- **getWorkItemTrends** - Get work item trend analytics
- **getBranchHealthReport** - Get branch health analytics
- **getCodeChurnReport** - Get code churn report

## Advanced Extensibility

### Webhooks
- **listWebhooks** - List all webhooks
- **createWebhook** - Create a new webhook
- **updateWebhook** - Update an existing webhook
- **deleteWebhook** - Delete a webhook

### Security
- **getSecurityGroups** - Get all security groups
- **getUserPermissions** - Get permissions for a user
- **changePermissions** - Change permissions for a user or group

## Implementation Priority Recommendations

### High Priority (Quick Wins)
1. Work item operations (get by ID, update, create)
2. Sprint and board management tools
3. Repository and pull request operations

### Medium Priority
1. Test management operations
2. Build and release operations
3. Analytics and reporting tools

### Lower Priority
1. Wiki operations
2. Advanced security operations
3. Custom extension integrations

## Implementation Notes

When implementing these tools, consider:

1. **Authentication**: Ensure proper scope for PAT tokens
2. **Error Handling**: Provide clear error messages for API failures
3. **Rate Limiting**: Consider Azure DevOps API rate limits
4. **Pagination**: Implement pagination for tools that return large datasets
5. **Caching**: Consider caching results where appropriate
6. **User Experience**: Format responses to be human-readable in conversational contexts 