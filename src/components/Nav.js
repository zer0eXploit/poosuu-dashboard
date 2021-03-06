import React from "react";

import {
  Avatar,
  Pane,
  Heading,
  Button,
  Paragraph,
  Text,
  AddIcon,
  UserIcon,
  minorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { Container } from "./Container";

import { useAuth } from "../context/auth-context";

export function Nav() {
  const { authData } = useAuth();

  const navigate = useNavigate();

  return (
    <Pane
      border
      elevation={1}
      position="fixed"
      background="tint2"
      top={0}
      zIndex={5}
      width="100%"
    >
      <Container disableMt>
        <Pane display="flex" alignItems="center" justifyContent="space-between">
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
                iconAfter={AddIcon}
                marginRight={16}
                onClick={() => navigate("/dashboard/artists/create")}
              >
                Add Artist
              </Button>
              <Button
                iconAfter={AddIcon}
                marginRight={16}
                onClick={() => navigate("/dashboard/songs/create")}
              >
                Add Song
              </Button>
              <Button
                iconAfter={AddIcon}
                marginRight={16}
                onClick={() => navigate("/dashboard/lyrics/create")}
              >
                Add lyrics
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
      </Container>
    </Pane>
  );
}
