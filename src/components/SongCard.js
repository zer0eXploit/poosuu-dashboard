import React from "react";

import { useNavigate } from "react-router-dom";
import { Heading, Card, Button, majorScale } from "evergreen-ui";

export function SongCard({ title, coverArt, id }) {
  const navigate = useNavigate();

  return (
    <Card
      display="grid"
      gridTemplateColumns="1fr"
      gridGap="10px"
      padding={majorScale(2)}
      elevation={1}
      background="blue25"
      justifyItems="center"
      width="180px"
      maxWidth="180px"
    >
      <img
        width="150px"
        src={coverArt}
        alt={title}
        style={{ borderRadius: "5px" }}
      />
      <Heading
        as="h5"
        marginBottom="auto"
        size={800}
        overflowX="auto"
        title={title}
      >
        {`${title.length > 13 ? title.slice(0, 10) + "..." : title}`}
      </Heading>
      <Button onClick={() => navigate(`/dashboard/songs/${id}`)}>View</Button>
    </Card>
  );
}
