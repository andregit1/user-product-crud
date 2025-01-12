import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import usersReducer from './features/usersSlice';
import productsReducer from './features/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    products: productsReducer,
  },
});

export default store;
