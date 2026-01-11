import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosConfig';

export const fetchMyBids = createAsyncThunk('bids/fetchMyBids', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/bids/my-bids');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const bidSlice = createSlice({
    name: 'bids',
    initialState: {
        myBids: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearBidError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyBids.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyBids.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myBids = action.payload;
            })
            .addCase(fetchMyBids.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBidError } = bidSlice.actions;
export default bidSlice.reducer;
