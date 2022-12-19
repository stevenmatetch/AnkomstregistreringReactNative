import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/features/loggaIn/userAuthSlice";
import LoggaInView from "../redux/features/loggaIn/loggaInView";
import UppgiftView from "../redux/features/uppgift/uppgiftView";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { selectAdmin } from "../redux/features/loggaIn/userAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setSignOut } from "../redux/features/loggaIn/userAuthSlice";
import { BokningView } from "../redux/features/bokning/bokningView";
import BetalningView from "../redux/features/betalning/betalningView";
import AdminView from "../redux/features/admin/adminView";

const Stack = createStackNavigator();

function HandleNavigation() {
  const dispatch = useDispatch();

  type Nav = {
    navigate: (value: string) => void;
  };

  const { navigate } = useNavigation<Nav>();

  return (
    <View style={styles.gridView}>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigate("Bokningar")}>
          <Image
            style={styles.container}
            source={require("../assets/images/calendar.png")}
          />
        </TouchableOpacity>
        <Text>Bokningar</Text>
      </View>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigate("Betalningar")}>
          <Image
            style={styles.container}
            source={require("../assets/images/wallet.png")}
          />
        </TouchableOpacity>
        <Text>Betalningar</Text>
      </View>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigate("Uppgifter")}>
          <Image
            style={styles.container}
            source={require("../assets/images/user.png")}
          />
        </TouchableOpacity>
        <Text>Uppgifter</Text>
      </View>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => dispatch(setSignOut())}>
          <Image
            style={styles.container}
            source={require("../assets/images/exit.png")}
          />
        </TouchableOpacity>
        <Text>Logga ut</Text>
      </View>
    </View>
  );
}

const AppRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin = useSelector(selectAdmin);

  return (
    <NavigationContainer>
      <View style={styles.view}>
        {isLoggedIn == true && isAdmin == false && <HandleNavigation />}
      </View>
      {isLoggedIn ? (
        isAdmin == true ? (
          <AdminView />
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Bokningar"
              component={BokningView}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Betalningar"
              component={BetalningView}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Uppgift"
              component={UppgiftView}
            />
          </Stack.Navigator>
        )
      ) : (
        <LoggaInView />
      )}
    </NavigationContainer>
  );
};

export default AppRoute;

const styles = StyleSheet.create({
  iconBtn: {
    height: 40,
    width: 40,
  },

  container: {
    height: 70,
    width: 70,
  },

  view: {
    backgroundColor: "aliceblue",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  Img: {
    height: 30,
    width: 30,
  },

  gridView: {
    margin: 20,
    marginTop: 10,
    flexDirection: "row",
  },

  itemContainer: {
    justifyContent: "center",
    borderRadius: 5,
    padding: 40,
    height: 150,
    width: 158,
    margin: 5,
    backgroundColor: "#3498db",
  },
});
