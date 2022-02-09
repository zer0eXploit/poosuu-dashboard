import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { Heading, Pane, Button, Pagination, majorScale } from "evergreen-ui";

import { Container, CardLoader, ArtistCard } from "../components";

import { useAsync } from "../hooks";

import { getAllArtists } from "../utils/artists";

export default function ArtistAll() {
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
          {artists.map(({ name, image, _id }) => (
            <ArtistCard name={name} image={image} id={_id} key={_id} />
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
