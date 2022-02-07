import React from "react";

import {
  Card,
  Heading,
  Pane,
  SearchInput,
  Button,
  majorScale,
} from "evergreen-ui";

import { useNavigate } from "react-router-dom";

import { CardLoader } from "../components";

import { useAsync } from "../hooks";

import { searchArtists } from "../utils/artists";

export default function ArtistsIndex() {
  const { status, data, error, run } = useAsync();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const term = e.target.elements["term"].value;
    if (!!!term) return;

    run(searchArtists(term));
  };

  return (
    <Pane padding={majorScale(2)}>
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
            data.data.map((artist) => {
              return (
                <Card
                  key={artist.name}
                  display="grid"
                  gridTemplateColumns="150px 1fr"
                  gridGap="10px"
                  padding={majorScale(2)}
                  elevation={1}
                  background="blue25"
                >
                  <img
                    width="100%"
                    src={artist.image}
                    alt={artist.name}
                    style={{ borderRadius: "5px" }}
                  />
                  <Pane
                    display="flex"
                    gap="10px"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Heading as="h5" marginBottom="auto" size={800}>
                      {artist.name}
                    </Heading>
                    <Button
                      appearance="primary"
                      intent="success"
                      onClick={() => {
                        navigate(`/dashboard/artists/${artist._id}/songs`);
                      }}
                    >
                      View Songs
                    </Button>
                    <Button
                      intent="success"
                      onClick={() => {
                        navigate(`/dashboard/artists/${artist._id}`);
                      }}
                    >
                      See Info
                    </Button>
                  </Pane>
                </Card>
              );
            })}
          {status === "resolved" && data?.data?.length === 0 && (
            <Heading as="h4" size={500} marginY={majorScale(5)}>
              No artist found! Please curate your search to contain at least
              complete first or last name.
            </Heading>
          )}
        </Pane>
      </Pane>
    </Pane>
  );
}
