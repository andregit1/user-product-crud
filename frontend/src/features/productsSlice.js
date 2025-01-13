import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../apollo/client';
import { GET_PRODUCTS_QUERY } from '../graphql/queries';
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION, DELETE_PRODUCT_MUTATION } from '../graphql/mutations';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const { data } = await client.query({ query: GET_PRODUCTS_QUERY });
  return data.products;
});

export const createProduct = createAsyncThunk('products/createProduct', async ({ name, price, stock }) => {
  const { data } = await client.mutate({
    mutation: CREATE_PRODUCT_MUTATION,
    variables: { name, price, stock },
  });
  return data.createProduct;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, name, price, stock }) => {
  const { data } = await client.mutate({
    mutation: UPDATE_PRODUCT_MUTATION,
    variables: { id, name, price, stock },
  });
  return data.updateProduct;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await client.mutate({
    mutation: DELETE_PRODUCT_MUTATION,
    variables: { id },
  });
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((product) => product.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;