import * as Device from "expo-device";
let baseURL = "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/";

export default class Services 
{ 
  async GetImage2(cTabP:number, iNrP:number) 
  {
    const resp = await fetch(baseURL + `sch/GetImage2?cParamP=AnkImage&cTabP=${cTabP}&iNrP=${iNrP}`);
    const data = await resp.json();
    const base64Image = data.response.cBase64P;
    return base64Image;
  }

  async GetAdminPassword() 
  {
    const resp = await fetch(baseURL +`rest/AnkRegAPI/gen/FindFirst?cTableP=AppYA&cWhereStrP=AppYId ="AnkPassword"&cDataStrP=PrmChr`);
    const data = await resp.json();
    const password = data.response.cDataStrP;
    return password;
  }
  
  async GetSettings() 
  {
    let deviceName = Device.deviceName;
    const resp = await fetch(baseURL + `arr/GetArrP?cComputerIdP=${deviceName}`);
    const data = await resp.json();
    return data;  
  }

  async  GetSessionNrCode() {
    const resp = await fetch(baseURL + `gen/GetSessionNr`);
    const data = await resp.json();
    return data.response.iSessionNrP;
  }
 
  async FetchFindFirstEcoP(EcoPNr:number) 
  {
    const respFindFirstEcoP = await fetch(baseURL +`rest/AnkRegAPI/gen/FindFirst?cTableP=EcoP&cWhereStrP=EcoPNr=${EcoPNr}&cDataStrP=Dsc`);
    const dataFindFirstEcoP = await respFindFirstEcoP.json();
    return dataFindFirstEcoP.response.cDataStrP;
  }
  
}
