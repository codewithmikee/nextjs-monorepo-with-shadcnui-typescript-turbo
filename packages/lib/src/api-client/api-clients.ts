import { ClientPublicApiClient, ClientPrivateApiClient } from "./client-clients";
import { ServerPublicApiClient, ServerPrivateApiClient } from "./server-clients";

// packages/lib/src/api-client/index.ts

export const autClientApi = new ClientPublicApiClient('auth')
export const publicClientApi = new ClientPublicApiClient()
export const privateClientApi = new ClientPrivateApiClient()


type DashboardData = {
 total: number,
 revenue: number,
}

type FilterData = {
  start_date: string,
  end_date: string,
  shopId: string,
}


export const getDashboardData = async (filterData?: FilterData) => {
  const response = await privateClientApi.get<DashboardData>('dashboard', {
    queryParams: filterData
  });
  return response;
}

export const authServerSideApi = new ServerPublicApiClient('auth')

export const publicServerSideApi = new ServerPublicApiClient()
export const privateServerSideApi = new ServerPrivateApiClient()

