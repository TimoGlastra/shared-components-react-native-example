import {
  anoncreds,
  Credential,
  CredentialDefinition,
  CredentialOffer,
  CredentialRequest,
  MasterSecret,
  Presentation,
  Schema,
} from '@hyperledger/anoncreds-react-native';

export default function fullAnoncredsRsFlowTest() {
  // with these DIDs, create presentation often fails (app crash)
  const issuerId = 'did:indy:local:1234';
  const schemaId = 'did:indy:local:1234/anoncreds/v1/schema/12312-93919-23920-04290-22930-1931-209';
  const credentialDefinitionId =
    'did:indy:local:1234/anoncreds/v1/credential-definition/12312-93919-23920-04290-22930-1931-209';
  
  // with these DIDs, create presentation works fine
  //const issuerId = 'mock:uri';
  //const schemaId = 'mock:uri';
  //const credentialDefinitionId = 'mock:uri';

  console.log('creating schema...');
  const schema = Schema.fromJson({
    name: 'schema-1',
    issuerId: issuerId,
    version: '1',
    attrNames: ['name', 'age', 'sex', 'height'],
  });

  console.log('creating credential definition...');
  const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
    CredentialDefinition.create({
      schemaId: schemaId,
      issuerId: issuerId,
      schema: {
        name: 'schema-1',
        issuerId: issuerId,
        version: '1',
        attrNames: ['name', 'age', 'sex', 'height'],
      },
      signatureType: 'CL',
      supportRevocation: false,
      tag: 'TAG',
    });

  console.log('creating credential offer...');
  const credentialOffer = CredentialOffer.create({
    schemaId: schemaId,
    credentialDefinitionId: credentialDefinitionId,
    keyCorrectnessProof: keyCorrectnessProof.toJson(),
  });

  console.log('creating masster secret...');
  const masterSecret = MasterSecret.create();
  const masterSecretId = 'master secret id';

  console.log('creating credential request...');
  const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
    credentialDefinition: credentialDefinition.toJson(),
    masterSecret: masterSecret.toJson(),
    masterSecretId,
    credentialOffer: credentialOffer.toJson(),
  });

  console.log('creating credential...');
  const credential = Credential.create({
    credentialDefinition: credentialDefinition.toJson(),
    credentialDefinitionPrivate: credentialDefinitionPrivate.toJson(),
    credentialOffer: credentialOffer.toJson(),
    credentialRequest: credentialRequest.toJson(),
    attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
  });

  console.log('processing credential...');
  const credReceived = credential.process({
    credentialDefinition: credentialDefinition.toJson(),
    credentialRequestMetadata: credentialRequestMetadata.toJson(),
    masterSecret: masterSecret.toJson(),
  });

  console.log('creating nonce...');
  const nonce = anoncreds.generateNonce();

  const presentationRequest = {
    nonce,
    name: 'pres_req_1',
    version: '0.1',
    requested_attributes: {
      attr1_referent: {
        name: 'name',
        issuer: 'mock:uri',
      },
      attr2_referent: {
        name: 'sex',
      },
      attr3_referent: {
        name: 'phone',
      },
      attr4_referent: {
        names: ['name', 'height'],
      },
    },
    requested_predicates: {
      predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
    },
  };

  console.log('creating presentation...');
  const presentation = Presentation.create({
    presentationRequest,
    credentials: [
      {
        credential: credReceived.toJson(),
      },
    ],
    credentialDefinitions: {
      [credentialDefinitionId]: credentialDefinition.toJson(),
    },
    credentialsProve: [
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr1_referent',
        reveal: true,
      },
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr2_referent',
        reveal: false,
      },
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr4_referent',
        reveal: true,
      },
      {
        entryIndex: 0,
        isPredicate: true,
        referent: 'predicate1_referent',
        reveal: true,
      },
    ],
    masterSecret: masterSecret.toJson(),
    schemas: {
      [schemaId]: schema.toJson(),
    },
    selfAttest: { attr3_referent: '8-800-300' },
  });

  console.log('verifying presentation...');
  const verify = Presentation.fromJson(presentation.toJson()).verify({
    presentationRequest,
    schemas: {
      [schemaId]: schema.toJson(),
    },
    credentialDefinitions: {
      [credentialDefinitionId]: credentialDefinition.toJson(),
    },
  });

  console.log('end');
  return verify;
}
