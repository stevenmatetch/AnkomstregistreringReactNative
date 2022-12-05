import {createSlice,createAsyncThunk,PayloadAction} from '@reduxjs/toolkit';
import Bokning from '../../../models/Bokning';
import moment from 'moment';
import "moment/locale/sv";
import { DataStateBokning } from '../../../models/DataStateBoking';
import LoadedBokning from '../../../models/LoadedBokning';

const initialState: DataStateBokning = {
  loading: false,
  bokningar: [],
  error: null,
};

export const FetchBokning = createAsyncThunk("",async (PatPNr:number) => {
  var from = new Date();
  from.setMinutes(from.getMinutes() - 10);
  const fromNewFormat = moment(from).format("L");
  var to = new Date();
  to.setHours(to.getHours() + 12);
  const toNewFormat = moment(to).format("L");
  const resp = await fetch(`http://scssrv6.scs.lan:7710/CaritaAnkRegAPI/rest/AnkRegAPI/sch/SchGetSchS?iPatPNrP=${PatPNr}&dDatSchStartP=${fromNewFormat}&dDatSchEndP=${toNewFormat}`);
  const data = await resp.json();
  var result = data.response.SchSTt;
  const { "SchS-tt": myData } = result;
  return myData;
});


const bokningSlice = createSlice({
  name: 'bokning',
  reducers:{},
  initialState,
  extraReducers: builder => {
    builder.addCase(FetchBokning.pending, state => {
      state.loading = true;
    });
    builder.addCase(FetchBokning.fulfilled, (state, action: PayloadAction<LoadedBokning[]>) => {
      state.loading = false;
      state.bokningar = action.payload;
      state.error = '';
    });
    builder.addCase(FetchBokning.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.bokningar = [];
      state.error = action.payload;
    });
  },
});

export default bokningSlice.reducer;
