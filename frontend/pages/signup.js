import styled from "styled-components";
import Signup from "../components/Signup";

const Common = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const SignupPage = () => {
  return (
    <Common>
      <Signup />
      <Signup />
      <Signup />
    </Common>
  );
};

export default SignupPage;
