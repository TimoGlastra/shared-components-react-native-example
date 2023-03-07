import { ariesAskar } from '@hyperledger/aries-askar-react-native'
import { indyVdr } from '@hyperledger/indy-vdr-react-native'
// import * as anoncreds from '@hyperledger/anoncreds-react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { agent } from './agent'
import { ConnectionRecord } from '@aries-framework/core'

const AgentView = ({}) => {
  const isDarkMode = useColorScheme() === 'dark'
  const [isInitializing, setIsInitializing] = useState(false)
  const [versions, setVersions] = useState('')
  const [connections, setConnections] = useState<ConnectionRecord[]>([])
  useEffect(() => {
    console.log({
      askar: ariesAskar.version(),
      indyVdr: indyVdr.version(),
    })
    setVersions(`askar: ${ariesAskar.version()} indyVdr: ${indyVdr.version()}`)
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
    if (!isInitializing && agent.isInitialized) {
      const clear = setInterval(() => {
        agent.connections.getAll().then((connections) => {
          setConnections(connections)
        })
      }, 2000)

      return () => {
        clearInterval(clear)
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
      {connections.map((c) => (
        <Text style={{ marginTop: 3 }} key={c.id}>
          {c.id.substring(0, 4)} - {c.theirLabel}
        </Text>
      ))}
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
