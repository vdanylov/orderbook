import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  ColorValue,
  TextStyle,
} from 'react-native'
import Layout from '../constants/Layout'

interface Props {
  containerStyle?: StyleProp<ViewStyle>
  fillBackgroundColor?: ColorValue
  fillWidth?: number
  first?: string
  firstStyle?: StyleProp<TextStyle>
  second?: string
  secondStyle?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
  third?: string
  thirdStyle?: StyleProp<TextStyle>
}

export const Row = ({
  containerStyle,
  fillBackgroundColor,
  fillWidth,
  first,
  firstStyle,
  second,
  secondStyle,
  textStyle,
  third,
  thirdStyle,
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
      {first !== undefined && (
        <Text style={[styles.text, textStyle, firstStyle]}>{first}</Text>
      )}
      {second !== undefined && (
        <Text style={[styles.text, textStyle, secondStyle]}>{second}</Text>
      )}
      {third !== undefined && (
        <Text style={[styles.text, textStyle, thirdStyle]}>{third}</Text>
      )}
    </View>
  )
}

export const MAX_ROW_HEIGHT = Layout.isSmallDevice ? 30 : 40
console.log(`MAX_ROW_HEIGHT`, MAX_ROW_HEIGHT)

const styles = StyleSheet.create({
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
