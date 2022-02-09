import React, { useEffect } from "react";

import {
  Pagination,
  Card,
  Heading,
  Pane,
  Button,
  majorScale,
} from "evergreen-ui";

import { useNavigate, useSearchParams, useParams } from "react-router-dom";

import { Container, SongLoader } from "../components";

import { useAsync } from "../hooks";

import { getArtistSongs } from "../utils/artists";

export default function ArtistSongs() {
  const { artistId } = useParams();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { error, data, status, run } = useAsync();

  const pageNumber = searchParams.get("page") ?? 1;

  useEffect(() => {
    run(getArtistSongs(artistId, pageNumber));
  }, [run, pageNumber, artistId]);

  const handleRetry = () => {
    run(getArtistSongs(artistId, pageNumber));
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
        <Pane display="flex" gap={majorScale(2)} flexWrap="wrap">
          <SongLoader />
          <SongLoader />
          <SongLoader />
        </Pane>
      </Container>
    );
  }

  if (status === "resolved") {
    const {
      data: { songs, pagination },
    } = data;

    const { current, pages, prev, next } = pagination;

    if (songs.length === 0) {
      return (
        <Container disableMt>
          <Heading as="h4" size={500}>
            There are no songs for the artist yet. Go add some!
          </Heading>
        </Container>
      );
    }

    return (
      <Container disableMt>
        <Pane display="flex" gap={majorScale(2)} flexWrap="wrap">
          {songs.map((song) => {
            return (
              <Card
                key={song.title}
                display="grid"
                gridTemplateColumns="1fr"
                gridGap="10px"
                padding={majorScale(2)}
                elevation={1}
                background="blue25"
              >
                <img
                  width="150px"
                  src={song.coverArt}
                  alt={song.title}
                  style={{ borderRadius: "5px" }}
                />
                <Heading as="h5" marginBottom="auto" size={800}>
                  {song.title}
                </Heading>
                <Button
                  onClick={() => navigate(`/dashboard/songs/${song._id}`)}
                >
                  View
                </Button>
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
