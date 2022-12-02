import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'

const CustomButton = ({text,onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container:{
        width:350,
        height:50,
        padding:15,
        borderRadius:5,
        backgroundColor: "#3B71F3",
        marginVertical:5,
        alignItems:'center'
    },
    text:{
        fontWeight:'bold',
        color:'white'       
    }
})