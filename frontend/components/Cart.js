import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

export const TOGGLE_CART_mUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => {
  return (
    <Mutation mutation={TOGGLE_CART_mUTATION}>
      {(toggleCart) => (
        <Query query={LOCAL_STATE_QUERY}>
          {({ data }) => (
            <CartStyles open={data.cartOpen}>
              <header>
                <CloseButton onClick={toggleCart}>&times;</CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have __ Items in your cart.</p>
              </header>

              <footer>
                <p>$10.20</p>
                <SickButton>Checkout</SickButton>
              </footer>
            </CartStyles>
          )}
        </Query>
      )}
    </Mutation>
  );
};

export default Cart;
