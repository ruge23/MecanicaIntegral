import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormData } from '../../types';

interface InvoiceState {
  invoiceData: FormData | null;
  idPresupuesto: string;
  flagConFactura: boolean;
}

const initialState: InvoiceState = {
  invoiceData: null,
  idPresupuesto: '',
  flagConFactura: false
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
    },
    setFlagConFactura: (state, action) => {
      state.flagConFactura = action.payload;
    }
  },
});

export const { saveInvoiceData, clearInvoiceData, setIdPresupuesto, setFlagConFactura } = invoiceSlice.actions;
export default invoiceSlice.reducer;