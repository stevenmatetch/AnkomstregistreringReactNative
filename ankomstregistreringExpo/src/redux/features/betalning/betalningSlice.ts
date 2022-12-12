import { DataStateBetalPost } from './../../../models/DatastateBetalPost';
import { LoadedBetalPost } from './../../../models/LoadedBetalPost';
import {createSlice, createAsyncThunk,PayloadAction} from '@reduxjs/toolkit';

const initialState:DataStateBetalPost = {
  loading: false,
  betalningar: []
}

const baseURL = "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/";

export const FetchBetalning = createAsyncThunk("",async ({ patPNr, sessionNrCode }:{ patPNr: number, sessionNrCode: number }) => {
  const resp = await fetch(baseURL +`pat/PatPayNewExternal?lInitP=true&iPatPNrP=${patPNr}&iEcoPNrP=0&deRecivedP=0&cTxtCepaP=${""}&iSessionNrP=${sessionNrCode}`);
  const data = await resp.json();
  var result = data.response.InfoTt;
  const { "Info-tt": myData } = result;
  return myData;
})

const betalningSlice = createSlice({
  name: 'betalning',
  initialState,
  reducers:{}, 
  extraReducers: builder => {  
    builder.addCase(FetchBetalning.pending, state => {
      state.loading = true;
    })
    builder.addCase(FetchBetalning.fulfilled, (state,  action: PayloadAction<LoadedBetalPost[]>) => {
      state.loading = false;
      state.betalningar = action.payload;
    })
    builder.addCase(FetchBetalning.rejected, (state) => {
      state.loading = false;
      state.betalningar = [];
    })
  }
})

export default betalningSlice.reducer;
