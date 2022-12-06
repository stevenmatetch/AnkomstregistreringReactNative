import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const CustomInput = ({placeholder,value,setValue, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput value={value} onChangeText={setValue} placeholder={placeholder} style={styles.input} secureTextEntry = {secureTextEntry}></TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:350,
    height:50,
    padding:15,
    borderColor:'#e8e8e8',
    borderWidth:1,
    borderRadius:5,
    backgroundColor: "white",
    marginVertical:5,  
  },
  input:{
  }  
});


export default CustomInput

