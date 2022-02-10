import React from "react";

import { Heading, majorScale } from "evergreen-ui";

import { Container, SongForm } from "../components";

import { createSong } from "../utils/songs";

export default function SongCreate() {
  return (
    <Container disableMt>
      <Heading as="h4" size={700} marginBottom={majorScale(3)}>
        Please fill in the following form to add a new song
      </Heading>
      <SongForm makeRequest={createSong} />
    </Container>
  );
}
