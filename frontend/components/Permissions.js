import { Query } from "react-apollo";
import gql from "graphql-tag";

import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const possiblePermission = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermission.map((permission) => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <User key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

const User = ({ user }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    {possiblePermission.map((permission) => (
      <td key={permission}>
        <label htmlFor={`${user.id}-permission-${permission}`}>
          <input type="checkbox" />
        </label>
      </td>
    ))}
    <td>
      <SickButton>Update</SickButton>
    </td>
  </tr>
);

export default Permissions;
