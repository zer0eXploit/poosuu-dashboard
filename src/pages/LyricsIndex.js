import React from "react";

import { useNavigate, Link } from "react-router-dom";
import { Pane, Heading, Text, majorScale } from "evergreen-ui";

import { Container, SearchWithSuggestions } from "../components";

export default function LyricsIndex() {
  return (
    <Container disableMt>
      <Heading as="h3" size={900} marginBottom={majorScale(3)}>
        Lyrics
      </Heading>
      <SearchWithSuggestions
        placeholder={"Enter song name"}
        searchConfig={{ url: "/lyrics" }}
        ResultCard={LyricsResult}
        NoResultInfo={NoLyricsResultInfo}
      />
    </Container>
  );
}

function LyricsResult({ title, id }) {
  const navigate = useNavigate();

  return (
    <Pane onClick={() => navigate(`/dashboard/lyrics/${id}`)} cursor="pointer">
      {title} - {id}
    </Pane>
  );
}

function NoLyricsResultInfo() {
  return (
    <Pane>
      <Text display="block" size={500}>
        There is no lyrics by that title.{" "}
        <Link to="/dashboard/lyrics/create">Add one now?</Link>
      </Text>
    </Pane>
  );
}
