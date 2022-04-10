import React, { useState } from "react";

import {
  Button,
  Card,
  Heading,
  TextInputField,
  TextareaField,
  toaster,
  majorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { Container } from "../components";

import { postArtist } from "../utils/artists";

export default function ArtistCreate() {
  const navigate = useNavigate();
  const [{ value: artistName, touched: nameTouched }, setName] = useState({
    value: "",
    touched: false,
  });
  const [{ value: artistBio, touched: bioTouched }, setBio] = useState({
    value: "",
    touched: false,
  });
  const [{ value: artistCover, touched: coverTouched }, setCover] = useState({
    value: "",
    touched: false,
  });
  const [{ value: artistImage, touched: imageTouched }, setImage] = useState({
    value: "",
    touched: false,
  });

  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: artistName,
      bio: artistBio,
      cover: artistCover,
      image: artistImage,
    };
    setStatus("pending");
    toaster.closeAll();
    toaster.notify("Creating artist. Please wait...");
    postArtist(data).then(
      ({ data: { _id } }) => {
        toaster.closeAll();
        toaster.success("Artist created!");
        setStatus("resolved");
        navigate(`/dashboard/artists/${_id}`);
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        toaster.closeAll();
        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        }
      }
    );
  };

  return (
    <Container disableMt>
      <Heading as="h4" size={700} marginBottom={majorScale(3)}>
        Please fill in the following form to create an artist
      </Heading>
      <Card padding={majorScale(2)} elevation={1}>
        <form onSubmit={handleSubmit}>
          <TextInputField
            isInvalid={nameTouched && artistName.length === 0}
            value={artistName}
            onChange={(event) => {
              setName({
                value: event.target.value,
                touched: true,
              });
            }}
            label="Artist Name"
            disabled={status === "pending"}
          />
          <TextareaField
            isInvalid={bioTouched && artistBio.length === 0}
            value={artistBio}
            onChange={(event) => {
              setBio({
                value: event.target.value,
                touched: true,
              });
            }}
            label="Artist Bio"
            disabled={status === "pending"}
          />
          <TextInputField
            isInvalid={coverTouched && artistCover.length === 0}
            value={artistCover}
            onChange={(event) => {
              setCover({
                value: event.target.value,
                touched: true,
              });
            }}
            label="Artist Cover Url"
            disabled={status === "pending"}
          />
          <TextInputField
            isInvalid={imageTouched && artistImage.length === 0}
            value={artistImage}
            onChange={(event) => {
              setImage({
                value: event.target.value,
                touched: true,
              });
            }}
            label="Artist Image Url"
            disabled={status === "pending"}
          />
          <Button
            type="submit"
            intent="success"
            appearance="primary"
            isLoading={status === "pending"}
            disabled={
              artistName.length === 0 ||
              artistBio.length === 0 ||
              artistCover.length === 0 ||
              artistImage.length === 0
            }
          >
            Create Artist
          </Button>
        </form>
      </Card>
    </Container>
  );
}
