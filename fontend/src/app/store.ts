import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from 'src/features/auth/authSlice';
import notiReducer from 'src/features/notiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    noti: notiReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
