import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import React, { useState, useEffect } from "react";
import Dialog from "react-native-dialog";
import Services from "../../../services/Services";
import { FetchUppgifter } from "./uppgifterSlice";
import { AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { selectPatPNr } from "../loggaIn/userAuthSlice";

var APIServices = new Services();

interface Uppgift {
  Id: number;
  Dsc: string;
  cValue: string;
}

interface LoadedUppgift {
  Id: number;
  Dsc: string;
  cValue: string;
}

let loadedData: LoadedUppgift[] = [];

export default function UppgifterView() {
  const dispatch = useDispatch<AppDispatch>();
  const uppgift = useSelector((state: any) => state.uppgift);
  const [data, SetMyData] = useState<LoadedUppgift[]>([]);
  const patPNr = useSelector(selectPatPNr);
  loadedData = uppgift.uppgifter;
  const [visible, setVisible] = useState(false);
  const [cValueData, setcValueData] = useState("");
  const [getDsc, setDsc] = useState("");
  const [newText, setText] = useState("");
  const [getId, setId] = useState(0);

  const ShowDialog = (id: number, value: string, dsc: string) => {
    setcValueData(value);
    setId(id);
    setDsc(dsc);
    setVisible(true);
  };

  const HandleCancel = () => {
    setVisible(false);
  };

  async function HandleEdit(newcValue: string) {
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
            },
          ],
        },
      },
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    };

    const response = await fetch(
      "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/GetPatPParam",
      requestOptions
    );
    const myArray = await response.json();
    var x = myArray.response.AnkTt;
    const { "Ank-tt": myData } = x;
    dispatch(FetchUppgifter(patPNr));
    setVisible(false);
    return myData;
  }

  useEffect(() => {
    dispatch(FetchUppgifter(patPNr));
  }, []);



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
        <Dialog.Input onChangeText={(newText) => setText(newText)}>
          {cValueData}
        </Dialog.Input>
        <Dialog.Button label="Ändra" onPress={() => HandleEdit(newText)} />
        <Dialog.Button label="Stäng" onPress={() => HandleCancel()} />
      </Dialog.Container>
      <Text style={styles.Title}>Kontrollera dina Uppgifter</Text>     
     
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
    fontSize: 15,
  },

  Title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom:30
  },

  Bold: {
    fontWeight: "bold",
    fontSize: 15,
    color: "black",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    width: 220,
    margin: 10,
  },

  flex1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flex2: {
    flexDirection: "row",
  },

  item: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 500,
  },

  view: {
    flex: 1,
    backgroundColor: "aliceblue",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    height: 70,
    width: 70,
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
  },

  font: {
    fontWeight: "bold",
    fontSize: 15,
  },
});