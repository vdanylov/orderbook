import React from 'react'
import { Row } from '../Row'
import { render } from '@testing-library/react-native'

describe('<Row>', () => {
  const props = {
    first: 'first',
    second: 'second',
    third: 'third',
  }

  it('should render properly', () => {
    const { getByTestId, getByText } = render(<Row {...props} />)
    const row = getByTestId('container')
    expect(row).toBeDefined()
    expect(row.props.children.length).toEqual(4)

    Object.values(props).forEach((prop) => {
      expect(getByText(prop)).toBeDefined()
    })
  })
})
