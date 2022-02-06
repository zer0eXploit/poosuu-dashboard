import React from "react";

import {
  Avatar,
  Pane,
  Heading,
  Button,
  Text,
  majorScale,
  minorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";

export function Nav() {
  const {
    authData: { admin },
  } = useAuth();

  const navigate = useNavigate();

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border
      padding={majorScale(2)}
      elevation={1}
    >
      <Heading as="h4" size={500} cursor="pointer">
        {admin ? (
          <Pane display="flex" alignItems="center">
            <Avatar src={admin.avatarUrl} name={admin.name} size={40} />
            <Text marginLeft={minorScale(3)}>{admin.username}</Text>
          </Pane>
        ) : (
          "Poo Suu Admins"
        )}
      </Heading>
      {admin && (
        <Button
          marginRight={16}
          onClick={() => navigate("/dashboard/my-account")}
        >
          My Account
        </Button>
      )}
    </Pane>
  );
}
