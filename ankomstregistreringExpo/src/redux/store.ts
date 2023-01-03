import { configureStore } from '@reduxjs/toolkit'
import bokningReducer from './features/bokning/BokningSlice'
import userAuthReducer from './features/loggaIn/UserAuthSlice'
import betalningReducer from './features/betalning/BetalningSlice'
import uppgiftReducer from './features/uppgift/UppgiftSlice'

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