import React, { useEffect } from "react";

import { useSearchParams, useParams } from "react-router-dom";
import { Heading, Pane, Button, Pagination, majorScale } from "evergreen-ui";

import { Container, SongLoader, SongCard } from "../components";

import { useAsync } from "../hooks";

import { getArtistSongs } from "../utils/artists";

export default function ArtistSongs() {
  const { artistId } = useParams();

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
          {songs.map(({ title, coverArt, _id }) => (
            <SongCard title={title} coverArt={coverArt} id={_id} key={_id} />
          ))}
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
