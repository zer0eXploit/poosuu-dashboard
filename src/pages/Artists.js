import React from "react";

import {
  Button,
  Pane,
  NewPersonIcon,
  AsteriskIcon,
  SearchIcon,
  minorScale,
} from "evergreen-ui";
import { Outlet, useNavigate } from "react-router-dom";

export default function Artists() {
  const navigate = useNavigate();
  return (
    <>
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
          iconAfter={NewPersonIcon}
          onClick={() => {
            navigate("/dashboard/artists/create");
          }}
        >
          Create New Artist
        </Button>
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={AsteriskIcon}
          onClick={() => {
            navigate("/dashboard/artists/all");
          }}
        >
          See all Artists
        </Button>
        <Button
          marginY={8}
          marginRight={12}
          iconAfter={SearchIcon}
          onClick={() => {
            navigate("/dashboard/artists");
          }}
        >
          Search for Artists on Poo Suu
        </Button>
      </Pane>
      <Outlet />
    </>
  );
}
