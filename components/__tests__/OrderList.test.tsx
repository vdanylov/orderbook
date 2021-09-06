import React from 'react'
import { MemoOrderList, Props } from '../OrderList'
import { render } from '@testing-library/react-native'
import { formatToLocaleString } from '../../utils'

describe('<MemoOrderList>', () => {
  const props: Props = {
    absoluteTotal: 300,
    list: [
      {
        price: 100,
        size: 10,
        total: 200,
      },
      {
        price: 110,
        size: 12,
        total: 300,
      },
    ],
  }

  it('should render properly', () => {
    const { getByTestId, getByText } = render(<MemoOrderList {...props} />)
    const orderList = getByTestId('order_list')
    expect(orderList).toBeDefined()
    expect(orderList.props.children.length).toEqual(2)

    Object.values(props.list).forEach((listItem) => {
      Object.values(listItem).map((listItemProp) => {
        expect(getByText(formatToLocaleString(listItemProp))).toBeDefined()
      })
    })
  })
})
