import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      id
      name
      resetToken
      resetTokenExpiry
    }
  }
`;

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email }}>
      {(reset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await reset();
              setEmail("");
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a Password Reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link!</p>
              )}
              <label htmlFor="email">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <button type="submit">Reset Password!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default ResetPassword;
