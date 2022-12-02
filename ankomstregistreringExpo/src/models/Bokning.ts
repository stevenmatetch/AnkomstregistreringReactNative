export default interface Bokning {
  EmpPDsc: string;
  SchPDsc: string;
  ImageFile: string;
  DatTimeStart: string;
  DatTimeEnd: string;
  Welcome: string;
  ToLate: boolean;
  LateText: string;
  Stat: number;
  SchSNr: number;
  TimeStart: number;
  TimeEnd: string;
}