import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
    
  const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user; // Returns true if user exists
  };

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectIfLoggedIn;