import React from 'react'
import { ColorValue } from 'react-native'
import { OrderDataItem } from '../types'
import { formatToLocaleString } from '../utils'
import { Row } from './Row'

interface Props {
  absoluteTotal: number
  list: OrderDataItem[]
  fillBackgroundColor?: ColorValue
}

const OrderList = ({ absoluteTotal, fillBackgroundColor, list }: Props) => {
  // NOTE: sort list here
  return (
    <>
      {list?.map(({ price, size, total }) => (
        <Row
          key={price}
          first={formatToLocaleString(price)}
          second={formatToLocaleString(size)}
          third={formatToLocaleString(total)}
          fillBackgroundColor={fillBackgroundColor}
          fillWidth={absoluteTotal / total}
        />
      ))}
    </>
  )
}

export const MemoOrderList = React.memo(OrderList)
