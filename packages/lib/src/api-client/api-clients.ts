import { ClientPublicApiClient, ClientPrivateApiClient } from "./client-clients";
import { ServerPublicApiClient, ServerPrivateApiClient } from "./server-clients";

// packages/lib/src/api-client/index.ts

export const autClientApi = new ClientPublicApiClient('auth')
export const publicClientApi = new ClientPublicApiClient()
export const privateClientApi = new ClientPrivateApiClient()



export const publicServerSideApi = new ServerPublicApiClient()
export const privateServerSideApi = new ServerPrivateApiClient()

