import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { Button, Pane, Heading, Spinner, majorScale } from "evergreen-ui";

import { useAsync } from "../hooks";

import { Container, LyricsForm } from "../components";

import { getLyrics, updateLyrics } from "../utils/lyrics";

export default function LyricsIndividual() {
  const { lyricsId } = useParams();
  let { error, data, status, run } = useAsync();

  useEffect(() => run(getLyrics(lyricsId)), [run, lyricsId]);

  const refetch = () => void run(getLyrics(lyricsId));

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
          <Button intent="success" appearance="primary" onClick={refetch}>
            Try Again
          </Button>
        </Pane>
      </Container>
    );
  }

  if (status === "idle" || status === "pending") {
    return (
      <Container disableMt>
        <Spinner marginX="auto" marginY={120} />
      </Container>
    );
  }

  if (status === "resolved") {
    return (
      <Container disableMt>
        <Heading as="h4" size={700} marginBottom={majorScale(3)}>
          Lyrics Data
        </Heading>
        <LyricsForm
          makeRequest={updateLyrics}
          data={data.data}
          update
          refetch={refetch}
        />
      </Container>
    );
  }

  return <>{lyricsId}</>;
}
