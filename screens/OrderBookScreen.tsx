import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, MAX_ROW_HEIGHT, MemoOrderList, Row } from '../components'
import { NUMBER_OR_SECTIONS, THROTTLE_VALUE, WS_PATH } from '../constants'
import usePrevious from '../hooks/usePrevious'
import {
  OrderDataItem,
  ProductID,
  TotalOrderDataItem,
  WebSocketStatus,
} from '../types'
import throttle from 'lodash.throttle'
import { formatToLocaleString } from '../utils'

const feeds: Record<ProductID, ProductID> = {
  PI_ETHUSD: 'PI_XBTUSD',
  PI_XBTUSD: 'PI_ETHUSD',
}

const OrderBookScreen = () => {
  const { height } = useWindowDimensions()
  // NOTE: could be improved cause we can style headers height
  const MAX_NUMBER_OF_ROWS_IN_SECTION = Math.floor(
    (height / NUMBER_OR_SECTIONS - MAX_ROW_HEIGHT) / MAX_ROW_HEIGHT
  )
  const [webSocketStatus, setWebSocketStatus] = useState<WebSocketStatus>({
    status: 'default',
  })
  const webSocketRef = useRef<WebSocket | undefined>()
  const [productId, setProductId] = useState<ProductID>('PI_XBTUSD')
  const previousProductId = usePrevious<ProductID>(productId)

  const [orderData, setOrderData] = useState<{
    asks: Record<string, OrderDataItem>
    bids: Record<string, OrderDataItem>
  }>({
    asks: {},
    bids: {},
  })

  const initWebsocket = () => {
    webSocketRef.current = new WebSocket(WS_PATH)
    webSocketRef.current.onclose = handleOnClose
    webSocketRef.current.onerror = handleOnError
    webSocketRef.current.onmessage = handleOnMessage
    webSocketRef.current.onopen = handleOnOpen
  }

  const handleWsSubscribe = (productId: ProductID) => {
    webSocketRef.current?.send(
      JSON.stringify({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [productId],
      })
    )
    setWebSocketStatus({
      status: 'online',
    })
  }

  const handleWsUnsubscribe = (productId: ProductID) => {
    setOrderData({
      bids: {},
      asks: {},
    })
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
    setWebSocketStatus({
      status: 'offline',
    })
  }

  const handleOnError = (e: Event) => {
    setWebSocketStatus({
      status: 'error',
      message: JSON.stringify(e, null, 2),
    })
    handleOnClose()
  }

  const handleConnect = () => {
    initWebsocket()
  }

  const handleOnOpen = useCallback(() => {
    handleWsSubscribe(productId)
  }, [productId])

  const handleToggleFeed = () => {
    setProductId((previousProductId) => feeds[previousProductId])
  }

  useEffect(() => {
    if (previousProductId && previousProductId !== productId) {
      if (previousProductId) {
        setWebSocketStatus({
          status: 'loading',
        })
        handleWsUnsubscribe(previousProductId)
      }
    }
    initWebsocket()
  }, [productId])

  useEffect(() => {
    return handleOnClose
  }, [])

  const formatData = (
    prevData: Record<string, OrderDataItem>,
    data: number[][]
  ) => {
    if (!data || data.length === 0) return prevData

    if (Object.keys(prevData)?.length === 0) {
      return data.reduce<Record<string, OrderDataItem>>((acc, curr) => {
        const [price, size] = curr
        const isZeroSize = size === 0
        return isZeroSize
          ? acc
          : {
              ...acc,
              [price]: {
                price,
                size,
              },
            }
      }, {})
    }

    const newData: Record<string, OrderDataItem> = JSON.parse(
      JSON.stringify(prevData)
    )

    // NOTE:  If the size returned by a delta is 0 then that price level should be removed from the order book, otherwise you can safely overwrite the state of that price level with new data returned by that delta.
    for (const dataItem of data) {
      const [price, size] = dataItem
      const isZeroSize = size === 0
      if (isZeroSize && newData[price]) {
        delete newData[price]
      } else {
        const orderData = Object.values(newData)
        if (
          !isZeroSize &&
          !newData[price] &&
          orderData.length <= MAX_NUMBER_OF_ROWS_IN_SECTION
        ) {
          const lastItem = orderData[orderData.length - 1]
          if (lastItem.price < price) {
            delete newData[lastItem.price]
          }
          newData[price] = {
            price,
            size,
          }
        } else if (
          !isZeroSize &&
          orderData.length < MAX_NUMBER_OF_ROWS_IN_SECTION
        ) {
          newData[price] = {
            price,
            size,
          }
        }
      }
    }
    return newData
  }

  const handleOnMessage = throttle((e: WebSocketMessageEvent) => {
    const parsedData = JSON.parse(e.data)
    if (!parsedData) return
    const { asks, bids } = parsedData
    if (asks || bids) {
      const newAsks = asks.slice(-asks.length, MAX_NUMBER_OF_ROWS_IN_SECTION)
      const newBids = bids.slice(-bids.length, MAX_NUMBER_OF_ROWS_IN_SECTION)
      setOrderData(({ asks: prevAsks, bids: prevBids }) => ({
        asks: formatData(prevAsks, newAsks),
        bids: formatData(prevBids, newBids),
      }))
    }
  }, THROTTLE_VALUE)

  const currenProductId = productId.split('_')[1]

  const calculatedAsks = Object.values(orderData.asks)
    .reduce<TotalOrderDataItem[]>(
      (acc, curr, index) => [
        ...acc,
        {
          ...curr,
          total: index > 0 ? acc[index - 1].total + curr.size : curr.size,
        },
      ],
      []
    )
    .sort((a, b) => b.price - a.price)

  const calculatedBids = Object.values(orderData.bids)
    .sort((a, b) => b.price - a.price)
    .reduce<TotalOrderDataItem[]>(
      (acc, curr, index) => [
        ...acc,
        {
          ...curr,
          total: index > 0 ? acc[index - 1].total + curr.size : curr.size,
        },
      ],
      []
    )

  const absoluteTotal = Math.max(
    calculatedAsks?.[0]?.total,
    calculatedBids?.[calculatedBids.length - 1]?.total
  )

  const firstBid = calculatedBids[0]?.price ?? 0
  const lastAsk = calculatedAsks[calculatedAsks.length - 1]?.price ?? 0
  const spread = lastAsk - firstBid
  const spreadPercentage = `(${formatToLocaleString(
    (spread / firstBid) * 100
  )}%)`

  if (['offline', 'error'].includes(webSocketStatus.status)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        {webSocketStatus.status === 'error' && (
          <Button text='Retry' onPress={handleConnect} />
        )}
        {webSocketStatus.status === 'offline' && (
          <Button text='Connect' onPress={handleConnect} />
        )}
      </SafeAreaView>
    )
  }

  if (webSocketStatus.status === 'loading') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    )
  }

  if (webSocketStatus.status === 'online') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Order Book: {currenProductId}</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Row
            first='PRICE'
            second='SIZE'
            third='TOTAL'
            containerStyle={styles.topTableHeader}
            textStyle={styles.tableHeader}
          />
          <MemoOrderList
            absoluteTotal={absoluteTotal}
            // NOTE: move colors to theme
            fillBackgroundColor='#391f28'
            list={calculatedAsks}
          />
          <Row
            first={`Spread: ${spread} ${spreadPercentage}`}
            textStyle={styles.tableHeader}
          />
          <MemoOrderList
            absoluteTotal={absoluteTotal}
            // NOTE: move colors to theme
            fillBackgroundColor='#1b3434'
            list={calculatedBids}
          />
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Button onPress={handleToggleFeed} text='Toggle Feed' />
        </View>
      </SafeAreaView>
    )
  }

  return null
}

export default OrderBookScreen

// NOTE: move to theme
const borderColor = '#414653'

const styles = StyleSheet.create({
  bottomContainer: {
    paddingVertical: 8,
    borderTopColor: borderColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
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
