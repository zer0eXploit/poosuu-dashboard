import React, { useState } from "react";

import {
  Button,
  Card,
  TextInputField,
  TextareaField,
  toaster,
  majorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { deleteLyrics } from "../utils/lyrics";

export function LyricsForm({
  makeRequest,
  data,
  update = false,
  refetch = () => {},
}) {
  const [{ value: title, touched: titleTouched }, setTitle] = useState({
    value: data?.title ?? "",
    touched: false,
  });
  const [{ value: enLyrics, touched: enLyricsTouched }, setEnLyrics] = useState(
    {
      value: data?.enLyrics ?? [],
      touched: false,
    }
  );

  const [mmLyrics, setMmLyrics] = useState(data?.mmLyrics ?? []);
  const [jpLyrics, setJpLyrics] = useState(data?.krLyrics ?? []);
  const [krLyrics, setKrLyrics] = useState(data?.krLyrics ?? []);

  const [status, setStatus] = useState("idle");
  const [delStatus, setDelStatus] = useState("idle");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const reqData = {
      title,
      enLyrics,
      mmLyrics,
      jpLyrics,
      krLyrics,
    };

    if (update) reqData.id = data._id;

    setStatus("pending");
    toaster.notify("Please wait...");
    makeRequest(reqData).then(
      ({ data: { _id } }) => {
        toaster.success("Success!");
        if (!update) {
          navigate(`/dashboard/lyrics/${_id}`);
        } else {
          refetch();
        }
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;

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
          label="Lyrics Title"
          disabled={status === "pending"}
        />
        <TextareaField
          isInvalid={enLyricsTouched && enLyrics.length === 0}
          value={enLyrics.join("\n")}
          onChange={(event) => {
            const value = event.target.value;
            const lines = !!value ? value.split(/\n/g) : [];

            setEnLyrics({ value: lines, touched: true });
          }}
          label="English Lyrics"
          description="Please use enter for line breaks."
          disabled={status === "pending"}
          rows="10"
        />
        <TextareaField
          value={mmLyrics.join("\n")}
          onChange={(event) => {
            const value = event.target.value;
            const lines = !!value ? value.split(/\n/g) : [];

            setMmLyrics(lines);
          }}
          label="Burmese Lyrics (Optional)"
          description="Please use enter for line breaks."
          disabled={status === "pending"}
        />
        <TextareaField
          value={jpLyrics.join("\n")}
          onChange={(event) => {
            const value = event.target.value;
            const lines = !!value ? value.split(/\n/g) : [];

            setJpLyrics(lines);
          }}
          label="Japanese Lyrics (Optional)"
          description="Please use enter for line breaks."
          disabled={status === "pending"}
        />
        <TextareaField
          value={krLyrics.join("\n")}
          onChange={(event) => {
            const value = event.target.value;
            const lines = !!value ? value.split(/\n/g) : [];

            setKrLyrics(lines);
          }}
          label="Korean Lyrics (Optional)"
          description="Please use enter for line breaks."
          disabled={status === "pending"}
        />
        <Button
          type="submit"
          intent="success"
          appearance="primary"
          isLoading={status === "pending"}
          marginTop={majorScale(2)}
          disabled={
            title.length === 0 ||
            enLyrics.length === 0 ||
            delStatus === "pending"
          }
        >
          {update ? "Update" : "Add Lyrics"}
        </Button>
        {update && (
          <Button
            intent="danger"
            isLoading={delStatus === "pending"}
            disabled={status === "pending"}
            marginTop={majorScale(2)}
            marginLeft={majorScale(2)}
            onClick={async () => {
              setDelStatus("pending");
              await deleteLyrics(data._id);
              toaster.success("Deleted!");
              navigate("/dashboard/lyrics");
            }}
          >
            DELETE
          </Button>
        )}
      </form>
    </Card>
  );
}
