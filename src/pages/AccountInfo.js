import React, { useState } from "react";

import {
  Button,
  Card,
  Pane,
  Heading,
  TextInputField,
  majorScale,
  toaster,
} from "evergreen-ui";

import { useAuth } from "../context/auth-context";

import { updateNameAvatar } from "../utils/account";

import CONSTANTS from "../utils/constants";

export default function AccountInfo() {
  const { authData, setAuthData } = useAuth();

  const { admin } = authData;

  const [{ value: name, touched: nameFieldTouched }, setName] = useState({
    value: admin.name,
    touched: false,
  });

  const [{ value: avatarUrl, touched: avatarUrlFieldTouched }, setAvatarUrl] =
    useState({
      value: admin.avatarUrl,
      touched: false,
    });

  const [status, setStatus] = useState("idle");

  const handleClick = () => {
    setStatus("pending");

    updateNameAvatar({
      adminId: admin.id,
      name,
      avatarUrl,
    }).then(
      ({ data: { name, avatarUrl } }) => {
        const admin = {
          ...authData.admin,
          name,
          avatarUrl,
        };

        localStorage.setItem(
          CONSTANTS.POOSUU_ADMIN_DATA,
          JSON.stringify(admin)
        );

        setAuthData({
          token: authData.token,
          admin,
        });
        setStatus("resolved");
        toaster.success("Update successful!");
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        if (errorResponse) {
          toaster.danger(errorResponse.error);
        } else {
          toaster.danger("An unknown error occurred.");
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
        id="account-info-pannel"
        role="tabpanel"
        aria-labelledby="account-info-pannel"
      >
        <Heading as="h3" size={700}>
          Update My Account Info
        </Heading>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <img
            src={avatarUrl}
            alt={name}
            width="300"
            style={{ display: "block", borderRadius: 8 }}
          />
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            <TextInputField
              description="Please enter your new name."
              isInvalid={nameFieldTouched && name.length === 0}
              value={name}
              onChange={(e) =>
                setName({ value: e.target.value, touched: true })
              }
              label="Name"
            />
            <TextInputField
              description="Please enter your avatar image url. (Preferred Dimensions 500x500)"
              isInvalid={avatarUrlFieldTouched && avatarUrl.length === 0}
              value={avatarUrl}
              onChange={(e) =>
                setAvatarUrl({ value: e.target.value, touched: true })
              }
              label="Avatar Image URL"
            />
            <Button
              isLoading={status === "pending"}
              disabled={name.length === 0 || avatarUrl.length === 0}
              appearance="primary"
              intent="success"
              onClick={handleClick}
            >
              Update
            </Button>
          </Card>
        </Pane>
      </Pane>
    </Pane>
  );
}
