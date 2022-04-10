import React, { useState } from "react";

import {
  Pane,
  Text,
  Button,
  Card,
  Heading,
  Paragraph,
  TextInputField,
  TextareaField,
  toaster,
  majorScale,
} from "evergreen-ui";
import { useNavigate, Link } from "react-router-dom";

import { SearchWithSuggestions } from "./SearchWithSuggestions";

import { deleteSong } from "../utils/songs";

export function SongForm({
  makeRequest,
  data,
  update = false,
  refetch = () => {},
}) {
  const [{ value: title, touched: titleTouched }, setTitle] = useState({
    value: data?.title ?? "",
    touched: false,
  });
  const [{ value: description, touched: descriptionTouched }, setDescription] =
    useState({
      value: data?.description ?? "",
      touched: false,
    });
  const [{ value: coverArt, touched: coverTouched }, setCover] = useState({
    value: data?.coverArt ?? "",
    touched: false,
  });

  const [artist, setArtist] = useState(data?.artist ?? "");
  const [lyrics, setLyrics] = useState(data?.lyrics ?? "");
  const [status, setStatus] = useState("idle");
  const [delStatus, setDelStatus] = useState("idle");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const reqData = {
      title,
      description,
      coverArt,
      artist,
      lyrics,
    };

    if (update) reqData.id = data._id;

    setStatus("pending");
    toaster.closeAll();
    toaster.notify("Please wait...");
    makeRequest(reqData).then(
      ({ data: { _id } }) => {
        toaster.closeAll();
        toaster.success("Successfully completed!");
        if (!update) {
          navigate(`/dashboard/songs/${_id}`);
        } else {
          refetch();
        }
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        toaster.closeAll();
        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        } else {
          toaster.danger(error.message);
        }
      }
    );
  };

  return (
    <Card padding={majorScale(2)} elevation={1} flex="1">
      <form onSubmit={handleSubmit}>
        <TextInputField
          isInvalid={titleTouched && title.length === 0}
          value={title}
          onChange={(event) => {
            setTitle({
              value: event.target.value,
              touched: true,
            });
          }}
          label="Song Title"
          disabled={status === "pending"}
        />
        <TextareaField
          isInvalid={descriptionTouched && description.length === 0}
          value={description}
          onChange={(event) => {
            setDescription({
              value: event.target.value,
              touched: true,
            });
          }}
          label="Description"
          disabled={status === "pending"}
        />
        <TextInputField
          isInvalid={coverTouched && coverArt.length === 0}
          value={coverArt}
          onChange={(event) => {
            setCover({
              value: event.target.value,
              touched: true,
            });
          }}
          label="Cover Url"
          disabled={status === "pending"}
          description="You can either set your own image url or search and select images from
          Spotify below."
        />
        {coverArt && coverArt.startsWith("http") && (
          <>
            <Paragraph display="block" marginBottom={majorScale(2)}>
              Preview
            </Paragraph>
            <img
              width="250px"
              src={coverArt}
              alt={coverArt}
              style={{
                borderRadius: "5px",
                display: "block",
                marginBottom: "16px",
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
        <SearchWithSuggestions
          placeholder={"Enter song title to search for cover."}
          height="50px"
          searchConfig={{ url: "/songs/spotify" }}
          ResultCard={CoverImageResult((url) =>
            setCover({
              value: url,
              touched: true,
            })
          )}
          NoResultInfo={NoCoverImageResultInfo}
        />
        <Heading
          as="h3"
          size={400}
          marginTop={majorScale(3)}
          marginBottom={majorScale(1)}
        >
          Artist ID
        </Heading>
        <Paragraph marginBottom={majorScale(2)}>
          Selected - {artist.length > 0 ? artist : "None"}
        </Paragraph>
        <Paragraph display="block" marginBottom={majorScale(2)} color="gray700">
          Please note: when searching, keywords must be complete and partial
          texts are not allowed.
        </Paragraph>
        <SearchWithSuggestions
          placeholder={"Enter artist name to search and then select!"}
          height="40px"
          searchConfig={{ url: "/artists" }}
          ResultCard={ArtistResult((id) => setArtist(id))}
          NoResultInfo={NoArtistResultInfo}
        />
        <Heading
          as="h3"
          size={400}
          marginTop={majorScale(3)}
          marginBottom={majorScale(1)}
        >
          Lyrics ID
        </Heading>
        <Paragraph marginBottom={majorScale(2)}>
          Selected - {lyrics.length > 0 ? lyrics : "None"}
        </Paragraph>
        <Paragraph display="block" marginBottom={majorScale(2)} color="gray700">
          Please note: when searching, keywords must be complete and partial
          texts are not allowed.
        </Paragraph>
        <SearchWithSuggestions
          placeholder={"Enter lyrics title to search and then select!"}
          height="40px"
          searchConfig={{ url: "/lyrics" }}
          ResultCard={LyricsResult((id) => setLyrics(id))}
          NoResultInfo={NoLyricsResultInfo}
        />
        <Button
          type="submit"
          intent="success"
          appearance="primary"
          isLoading={status === "pending"}
          marginTop={majorScale(4)}
          disabled={
            title.length === 0 ||
            description.length === 0 ||
            coverArt.length === 0 ||
            artist.length === 0 ||
            lyrics.length === 0 ||
            delStatus === "pending"
          }
        >
          {update ? "Update" : "Add song"}
        </Button>
        {update && (
          <Button
            intent="danger"
            isLoading={delStatus === "pending"}
            disabled={status === "pending"}
            marginTop={majorScale(4)}
            marginLeft={majorScale(2)}
            onClick={async () => {
              setDelStatus("pending");
              await deleteSong(data._id);
              toaster.closeAll();
              toaster.success("Deleted!");
              navigate(-1);
            }}
          >
            DELETE
          </Button>
        )}
      </form>
    </Card>
  );
}

function LyricsResult(click) {
  return ({ title, id, hideSuggestions }) => (
    <Pane
      onClick={() => {
        click(id);
        hideSuggestions();
      }}
      cursor="pointer"
    >
      {title} - {id}
    </Pane>
  );
}

function NoLyricsResultInfo() {
  return (
    <Pane>
      <Text display="block" size={500}>
        There is no lyrics by that title.{" "}
        <Link to="/dashboard/lyrics/create" target="_blank">
          Click here to add now!
        </Link>
      </Text>
    </Pane>
  );
}

function ArtistResult(click) {
  return ({ name, id, hideSuggestions }) => (
    <Pane
      onClick={() => {
        click(id);
        hideSuggestions();
      }}
      cursor="pointer"
    >
      {name} - {id}
    </Pane>
  );
}

function NoArtistResultInfo() {
  return (
    <Pane>
      <Text display="block" size={500}>
        There is no such artist.{" "}
        <Link to="/dashboard/artists/create" target="_blank">
          Click here to create artist profile now!
        </Link>
      </Text>
    </Pane>
  );
}

function CoverImageResult(click) {
  return (props) => {
    const imageUrl = props?.album?.images?.[0]?.url;
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
          click(imageUrl);
          hideSuggestions();
          clearSearchField();
        }}
        cursor="pointer"
      >
        <img
          width="200px"
          src={imageUrl}
          alt={imageUrl}
          style={{ borderRadius: "5px" }}
        />
      </Pane>
    );
  };
}

function NoCoverImageResultInfo() {
  return (
    <Pane>
      <Text display="block" size={500}>
        No image was found. Kindly refine your search keyword.
      </Text>
    </Pane>
  );
}
