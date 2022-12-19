import { LoadedUppgift } from '../../../models/LoadedUppgift';
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import  DataStateUppgift  from '../../../models/DataStateUppgift';

const initialState:DataStateUppgift = {
  loading: false,
  uppgifter: []
}

export const FetchUppgift = createAsyncThunk('',async (patPNr: number) => {  
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
            SaveResult: ""
          }
        ]
      }
    }
  }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    }

    const response = await fetch('http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/GetPatPParam', requestOptions);
    const data = await response.json();
    const x = data.response.AnkTt;
    const { "Ank-tt": myData } = x; 
    return myData;
})


const uppgiftSlice = createSlice({
  name: 'uppgift',
  initialState,
  reducers:{},
  extraReducers: builder => {
    builder.addCase(FetchUppgift.pending, state => {
      state.loading = true;
    })
    builder.addCase(FetchUppgift.fulfilled, (state, action:PayloadAction<LoadedUppgift[]>) => {
      state.loading = false;
      state.uppgifter = action.payload;
    })
    builder.addCase(FetchUppgift.rejected, (state) => {
      state.loading = false;
      state.uppgifter = [];
    })
  }
})

export default uppgiftSlice.reducer;
