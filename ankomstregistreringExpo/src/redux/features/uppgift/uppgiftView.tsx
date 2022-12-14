import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect } from "react";
import Dialog from "react-native-dialog";
import { FetchUppgift } from "./UppgiftSlice";
import { AppDispatch } from "../../Store";
import { useSelector, useDispatch } from "react-redux";
import { selectPatPNr } from "../loggaIn/UserAuthSlice";
import { LoadedUppgift } from "../../../models/LoadedUppgift";
import Uppgift from "../../../models/Uppgift";

let loadedData: LoadedUppgift[] = [];

export default function UppgifterView() {
  const dispatch = useDispatch<AppDispatch>();
  const uppgift = useSelector((state: any) => state.uppgift);
  loadedData = uppgift.uppgifter;
  const patPNr = useSelector(selectPatPNr);
  const [visible, SetVisible] = useState(false);
  const [cValueData, SetcValueData] = useState("");
  const [getDsc, SetDsc] = useState("");
  const [newText, SetText] = useState("");
  const [getId, SetId] = useState("");
  const [emailValidError, SetEmailValidError] = useState("");

  useEffect(() => {
    dispatch(FetchUppgift(patPNr));
  }, []);

  const ShowDialog = (id: string, value: string, dsc: string) => {
    SetcValueData(value);
    SetId(id);
    SetDsc(dsc);
    SetVisible(true);
  };

  const HandleCancel = () => {
    SetVisible(false);
  };

  const HandleValidEmail = (val: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (val.length === 0) {
      SetEmailValidError("E-postadress måste anges");
    } else if (reg.test(val) === false) {
      SetEmailValidError("Ange giltig e-postadress");
      return "invalid";
    } else if (reg.test(val) === true) {
      return "valid";
    }
    return "";
  };

  async function HandleEdit(newcValue: string) {
    let value = "";
    if (getId == "Email") {
      let returnVal: string = HandleValidEmail(newcValue);
      value = returnVal;
    }

    if(value == "invalid"){
      Alert.alert(emailValidError);
    }

    if (value == "valid") {
      const jsonData = {
        request: {
          iPatPNrP: patPNr,
          iEcoPNrP: 1,
          cModeP: "SET",
          AnkTt: {
            "Ank-tt": [
              {
                Id: getId,
                Dsc: getDsc,
                cValue: newcValue,
                dValue: 0,
                lValue: false,
                ReadOnly: false,
                SaveResult: "",
              }
            ]
          }
        }
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      };

      const response = await fetch(
        "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/GetPatPParam",
        requestOptions
      );

      const data = await response.json();
      const x = data.response.AnkTt;
      const { "Ank-tt": myData } = x;
      dispatch(FetchUppgift(patPNr));
      SetVisible(false);
      return myData;
    }
  }


  function Swish() {
    //http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rct/SwishCl?cTxtRefP=""&cTxtRefP=""&cTxtMsgP=""&iPatPNrP=153&iEcoPNrP=1&deSumP=10
    //Verifiera telefonnummer? Finns redan i uppdatera uppgifter
    //Postlås (carita.TabLock2Pay)
    //Kör carita.pswishcl med OUTPUT SwishUUID
    //Polla (ca var 10 sek) pgetswishcl med OUTPUT Status
    //Om Status > 0: Status = 10 OK alla andra error.
    //Släpp postlås (samma som för betalkort)
    //Hämta och skriv ut kvitto
  }

  const RenderItem = ({ item }: { item: Uppgift }) => {
    return (
      <View style={styles.item}>
        <View style={styles.flex1}>
          <View>
            <Text style={styles.Bold1}>{item.Dsc}</Text>
            <Text>{item.cValue}</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => ShowDialog(item.Id, item.cValue, item.Dsc)}
            >
              <Image
                style={styles.Img}
                source={require("../Image/editing.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.view}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Ändra</Dialog.Title>
        <Dialog.Input onChangeText={(newText) => SetText(newText)}>
          {cValueData}
        </Dialog.Input>
        <Dialog.Button label="Ändra" onPress={() => HandleEdit(newText)} />
        <Dialog.Button label="Stäng" onPress={() => HandleCancel()} />
      </Dialog.Container>
      <Text style={styles.Title}>Kontrollera dina Uppgifter</Text>

      {uppgift.loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large"></ActivityIndicator>
        </View>
      )}

      <FlatList
        data={loadedData}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Bold1: {
    fontWeight: "bold",
    fontSize: 15
  },

  Title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30
  },

  Bold: {
    fontWeight: "bold",
    fontSize: 15,
    color: "black"
  },

  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    width: 220,
    margin: 10
  },

  flex1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  flex2: {
    flexDirection: "row"
  },

  item: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 500
  },

  view: {
    flex: 1,
    backgroundColor: "aliceblue",
    alignItems: "center",
    justifyContent: "center"
  },

  container: {
    height: 70,
    width: 70
  },

  Img: {
    height: 30,
    width: 30
  },

  gridView: {
    margin: 20,
    marginTop: 10,
    flexDirection: "row"
  },

  itemContainer: {
    justifyContent: "center",
    borderRadius: 5,
    padding: 40,
    height: 150,
    width: 158,
    margin: 5
  },

  font: {
    fontWeight: "bold",
    fontSize: 15
  }
});
