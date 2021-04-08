import userService from "../../services/userService";
import { Route, Redirect } from "react-router-dom";
const ProtectedRoute = ({ component: Component, render, admin, ...rest }) => {
  const currentUser = userService.getCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser || (admin && !currentUser.admin)) {
          return (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location },
              }}
            />
          );
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
