import React from "react";

import { Button, Pane, PlusIcon, SearchIcon, minorScale } from "evergreen-ui";
import { Outlet, useNavigate } from "react-router-dom";

import { Container } from "../components";

export default function Lyrics() {
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
            navigate("/dashboard/lyrics/create");
          }}
        >
          Add Lyrics
        </Button>
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={SearchIcon}
          onClick={() => {
            navigate("/dashboard/lyrics");
          }}
        >
          Search Lyrics on Poo Suu
        </Button>
      </Pane>
      <Outlet />
    </Container>
  );
}
