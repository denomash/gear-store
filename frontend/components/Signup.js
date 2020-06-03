import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Mutation mutation={SIGNUP_MUTATION} variables={{ name, email, password }}>
      {(signup, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await signup();

              setEmail("");
              setName("");
              setPassword("");
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for An Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label htmlFor="name">
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label htmlFor="password">
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Signup;
