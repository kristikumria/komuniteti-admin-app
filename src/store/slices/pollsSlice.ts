import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll, PollResponse, PollSummary } from '../../navigation/types';

export interface PollsState {
  polls: Poll[];
  activePoll: Poll | null;
  pollResponses: PollResponse[];
  pollSummary: PollSummary | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  activePoll: null,
  pollResponses: [],
  pollSummary: null,
  loading: false,
  submitting: false,
  error: null,
};

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    // Fetch polls
    fetchPollsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPollsSuccess: (state, action: PayloadAction<Poll[]>) => {
      state.polls = action.payload;
      state.loading = false;
    },
    fetchPollsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Fetch single poll
    fetchPollRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPollSuccess: (state, action: PayloadAction<Poll>) => {
      state.activePoll = action.payload;
      state.loading = false;
    },
    fetchPollFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Create poll
    createPollRequest: (state) => {
      state.submitting = true;
      state.error = null;
    },
    createPollSuccess: (state, action: PayloadAction<Poll>) => {
      state.polls.push(action.payload);
      state.submitting = false;
    },
    createPollFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    
    // Update poll
    updatePollRequest: (state) => {
      state.submitting = true;
      state.error = null;
    },
    updatePollSuccess: (state, action: PayloadAction<Poll>) => {
      const index = state.polls.findIndex(poll => poll.id === action.payload.id);
      if (index !== -1) {
        state.polls[index] = action.payload;
      }
      if (state.activePoll && state.activePoll.id === action.payload.id) {
        state.activePoll = action.payload;
      }
      state.submitting = false;
    },
    updatePollFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    
    // Delete poll
    deletePollRequest: (state) => {
      state.submitting = true;
      state.error = null;
    },
    deletePollSuccess: (state, action: PayloadAction<string>) => {
      state.polls = state.polls.filter(poll => poll.id !== action.payload);
      if (state.activePoll && state.activePoll.id === action.payload) {
        state.activePoll = null;
      }
      state.submitting = false;
    },
    deletePollFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    
    // Submit poll response
    submitPollResponseRequest: (state) => {
      state.submitting = true;
      state.error = null;
    },
    submitPollResponseSuccess: (state, action: PayloadAction<PollResponse>) => {
      state.pollResponses.push(action.payload);
      state.submitting = false;
    },
    submitPollResponseFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
    
    // Fetch poll summary
    fetchPollSummaryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPollSummarySuccess: (state, action: PayloadAction<PollSummary>) => {
      state.pollSummary = action.payload;
      state.loading = false;
    },
    fetchPollSummaryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear active poll
    clearActivePoll: (state) => {
      state.activePoll = null;
    },
    
    // Reset polls state
    resetPolls: () => initialState,
  },
});

export const {
  fetchPollsRequest,
  fetchPollsSuccess,
  fetchPollsFailure,
  fetchPollRequest,
  fetchPollSuccess,
  fetchPollFailure,
  createPollRequest,
  createPollSuccess,
  createPollFailure,
  updatePollRequest,
  updatePollSuccess,
  updatePollFailure,
  deletePollRequest,
  deletePollSuccess,
  deletePollFailure,
  submitPollResponseRequest,
  submitPollResponseSuccess,
  submitPollResponseFailure,
  fetchPollSummaryRequest,
  fetchPollSummarySuccess,
  fetchPollSummaryFailure,
  clearActivePoll,
  resetPolls,
} = pollsSlice.actions;

export default pollsSlice.reducer; 