import React, { useState } from "react";

import {
  Heading,
  Button,
  SearchInput,
  Text,
  Pane,
  Spinner,
  majorScale,
} from "evergreen-ui";

import { useSearch } from "../hooks";

export function SearchWithSuggestions({
  placeholder = "Please enter search term...",
  searchConfig,
  height = "50px",
  ResultCard,
  NoResultInfo,
}) {
  const [term, setTerm] = useState("");
  const [show, setShow] = useState(false);
  const { status, error, data: result, search, dispatch } = useSearch();

  const handleSearch = (e) => {
    const term = e.target.value;
    setTerm(term);
    if (!!!term) {
      dispatch({ type: "reset" });
      return;
    }
    dispatch({ type: "start" });

    const options = {
      ...searchConfig,
      params: {
        search: term,
      },
    };

    search(options);
  };

  return (
    <Pane width="100%" position="relative">
      <SearchInput
        placeholder={placeholder}
        height={height}
        width="100%"
        value={term}
        onChange={handleSearch}
        autoComplete="off"
        onFocus={() => setShow(true)}
        onBlur={() => {
          if (!!!term) setShow(false);
        }}
      />
      {show && (
        <Pane
          width="100%"
          marginTop="4px"
          elevation={1}
          padding="15px"
          position="absolute"
          top={height}
          left="0"
          borderRadius={4}
          background="blue25"
          display="flex"
          flexWrap="wrap"
          maxHeight="300px"
          overflowY="auto"
          gap="10px"
          zIndex={2}
        >
          {status === "idle" && <Text size={500}>Please start typing...</Text>}
          {status === "pending" && (
            <Pane display="flex" alignItems="center" gap="10px">
              <Spinner size={24} />
              <Text size={500}>searching... this might take a moment.</Text>
            </Pane>
          )}
          {status === "rejected" && (
            <Pane
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              width="100%"
            >
              <Heading as="h3" size={600} marginBottom={majorScale(2)}>
                {error?.response?.data?.message ??
                  error?.response?.data?.error ??
                  error?.message ??
                  "Something went wrong..."}
              </Heading>
              <Button
                intent="success"
                appearance="primary"
                onClick={() => dispatch({ type: "reset" })}
              >
                Try Again
              </Button>
            </Pane>
          )}
          {status === "resolved" &&
            result.length === 0 &&
            (NoResultInfo ? (
              <NoResultInfo />
            ) : (
              <Text size={500}>Unfortunately there is no result. :(</Text>
            ))}
          {status === "resolved" &&
            result.length > 0 &&
            result.map(({ _id: id, ...r }) => {
              return (
                <ResultCard
                  key={id}
                  id={id}
                  {...r}
                  hideSuggestions={() => setShow(false)}
                />
              );
            })}
        </Pane>
      )}
    </Pane>
  );
}
