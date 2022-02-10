import React, { useState } from "react";

import { SearchInput, Text, Pane, Spinner } from "evergreen-ui";

export function SearchWithSuggestions({
  term,
  placeholder,
  onChange,
  status,
  result,
  ResultCard,
  NoResultInfo,
}) {
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
              {NoResultInfo && <NoResultInfo />}
            </Pane>
          )}
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
