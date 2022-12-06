import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Settings from "../../../models/Settings";
import EcoP from "../../../models/EcoP";
import Services from "../../../services/Services";
import CustomButton from "../../../CustomButton/CustomButton";
import CustomInput from "../../../CustomInput/CustomInput";
import { useDispatch } from "react-redux";
import { setSignIn } from "./userAuthSlice";

export default function LoggaInView() {
  //const user = useSelector(selectUserName);
  let Username = "";
  let PatPNr = 0;
  var APIServices = new Services();
  const settings = {} as Settings;
  const vardenheter: EcoP[] = [];
  const [currentLoginMethod, setLoginMethod] = useState(0);
  const [secretPNR, setSecretPNRMethod] = useState(false);
  const [AutoRegister, setAutoRegisterMethod] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  function getEcoPList(theseEcoP: EcoP[]) {
    let retVal = "";
    for (let i = 0; i < theseEcoP.length; i++) {
      if (retVal != "") {
        retVal += "%01";
      }
      retVal += theseEcoP[i].EcoPNr.toString();
    }
    return retVal;
  }

  const GetSettings = async () => {
    var data = await APIServices.GetSettings();
    let Typ = data.response.cLoginTypP;
    var result = data.response.EcoPTt;
    const { "EcoP-tt": myData } = result;
   //sdasd
    if (data.response.iArrPNrP > 0) {
      settings.ArrPNr = data.response.iArrPNrP;
      settings.AutoRegister = data.response.lAutoRegP;
      settings.UseMinusPNR = data.response.lPnrFormatP;
      settings.SecretPNR = data.response.lPnrHiddenP;
      settings.UseFpReader = data.response.lUseFingerP;
      settings.cLoginTypP = data.response.cLoginTypP;

      switch (Typ) {
        case "PNR":
          settings.LoginMethod = 2;
          break;
        case "PNRFP":
          settings.LoginMethod = 1;
          break;
        case "PIN":
          settings.LoginMethod = 0;
          break;
        default:
          settings.LoginMethod = 0;
          break;
      }

      setLoginMethod(settings.LoginMethod);
      setSecretPNRMethod(settings.SecretPNR);
      setAutoRegisterMethod(settings.AutoRegister);
 
    }

    for (let i = 0; i < myData.length; i++) {
      const newEcoP = {} as EcoP;
      newEcoP.EcoPNr = myData[i].EcoPNr;
      newEcoP.EcoPId = myData[i].EcoPId;
      newEcoP.Dsc = myData[i].Dsc;
      vardenheter.push(newEcoP);
    }
  };

  async function LoggInClicked(txtPersonNr: string, txtPIN: string) {
    //CheckPIN
    if (txtPersonNr.length == 13) {
      txtPersonNr = txtPersonNr.substring(2);
      txtPersonNr = txtPersonNr.replace("-", "");
      //?
    }

    if (txtPIN !== "") {
      let pwd = "";
      //if ()/*carita != null*/
      //{
      pwd = await APIServices.GetAdminPassword();
      if (txtPersonNr.toLowerCase() == "admin" && txtPIN == pwd) {
        const user = {
          isLoggedIn: true,
          admin: true,
        };
        dispatch(setSignIn(user));
      } else {
        const resp = await fetch(
          `http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/CheckPinCode?cPatPIdP=${txtPersonNr}&cPinCodeP=${txtPIN}&cEcoPNrListP=${getEcoPList(
            vardenheter
          )}`
        );

        const data = await resp.json();

        if (data.response.cMessageP !== "") {
          //?
          Alert.alert(data.response.cMessageP);
        }

        if (data.response.lResultP == true) {
          return await SetPatient(txtPersonNr);
        }
      }
    }
  }

  async function SetPatient(pNr: string) {
    //testa

    if (pNr.length == 10 || pNr.length == 11) pNr = "19" + pNr;
    if (pNr.length == 12) pNr = pNr.substring(0, 8) + "-" + pNr.substring(8);
    if (pNr.length == 13) {

      pNr = pNr.substring(2);   
      pNr = pNr.replace("-", "");
      /*
      if (settings.UseMinusPNR !== true) 
      {
        console.log("dontuseMinus")
        pNr = pNr.replace("-", "");
      }
      */

      //Findfirst???
      const url = `http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/gen/FindFirst?cTableP=PatP&cWhereStrP=PatPId="${pNr}" AND Century=19&cDataStrP=Dsc%01PatPNr%01EcoPN`;
      const resp = await fetch(url);
      let data = await resp.json();

      if (data.response.lAvailableP == true) {
        let result = data.response.cDataStrP;
        result = result.split("\u0000");
        Username = result[0];
        PatPNr = result[1];
        return data.response.lAvailableP;
        // if (carita.GetPatPAnkStop(appserver, currentPatPNr))
        //{
        // Ankomstterminalen är spärrad
        //   success = false;
        // }
        //else
        //{
        //   success = true;
        // Aktivera betalning om det finns!
        //}
      } else {
        Alert.alert(
          "Du kunde inte loggas in. Kontrollera inloggningsuppgifterna och försök igen!\r\nKontakta receptionen om problemet kvarstår."
        );
      }
    }
  }

  async function LoginHandle(txtPersonNr: string, txtPIN: string) {
    if (currentLoginMethod == 2) {
      if (txtPersonNr !== "") {
        let lAvailableP = await SetPatient(txtPersonNr);

        if (lAvailableP == true) {
          let sessionNr: number = await APIServices.GetSessionNrCode();
          const user = {
            isLoggedIn: true,
            userName: Username,
            admin: false,
            patPNr: PatPNr,
            sessionNrCode: sessionNr,
            autoRegister: AutoRegister,
          }
          console.log("aaa",AutoRegister)
          dispatch(setSignIn(user));
        }
      }
    } else {
      if (txtPersonNr !== "" && txtPIN !== "") {
        let lAvailableP = await LoggInClicked(txtPersonNr, txtPIN);
        if (lAvailableP == true) {
          let sessionNr: number = await APIServices.GetSessionNrCode();
          const user = {
            isLoggedIn: true,
            userName: Username,
            admin: false,
            patPNr: PatPNr,
            sessionNrCode: sessionNr,
            autoRegister: AutoRegister,
          }
          dispatch(setSignIn(user));
        }
      }
    }
  }

  useEffect(() => {
    GetSettings();
  }, []);

  if (currentLoginMethod == 2) {
    if(secretPNR == false){
      return (
        <View style={styles.container}>
          <View>
            <CustomInput
              placeholder="ÅÅÅÅMMDD-XXXX"
              value={username}
              setValue={setUsername}
              secureTextEntry={false}
            />
            <CustomButton
              text="Logga in"
              onPress={() => LoginHandle(username, password)}
            />
          </View>
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          <View>
            <CustomInput
              placeholder="ÅÅÅÅMMDD-XXXX"
              value={username}
              setValue={setUsername}
              secureTextEntry={true}
            />
            <CustomButton
              text="Logga in"
              onPress={() => LoginHandle(username, password)}
            />
          </View>
        </View>
      );
    }
  
  } else {
    if(secretPNR == false){
      return (
        <View style={styles.container}>
          <View>
            <CustomInput
              placeholder="ÅÅÅÅMMDD-XXXX"
              value={username}
              setValue={setUsername}
              secureTextEntry={false}
            />
            <CustomInput
              placeholder="Pinkod"
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
            />
            <CustomButton
              text="Logga in"
              onPress={() => LoginHandle(username, password)}
            />
          </View>
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
          <View>
            <CustomInput
              placeholder="ÅÅÅÅMMDD-XXXX"
              value={username}
              setValue={setUsername}
              secureTextEntry={true}
            />
            <CustomInput
              placeholder="Pinkod"
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
            />
            <CustomButton
              text="Logga in"
              onPress={() => LoginHandle(username, password)}
            />
          </View>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F9FBFC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "aliceblue",
  },
});
