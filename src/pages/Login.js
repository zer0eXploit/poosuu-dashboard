import React, { useState } from "react";

import {
  Heading,
  Pane,
  Card,
  TextInputField,
  Button,
  majorScale,
  toaster,
} from "evergreen-ui";
import { useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";

import { postLogin } from "../utils/auth";
import CONSTANTS from "../utils/constants";

function Login() {
  const [
    { value: usernameOrEmail, touched: usernameOrEmailFieldTouched },
    setUsernameOrEmail,
  ] = useState({
    value: "",
    touched: false,
  });

  const [{ value: password, touched: passwordFieldTouched }, setPassword] =
    useState({
      value: "",
      touched: false,
    });

  const [status, setStatus] = useState("idle");

  const { authData, setAuthData } = useAuth();

  const navigate = useNavigate();

  const handleLogin = () => {
    setStatus("pending");
    postLogin({ usernameOrEmail, password }).then(
      ({ data: { admin, token } }) => {
        setAuthData({ admin, token });
        setStatus("resolved");

        localStorage.setItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN, token);
        localStorage.setItem(
          CONSTANTS.POOSUU_ADMIN_DATA,
          JSON.stringify(admin)
        );

        navigate("/dashboard", { replace: true });
      },
      (error) => {
        const errorResponse = error?.response?.data;
        if (errorResponse) {
          console.error(errorResponse);
          toaster.danger(errorResponse.message);
        } else {
          console.error(error);
          toaster.danger("An unknown error occurred.");
        }
        setStatus("rejected");
      }
    );
  };

  if (authData) return <Navigate to="/dashboard" replace />;

  return (
    <Pane display="flex" justifyContent="center" alignItems="center">
      <Card
        width="300px"
        elevation={1}
        marginTop={majorScale(3)}
        padding={majorScale(3)}
      >
        <Heading as="h2" size={500} marginBottom={majorScale(2)}>
          Please Login
        </Heading>
        <TextInputField
          isInvalid={
            usernameOrEmailFieldTouched && usernameOrEmail.length === 0
          }
          value={usernameOrEmail}
          disabled={status === "pending"}
          onChange={(e) =>
            setUsernameOrEmail({ value: e.target.value, touched: true })
          }
          label="Username"
        />
        <TextInputField
          type="password"
          isInvalid={passwordFieldTouched && password.length === 0}
          value={password}
          disabled={status === "pending"}
          onChange={(e) =>
            setPassword({ value: e.target.value, touched: true })
          }
          label="Password"
        />
        <Button
          isLoading={status === "pending"}
          disabled={usernameOrEmail.length === 0 || password.length === 0}
          appearance="primary"
          intent="success"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Card>
    </Pane>
  );
}

export default Login;
