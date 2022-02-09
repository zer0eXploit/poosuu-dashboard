import React, { useRef, useEffect, useState } from "react";

import {
  Button,
  Card,
  Heading,
  TextInputField,
  TextareaField,
  toaster,
  majorScale,
} from "evergreen-ui";

import { useNavigate, useLocation, useOutletContext } from "react-router-dom";

import { putArtist, deleteArtist } from "../utils/artists";

export default function ArtistEdit() {
  const scrollRef = useRef();
  const { key } = useLocation();
  const navigate = useNavigate();
  const {
    data: {
      data: { _id, name, bio, cover, image },
    },
    update,
  } = useOutletContext();

  const [{ value: artistName, touched: nameTouched }, setName] = useState({
    value: name,
    touched: false,
  });
  const [{ value: artistBio, touched: bioTouched }, setBio] = useState({
    value: bio,
    touched: false,
  });
  const [{ value: artistCover, touched: coverTouched }, setCover] = useState({
    value: cover,
    touched: false,
  });
  const [{ value: artistImage, touched: imageTouched }, setImage] = useState({
    value: image,
    touched: false,
  });

  const [updateStatus, setUpdateStatus] = useState("idle");
  const [deleteStatus, setDeleteStatus] = useState("idle");

  // Scroll form to view
  useEffect(() => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [key]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      id: _id,
      name: artistName,
      bio: artistBio,
      cover: artistCover,
      image: artistImage,
    };
    setUpdateStatus("pending");
    putArtist(data).then(
      (_) => {
        setUpdateStatus("resolved");
        update();
      },
      (error) => {
        setUpdateStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;

        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        }
      }
    );
  };

  const handleDelete = () => {
    setDeleteStatus("pending");
    deleteArtist(_id).then(
      (_) => {
        navigate("/dashboard/artists");
      },
      (error) => {
        setDeleteStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;

        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        }
      }
    );
  };

  return (
    <>
      <Heading as="h4" ref={scrollRef} size={700} marginY={majorScale(3)}>
        Edit Artist Information
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
            label="Artist Cover"
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
            label="Artist Image"
          />
          <Button
            type="submit"
            intent="success"
            appearance="primary"
            isLoading={updateStatus === "pending"}
            disabled={
              artistName.length === 0 ||
              artistBio.length === 0 ||
              artistCover.length === 0 ||
              artistImage.length === 0
            }
          >
            Update
          </Button>
          <Button
            intent="danger"
            isLoading={deleteStatus === "pending"}
            onClick={handleDelete}
            marginLeft={majorScale(2)}
          >
            Delete
          </Button>
        </form>
      </Card>
    </>
  );
}
