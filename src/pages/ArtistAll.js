import React, { useEffect } from "react";

import {
  Pagination,
  Card,
  Heading,
  Pane,
  Button,
  majorScale,
} from "evergreen-ui";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Container, CardLoader } from "../components";

import { useAsync } from "../hooks";

import { getAllArtists } from "../utils/artists";

export default function ArtistAll() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { error, data, status, run } = useAsync();

  const pageNumber = searchParams.get("page") ?? 1;

  useEffect(() => {
    run(getAllArtists(pageNumber));
  }, [run, pageNumber]);

  const handleRetry = () => {
    run(getAllArtists(pageNumber));
  };

  if (status === "rejected") {
    return (
      <Container disableMt>
        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading as="h3" size={600} marginBottom={majorScale(2)}>
            {error?.response?.data?.message ??
              error?.response?.data?.error ??
              "Something went wrong..."}
          </Heading>
          <Button intent="success" appearance="primary" onClick={handleRetry}>
            Try Again
          </Button>
        </Pane>
      </Container>
    );
  }

  if (status === "pending" || status === "idle") {
    return (
      <Container disableMt>
        <Pane
          display="flex"
          gap={majorScale(2)}
          flexWrap="wrap"
          justifyContent="center"
        >
          <CardLoader />
          <CardLoader />
          <CardLoader />
          <CardLoader />
        </Pane>
      </Container>
    );
  }

  if (status === "resolved") {
    const {
      data: { artists, pagination },
    } = data;

    const { current, pages, prev, next } = pagination;

    if (artists.length === 0) {
      return (
        <Container disableMt>
          <Heading as="h4" size={500} marginY={majorScale(5)}>
            No artist found! Please curate your search to contain at least
            complete first or last name.
          </Heading>
        </Container>
      );
    }

    return (
      <Container disableMt>
        <Pane
          display="flex"
          gap={majorScale(2)}
          flexWrap="wrap"
          justifyContent="center"
        >
          {artists.map((artist) => {
            return (
              <Card
                key={artist.name}
                display="grid"
                gridTemplateColumns="150px 1fr"
                gridGap="10px"
                padding={majorScale(2)}
                elevation={1}
                background="blue25"
                width={400}
                maxWidth={400}
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
        </Pane>
        <Pagination
          page={current}
          totalPages={pages}
          onPageChange={(page) => setSearchParams({ page })}
          onNextPage={() => setSearchParams({ page: next })}
          onPreviousPage={() => setSearchParams({ page: prev })}
        ></Pagination>
      </Container>
    );
  }
}
