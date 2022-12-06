import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from "react-native";
import Settings from "../../../models/Settings";
import moment from "moment";
import "moment/locale/sv";
import Bokning from "../../../models/Bokning";
import { selectPatPNr } from "../loggaIn/userAuthSlice";
import Services from "../../../services/Services";
import { useSelector, useDispatch } from "react-redux";
import { FetchBokning } from "./bokningSlice";
import { AppDispatch } from "../../store";
import { selectUserName } from "../loggaIn/userAuthSlice";
import LoadedBokning  from '../../../models/LoadedBokning';


let loadedData: LoadedBokning[] = [];

export const BokningView = () => {
  let baseURL = "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/";
  const patPNr = useSelector(selectPatPNr);
  const Username = useSelector(selectUserName);
  const [data, SetMyData] = useState<Bokning[]>([]);
  //obj (slice)
  const bokning = useSelector((state: any) => state.bokning);
  const dispatch = useDispatch<AppDispatch>();
  var APIServices = new Services();
  const bokningar: Bokning[] = [];
  loadedData = bokning.bokningar;

  useEffect(() => {
    dispatch(FetchBokning(patPNr)).finally(() => LoadedBokningToBokning());
  }, []);

  async function Arrive(iSchSNrP: number) {
    let resp = await fetch(baseURL + `sch/Arrive?iSchSNrP=${iSchSNrP}`);
    const data = await resp.json();
    if (data.response.cResultP !== "") {
      Alert.alert(data.response.cResultP);
    }

    dispatch(FetchBokning(patPNr)).finally(() => LoadedBokningToBokning());
  }


  async function LoadedBokningToBokning() {
    if (loadedData.length > 0) {
      var from = new Date();
      let fromMin = moment(from).subtract(10, "minutes").toDate();
      let latetxt = "";
      let toolate = false;

      for (let i = 0; i < loadedData.length; i++) {
        const newBokning = {} as Bokning;
        const settings = {} as Settings;

        //stöd för försenad
        let startTid = GetDatTimeStartDate(
          loadedData[i].DatSch,
          loadedData[i].TimeStart
        );

        if (startTid < fromMin) {
          newBokning.ToLate = true;
        }

        newBokning.ImageFile = await APIServices.GetImage2(
          loadedData[i].TabYAATab,
          loadedData[i].TabYAANr
        );

        if (newBokning.ToLate && loadedData[i].Stat == 10) {
          toolate = true;
          latetxt = loadedData[i].LateTxt;
        }

        newBokning.LateText = loadedData[i].LateTxt;
        newBokning.SchSNr = loadedData[i].SchSNr;
        newBokning.EmpPDsc = loadedData[i].EmpPDsc;
        newBokning.SchPDsc = loadedData[i].SchPDsc;
        newBokning.TimeStart = loadedData[i].DatTimeStart;
        newBokning.TimeEnd = loadedData[i].DatTimeEnd;
        newBokning.Welcome = loadedData[i].WelcomeTxt;
        newBokning.Stat = loadedData[i].Stat;
        newBokning.DatTimeStart = GetDatTimeStart(
          loadedData[i].DatSch,
          loadedData[i].TimeStart
        );

        newBokning.DatTimeEnd = GetDatTimeEnd(
          loadedData[i].DatSch,
          loadedData[i].TimeEnd
        );

        bokningar.push(newBokning);
       console.log("asdsssssssssss", settings.AutoRegister);
        if (bokningar[i].Stat == 10 && settings.AutoRegister) {
          // Ankomstregistrera denna!
          let res = await Arrive(bokningar[i].SchSNr);
          if (res != null && res !== "") {
          } else {
            bokningar[i].Stat = 20;
            // newBlock.Ankommen = true;
            // newBlock.SetSelect(true);
         
          }
        }
        if (toolate) {
          if (latetxt !== "") {
            latetxt = "Kontakta receptionen.";
            Alert.alert("Tiden för en bokning har passerats.\n" + latetxt);
          }
        }
      }
    }
    SetMyData(bokningar);
  }

  function GetDatTimeStartDate(value: number, min: number) {
    let date: Date = new Date(value);
    date.setMinutes(min);
    return date;
  }

  function GetDatTimeStart(value: number, min: number) {
    let date: Date = new Date(value);
    date.setMinutes(min);
    var newFormat = moment(date).format("llll");
    let dateString = newFormat.split(" ");
    let myArray: string[] = [
      dateString[0],
      dateString[1],
      dateString[2],
      dateString[4],
    ];
    let myArrayJoin = myArray.join(" ");
    return myArrayJoin;
  }

  function GetDatTimeEnd(value: number, min: number) {
    let date: Date = new Date(value);
    date.setMinutes(min);
    var newFormat = moment(date).format("llll");
    let dateString = newFormat.split(" ");
    let time = dateString[4];
    return time;
  }

  const RenderItem = ({ item }: { item: Bokning }) => {
    if (item.Stat >= 20 && item.Stat < 40) {
      if (!item.ImageFile) {
        return (
          <View style={styles.item}>
            <View style={styles.flex1}>
              <View>
                <Text>{Username}</Text>
              </View>
              <View>
                <Text>
                  {item.DatTimeStart} - {item.DatTimeEnd}
                </Text>
              </View>
            </View>
            <Text></Text>
            <Text>Ansvarig: {item.EmpPDsc}</Text>
            <Text>Plats: {item.SchPDsc} </Text>
            <Text>{item.Welcome}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.item}>
            <View style={styles.flex1}>
              <View>
                <Text>{Username}</Text>
              </View>
              <View>
                <Text>
                  {item.DatTimeStart} - {item.DatTimeEnd}
                </Text>
              </View>
            </View>
            <Text></Text>
            <Text>Ansvarig: {item.EmpPDsc}</Text>
            <Text>Plats: {item.SchPDsc} </Text>
            <Text>{item.Welcome}</Text>
            <Text></Text>
            <Image
              source={{
                uri: `data:image/jpg;base64,${item.ImageFile}`,
              }}
              style={{ height: 220, width: 200 }}
            />
          </View>
        );
      }
    } else {
      if (!item.ImageFile) {
        return (
          <View style={styles.item}>
            <View style={styles.flex1}>
              <View>
                <Text>{Username}</Text>
              </View>
              <View>
                <Text>
                  {item.DatTimeStart} - {item.DatTimeEnd}
                </Text>
              </View>
            </View>
            <Text></Text>
            <Text>Ansvarig: {item.EmpPDsc}</Text>
            <Text>Plats: {item.SchPDsc} </Text>
            <Text>{item.Welcome}</Text>
            <Text></Text>
            <TouchableOpacity
              onPress={() => Arrive(item.SchSNr)}
              style={styles.button}
            >
              <Text style={styles.Bold}>Anmäl ankomst</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.item}>
            <View style={styles.flex1}>
              <View>
                <Text>{Username}</Text>
              </View>
              <View>
                <Text>
                  {item.DatTimeStart} - {item.DatTimeEnd}
                </Text>
              </View>
            </View>
            <Text></Text>
            <Text>Ansvarig: {item.EmpPDsc}</Text>
            <Text>Plats: {item.SchPDsc} </Text>
            <Text>{item.Welcome}</Text>
            <Text></Text>
            <Image
              source={{
                uri: `data:image/jpg;base64,${item.ImageFile}`,
              }}
              style={{ height: 200, width: 200 }}
            />
            <Text></Text>
            <TouchableOpacity
              onPress={() => Arrive(item.SchSNr)}
              style={styles.button}
            >
              <Text style={styles.Bold}>Anmäl ankomst</Text>
            </TouchableOpacity>
            <Text></Text>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.view}>
      {loadedData.length > 1 && (
        <Text style={styles.Title}>Dagens bokningar</Text>
      )}
      {loadedData.length == 1 && (
        <Text style={styles.Title}>Dagens bokning</Text>
      )}

      <FlatList
        data={data}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  Title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
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

  Bold: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },

  Bold1: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
