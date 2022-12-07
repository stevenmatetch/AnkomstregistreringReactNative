import { LoadedUppgift } from '../../../models/LoadedUppgift';
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import  DataStateUppgift  from '../../../models/DataStateUppgift';

const initialState:DataStateUppgift  = {
  loading: false,
  uppgifter: [],
  error: null,
};

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
    const myArray = await response.json();
    var x = myArray.response.AnkTt;
    const { "Ank-tt": myData } = x; 
    return myData;
});


const uppgiftSlice = createSlice({
  name: 'uppgift',
  initialState,
  reducers:{},
  extraReducers: builder => {
    builder.addCase(FetchUppgift.pending, state => {
      state.loading = true;
    });
    builder.addCase(FetchUppgift.fulfilled, (state, action:PayloadAction<LoadedUppgift[]>) => {
      state.loading = false;
      state.uppgifter = action.payload;
    });
    builder.addCase(FetchUppgift.rejected, (state, action:PayloadAction<any>) => {
      state.loading = false;
      state.uppgifter = [];
      state.error = action.payload;
    });
  },
});

export default uppgiftSlice.reducer;
