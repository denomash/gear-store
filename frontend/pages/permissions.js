import PrivateRoutes from "../components/PrivateRoutes";
import Permissions from "../components/Permissions";

const PermissionsPage = (props) => (
  <div>
    <PrivateRoutes>
      <Permissions />
    </PrivateRoutes>
  </div>
);

export default PermissionsPage;
