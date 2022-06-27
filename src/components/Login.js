import { useEffect, useContext } from "react";
import { Auth } from "contexts";

function Login() {
  let { signIn } = useContext(Auth);

  useEffect(() => {
    signIn();
  }, []);

  return null;
}

export default Login;