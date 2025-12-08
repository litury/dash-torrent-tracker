declare module 'dash-platform-sdk/bundle.min.js' {
  export interface DashPlatformSDKOptions {
    network: string
  }

  export interface Document {
    id: {
      base58: () => string
    }
    ownerId: {
      base58: () => string
    }
    properties: Record<string, unknown>
    updatedAt: {
      toString: () => string
    }
  }

  export class DashPlatformSDK {
    constructor(options: DashPlatformSDKOptions)

    documents: {
      query: (
        dataContract: string,
        documentType: string,
        where?: unknown,
        orderBy?: unknown,
        limit?: number
      ) => Promise<Document[]>
      create: (
        dataContract: string,
        documentType: string,
        data: Record<string, unknown>,
        ownerId: string,
        nonce: bigint
      ) => Promise<Document>
      createStateTransition: (
        document: Document,
        action: number,
        options?: { identityContractNonce?: bigint }
      ) => Promise<unknown>
    }

    identities: {
      getIdentityContractNonce: (
        identityId: string,
        dataContractId: string
      ) => Promise<bigint>
    }
  }
}
