import React from "react";

import { Link } from "react-router-dom";
import { Pane, Heading, Text, majorScale } from "evergreen-ui";

import { Container, ArtistCard, SearchWithSuggestions } from "../components";

function NoResultInfo() {
  return (
    <Pane>
      <Text size={500}>Unfortunately there is no result. :(</Text>
      <Text display="block" size={500} marginTop="10px">
        Your search keyword must be a complete artist name or{" "}
        <Link to="/dashboard/artists/create">create artist now.</Link>
      </Text>
    </Pane>
  );
}

export default function ArtistsIndex() {
  return (
    <Container disableMt>
      <Heading as="h3" size={900} marginBottom={majorScale(3)}>
        Artists
      </Heading>
      <SearchWithSuggestions
        placeholder={"Enter song name"}
        searchConfig={{ url: "/artists" }}
        ResultCard={ArtistCard}
        NoResultInfo={NoResultInfo}
      />
    </Container>
  );
}
