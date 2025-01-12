import { gql } from '@apollo/client';

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
    }
  }
`;

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      price
      stock
    }
  }
`;
