import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import {
  Button,
  Pane,
  Heading,
  Spinner,
  TextInputField,
  majorScale,
} from "evergreen-ui";

import { useAsync } from "../hooks";

import { Container, Plyr, LyricsTool } from "../components";

import { getLyrics, updateLyrics } from "../utils/lyrics";

export default function LyricsIndividual() {
  const { lyricsId } = useParams();
  let { error, data, status, run } = useAsync();

  const plyrRef = useRef();
  const [embedId, setEmbedId] = useState(null);

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
          You can edit the lyrics data below
        </Heading>
        <Pane display="flex" gap="2rem">
          <Pane width="50%">
            <Pane borderRadius="0.5rem" overflow="hidden">
              <Plyr
                ref={plyrRef}
                source={{
                  type: "video",
                  sources: [
                    {
                      src: embedId || data?.data?.youtubeEmbed,
                      provider: "youtube",
                    },
                  ],
                }}
              />
            </Pane>
            <TextInputField
              marginTop={majorScale(2)}
              label="YouTube video URL or embed ID."
              description="Please enter the ID of the YouTube video or the full URL."
              placeholder="inpok4MKVLM"
              autoComplete="off"
              hint="The default video is just a placeholder."
              onChange={(e) => {
                // BAD Mutation
                data.data.youtubeEmbed = e.target.value;
                setEmbedId(e.target.value);
              }}
            />
          </Pane>
          <Pane
            elevation={1}
            width="50%"
            borderRadius="0.5rem"
            display="flex"
            padding="1rem"
          >
            <LyricsTool
              videoRef={plyrRef}
              data={data?.data}
              update
              makeRequest={updateLyrics}
              refetch={refetch}
            />
          </Pane>
        </Pane>
      </Container>
    );
  }

  return <>{lyricsId}</>;
}
