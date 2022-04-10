import React, { useState } from "react";

import {
  Button,
  Card,
  Heading,
  TextInputField,
  TextareaField,
  Paragraph,
  Pane,
  Text,
  toaster,
  majorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { Container, SearchWithSuggestions } from "../components";

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
          {artistCover && artistCover.startsWith("http") && (
            <>
              <Paragraph display="block" marginBottom={majorScale(2)}>
                Preview
              </Paragraph>
              <img
                src={artistCover}
                alt={artistCover}
                style={{
                  borderRadius: "5px",
                  maxHeight: "200px",
                  width: "100%",
                  display: "block",
                  marginBottom: "16px",
                  objectFit: "cover",
                  objectPosition: "50% 10%",
                }}
              />
              <Button
                marginBottom={majorScale(2)}
                onClick={() =>
                  setCover({
                    value: "",
                    touched: true,
                  })
                }
              >
                Remove Photo
              </Button>
            </>
          )}
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
            description="You can either enter your own artist image url or search below from Spotify."
          />
          {artistImage && artistImage.startsWith("http") && (
            <>
              <Paragraph display="block" marginBottom={majorScale(2)}>
                Preview
              </Paragraph>
              <img
                width="250px"
                height="250px"
                src={artistImage}
                alt={artistImage}
                style={{
                  borderRadius: "5px",
                  display: "block",
                  marginBottom: "16px",
                  objectFit: "cover",
                }}
              />
              <Button
                marginBottom={majorScale(2)}
                onClick={() =>
                  setImage({
                    value: "",
                    touched: true,
                  })
                }
              >
                Remove Photo
              </Button>
            </>
          )}
          <SearchWithSuggestions
            placeholder={"Enter artist name to search for profile image."}
            height="50px"
            searchConfig={{ url: "/artists/spotify" }}
            ResultCard={ArtistImageResult((url) =>
              setImage({
                value: url,
                touched: true,
              })
            )}
            NoResultInfo={NoArtistImageResultInfo}
          />
          <Button
            type="submit"
            intent="success"
            appearance="primary"
            marginTop={majorScale(2)}
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

function ArtistImageResult(setArtistImage) {
  return (props) => {
    const imageUrl = props?.images?.[0]?.url;
    const { hideSuggestions, clearSearchField } = props;

    if (!imageUrl) return null;

    return (
      <Pane
        elevation={1}
        padding={5}
        borderRadius="5px"
        overflow="hidden"
        display="flex"
        alignItems="center"
        onClick={() => {
          setArtistImage(imageUrl);
          hideSuggestions();
          clearSearchField();
        }}
        cursor="pointer"
      >
        <img
          width="150px"
          height="150px"
          src={imageUrl}
          alt={imageUrl}
          style={{ borderRadius: "5px", objectFit: "cover" }}
        />
      </Pane>
    );
  };
}

function NoArtistImageResultInfo() {
  return (
    <Pane>
      <Text display="block" size={500}>
        No image was found. Kindly refine your search keyword.
      </Text>
    </Pane>
  );
}
