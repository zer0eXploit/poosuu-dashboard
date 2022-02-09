import React, { useState } from "react";

import {
  Button,
  Card,
  Heading,
  Pane,
  Paragraph,
  Text,
  Strong,
  TextInputField,
  toaster,
  majorScale,
} from "evergreen-ui";

import { useAsync } from "../hooks";

import { ListLoader } from "../components";

import {
  createAPIKey,
  getGeneratedAPIKey,
  getGeneratedAPIKeys,
  deleteGeneratedAPIKey,
} from "../utils/account";

export default function ManageAPIKeys() {
  const [createAPIKeyStatus, setCreateAPIKeyStatus] = useState("idle");
  const [getAPIKeyStatus, setGetAPIKeyStatus] = useState("idle");
  const [apiKeyInfo, setApiKeyInfo] = useState("");

  const {
    data: apiKeys,
    status: getAPIKeysStatus,
    run: resolveAPIKeys,
  } = useAsync();

  const handleGetAPIKey = (event) => {
    event.preventDefault();
    let apiKey = event.target.elements["apiKey"].value;

    if (!!!apiKey) {
      toaster.warning("Please enter an API Key!");
      return;
    }

    setGetAPIKeyStatus("pending");
    getGeneratedAPIKey(apiKey).then(
      ({ data: { domain } }) => {
        setApiKeyInfo(domain);
        setGetAPIKeyStatus("resolved");
      },
      (error) => {
        console.error(error);
        toaster.danger("Error getting API key info.");
        setGetAPIKeyStatus("rejected");
      }
    );
  };

  const handleCreateAPIKey = (event) => {
    event.preventDefault();

    let hostName = event.target.elements["host"].value;

    if (!!!hostName) {
      toaster.warning("Please enter a hostname!");
      return;
    }

    setCreateAPIKeyStatus("pending");

    // Strip http or https if any
    const protomatch = /^(https?|ftp):\/\//;
    if (protomatch.test(hostName)) {
      hostName = hostName.replace(protomatch, "");
    }

    createAPIKey(hostName).then(
      ({ data: { key, host } }) => {
        setCreateAPIKeyStatus("resolved");

        // Copy API Key to ClipBoard
        navigator.clipboard.writeText(key).then(
          () =>
            toaster.success(
              `API Key for ${host} is created and copied to clipboard.`
            ),
          () => toaster.success("API Key Generated!")
        );
      },
      (error) => {
        setCreateAPIKeyStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        if (errorResponse) {
          toaster.warning(errorResponse.error ?? errorResponse.message);
        } else {
          toaster.danger("API Key creation failed.");
        }
      }
    );
  };

  const handleDeleteAPIKey = async (key) => {
    toaster.notify("Deleting the key...");
    deleteGeneratedAPIKey(key).then(
      () => {
        toaster.closeAll();
        toaster.success("Successfully deleted!");
      },
      (error) => {
        console.error(error);
        toaster.closeAll();
        toaster.danger("Error deleting the key. :(");
      }
    );
    // Refetch List
    resolveAPIKeys(getGeneratedAPIKeys());
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
          Manage API Keys
        </Heading>
        <Paragraph marginTop={majorScale(2)}>
          You can manage the generated API keys here. Or create new ones if
          necessary.
        </Paragraph>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Create new API Key
          </Heading>
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            <Paragraph>
              An API key is required to read data from Poo Suu API endpoints. To
              create an API Key all you need to specify is the domain name from
              which the API queries will be made.
            </Paragraph>
            <form onSubmit={handleCreateAPIKey}>
              <TextInputField
                description="Domain name without http:// or https:// example: poosuu.com"
                label="Domain Name"
                name="host"
              />
              <Button
                isLoading={createAPIKeyStatus === "pending"}
                appearance="primary"
                intent="success"
                type="submit"
              >
                Create
              </Button>
            </form>
          </Card>
        </Pane>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Get API Key Info
          </Heading>
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            <Paragraph>
              Please use the form below to query domain associated with an API
              Key.
            </Paragraph>
            <form onSubmit={handleGetAPIKey}>
              <TextInputField
                description="Please enter the API Key below."
                label="API Key"
                name="apiKey"
              />
              <Button
                isLoading={getAPIKeyStatus === "pending"}
                appearance="primary"
                intent="success"
                type="submit"
              >
                Get Information
              </Button>
            </form>
            {apiKeyInfo !== "" && (
              <Strong>
                The API Key is generated for hostname: {apiKeyInfo}
              </Strong>
            )}
          </Card>
        </Pane>
        <Pane display="flex" gap={majorScale(5)} marginTop={majorScale(3)}>
          <Heading as="h4" size={500} flexBasis="20%">
            Generated API Keys
          </Heading>
          <Card
            display="flex"
            flexBasis="60%"
            flexDirection="column"
            gap={majorScale(2)}
          >
            {(getAPIKeysStatus === "idle" ||
              getAPIKeysStatus === "rejected" ||
              apiKeys?.data?.keys?.length === 0) && (
              <>
                <Paragraph>
                  Please click the following button to get all generated API
                  Keys.
                </Paragraph>
                <Button
                  isLoading={getAPIKeysStatus === "pending"}
                  appearance="outline"
                  intent="none"
                  onClick={() => resolveAPIKeys(getGeneratedAPIKeys())}
                >
                  Get Generated API Keys
                </Button>
              </>
            )}
            {getAPIKeysStatus === "pending" && <ListLoader />}
            {getAPIKeysStatus === "rejected" && (
              <Text>Error getting API Keys. Please try again.</Text>
            )}
            {getAPIKeysStatus === "resolved" && (
              <Pane
                background="gray75"
                elevation={1}
                borderRadius={3}
                padding={majorScale(1)}
              >
                {apiKeys.data.keys.length > 0 ? (
                  apiKeys.data.keys.map((apiKey) => {
                    return (
                      <Pane
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        margin={majorScale(1)}
                        key={apiKey}
                      >
                        <Text>{apiKey}</Text>{" "}
                        <Pane>
                          <Button
                            intent="success"
                            appearance="primary"
                            onClick={() => {
                              navigator.clipboard.writeText(apiKey).then(
                                () =>
                                  toaster.success("Key copied to clipboard."),
                                () =>
                                  toaster.success(
                                    "Could not copy to clipboard. :("
                                  )
                              );
                            }}
                            marginRight={majorScale(1)}
                          >
                            Copy
                          </Button>
                          <Button
                            intent="danger"
                            onClick={() => handleDeleteAPIKey(apiKey)}
                          >
                            Delete
                          </Button>
                        </Pane>
                      </Pane>
                    );
                  })
                ) : (
                  <Text>
                    There are no API keys yet. Please create them above.
                  </Text>
                )}
              </Pane>
            )}
          </Card>
        </Pane>
      </Pane>
    </Pane>
  );
}
