import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native'
import Layout from '../constants/Layout'

interface Props {
  first?: string
  second?: string
  third?: string
  isBold?: boolean
  containerStyle?: StyleProp<ViewStyle>
  fillBackgroundColor?: ColorValue
  fillWidth?: number
}

export const Row = ({
  first,
  second,
  third,
  isBold,
  containerStyle,
  fillWidth,
  fillBackgroundColor,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {!!fillWidth && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: fillBackgroundColor,
              width: fillWidth,
            },
          ]}
          testID='fill'
        />
      )}
      {!!first && (
        <Text style={[styles.text, isBold && styles.bold]}>{first}</Text>
      )}
      {!!second && (
        <Text style={[styles.text, isBold && styles.bold]}>{second}</Text>
      )}
      {!!third && (
        <Text style={[styles.text, isBold && styles.bold]}>{third}</Text>
      )}
    </View>
  )
}

const MAX_ROW_HEIGHT = Layout.isSmallDevice ? 30 : 40
console.log(`MAX_ROW_HEIGHT`, MAX_ROW_HEIGHT)

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    maxHeight: MAX_ROW_HEIGHT,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },
})
