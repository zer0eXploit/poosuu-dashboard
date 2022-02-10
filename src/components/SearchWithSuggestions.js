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
  placeholder,
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
      url: "/songs",
      params: {
        search: term,
      },
    };

    search(options);
  };

  return (
    <form
      style={{ width: "100%" }}
      onSubmit={(e) => e.preventDefault()}
      autoComplete="off"
    >
      <SearchInput
        placeholder={placeholder}
        height="50px"
        width="100%"
        value={term}
        onChange={handleSearch}
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
          borderRadius={4}
          background="blue25"
          display="flex"
          flexWrap="wrap"
          maxHeight="200px"
          overflowY="auto"
          gap="10px"
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
              return <ResultCard key={id} id={id} {...r} />;
            })}
        </Pane>
      )}
    </form>
  );
}
