import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormData } from '../../types';

interface InvoiceState {
  invoiceData: FormData | null;
  idPresupuesto: string;
}

const initialState: InvoiceState = {
  invoiceData: null,
  idPresupuesto: ''
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    saveInvoiceData: (state, action: PayloadAction<FormData>) => {
      state.invoiceData = action.payload;
    },
    clearInvoiceData: (state) => {
      state.invoiceData = null;
    },
    setIdPresupuesto: (state, action) => {
      state.idPresupuesto = action.payload;
    }
  },
});

export const { saveInvoiceData, clearInvoiceData, setIdPresupuesto } = invoiceSlice.actions;
export default invoiceSlice.reducer;