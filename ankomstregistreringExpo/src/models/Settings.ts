export default class Settings {
  
   ArrPNr:number=  0;

  // Inställningar
  LoginMethod: number;
  UseFpReader: boolean;
  StartBPTIXml: boolean;
  AutoRegister: boolean;
  SecretPNR: boolean;
  cLoginTypP: boolean;
  
  constructor(LoginMethod: number, UseFpReader: boolean,  StartBPTIXml: boolean, AutoRegister: boolean, SecretPNR: boolean,cLoginTypP: boolean) 
  {
    this.LoginMethod = LoginMethod;
    this.UseFpReader = UseFpReader;
    this.StartBPTIXml= StartBPTIXml;
    this.AutoRegister= AutoRegister;
    this.SecretPNR= SecretPNR;
   
    this.cLoginTypP=cLoginTypP;
}

  UseMinusPNR:boolean = true;

  // Skrivare
  printAnkomstKvitto: boolean = true;
  printQueueName: string = "CUSTOM VKP80 II";
  printHost: string = "\\\\LOCALHOST";
  printFontSize: number = 10;
  mpxLeft: number = 15;
  mpxRight: number = 15;
  mpxTop: number = 0;
  mpxBottom: number = 0;
  

  // Avstängd
  AnkTermDiabled: boolean = false;
  DiabledImage: string = "";
}
