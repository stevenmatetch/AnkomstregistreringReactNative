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
import BetalPost from "../../../models/BetalPost";
import Services from "../../../services/Services";
//import * as SecureStore from "expo-secure-store";
import { FetchBetalning } from "./betalningSlice";
import {AppDispatch} from '../../store';
import { selectPatPNr } from "../loggaIn/userAuthSlice";
import {useSelector, useDispatch} from 'react-redux';
import { selectsessionNrCode } from "../loggaIn/userAuthSlice";
import { LoadedBetalPost } from "../../../models/LoadedBetalPost";

var APIServices = new Services();


let loadedData: LoadedBetalPost[] = [];

export default function BetalningView() 
{
    const dispatch = useDispatch<AppDispatch>();
    const betalning = useSelector((state: any) => state.betalning);
    const [data, SetMyData] = useState<BetalPost[]>([]);
    const patPNr = useSelector(selectPatPNr);
    const sessionNrCode = useSelector(selectsessionNrCode);
    loadedData = betalning.betalningar;
    const betalposts: BetalPost[] = [];

    async function LoadedBetalPostToBetalPost() 
    {
      for (let i = 0; i < loadedData.length; i++) 
      {
        const newBetalpost = {} as BetalPost;
        newBetalpost.name = await APIServices.FetchFindFirstEcoP(loadedData[i].EcoPNr);        
        newBetalpost.sum = loadedData[i].SumJob;
        betalposts.push(newBetalpost);
      }
     SetMyData(betalposts);
    }

  useEffect(() => {
  dispatch(FetchBetalning({patPNr,sessionNrCode})).finally(() => LoadedBetalPostToBetalPost());
  }, []);

  const CreateAlert = () =>
    Alert.alert("Betala med", "My Alert Msg", [
      {
        text: "Kort",
        onPress: () => console.log("Kort Pressed"),
        style: "cancel",
      },
      { text: "Swish", onPress: () => console.log("Swish Pressed") }
    ]);


  function Swish() 
  {
    //http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rct/SwishCl?cTxtRefP=""&cTxtRefP=""&cTxtMsgP=""&iPatPNrP=153&iEcoPNrP=1&deSumP=10
    //Verifiera telefonnummer? Finns redan i uppdatera uppgifter
    //Postlås (carita.TabLock2Pay)
    //Kör carita.pswishcl med OUTPUT SwishUUID
    //Polla (ca var 10 sek) pgetswishcl med OUTPUT Status
    //Om Status > 0: Status = 10 OK alla andra error.
    //Släpp postlås (samma som för betalkort)
    //Hämta och skriv ut kvitto
  }

  const RenderItem = ({item}: {item: BetalPost}) => {
    return (
      <View>
        <View style={styles.item}>
          <View style={styles.flex1}>
            <View>
              <Text>{item.name}</Text>
            </View>
            <View>
              <Text>{item.sum} Kr</Text>
            </View>
          </View>
          <View style={styles.flex2}>
            <View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.Bold1}>Swish</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.Bold1}>Kort</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.view}>
      <Text style={styles.Title}>Att betala</Text>
     
      <FlatList
        data={data}
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
    color: "white",

  },

  Title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
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
  }
});
