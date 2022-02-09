import React from "react";

import { useNavigate } from "react-router-dom";
import { Card, Pane, Heading, Button, majorScale } from "evergreen-ui";

export function ArtistCard({ name, image, id }) {
  const navigate = useNavigate();

  return (
    <Card
      display="grid"
      gridTemplateColumns="150px 1fr"
      gridGap="10px"
      padding={majorScale(2)}
      elevation={1}
      background="blue25"
      width={400}
      maxWidth={400}
    >
      <img
        width="100%"
        src={image}
        alt={name}
        style={{ borderRadius: "5px" }}
      />
      <Pane
        display="flex"
        gap="10px"
        flexDirection="column"
        justifyContent="center"
      >
        <Heading as="h5" marginBottom="auto" size={800}>
          {name}
        </Heading>
        <Button
          appearance="primary"
          intent="success"
          onClick={() => {
            navigate(`/dashboard/artists/${id}/songs`);
          }}
        >
          View Songs
        </Button>
        <Button
          intent="success"
          onClick={() => {
            navigate(`/dashboard/artists/${id}`);
          }}
        >
          See Info
        </Button>
      </Pane>
    </Card>
  );
}
