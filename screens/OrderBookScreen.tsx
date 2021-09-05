import React, { useEffect, useRef, useState } from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, MemoOrderList, Row } from '../components'
import { WS_PATH } from '../constants'
import usePrevious from '../hooks/usePrevious'
import { OrderDataItem, ProductID } from '../types'

const defaultRow = {
  first: 'first',
  second: 'second',
  third: 'third',
}

const defaultList = Array.from({ length: 8 }, (i) => defaultRow)

const feeds: Record<ProductID, ProductID> = {
  PI_ETHUSD: 'PI_XBTUSD',
  PI_XBTUSD: 'PI_ETHUSD',
}

const OrderBookScreen = () => {
  const webSocketRef = useRef<WebSocket | undefined>()
  const [productId, setProductId] = useState<ProductID>('PI_XBTUSD')
  const previousProductId = usePrevious<ProductID>(productId)

  const [orderData, setOrderData] = useState<{
    asks: OrderDataItem[]
    bids: OrderDataItem[]
  }>({
    asks: [],
    bids: [],
  })

  const initWebsocket = (productId: ProductID) => {
    console.log('WS init')
    webSocketRef.current = new WebSocket(WS_PATH)
    webSocketRef.current.onclose = handleOnClose
    webSocketRef.current.onerror = handleOnError
    webSocketRef.current.onmessage = handleOnMessage
    webSocketRef.current.onopen = handleOnOpen
  }

  const handleWsSubscribe = (productId: ProductID) => {
    console.log(`handleWsSubscribe`)
    webSocketRef.current?.send(
      JSON.stringify({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [productId],
      })
    )
  }

  const handleWsUnsubscribe = (productId: ProductID) => {
    webSocketRef.current?.send(
      JSON.stringify({
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [productId],
      })
    )
  }

  const handleOnClose = () => {
    webSocketRef.current?.close()
    webSocketRef.current = undefined
  }

  const handleOnError = (e: Event) => {
    console.log(`error:`, JSON.stringify(e, null, 2))
    return e
  }

  const handleOnOpen = () => {
    handleWsSubscribe(productId)
  }

  const handleToggleFeed = () => {
    setProductId((previousProductId) => feeds[previousProductId])
  }

  useEffect(() => {
    if (previousProductId && previousProductId !== productId) {
      console.log('previousProductId', previousProductId)
      // if (previousProductId) handleWsUnsubscribe(previousProductId)
    }
    initWebsocket(productId)
    return handleOnClose
  }, [productId])

  let first = 0

  const formatData = (prevData: {}[], data: number[][]) => {
    const newData = { ...prevData }
    if (data.length === 0) return []
    if (prevData?.length === 0) {
      return data.reduce<OrderDataItem[]>((acc, curr) => {
        return [
          ...acc,
          {
            price: curr[0],
            size: curr[1],
            total: 0,
          },
        ]
      }, [])
    }
    // NOTE:  If the size returned by a delta is 0 then that price level should be removed from the orderbook, otherwise you can safely overwrite the state of that price level with new data returned by that delta.
    for (const dataItem of data) {
      if (dataItem[1] === 0) {
        // NOTE: remove item with specific price level
      } else {
        // NOTE: overwrite price of the level
      }
    }
  }

  // NOTE: fix types
  const handleOnMessage = (e: WebSocketMessageEvent) => {
    const parsedData = JSON.parse(e.data ?? '')
    // console.log(`parsedData`, JSON.stringify(parsedData, null, 2))
    first = first + 1
    if (!parsedData) return
    const { asks, bids } = parsedData
    if (asks && bids) {
      setOrderData({
        asks: formatData(orderData.asks, asks)
        bids: formatData(orderData.bids, bids)
      })
      handleOnClose()
    }
  }

  const currenProductId = productId.split('_')[1]

  console.log(`orderData`, orderData)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Order Book: {currenProductId}</Text>
        <Row
          first='PRICE'
          second='SIZE'
          third='TOTAL'
          containerStyle={styles.topTableHeader}
          textStyle={styles.tableHeader}
        />
        {/* NOTE: put proper value to absoluteTotal */}
        <MemoOrderList
          absoluteTotal={100}
          fillBackgroundColor='#1b3434'
          list={orderData.asks}
        />
        {/* NOTE: add proper calculations */}
        <Row first={`Spread: 13 (0,04%)`} textStyle={styles.tableHeader} />
        <MemoOrderList
          absoluteTotal={100}
          fillBackgroundColor='#391f28'
          list={orderData.bids}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Button onPress={handleToggleFeed} text='Toggle Feed' />
        <View style={{ width: 16 }} />
        <Button onPress={handleOnClose} text='Close' />
        {/* <Button onPress={() => {}} text='Retry' /> */}
      </View>
    </SafeAreaView>
  )
}

export default OrderBookScreen

const borderColor = '#414653'

const styles = StyleSheet.create({
  bottomContainer: {
    paddingVertical: 8,
    borderTopColor: borderColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#232232',
  },
  header: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  topTableHeader: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: borderColor,
    borderTopColor: borderColor,
    color: '#3d424e',
  },
  tableHeader: {
    color: '#414653',
    fontWeight: 'bold',
  },
})
