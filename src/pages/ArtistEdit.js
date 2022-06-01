import React, { useRef, useEffect, useState } from "react";

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

import { useNavigate, useLocation, useOutletContext } from "react-router-dom";

import {
  SearchWithSuggestions,
  ImageCropper,
  ConfirmActionDialog,
} from "../components";

import { putArtist, deleteArtist } from "../utils/artists";

export default function ArtistEdit() {
  const scrollRef = useRef();
  const { key } = useLocation();
  const navigate = useNavigate();
  const {
    data: {
      data: { _id, name, bio, cover, image, coverDeleteUrl },
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
  const [coverDelUrl, setCoverDelUrl] = useState(coverDeleteUrl);

  const [firstTimeRemove, setFirstTimeRemove] = useState(true);

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
      coverDeleteUrl: coverDelUrl,
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
        toaster.closeAll();
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
        toaster.closeAll();
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
            disabled
          />
          {!firstTimeRemove && (
            <Pane marginBottom={majorScale(3)}>
              <ImageCropper
                setImageUrl={(uploadedUrl, deleteUrl = "") => {
                  setCover({
                    value: uploadedUrl,
                    touched: true,
                  });
                  setCoverDelUrl(deleteUrl);
                }}
              />
            </Pane>
          )}
          {firstTimeRemove && (
            <Pane marginBottom={12}>
              <ConfirmActionDialog
                actionBtnText="Remove Current Photo"
                actionInfo="Are you sure you want to remove the artist cover image? Please also delete the image from the link you are taken."
                actionConfirmBtnText="Remove (This will open a new tab)"
                proceedActionFunc={() => {
                  setCover({
                    value: "",
                    touched: true,
                  });
                  setFirstTimeRemove(false);
                  window.open(coverDelUrl);
                }}
                marginTop={0}
              />
            </Pane>
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
            label="Artist Image"
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
            isLoading={updateStatus === "pending"}
            marginTop={majorScale(2)}
            disabled={
              artistName.length === 0 ||
              artistBio.length === 0 ||
              artistCover.length === 0 ||
              artistImage.length === 0
            }
          >
            Update
          </Button>
          {/* <Button
            intent="danger"
            isLoading={deleteStatus === "pending"}
            onClick={handleDelete}
            marginLeft={majorScale(2)}
            marginTop={majorScale(2)}
          >
            Delete
          </Button> */}
          <Pane display="inline-block" marginLeft={majorScale(2)}>
            <ConfirmActionDialog
              actionBtnText="Delete Artist"
              actionInfo="Are you sure you want to delete the artist?"
              actionConfirmBtnText="Delete"
              proceedActionFunc={handleDelete}
              marginTop={majorScale(2)}
              isLoading={deleteStatus === "pending"}
            />
          </Pane>
        </form>
      </Card>
    </>
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
