import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation login ($email: String!, $password: String!) {
    login (email: $email, password: $password) {
      token
      user {
        id
        name
        email
        password
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation createProduct($name: String!, $price: Float!, $stock: Int!) {
    createProduct(name: $name, price: $price, stock: $stock) {
      id
      name
      price
      stock
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation updateProduct($id: ID!, $name: String!, $price: Float!, $stock: Int!) {
    updateProduct(id: $id, name: $name, price: $price, stock: $stock) {
      id
      name
      price
      stock
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;