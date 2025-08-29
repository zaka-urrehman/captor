import { configureStore } from '@reduxjs/toolkit'
import chatSlice from './slices/chatSlice'

export const store = configureStore({
    reducer: {
        chat: chatSlice,
    },
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
