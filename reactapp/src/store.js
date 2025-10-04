import { configureStore } from '@reduxjs/toolkit';
 
// Dummy reducer (replace with actual slices if needed)
const dummyReducer = (state = {}, action) => state;
 
const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
});
 
export default store;