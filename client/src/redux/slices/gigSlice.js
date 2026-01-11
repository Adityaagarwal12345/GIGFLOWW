import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

const initialState = {
    gigs: [],
    currentGig: null, // For details view
    gigsLoading: false,
    gigsError: null,
};

export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async (keyword = '', { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs?keyword=${keyword}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/gigs/my-gigs');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const createGig = createAsyncThunk('gigs/create', async (gigData, thunkAPI) => {
    try {
        const response = await api.post('/gigs', gigData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
});

export const fetchGigById = createAsyncThunk('gigs/fetchOne', async (gigId, thunkAPI) => {
    try {
        const response = await api.get(`/gigs/${gigId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const gigSlice = createSlice({
    name: 'gigs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Gigs
            .addCase(fetchGigs.pending, (state) => {
                state.gigsLoading = true;
            })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.gigsLoading = false;
                state.gigs = action.payload;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.gigsLoading = false;
                state.gigsError = action.payload;
            })
            // Create Gig (rejected)
            .addCase(createGig.rejected, (state, action) => {
                state.gigsLoading = false;
                state.gigsError = action.payload;
            })
            // Fetch My Gigs
            .addCase(fetchMyGigs.pending, (state) => {
                state.gigsLoading = true;
                state.gigsError = null;
            })
            .addCase(fetchMyGigs.fulfilled, (state, action) => {
                state.gigsLoading = false;
                state.gigs = action.payload; // We can reuse the main gigs array or creating a separate one `myGigs`. Using `gigs` for simplicity as dashboard view switches.
            })
            .addCase(fetchMyGigs.rejected, (state, action) => {
                state.gigsLoading = false;
                state.gigsError = action.payload;
            })
            // Create Gig (fulfilled)
            .addCase(createGig.fulfilled, (state, action) => {
                state.gigs.push(action.payload);
            })
            // Fetch Gig details
            .addCase(fetchGigById.pending, (state) => {
                state.gigsLoading = true;
            })
            .addCase(fetchGigById.fulfilled, (state, action) => {
                state.gigsLoading = false;
                state.currentGig = action.payload;
            })
            .addCase(fetchGigById.rejected, (state, action) => {
                state.gigsLoading = false;
                state.gigsError = action.payload;
            });
    },
});

export default gigSlice.reducer;
