import React, { useState, useRef } from "react";

import {
  Button,
  Card,
  Pane,
  Heading,
  TextInputField,
  IconButton,
  EyeOpenIcon,
  EyeOffIcon,
  InfoSignIcon,
  Text,
  majorScale,
  toaster,
} from "evergreen-ui";

import { useAuth } from "../context/auth-context";

import { updatePassword, requestPasswordResetEmail } from "../utils/account";

export default function AccountSecurity() {
  const [
    {
      value: oldPassword,
      touched: oldPasswordFieldTouched,
      passwordShown: oldPwVisible,
    },
    setOldPassword,
  ] = useState({
    value: "",
    touched: false,
    passwordShown: false,
  });

  const [
    {
      value: newPassword,
      touched: newPasswordFieldTouched,
      passwordShown: newPwVisible,
    },
    setNewPassword,
  ] = useState({
    value: "",
    touched: false,
    passwordShown: false,
  });

  const [status, setStatus] = useState("idle");
  const [pwResetStatus, setPwResetStatus] = useState("idle");
  const [tryAfter, setTryAfter] = useState(0);

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const {
    authData: { admin },
  } = useAuth();

  const handlePasswordVisibility = (ref, show, newPw) => {
    const type = show ? "text" : "password";
    ref.current.setAttribute("type", type);

    if (newPw) {
      setNewPassword({
        value: newPassword,
        touched: newPasswordFieldTouched,
        passwordShown: show,
      });
    } else {
      setOldPassword({
        value: oldPassword,
        touched: oldPasswordFieldTouched,
        passwordShown: show,
      });
    }
  };

  const handleClick = () => {
    setStatus("pending");
    updatePassword({ oldPassword, newPassword }).then(
      ({ data: { message } }) => {
        setStatus("resolved");
        toaster.closeAll();
        toaster.success(message);
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        toaster.closeAll();
        const errorResponse = error?.response?.data;
        if (errorResponse) {
          toaster.danger(errorResponse.message);
        } else {
          toaster.danger(error.message);
        }
      }
    );
  };

  const handlePwReset = () => {
    setPwResetStatus("pending");
    requestPasswordResetEmail({ email: admin.email }).then(
      ({ data: { message } }) => {
        setPwResetStatus("resolved");
        toaster.closeAll();
        toaster.success(message);
      },
      (error) => {
        setPwResetStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        toaster.closeAll();
        if (errorResponse) {
          toaster.danger(errorResponse.message);
          setTryAfter(errorResponse.retryAfter);
        } else {
          toaster.danger("Something went wrong. Please try again...");
        }
      }
    );
  };

  return (
    <Pane
      padding={16}
      background="tint1"
      flex="1"
      elevation={1}
      borderRadius={4}
    >
      <Pane
        id="account-security-pannel"
        role="tabpanel"
        aria-labelledby="account-security-pannel"
      >
        <Heading as="h3" size={700}>
          Account Security
        </Heading>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Update Password
          </Heading>
          <Card
            display="flex"
            flexBasis="80%"
            flexDirection="column"
            alignItems="stretch"
            gap={majorScale(1)}
          >
            <Pane>
              <TextInputField
                ref={oldPasswordRef}
                type="password"
                description="Please enter your old password."
                isInvalid={oldPasswordFieldTouched && oldPassword.length === 0}
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword({ value: e.target.value, touched: true })
                }
                label="Old Password"
                display="inline-block"
                marginRight={majorScale(1)}
                width="80%"
              />
              {oldPwVisible ? (
                <IconButton
                  icon={EyeOpenIcon}
                  onClick={() =>
                    handlePasswordVisibility(oldPasswordRef, false, false)
                  }
                />
              ) : (
                <IconButton
                  icon={EyeOffIcon}
                  onClick={() =>
                    handlePasswordVisibility(oldPasswordRef, true, false)
                  }
                />
              )}
            </Pane>
            <Pane>
              <TextInputField
                ref={newPasswordRef}
                type="password"
                description="Please enter new password. (Should be at least 7 characters.)"
                isInvalid={newPasswordFieldTouched && newPassword.length < 7}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword({ value: e.target.value, touched: true })
                }
                label="New Password"
                display="inline-block"
                marginRight={majorScale(1)}
                width="80%"
              />
              {newPwVisible ? (
                <IconButton
                  icon={EyeOpenIcon}
                  onClick={() =>
                    handlePasswordVisibility(newPasswordRef, false, true)
                  }
                />
              ) : (
                <IconButton
                  icon={EyeOffIcon}
                  onClick={() =>
                    handlePasswordVisibility(newPasswordRef, true, true)
                  }
                />
              )}
            </Pane>

            <Button
              isLoading={status === "pending"}
              disabled={oldPassword.length === 0 || newPassword.length < 7}
              appearance="primary"
              intent="success"
              onClick={handleClick}
              width="fit-content"
            >
              Update
            </Button>
          </Card>
        </Pane>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Reset Password
          </Heading>
          <Card
            display="flex"
            flexBasis="80%"
            flexDirection="column"
            alignItems="stretch"
            gap={majorScale(1)}
          >
            <Pane
              display="flex"
              gap={majorScale(2)}
              marginBottom={majorScale(2)}
            >
              <InfoSignIcon size={20} color="gray800" />{" "}
              <Text size={500}>
                Please click the button below to request for an email with link
                to reset your password.
              </Text>
            </Pane>
            <Button
              isLoading={pwResetStatus === "pending"}
              appearance="primary"
              intent="info"
              onClick={handlePwReset}
              width="fit-content"
              disabled={tryAfter !== 0}
            >
              {tryAfter > 0
                ? `Please try again after ${(tryAfter / 1000 / 60).toFixed(
                    0
                  )} minute(s).`
                : "Get Password Reset Email"}
            </Button>
          </Card>
        </Pane>
      </Pane>
    </Pane>
  );
}
