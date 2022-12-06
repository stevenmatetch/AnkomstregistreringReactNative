export interface UserAuth {
    isLoggedIn: boolean;
    userName: string;
    userToken: string;
    admin: boolean;
    patPNr : number | null;
    sessionNrCode:number | null;
     autoRegister: boolean;

}