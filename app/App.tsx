import { ariesAskar } from '@hyperledger/aries-askar-react-native'
import { indyVdr } from '@hyperledger/indy-vdr-react-native'
import { anoncreds } from '@hyperledger/anoncreds-react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import { agent } from './agent'
import { KeyType } from '@aries-framework/core'
import { AskarWallet } from '@aries-framework/askar'

const AgentView = ({ }) => {
  const isDarkMode = useColorScheme() === 'dark'
  const [isInitializing, setIsInitializing] = useState(false)
  const [versions, setVersions] = useState('')
  useEffect(() => {
    console.log({
      askar: ariesAskar.version(),
      indyVdr: indyVdr.version(),
      anoncreds: anoncreds.version(),
    })
    setVersions(`askar: ${ariesAskar.version()} indyVdr: ${indyVdr.version()} anoncreds: ${anoncreds.version()}`)
    if (isInitializing) return
    setIsInitializing(true)

    agent.initialize().then(() => {
      setIsInitializing(false)

      const key = agent.context.wallet.createKey({ keyType: KeyType.Ed25519 }).then(key => {
        ;(agent.context.wallet as AskarWallet).session.fetchKey({ name: key.publicKeyBase58 })
      })
    })
  }, [])

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
