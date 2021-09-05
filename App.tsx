import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

const App = () => {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const webSocketRef = useRef<WebSocket | undefined>()

  const initWebsocket = () => {
    webSocketRef.current = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
    // webSocketRef.current.onclose = handleOnClose
    // webSocketRef.current.onerror = handleOnError
    webSocketRef.current.onmessage = handleOnMessage
    // webSocketRef.current.onopen = handleOnOpen
    webSocketRef.current.onopen = (e) => {
      console.log(`object`, e)
      webSocketRef.current?.send(
        JSON.stringify({
          event: 'subscribe',
          feed: 'book_ui_1',
          product_ids: ['PI_XBTUSD'],
        })
      )
    }
  }

  const closeWebsocket = () => {}

  const handleOnOpen = {}

  const handleOnMessage = (e: WebSocketMessageEvent) => {
    const parsedData = JSON.parse(e.data ?? '')
    if (!parsedData) return

    console.log(`parsedData`, JSON.stringify(parsedData, null, 2))
  }

  useEffect(() => {
    // initWebsocket()
    // return closeWebsocket
  }, [])

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}

export default App
