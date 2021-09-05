import React from 'react'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, MemoOrderList, Row } from '../components'

const defaultRow = {
  first: 'first',
  second: 'second',
  third: 'third',
}

const defaultList = Array.from({ length: 8 }, (i) => defaultRow)

export default function OrderBookScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Order Book</Text>
        <Row
          isBold
          first='Price'
          second='Size'
          third='Total'
          containerStyle={styles.topTableHeader}
        />
        <MemoOrderList fillBackgroundColor='#1b3434' list={defaultList} />
        {/* NOTE: add proper calculations */}
        <Row isBold first={`Spread: 13 (0,04%)`} />
        <MemoOrderList fillBackgroundColor='#391f28' list={defaultList} />
        <View style={styles.bottomContainer}>
          <Button onPress={() => {}} text='Toggle Feed' />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const borderColor = '#99999999'

const styles = StyleSheet.create({
  bottomContainer: {
    paddingVertical: 8,
    borderTopColor: borderColor,
    borderTopWidth: 1,
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
  },
})
