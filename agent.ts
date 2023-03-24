import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'
import { AskarModule } from '@aries-framework/askar'
import { agentDependencies } from '@aries-framework/react-native'
import {
  Agent,
  AutoAcceptCredential,
  AutoAcceptProof,
  ConnectionsModule,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  KeyDidRegistrar,
  KeyDidResolver,
  LogLevel,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  WebDidResolver,
  WsOutboundTransport,
  utils,
  RecipientModule,
} from '@aries-framework/core'
import {
  AnonCredsModule,
  AnonCredsCredentialFormatService,
  AnonCredsProofFormatService,
} from '@aries-framework/anoncreds'

import { ariesAskar } from '@hyperledger/aries-askar-react-native'
import { anoncreds } from '@hyperledger/anoncreds-react-native'

export const agent = new Agent({
  config: {
    label: 'Demo Agent',
    autoUpdateStorageOnStartup: false,
    walletConfig: {
      id: `demo-agent-${utils.uuid()}`,
      key: 'demo-agent-key',
    },
    // Change to view logs in terminal
    logger: new ConsoleLogger(LogLevel.debug),
  },
  modules: {
    // Storage
    askar: new AskarModule({
      ariesAskar,
    }),

    mediationRecipient: new RecipientModule({
      mediatorInvitationUrl:
        'https://mediator.dev.animo.id/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiIyMDc1MDM4YS05ZGU3LTRiODItYWUxYi1jNzBmNDg4MjYzYTciLCJsYWJlbCI6IkFuaW1vIE1lZGlhdG9yIiwiYWNjZXB0IjpbImRpZGNvbW0vYWlwMSIsImRpZGNvbW0vYWlwMjtlbnY9cmZjMTkiXSwiaGFuZHNoYWtlX3Byb3RvY29scyI6WyJodHRwczovL2RpZGNvbW0ub3JnL2RpZGV4Y2hhbmdlLzEuMCIsImh0dHBzOi8vZGlkY29tbS5vcmcvY29ubmVjdGlvbnMvMS4wIl0sInNlcnZpY2VzIjpbeyJpZCI6IiNpbmxpbmUtMCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vbWVkaWF0b3IuZGV2LmFuaW1vLmlkIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtvSG9RTUphdU5VUE5OV1pQcEw3RGs1SzNtQ0NDMlBpNDJGY3FwR25iampMcSJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiJ3c3M6Ly9tZWRpYXRvci5kZXYuYW5pbW8uaWQiLCJ0eXBlIjoiZGlkLWNvbW11bmljYXRpb24iLCJyZWNpcGllbnRLZXlzIjpbImRpZDprZXk6ejZNa29Ib1FNSmF1TlVQTk5XWlBwTDdEazVLM21DQ0MyUGk0MkZjcXBHbmJqakxxIl0sInJvdXRpbmdLZXlzIjpbXX1dfQ',
    }),

    // Connections module is enabled by default, but we can
    // override the default configuration
    connections: new ConnectionsModule({
      autoAcceptConnections: true,
    }),

    // Credentials module is enabled by default, but we can
    // override the default configuration
    credentials: new CredentialsModule({
      autoAcceptCredentials: AutoAcceptCredential.Always,

      // Support v2 protocol
      credentialProtocols: [
        new V2CredentialProtocol({
          credentialFormats: [new AnonCredsCredentialFormatService()],
        }),
      ],
    }),

    // Proofs module is enabled by default, but we can
    // override the default configuration
    proofs: new ProofsModule({
      autoAcceptProofs: AutoAcceptProof.Always,

      // Support v2 protocol
      proofProtocols: [
        new V2ProofProtocol({
          proofFormats: [new AnonCredsProofFormatService()],
        }),
      ],
    }),

    // Dids
    dids: new DidsModule({
      // Support creation of did:key dids
      // FIXME: add cheqd did resolver
      registrars: [new KeyDidRegistrar()],
      // Support resolving of did:indy, did:sov, did:key and did:web dids
      // FIXME: add cheqd did registrar
      resolvers: [new KeyDidResolver(), new WebDidResolver()],
    }),

    // AnonCreds
    anoncreds: new AnonCredsModule({
      // Support indy anoncreds method
      // FIXME: add cheqd registry
      registries: [],
    }),
    // Use anoncreds-rs as anoncreds backend
    _anoncreds: new AnonCredsRsModule({
      anoncreds,
    }),

    // FIXME: add cheqd module
  },
  dependencies: agentDependencies,
})

agent.registerOutboundTransport(new HttpOutboundTransport())
agent.registerOutboundTransport(new WsOutboundTransport())
