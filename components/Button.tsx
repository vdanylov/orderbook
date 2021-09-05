import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

interface Props {
  containerStyle?: TouchableOpacityProps['style']
  text: string
  onPress: () => void
}

export const Button = ({ containerStyle, onPress, text }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#392ed2',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
})
