import React, { useState } from "react";

import {
  Heading,
  Pane,
  Card,
  TextInputField,
  Text,
  Button,
  majorScale,
  toaster,
} from "evergreen-ui";
import { useParams } from "react-router-dom";

import { Container } from "../components";

import CONSTANTS from "../utils/constants";
import { resetPassword } from "../utils/account";

function PasswordReset() {
  const [{ value: repeatPw, touched: repeatPwFieldTouched }, setRepeatPw] =
    useState({
      value: "",
      touched: false,
    });

  const [{ value: password, touched: passwordFieldTouched }, setPassword] =
    useState({
      value: "",
      touched: false,
    });

  const [status, setStatus] = useState("idle");

  const params = useParams();

  const handlePasswordReset = () => {
    setStatus("pending");
    resetPassword({ token: params.token, newPassword: password }).then(
      (_) => {
        setStatus("resolved");
        localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);
        localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_DATA);
        window.location.href = "/login";
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

  return (
    <Container>
      <Pane display="flex" justifyContent="center" alignItems="center">
        <Card
          width="50%"
          maxWidth="500px"
          elevation={1}
          marginTop={majorScale(3)}
          padding={majorScale(3)}
        >
          <Heading as="h2" size={500} marginBottom={majorScale(2)}>
            Please enter passwords below
          </Heading>
          <TextInputField
            description="Must be more than 7 characters."
            type="password"
            isInvalid={passwordFieldTouched && password.length < 7}
            value={password}
            disabled={status === "pending"}
            onChange={(e) =>
              setPassword({ value: e.target.value, touched: true })
            }
            label="New Password"
          />
          <TextInputField
            isInvalid={repeatPwFieldTouched && repeatPw.length < 7}
            value={repeatPw}
            disabled={status === "pending"}
            onChange={(e) =>
              setRepeatPw({ value: e.target.value, touched: true })
            }
            type="password"
            label="Repeat New Password"
          />
          {password !== repeatPw && (
            <Text color="red500" display="block" marginBottom={majorScale(2)}>
              Passwords do not match.
            </Text>
          )}
          <Button
            isLoading={status === "pending"}
            disabled={
              password.length < 7 ||
              repeatPw.length < 7 ||
              password !== repeatPw
            }
            appearance="primary"
            intent="success"
            onClick={handlePasswordReset}
          >
            Reset
          </Button>
        </Card>
      </Pane>
    </Container>
  );
}

export default PasswordReset;
