import React, { useEffect } from "react";

import {
  Button,
  Heading,
  Paragraph,
  Pane,
  Small,
  EditIcon,
  MoreIcon,
  majorScale,
} from "evergreen-ui";
import { useParams, useNavigate, Outlet } from "react-router-dom";

import { Container, ArtistLoader } from "../components";

import { useAsync } from "../hooks";

import { getArtist } from "../utils/artists";

import classes from "./styles/Artist.module.css";

export default function Artist() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { error, data, status, run } = useAsync();

  useEffect(() => {
    run(getArtist(artistId));
  }, [artistId, run]);

  const handleRetry = () => {
    run(getArtist(artistId));
  };

  if (status === "rejected") {
    return (
      <Container>
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

  if (status === "idle" || status === "pending") {
    return (
      <Container>
        <ArtistLoader />
      </Container>
    );
  }

  if (status === "resolved") {
    const {
      data: { name, bio, image, cover, updatedAt },
    } = data;

    return (
      <Container>
        <div className={classes["artist-grid"]}>
          <div className={classes["artist-cover-container"]}>
            <img src={cover} alt={name} className={classes["artist-cover"]} />
          </div>
          <div className={classes["artist-image-container"]}>
            <img src={image} alt={name} className={classes["artist-image"]} />
          </div>
          <Heading
            as="h2"
            size={900}
            className={classes["artist-name"]}
            padding={majorScale(1)}
          >
            {name}
          </Heading>
          <Pane
            className={classes["artist-bio"]}
            borderRadius={5}
            elevation={1}
            padding={majorScale(2)}
            display="flex"
            flexDirection="column"
            gap="4px"
          >
            <Paragraph size={500}>
              {bio}
              <Small display="block" marginTop={majorScale(2)}>
                Last Edited: {new Date(updatedAt).toLocaleDateString()}
              </Small>
            </Paragraph>
            <Pane alignSelf="flex-end">
              <Button
                iconBefore={EditIcon}
                marginRight={majorScale(2)}
                onClick={() => {
                  navigate(`/dashboard/artists/${artistId}/edit`);
                }}
              >
                Edit
              </Button>
              <Button
                iconBefore={MoreIcon}
                intent="success"
                appearance="primary"
                onClick={() => {
                  navigate(`/dashboard/artists/${artistId}/songs`);
                }}
              >
                View Songs
              </Button>
            </Pane>
          </Pane>
        </div>
        <Outlet
          context={{
            data,
            update: () => {
              run(getArtist(artistId));
            },
          }}
        />
      </Container>
    );
  }
}
