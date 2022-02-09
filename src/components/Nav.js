import React from "react";

import {
  Avatar,
  Pane,
  Heading,
  Button,
  Paragraph,
  Text,
  UserIcon,
  HatIcon,
  majorScale,
  minorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";

export function Nav() {
  const { authData } = useAuth();

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
        {authData?.admin ? (
          <Pane
            display="flex"
            alignItems="center"
            onClick={() => navigate("/dashboard")}
          >
            <Avatar
              src={authData?.admin.avatarUrl}
              name={authData?.admin.name}
              size={40}
            />

            <Paragraph marginLeft={minorScale(3)}>
              <Text display="block">{authData?.admin.username}</Text>
              {new Date().toLocaleString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Paragraph>
          </Pane>
        ) : (
          "Poo Suu Admins"
        )}
      </Heading>
      {authData?.admin && (
        <Pane marginLeft="auto">
          <Button
            iconAfter={HatIcon}
            marginRight={16}
            onClick={() => navigate("/dashboard/artists")}
          >
            Artists
          </Button>
          <Button
            iconAfter={UserIcon}
            marginRight={16}
            onClick={() => navigate("/dashboard/my-account")}
          >
            My Account
          </Button>
        </Pane>
      )}
    </Pane>
  );
}
