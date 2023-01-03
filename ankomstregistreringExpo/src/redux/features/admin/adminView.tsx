import { StyleSheet, Text, View,TouchableOpacity} from "react-native";
import { useDispatch } from "react-redux";
import { setSignOut } from "../loggaIn/UserAuthSlice";
import * as Device from "expo-device";

export default function AdminView() 
{
  const dispatch = useDispatch();
  const deviceName = Device.deviceName;
  
  return (
    <View style={styles.view}>
      <View style={styles.view} >
        <View >
        <Text>Klinikens namn är: {deviceName}</Text>
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
    justifyContent: "center"
  },

  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    width: 190,
    margin: 10
  }, 

   Bold1: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white"
  }

});
