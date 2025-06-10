import { configureStore } from '@reduxjs/toolkit'

// TODO: Add slicers here

export const store = configureStore({
  reducer: {
    // TODO: Add reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch