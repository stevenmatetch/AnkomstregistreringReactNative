import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import moment from "moment";
import "moment/locale/sv";
import { selectAutoRegister } from "../loggaIn/UserAuthSlice";
import Bokning from "../../../models/Bokning";
import { selectPatPNr } from "../loggaIn/UserAuthSlice";
import Services from "../../../services/Services";
import { useSelector, useDispatch } from "react-redux";
import { FetchBokning } from "./BokningSlice";
import { AppDispatch } from "../../Store";
import { selectUserName } from "../loggaIn/UserAuthSlice";
import LoadedBokning from "../../../models/LoadedBokning";

let loadedData: LoadedBokning[] = [];
let HalfBookingTime: number = 0;
let BookingStartDateTime: Date = new Date();

export const BokningView = () => {
  const settings_AutoRegister = useSelector(selectAutoRegister);
  let baseURL = "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/";
  const patPNr = useSelector(selectPatPNr);
  const Username = useSelector(selectUserName);
  const [data, SetMyData] = useState<Bokning[]>([]);
  const [toLateMoreThanHalfBookingTime, SetoLateMoreThanHalfBookingTime] = useState<boolean>(false);

  //obj (slice)
  const bokning = useSelector((state: any) => state.bokning);
  const dispatch = useDispatch<AppDispatch>();
  const APIServices = new Services();
  const bokningar: Bokning[] = [];
  loadedData = bokning.bokningar;
  
  useEffect(() => {
    dispatch(FetchBokning(patPNr)).finally(() => LoadedBokningToBokning());
  }, []);

  async function Arrive(iSchSNrP: number) {
    console.log(1);
    const resp = await fetch(baseURL + `sch/Arrive?iSchSNrP=${iSchSNrP}`);
    const data = await resp.json();
    console.log(2);
    if (data.response.cResultP !== "") {
      Alert.alert(data.response.cResultP);
      dispatch(FetchBokning(patPNr)).finally(() => LoadedBokningToBokning());
      return "nej";
    } else {
      dispatch(FetchBokning(patPNr)).finally(() => LoadedBokningToBokning());
      return "ja";
    }
  }

  async function LoadedBokningToBokning() {

    if (loadedData.length > 0) {
      const from: Date = new Date();
      const fromMin = moment(from).subtract(10, "minutes").toDate();
      let latetxt = "";
      let toolate = false;
      const dateTimeNow: Date = new Date();
      let datTimeEnd: string = "";
      let toLateMoreThanHalfBookingTime:Boolean = false;
      console.log(loadedData);
   
      console.log("hhhh", HalfBookingTime);
      const newBookingTime = moment(BookingStartDateTime)
        .add(HalfBookingTime, "minutes")
        .toDate();
      console.log("21.20", newBookingTime);

      for (let i = 0; i < loadedData.length; i++) {
        const newBokning = {} as Bokning;

        //st??d f??r f??rsenad
        let startTid = GetDatTimeStartDate(
          loadedData[i].DatSch,
          loadedData[i].TimeStart
        );

        console.log(startTid);
        BookingStartDateTime = startTid;
        console.log("startTime:",BookingStartDateTime);// 21:00

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
        newBokning.DatTimeStart = GetDatTimeStartString(
          loadedData[i].DatSch,
          loadedData[i].TimeStart
        );

        newBokning.DatTimeEnd = GetDatTimeEndString(
          loadedData[i].DatSch,
          loadedData[i].TimeEnd
        );
        datTimeEnd = newBokning.DatTimeEnd;

        let halfBookingTime = GetHalfBookingTime(
          loadedData[i].DatSch,
          loadedData[i].TimeStart,
          loadedData[i].TimeEnd
        );
        HalfBookingTime = halfBookingTime;
        console.log("A",dateTimeNow);
        console.log("b",newBookingTime);

        if (dateTimeNow > newBookingTime) {
          SetoLateMoreThanHalfBookingTime(true);
          console.log("jaaaaaaaaaaaaaaaaaaaaa!")
          newBokning.toLateMoreThanHalfBookingTime = true;
          // mer ??n halva bokningstiden
        }
        /* if(fromMin > HalvBookingTime)*/
        //sen
       /* if (startTid < fromMin) {
          bokningar.push(newBokning);
        }
        */

        // i tid
        if (startTid > fromMin) {
          bokningar.push(newBokning);
        }

        console.log("asdsssssssssss", settings_AutoRegister);
        if (loadedData[i].Stat == 10 && settings_AutoRegister) {
          console.log("yes");
          // Ankomstregistrera denna!
          let res = await Arrive(bokningar[i].SchSNr);
          console.log("res", res);
          if (res !== null && res !== "") {
            console.log("tom");
          }
          if (res == "ja") {
            console.log("autoreg");
            loadedData[i].Stat = 20;
            // newBlock.Ankommen = true;
            // newBlock.SetSelect(true);
          }
        }

        if (toolate) {
          if (latetxt !== "") {
            latetxt = "Kontakta receptionen.";
            Alert.alert("Tiden f??r en bokning har passerats.\n" + latetxt);
          }

          if (latetxt == "") {
            Alert.alert("Tiden f??r en bokning har passerats.");
          }
        }
      }
    }
    SetMyData(bokningar);
  }

  function GetHalfBookingTime(
    DatSch: number,
    TimeStart: number,
    TimeEnd: number
  ) {
    const dateStart: Date = new Date(DatSch);
    dateStart.setMinutes(TimeStart);

    const dateEnd: Date = new Date(DatSch);
    dateEnd.setMinutes(TimeEnd);

    let diff = (dateEnd.getTime() - dateStart.getTime()) / 1000;
    diff /= 60;
    const halfDiff = diff / 2;
    return Math.abs(Math.round(halfDiff));
  }

  function GetDatTimeStartDate(value: number, min: number) {
    const date: Date = new Date(value);
    date.setMinutes(min);
    return date;
  }

  function GetDatTimeStartString(value: number, min: number) {
    const date: Date = new Date(value);
    date.setMinutes(min);
    const newFormat = moment(date).format("llll");
    const dateString = newFormat.split(" ");
    const myArray: string[] = [
      dateString[0],
      dateString[1],
      dateString[2],
      dateString[4],
    ];
    const myArrayJoin = myArray.join(" ");
    return myArrayJoin;
  }

  function GetDatTimeEnd(value: number, min: number) {
    let date: Date = new Date(value);
    date.setMinutes(min);
    let newFormat = moment(date).format("llll");
    let dateString = newFormat.split(" ");
    let time = dateString[4];
    return time;
  }

  function GetDatTimeEndString(value: number, min: number) {
    const date: Date = new Date(value);
    date.setMinutes(min);
    const newFormat = moment(date).format("llll");
    const dateString = newFormat.split(" ");
    const time = dateString[4];
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
    } else 
    {
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
              <Text style={styles.Bold}>Anm??l ankomst</Text>
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
              <Text style={styles.Bold}>Anm??l ankomst</Text>
            </TouchableOpacity>
            <Text></Text>
          </View>
        );
      }
    }
  
  };

  return (
    <View style={styles.view}>
      {data.length > 1 && <Text style={styles.Title}>Dagens bokningar</Text>}
      {data.length == 1 && <Text style={styles.Title}>Dagens bokning</Text>}

      {bokning.loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large"></ActivityIndicator>
        </View>
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
