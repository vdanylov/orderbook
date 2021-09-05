import React from 'react'
import { ColorValue } from 'react-native'
import { Row } from './Row'

interface Props {
  list: any[]
  fillBackgroundColor?: ColorValue
}

const OrderList = ({ fillBackgroundColor, list }: Props) => {
  // NOTE: sort list here
  return (
    <>
      {list?.map((item, key) => (
        <Row
          key={key}
          {...item}
          fillBackgroundColor={fillBackgroundColor}
          fillWidth={key * 30}
        />
      ))}
    </>
  )
}

export const MemoOrderList = React.memo(OrderList)
