import {createSlice, createAsyncThunk,PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  betalningar: [],
  error: '',
};

let baseURL = "http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/";


export const FetchBetalningar = createAsyncThunk("",async ({ patPNr, sessionNrCode }: { patPNr: number, sessionNrCode: number }) => {
  const resp = await fetch(baseURL +`pat/PatPayNewExternal?lInitP=true&iPatPNrP=${patPNr}&iEcoPNrP=0&deRecivedP=0&cTxtCepaP=${""}&iSessionNrP=${sessionNrCode}`);
  const data = await resp.json();
  var result = data.response.InfoTt;
  const { "Info-tt": myData } = result;
  return myData;
});

const betalningSlice = createSlice({
  name: 'betalning',
  initialState,
  reducers:{}, 
  extraReducers: builder => {  
    builder.addCase(FetchBetalningar.pending, state => {
      state.loading = true;
    });
    builder.addCase(FetchBetalningar.fulfilled, (state,  action: PayloadAction<any>) => {
      state.loading = false;
      state.betalningar = action.payload;
      state.error = '';
    });
    builder.addCase(FetchBetalningar.rejected, (state,  action: PayloadAction<any>) => {
      state.loading = false;
      state.betalningar = [];
      state.error = action.payload;
    });
  },
});

export default betalningSlice.reducer;
