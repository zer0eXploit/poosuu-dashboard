import React from "react";

import {
  Heading,
  Pane,
  Card,
  Text,
  SettingsIcon,
  PeopleIcon,
  MusicIcon,
  ListIcon,
  AddIcon,
  KeyIcon,
  majorScale,
  Paragraph,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { Container } from "../components";

import { useAuth } from "../context/auth-context";

import classes from "./styles/Dashboard.module.css";

const quickActions = [
  {
    title: "Account Settings",
    icon: <SettingsIcon size={40} />,
    description:
      "This is where you can manage you account info and security settings.",
    to: "/my-account",
  },
  {
    title: "Manage Artists",
    icon: <PeopleIcon size={40} />,
    description:
      "This is where you can search, view, add, edit or delete artist information.",
    to: "/artists",
  },
  {
    title: "Manage Songs",
    icon: <MusicIcon size={30} />,
    description:
      "This is where you can search, view, add, edit or delete song information.",
    to: "/songs",
  },
  {
    title: "Manage Lyrics",
    icon: <ListIcon size={40} />,
    description:
      "This is where you can search, view, add, edit or delete lyrics information.",
    to: "/lyrics",
  },
  {
    title: "Manage API Keys",
    icon: <KeyIcon size={40} />,
    description:
      "This is where you manage generate API Keys or create new ones.",
    to: "/my-account/manage-api-keys",
  },
  {
    title: "Manage Admins",
    icon: <AddIcon size={40} />,
    description:
      "This is where you create admin accounts for newcomers and view admin account information.",
    to: "/my-account/manage-admins",
  },
];

function SettingCard({ title, icon, description, to }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={2}
      background="blueTint"
      borderRadius="5px"
      display="grid"
      gridTemplateColumns="45px 1fr"
      gridTemplateRows="45px 1fr"
      justifyItems="start"
      alignItems="center"
      gap={majorScale(1)}
      padding={majorScale(2)}
      cursor="pointer"
      minHeight="145px"
      className={classes["QuickActionCard"]}
      onClick={() => navigate(`/dashboard${to}`)}
    >
      {icon}
      <Heading as="h4">{title}</Heading>
      <Pane width="300px" gridColumnStart="2">
        <Text>{description}</Text>
      </Pane>
    </Card>
  );
}

export default function Dashboard() {
  const {
    authData: {
      admin: { name },
    },
  } = useAuth();

  return (
    <Container>
      <Heading as="h2" size={900}>
        {`Konnichiwa ${name}!`}
      </Heading>
      <Paragraph size={500} marginY={majorScale(2)}>
        What would you like to to?
      </Paragraph>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        gap={majorScale(2)}
        padding={majorScale(3)}
      >
        {quickActions.map((qA) => (
          <SettingCard
            key={qA.title}
            title={qA.title}
            icon={qA.icon}
            description={qA.description}
            to={qA.to}
          />
        ))}
      </Pane>
    </Container>
  );
}
