import React from "react";

import {
  Pane,
  Button,
  PlusIcon,
  AsteriskIcon,
  SearchIcon,
  minorScale,
} from "evergreen-ui";
import { Outlet, useNavigate } from "react-router-dom";

import { Container } from "../components";

export default function Songs() {
  const navigate = useNavigate();

  return (
    <Container>
      <Pane
        display="flex"
        alignItems="center"
        gap={minorScale(10)}
        padding="10px"
        overflowX="auto"
      >
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={PlusIcon}
          onClick={() => {
            navigate("/dashboard/songs/create");
          }}
        >
          Add New
        </Button>
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={AsteriskIcon}
          onClick={() => {
            navigate("/dashboard/songs/all");
          }}
        >
          See all
        </Button>
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={SearchIcon}
          onClick={() => {
            navigate("/dashboard/songs");
          }}
        >
          Search Songs
        </Button>
      </Pane>
      <Outlet />
    </Container>
  );
}
