import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import { useState } from "react";

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
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

const UserPermissions = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permissions);

  const hanlePermissionsChange = (e) => {
    const checkbox = e.target;

    //   Take a copy of the current permissions
    let updatedPermissions = [...permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      );
    }

    setPermissions(updatedPermissions);
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {possiblePermission.map((permission) => (
        <td key={permission}>
          <label htmlFor={`${user.id}-permission-${permission}`}>
            <input
              type="checkbox"
              checked={permissions.includes(permission)}
              value={permission}
              onChange={(e) => hanlePermissionsChange(e)}
            />
          </label>
        </td>
      ))}
      <td>
        <SickButton>Update</SickButton>
      </td>
    </tr>
  );
};

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.string,
  }).isRequired,
};

export default Permissions;
