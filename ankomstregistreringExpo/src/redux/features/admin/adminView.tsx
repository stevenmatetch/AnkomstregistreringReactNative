import { StyleSheet, Text, View,TouchableOpacity,Image } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../../CustomButton/CustomButton";
import { useDispatch } from "react-redux";
import { setSignOut } from "../loggaIn/userAuthSlice";

export default function AdminView() 
{
  const dispatch = useDispatch();
  // let DeviceName = Device.deviceName;
      /*  <Text>Klinikens namn är: {DeviceName}</Text>*/
  return (
    <View style={styles.view}>
      <View >
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.Bold1}>Välj skrivare</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.Bold1}>AppServer</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.Bold1}>Fellogg</Text>
          </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity style={styles.button} onPress={() => dispatch(setSignOut())}>
            <Text style={styles.Bold1}>Logga ut</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>   
  );
}

const styles = StyleSheet.create({

  view: {
    flex: 1,
    backgroundColor: "aliceblue",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    width: 190,
    margin: 10,
  }, 

   Bold1: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  }

});
