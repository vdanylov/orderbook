import React from 'react'
import { Button } from '../Button'
import { render, fireEvent } from '@testing-library/react-native'

describe('<Button>', () => {
  const onPress = jest.fn()
  const text = 'Test button'

  it('should fire onPress', () => {
    const { getByTestId, getByText } = render(
      <Button text={text} onPress={onPress} />
    )
    const button = getByTestId('button')
    expect(button).toBeDefined()
    fireEvent(button, 'press')
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should display text', () => {
    const { getByText } = render(<Button text={text} onPress={onPress} />)
    expect(getByText(text)).toBeDefined()
  })
})
