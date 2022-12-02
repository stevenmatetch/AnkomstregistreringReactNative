import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { selectPatPNr } from '../loggaIn/userAuthSlice';
import { useSelector } from "react-redux";
import Uppgift from '../../../models/Uppgift';

export interface DataState {
  loading: boolean,
  uppgifter: null | Uppgift[],
  error: string | null,
}

const initialState: DataState = {
  loading: false,
  uppgifter: [],
  error: null,
};

export const FetchUppgifter = createAsyncThunk('',async (patPNr: number) => {  
  const jsonData = {  
    request: {
      iPatPNrP: patPNr,
      cModeP: "GET",
      AnkTt: {
        "Ank-tt": [
          {
            Id: "",
            Dsc: "",
            cValue: "",
            dValue: 0,
            lValue: false,
            ReadOnly: false,
            SaveResult: "",
          },
        ],
      },
    },
  };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    };

    const response = await fetch('http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/GetPatPParam', requestOptions);
    const myArray = await response.json()
    var x = myArray.response.AnkTt;
    const { "Ank-tt": myData } = x; 
    return myData;
});


const uppgifterSlice = createSlice({
  name: 'uppgift',
  initialState,
  reducers:{},
  extraReducers: builder => {
    builder.addCase(FetchUppgifter.pending, state => {
      state.loading = true;
    });
    builder.addCase(FetchUppgifter.fulfilled, (state, action:PayloadAction<Uppgift[]>) => {
      state.loading = false;
      state.uppgifter = action.payload;
    });
    builder.addCase(FetchUppgifter.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.uppgifter = [];
      state.error = action.payload;
    });
  },
});

export default uppgifterSlice.reducer;
