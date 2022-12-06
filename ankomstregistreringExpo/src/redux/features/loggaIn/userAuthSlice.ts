import { createSlice ,PayloadAction} from "@reduxjs/toolkit"
import { UserAuth } from "../../../models/UserAuth";

const initialState:UserAuth = {
    isLoggedIn: false,
    userName: "",
    userToken: "",
    admin: false,
    patPNr : null,
    sessionNrCode: null,
    autoRegister: false
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
            state.sessionNrCode = action.payload.sessionNrCode;
            state.autoRegister = action.payload.autoRegister;
        },

        setSignOut: (state) =>  {
            state.userName = "";
            state.isLoggedIn = false;
            state.userToken = "";
            state.admin = false;
            state.sessionNrCode = null;
            state.autoRegister = false;
        }
    }
});

export const { setSignIn, setSignOut } = authSlice.actions;
export const selectAutoRegister = (state:any) => state.userAuth.autoRegister;
export const selectIsLoggedIn = (state:any) => state.userAuth.isLoggedIn;
export const selectUserName = (state:any) => state.userAuth.userName;
export const selectAdmin = (state:any) => state.userAuth.admin;
export const selectPatPNr = (state:any) => state.userAuth.patPNr;
export const selectsessionNrCode = (state:any) => state.userAuth.sessionNrCode;
export default authSlice.reducer;