import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormData } from '../../types';

interface InvoiceState {
  invoiceData: FormData | null;
}

const initialState: InvoiceState = {
  invoiceData: null,
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
  },
});

export const { saveInvoiceData, clearInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;