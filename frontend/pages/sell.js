import CreateItem from "../components/CreateItem";
import PrivateRoutes from "../components/PrivateRoutes";

const Sell = (props) => (
  <div>
    <PrivateRoutes>
      <CreateItem />
    </PrivateRoutes>
  </div>
);

export default Sell;
