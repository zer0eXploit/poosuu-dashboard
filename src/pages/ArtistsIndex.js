import React from "react";

import { Pane, Heading, SearchInput, majorScale } from "evergreen-ui";

import { Container, CardLoader, ArtistCard } from "../components";

import { useAsync } from "../hooks";

import { searchArtists } from "../utils/artists";

export default function ArtistsIndex() {
  const { status, data, error, run } = useAsync();

  const handleSearch = (e) => {
    e.preventDefault();

    const term = e.target.elements["term"].value;
    if (!!!term) return;

    run(searchArtists(term));
  };

  return (
    <Container disableMt>
      <Heading as="h3" size={900} marginBottom={majorScale(3)}>
        Artists
      </Heading>
      <Pane display="flex" flexDirection="column">
        <form
          style={{ width: "100%" }}
          onSubmit={handleSearch}
          autoComplete="off"
        >
          <SearchInput
            placeholder="Enter artist name to search"
            height="50px"
            width="100%"
            name="term"
            disabled={status === "pending"}
          />
        </form>
        <Pane
          display="flex"
          gap={majorScale(2)}
          marginY={majorScale(3)}
          flexWrap="wrap"
        >
          {status === "rejected" && (
            <Heading as="h4" size={500} marginY={majorScale(5)}>
              {error?.response?.data?.error ?? "Something went wrong..."}
            </Heading>
          )}

          {status === "pending" && (
            <>
              <CardLoader />
              <CardLoader />
              <CardLoader />
            </>
          )}

          {status === "resolved" &&
            data?.data?.length > 0 &&
            data.data.map(({ name, image, _id }) => (
              <ArtistCard name={name} image={image} id={_id} key={_id} />
            ))}
          {status === "resolved" && data?.data?.length === 0 && (
            <Heading as="h4" size={500} marginY={majorScale(5)}>
              No artist found! Please curate your search to contain at least
              complete first or last name.
            </Heading>
          )}
        </Pane>
      </Pane>
    </Container>
  );
}
