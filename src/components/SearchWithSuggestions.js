import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { SearchInput, Text, Pane, Paragraph, Spinner } from "evergreen-ui";

export function SearchWithSuggestions({
  term,
  placeholder,
  onChange,
  status,
  result,
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

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
        onChange={onChange}
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
          {status === "resolved" && result.length === 0 && (
            <Pane>
              <Text size={500}>Unfortunately there is no result. :(</Text>
              <Text display="block" size={500} marginTop="10px">
                Your search keyword must be a complete song title or{" "}
                <Link to="/dashboard/songs/create">create a new song now.</Link>
              </Text>
            </Pane>
          )}
          {status === "resolved" &&
            result.length > 0 &&
            result.map(({ title, coverArt, _id: id }) => (
              <Pane
                key={id}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                gap="10px"
                marginY="5px"
                padding="10px"
                elevation={1}
                background="tint2"
                cursor="pointer"
                minWidth="150px"
                onClick={() => navigate(`/dashboard/songs/${id}`)}
              >
                <img src={coverArt} alt={title} width="100px" />
                <Paragraph>{title}</Paragraph>
              </Pane>
            ))}
        </Pane>
      )}
    </form>
  );
}
