import { ariesAskar } from '@hyperledger/aries-askar-react-native'
import { anoncreds } from '@hyperledger/anoncreds-react-native'
import { AnonCredsSchema } from '@aries-framework/anoncreds'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { agent } from './agent'
import { ConnectionRecord, CredentialExchangeRecord } from '@aries-framework/core'

const AgentView = ({}) => {
  const isDarkMode = useColorScheme() === 'dark'
  const [isInitializing, setIsInitializing] = useState(false)
  const [versions, setVersions] = useState('')
  const [connections, setConnections] = useState<ConnectionRecord[]>([])
  const [credentials, setCredentials] = useState<CredentialExchangeRecord[]>([])
  const [schema, setSchema] = useState<AnonCredsSchema>()
  const [linkSecrets, setLinkSecrets] = useState<string[]>()

  useEffect(() => {
    console.log({
      askar: ariesAskar.version(),
      anoncreds: anoncreds.version(),
    })
    setVersions(`askar: ${ariesAskar.version()} anoncreds: ${anoncreds.version()}`)
    if (isInitializing) return
    setIsInitializing(true)

    agent
      .initialize()
      .then(async () => {
        setIsInitializing(false)
      })
      .catch((e) => {
        console.log('error hier', e.stack)
      })
  }, [])

  useEffect(() => {
    let clear: ReturnType<typeof setInterval> | undefined = undefined

    async function run() {
      // set connections and credentials every 2 seconds
      clear = setInterval(async () => {
        const connections = await agent.connections.getAll()
        setConnections(connections)
        const credentials = await agent.credentials.getAll()
        setCredentials(credentials)
      }, 2000)

      // get schema
      // const registry = new IndyVdrAnonCredsRegistry()
      // const schemaResult = await registry.getSchema(agent.context, 'Y6LRXGU3ZCpm7yzjVRSaGu:2:VerifiedEmail:1.0')
      // if (schemaResult.schema) setSchema(schemaResult.schema)

      // create link secret
      await agent.modules.anoncreds.createLinkSecret()
      const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()
      setLinkSecrets(linkSecretIds)
    }
    if (!isInitializing && agent.isInitialized) {
      run()

      return () => {
        if (clear) clearInterval(clear)
      }
    }
  }, [isInitializing])

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        AFJ Shared components RN sample tests
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {versions}
      </Text>
      <Text />
      <Text />
      <Text />
      {connections.length > 0 && <Text style={{ color: 'green' }}>Connections (Askar Check)</Text>}
      {connections.map((c) => (
        <Text style={{ marginTop: 3 }} key={c.id}>
          {c.id.substring(0, 4)} - {c.theirLabel}
        </Text>
      ))}
      <Text />
      {credentials.length > 0 && <Text style={{ color: 'green' }}>Credentials (AnonCreds Check)</Text>}
      {credentials.map((c) => (
        <Text style={{ marginTop: 3 }} key={c.id}>
          {c.id.substring(0, 4)} - {c.state}
        </Text>
      ))}
      <Text />
      {schema && (
        <Text>
          <Text style={{ color: 'green' }}>Schema (Indy VDR Check){'\n'}</Text>
          {JSON.stringify(schema, null, 2)}
        </Text>
      )}
      {linkSecrets && (
        <Text>
          <Text style={{ color: 'green' }}>Link Secrets (AnonCreds Check){'\n'}</Text>
          {JSON.stringify(linkSecrets, null, 2)}
        </Text>
      )}
    </View>
  )
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <AgentView />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App
