import { useStorage } from '@/lib/helpers/manage-store';
import { api } from '@/redux/api';
import { type PayloadAction, configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSliceReducer from './features/auth/auth.slice';
import stocksSliceReducer from './features/stock/stock.slice';
import { sidebarReducer } from './features/sidebar';

const persistConfig = {
  key: 'root',
  storage,
};

type RootAction =
  | PayloadAction<any, 'auth/refreshToken', { payload: any }>
  | PayloadAction<void, 'user/signout'>;

const appReducer = combineReducers({
  auth: authSliceReducer,
  stocks: stocksSliceReducer,
  sidebar: sidebarReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof appReducer>;

// Define the RootReducer
const rootReducer = (
  state: RootState | undefined,
  action: RootAction
): RootState => {
  if (action.type === 'auth/refreshToken') {
    const { setAccessToken } = useStorage();
    const token = action.payload.data.access;
    setAccessToken(token, { expires: 24 / 6 });
  }
  if (action.type === 'user/signout') {
    const { removeAccessToken, removeRefreshToken } = useStorage();
    storage.removeItem('persist:root');
    state = undefined;
    removeAccessToken();
    removeRefreshToken();
    localStorage.clear();
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
