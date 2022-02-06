import React from "react";

import {
  Button,
  Pane,
  Heading,
  Paragraph,
  Avatar,
  Text,
  minorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";

import CONSTANTS from "../utils/constants";

export default function AccountIndex() {
  const {
    authData: { admin },
    setAuthData,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);
    localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_DATA);
    setAuthData(null);
    navigate("/login");
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
        <Heading as="h2" size={700} marginBottom={minorScale(5)}>
          Good Day {admin.name}!
        </Heading>
        <Paragraph size={500} marginBottom={minorScale(5)}>
          Please use the panel on the left to navigate to different pages.
        </Paragraph>
        <Pane display="flex" gap={40}>
          <Avatar
            src={admin.avatarUrl}
            name={admin.name}
            size={250}
            display="block"
          />
          <Pane
            display="flex"
            flexDirection="column"
            justifyContent="space-evenly"
            gap={5}
          >
            <Text size={500}>Name - {admin.name}</Text>
            <Text size={500}>Username - {admin.username}</Text>
            <Text size={500}>Admin ID - {admin.id}</Text>
            <Text size={500}>Email - {admin.email}</Text>
            <Text size={500}>
              Account Created - {new Date(admin.createdAt).toLocaleDateString()}
            </Text>
            <Button onClick={handleLogout} intent="danger">
              Log Out
            </Button>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
}
