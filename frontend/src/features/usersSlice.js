import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../apollo/client';
import { GET_USERS_QUERY, GET_USER_QUERY } from '../graphql/queries';
import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from '../graphql/mutations';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const { data } = await client.query({ query: GET_USERS_QUERY });
  return data.users;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id) => {
  const { data } = await client.query({
    query: GET_USER_QUERY,
    variables: { id },
  });
  return data.user;
});

export const createUser = createAsyncThunk('users/createUser', async ({ name, email }) => {
  const { data } = await client.mutate({
    mutation: CREATE_USER_MUTATION,
    variables: { name, email },
  });
  return data.createUser;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, name, email }) => {
  const { data } = await client.mutate({
    mutation: UPDATE_USER_MUTATION,
    variables: { id, name, email },
  });
  return data.updateUser;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await client.mutate({
    mutation: DELETE_USER_MUTATION,
    variables: { id },
  });
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
