import React, { useState, useReducer } from "react";

import { Pane, Heading, majorScale, Button } from "evergreen-ui";

import { Container, SearchWithSuggestions } from "../components";

import { useSafeDispatch } from "../hooks";

import { createSearchSongFunc } from "../utils/songs";
import { createDebouncedFunc } from "../utils/debounce";

const search = createDebouncedFunc(createSearchSongFunc());

const initialState = {
  status: "idle",
  data: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "search_start":
      return { ...state, status: "pending" };

    case "search_success":
      return { status: "resolved", data: action.payload, error: null };

    case "search_failed":
      return { status: "rejected", data: null, error: action.payload };

    case "search_reset":
      return { status: "idle", data: null, error: null };

    default:
      throw new Error(`Unhandled ${action.type}`);
  }
};

export default function ArtistsIndex() {
  const [term, setTerm] = useState("");
  const [{ status, data, error }, unsafeDispatch] = useReducer(
    reducer,
    initialState
  );
  const dispatch = useSafeDispatch(unsafeDispatch);

  const handleSearch = (e) => {
    const term = e.target.value;
    setTerm(term);
    if (!!!term) {
      dispatch({ type: "search_reset" });
      return;
    }
    dispatch({ type: "search_start" });

    search(term, dispatch);
  };

  return (
    <Container disableMt>
      <Heading as="h3" size={900} marginBottom={majorScale(3)}>
        Search Songs
      </Heading>
      <Pane display="flex" flexDirection="column">
        {!error && (
          <SearchWithSuggestions
            term={term}
            onChange={handleSearch}
            placeholder={"Enter song name"}
            result={data}
            status={status}
          />
        )}
        {error && (
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
            <Button
              intent="success"
              appearance="primary"
              onClick={() => {
                dispatch({ type: "search_reset" });
                setTerm("");
              }}
            >
              Try Again
            </Button>
          </Pane>
        )}
      </Pane>
    </Container>
  );
}
