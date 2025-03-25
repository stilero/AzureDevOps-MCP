import * as azdev from 'azure-devops-node-api';
import { WorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import { AzureDevOpsConfig, RawWorkItemResponse } from '../Interfaces/AzureDevOps';

export class AzureDevOpsService {
  private connection: azdev.WebApi;
  private config: AzureDevOpsConfig;

  constructor(config: AzureDevOpsConfig) {
    this.config = config;
    this.connection = new azdev.WebApi(
      config.orgUrl,
      azdev.getPersonalAccessTokenHandler(config.personalAccessToken)
    );
  }

  /**
   * Get the WorkItemTracking API client
   */
  private async getWorkItemTrackingApi(): Promise<WorkItemTrackingApi> {
    return await this.connection.getWorkItemTrackingApi();
  }

  /**
   * List work items based on a WIQL query
   */
  public async listWorkItems(wiqlQuery: string): Promise<RawWorkItemResponse> {
    try {
      const witApi = await this.getWorkItemTrackingApi();
      
      // Execute the WIQL query
      const queryResult = await witApi.queryByWiql({
        query: wiqlQuery
      }, {
        project: this.config.project
      });
      
      // Return the work items
      return {
        workItems: queryResult.workItems || [],
        count: queryResult.workItems?.length || 0
      };
    } catch (error) {
      console.error('Error listing work items:', error);
      throw error;
    }
  }
} 