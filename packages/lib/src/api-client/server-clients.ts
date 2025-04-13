import { BaseApiClient } from "./base-client";

// packages/lib/src/api-client/server-clients.ts
export class ServerPublicApiClient extends BaseApiClient {
  constructor(basePrefix?: string) {
    super({
      basePrefix,
      isProtected: false,
      isServer: true,
    });
  }
}

export class ServerPrivateApiClient extends BaseApiClient {
  constructor(basePrefix?: string) {
    super({
      basePrefix,
      isProtected: true,
      isServer: true,
    });
  }
}
