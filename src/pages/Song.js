import React, { useEffect } from "react";

import { Button, Card, Pane, Heading, Spinner, majorScale } from "evergreen-ui";
import { useNavigate, useParams } from "react-router-dom";

import { useAsync } from "../hooks";

import { Container, SongForm } from "../components";

import { getSong, updateSong } from "../utils/songs";

export default function Song() {
  const { songId } = useParams();
  const navigate = useNavigate();
  let { error, data, status, run } = useAsync();

  useEffect(() => run(getSong(songId)), [run, songId]);

  const refetch = () => void run(getSong(songId));

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
    const { title, coverArt, artist, lyrics } = data.data;
    return (
      <Container disableMt>
        <Heading as="h4" size={700} marginBottom={majorScale(3)}>
          Song Information
        </Heading>
        <Pane display="flex" gap={majorScale(6)}>
          <Pane>
            <Card
              display="grid"
              gridTemplateColumns="1fr"
              gridGap="10px"
              padding={majorScale(2)}
              elevation={1}
              background="blue25"
              justifyItems="center"
              alignSelf="flex-start"
              maxWidth={300}
            >
              <img
                width="150px"
                src={coverArt}
                alt={title}
                style={{ borderRadius: "5px" }}
              />
              <Heading
                as="h5"
                marginBottom="auto"
                size={800}
                justifySelf="start"
              >
                {title}
              </Heading>
            </Card>
            <Button
              width="100%"
              onClick={() => navigate(`/dashboard/artists/${artist}`)}
              marginY={majorScale(2)}
              intent="success"
            >
              View Artist
            </Button>
            <Button
              width="100%"
              intent="success"
              onClick={() => navigate(`/dashboard/lyrics/${lyrics}`)}
            >
              View Lyrics
            </Button>
          </Pane>
          <SongForm
            makeRequest={updateSong}
            data={data.data}
            update
            refetch={refetch}
          />
        </Pane>
      </Container>
    );
  }

  return <>{songId}</>;
}
