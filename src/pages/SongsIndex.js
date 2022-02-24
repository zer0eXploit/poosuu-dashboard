import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { Text, Pane, Heading, Paragraph, majorScale } from "evergreen-ui";

import { Container, SearchWithSuggestions } from "../components";

function NoResultInfo() {
  return (
    <Pane>
      <Text size={500}>Unfortunately there is no result. :(</Text>
      <Text display="block" size={500} marginTop="10px">
        Your search keyword must be a complete song title or{" "}
        <Link to="/dashboard/songs/create">create a new song now.</Link>
      </Text>
    </Pane>
  );
}

function ResultCard({ id, title, coverArt }) {
  const navigate = useNavigate();

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      gap="10px"
      marginY="5px"
      padding="10px"
      elevation={1}
      background="tint2"
      cursor="pointer"
      minWidth="150px"
      minHeight="150px"
      onClick={() => navigate(`/dashboard/songs/${id}`)}
    >
      <img src={coverArt} alt={title} width="100px" />
      <Paragraph>{title}</Paragraph>
    </Pane>
  );
}

export default function ArtistsIndex() {
  return (
    <Container disableMt>
      <Heading as="h3" size={900} marginBottom={majorScale(3)}>
        Search Songs
      </Heading>
      <Pane display="flex" flexDirection="column">
        <SearchWithSuggestions
          placeholder={"Enter song name to search..."}
          searchConfig={{ url: "/songs" }}
          ResultCard={ResultCard}
          NoResultInfo={NoResultInfo}
        />
      </Pane>
    </Container>
  );
}
