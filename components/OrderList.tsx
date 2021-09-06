import React from 'react'
import { StyleSheet, View, ColorValue } from 'react-native'
import { TotalOrderDataItem } from '../types'
import { formatToLocaleString } from '../utils'
import { Row } from './Row'

export interface Props {
  absoluteTotal: number
  list: TotalOrderDataItem[]
  fillBackgroundColor?: ColorValue
}

const OrderList = ({ absoluteTotal, fillBackgroundColor, list }: Props) => {
  return (
    <View testID='order_list' style={styles.container}>
      {list?.map(({ price, size, total }) => (
        <Row
          key={price}
          first={formatToLocaleString(price)}
          second={formatToLocaleString(size)}
          third={formatToLocaleString(total)}
          fillBackgroundColor={fillBackgroundColor}
          fillWidth={`${Math.round((total / absoluteTotal) * 100)}%`}
        />
      ))}
    </View>
  )
}

export const MemoOrderList = React.memo(OrderList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
