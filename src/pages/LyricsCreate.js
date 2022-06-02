import React, { useRef, useState } from "react";

import { Pane, Heading, TextInputField, majorScale } from "evergreen-ui";

import { Container, Plyr, LyricsTool } from "../components";

import { createLyrics } from "../utils/lyrics";

export default function LyricsCreate() {
  const [embedId, setEmbedId] = useState("inpok4MKVLM");
  const plyrRef = useRef();

  return (
    <Container disableMt>
      <Heading as="h4" size={700} marginBottom={majorScale(3)}>
        Create Lyrics
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
                    src: embedId,
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
            onChange={(e) => setEmbedId(e.target.value)}
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
            data={{
              youtubeEmbed: embedId,
              title: "",
              lyricsData: [],
            }}
            makeRequest={createLyrics}
          />
        </Pane>
      </Pane>
    </Container>
  );
}
