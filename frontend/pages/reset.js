import Reset from "../components/Reset";

const ResetPass = (props) => (
  <div>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default ResetPass;
