import React from "react";

import { Heading, majorScale } from "evergreen-ui";

import { Container, LyricsForm } from "../components";

import { createLyrics } from "../utils/lyrics";

export default function LyricsCreate() {
  return (
    <Container disableMt>
      <Heading as="h4" size={700} marginBottom={majorScale(3)}>
        Please fill in the following form to add a new lyrics
      </Heading>
      <LyricsForm makeRequest={createLyrics} />
    </Container>
  );
}
