import { useSelector } from "react-redux";
import { selectCurrectUser, selectCurrentToken } from "./authSlice";
import { Link } from "react-router-dom";

const ProtectedWelcome = () => {
  const user = useSelector(selectCurrectUser);
  const token = useSelector(selectCurrentToken);

  const welcome = user ? `Welcome ${user}` : "Welcome";
  const wokenAbbr = `${token}`;

  return (
    <>
      <h1>{welcome}</h1>
      <h2>{wokenAbbr}</h2>
    </>
  );
};

export default ProtectedWelcome;
