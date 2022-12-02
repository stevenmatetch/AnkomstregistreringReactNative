import { createSlice ,PayloadAction} from "@reduxjs/toolkit"

export interface UserAuth {
    isLoggedIn: boolean,
    userName: string,
    userToken: string,
    admin: boolean,
    patPNr : number | null
    sessionNrCode:number | null
}

const initialState:UserAuth = {
    isLoggedIn: false,
    userName: "",
    userToken: "",
    admin: false,
    patPNr : null,
    sessionNrCode: null
}

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {    

        setSignIn: (state, action:PayloadAction<any>) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userName = action.payload.userName;
            state.admin = action.payload.admin;
            state.patPNr = action.payload.patPNr;
            state.sessionNrCode = action.payload.sessionNrCode
        },

        setSignOut: (state) =>  {
            state.userName = "";
            state.isLoggedIn = false;
            state.userToken = "";
            state.admin = false;
            state.sessionNrCode = null
        }
    }
});

export const { setSignIn, setSignOut } = authSlice.actions;
export const selectIsLoggedIn = (state:any) => state.userAuth.isLoggedIn;
export const selectUserName = (state:any) => state.userAuth.userName;
export const selectAdmin = (state:any) => state.userAuth.admin;
export const selectPatPNr = (state:any) => state.userAuth.patPNr;
export const selectsessionNrCode = (state:any) => state.userAuth.sessionNrCode;
export default authSlice.reducer;