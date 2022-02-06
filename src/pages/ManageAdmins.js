import React, { useState } from "react";

import {
  Button,
  Card,
  TextInputField,
  Text,
  Pre,
  Pane,
  Heading,
  majorScale,
  toaster,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

import { createAdmin, getAdminById } from "../utils/account";

import { useAsync } from "../hooks/useAsync";

export default function ManageAdmins() {
  const [{ value: name, touched: nameFieldTouched }, setName] = useState({
    value: "",
    touched: false,
  });

  const [{ value: email, touched: emailFieldTouched }, setEmail] = useState({
    value: "",
    touched: false,
  });

  const [{ value: username, touched: usernameFieldTouched }, setUsername] =
    useState({
      value: "",
      touched: false,
    });

  const [{ value: password, touched: passwordFieldTouched }, setPassword] =
    useState({
      value: "",
      touched: false,
    });

  const [{ value: adminId, touched: adminIdFieldTouched }, setAdminId] =
    useState({
      value: "",
      touched: false,
    });

  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const { data, status: getAdminStatus, run } = useAsync();

  const getAdmin = (id) => {
    run(getAdminById(id));
  };

  const handleClick = () => {
    setStatus("pending");
    createAdmin({
      name,
      email,
      username,
      password,
    }).then(
      () => {
        setStatus("resolved");
        toaster.success("Admin created! They should get an email soon.");
        navigate("/dashboard/my-account");
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;

        if (errorResponse) {
          toaster.danger(errorResponse.error);
        }
      }
    );
  };

  return (
    <Pane
      padding={16}
      background="tint1"
      flex="1"
      elevation={1}
      borderRadius={4}
    >
      <Pane
        id="manage-admins-pannel"
        role="tabpanel"
        aria-labelledby="manage-admins-pannel"
      >
        <Heading as="h3" size={700}>
          Manage Admins
        </Heading>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Create Admin Account
          </Heading>
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            <TextInputField
              description="Please enter admin name."
              isInvalid={nameFieldTouched && name.length === 0}
              value={name}
              onChange={(e) =>
                setName({ value: e.target.value, touched: true })
              }
              label="Name"
            />
            <TextInputField
              description="Please enter admin email."
              isInvalid={emailFieldTouched && email.length === 0}
              value={email}
              onChange={(e) =>
                setEmail({ value: e.target.value, touched: true })
              }
              label="Email"
            />
            <TextInputField
              description="Please enter admin username."
              isInvalid={usernameFieldTouched && username.length === 0}
              value={username}
              onChange={(e) =>
                setUsername({ value: e.target.value, touched: true })
              }
              label="Username"
            />
            <TextInputField
              description="Please enter admin password."
              isInvalid={passwordFieldTouched && password.length === 0}
              value={password}
              onChange={(e) =>
                setPassword({ value: e.target.value, touched: true })
              }
              label="Temporary Password"
            />
            <Button
              isLoading={status === "pending"}
              disabled={
                name.length === 0 ||
                email.length === 0 ||
                username.length === 0 ||
                password.length === 0
              }
              appearance="primary"
              intent="success"
              onClick={handleClick}
            >
              Update
            </Button>
          </Card>
        </Pane>
        <Pane
          display="flex"
          gap={majorScale(5)}
          marginTop={majorScale(4)}
          marginBottom={majorScale(4)}
        >
          <Heading as="h4" size={500} flexBasis="20%" flex="-1">
            Get Admin Info
          </Heading>
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            <TextInputField
              description="Please enter admin id below."
              isInvalid={adminIdFieldTouched && adminId.length === 0}
              value={adminId}
              onChange={(e) =>
                setAdminId({ value: e.target.value, touched: true })
              }
              label="Admin Id"
            />
            {getAdminStatus === "resolved" && (
              <Pre
                maxWidth="700px"
                width="100%"
                overflow="auto"
                backgroundColor="#F4F5F9"
                padding="25px"
              >
                {JSON.stringify(data.data, null, 2)}
              </Pre>
            )}
            {getAdminStatus === "rejected" && <Text>Error getting admin</Text>}
            <Button
              isLoading={getAdminStatus === "pending"}
              disabled={adminId.length === 0}
              appearance="primary"
              intent="success"
              onClick={() => {
                getAdmin(adminId);
              }}
            >
              Get Admin
            </Button>
          </Card>
        </Pane>
      </Pane>
    </Pane>
  );
}
