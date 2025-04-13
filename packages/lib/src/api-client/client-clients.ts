import { BaseApiClient } from "./base-client";

// packages/lib/src/api-client/client-clients.ts
export class ClientPublicApiClient extends BaseApiClient {
  constructor(basePrefix?: string) {
    super({
      basePrefix,
      isProtected: false,
      isServer: false
    });
  }
}

export class ClientPrivateApiClient extends BaseApiClient {
  constructor(basePrefix?: string) {
    super({
      basePrefix,
      isProtected: true,
      isServer: false
    });
  }
}


