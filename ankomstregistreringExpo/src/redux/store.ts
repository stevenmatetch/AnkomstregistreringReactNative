import { configureStore } from '@reduxjs/toolkit'
import bokningReducer from './features/bokning/bokningSlice'
import userAuthReducer from './features/loggaIn/userAuthSlice'
import betalningReducer from './features/betalning/betalningSlice'
import uppgiftReducer from './features/uppgifter/uppgifterSlice'

export const store = configureStore({
  reducer: {
    bokning: bokningReducer,
    userAuth: userAuthReducer,
    betalning:betalningReducer,
    uppgift:uppgiftReducer
  },
})


export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch