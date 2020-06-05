import styled from "styled-components";
import Signup from "../components/Signup";
import Signin from "../components/Signin";

const Common = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const SignupPage = () => {
  return (
    <Common>
      <Signup />
      <Signin />
    </Common>
  );
};

export default SignupPage;
