export default class Settings {
  // Inställningar
  LoginMethod: number;
  UseFpReader: string;
  StartBPTIXml: string;
  AutoRegister: string;
  SecretPNR: number;
  ArrPNr: string;
  cLoginTypP: string;
  
  constructor(LoginMethod: number, UseFpReader: string,  StartBPTIXml: string, AutoRegister: string, SecretPNR: number,ArrPNr: string ,cLoginTypP: string) 
  {
    this.LoginMethod = LoginMethod;
    this.UseFpReader = UseFpReader;
    this.StartBPTIXml= StartBPTIXml;
    this.AutoRegister= AutoRegister;
    this.SecretPNR= SecretPNR;
    this.ArrPNr= ArrPNr;
    this.cLoginTypP=cLoginTypP
}

  // Skrivare
  printAnkomstKvitto: boolean = true;
  printQueueName: string = "CUSTOM VKP80 II";
  printHost: string = "\\\\LOCALHOST";
  printFontSize: number = 10;
  mpxLeft: number = 15;
  mpxRight: number = 15;
  mpxTop: number = 0;
  mpxBottom: number = 0;
  UseMinusPNR: boolean = true;

  // Avstängd
  AnkTermDiabled: boolean = false;
  DiabledImage: string = "";
}
