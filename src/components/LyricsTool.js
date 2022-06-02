import React, { useState } from "react";

import {
  Tab,
  Text,
  Pane,
  Label,
  Button,
  Heading,
  Spinner,
  Tablist,
  Textarea,
  Paragraph,
  TextInputField,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  toaster,
  majorScale,
} from "evergreen-ui";
import { useNavigate } from "react-router-dom";

export function LyricsTool({
  videoRef,
  makeRequest,
  update = false,
  refetch = () => {},
  data: {
    youtubeEmbed: embedId,
    title: lyricsTitle,
    lyricsData: lyricsLines = [],
    _id: lyricsId,
  },
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabs] = useState(["EN", "MM", "JP", "KR"]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [lyricsText, setLyricsText] = useState({
    EN: "",
    MM: "",
    JP: "",
    KR: "",
  });
  const [lines, setLines] = useState(lyricsLines);
  const [status, setStatus] = useState("idle");
  const [{ value: title, touched: titleTouched }, setTitle] = useState({
    value: lyricsTitle ?? "",
    touched: false,
  });
  const navigate = useNavigate();

  const clearAll = () => {
    setFrom(0);
    setTo(0);
    setLyricsText({
      EN: "",
      MM: "",
      JP: "",
      KR: "",
    });
  };

  const handleAddLyrics = (lyricsData) => {
    if (lyricsData.lyricsText.update) {
      const {
        from,
        to,
        lyricsText: { EN, MM, JP, KR },
      } = lyricsData;

      const linesCopy = lines.concat();

      linesCopy[lyricsData.lyricsText.idx] = {
        from,
        to,
        lyricsText: {
          EN,
          MM,
          JP,
          KR,
        },
      };
      setLines(linesCopy);
    } else {
      setLines((prevLines) => {
        return [...prevLines, lyricsData];
      });
    }

    clearAll();
  };

  const handleSubmit = (reqData) => {
    if (update) reqData.id = lyricsId;

    setStatus("pending");
    toaster.closeAll();
    toaster.notify("Please wait...");
    makeRequest(reqData).then(
      ({ data: { _id } }) => {
        toaster.closeAll();
        toaster.success("Success!");
        if (!update) {
          navigate(`/dashboard/lyrics/${_id}`);
        } else {
          refetch();
        }
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;

        toaster.closeAll();

        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        } else {
          toaster.danger(error.message);
        }
      }
    );
  };

  if (!embedId) {
    return <h1>Loading...</h1>;
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      gap="1rem"
    >
      <TextInputField
        isInvalid={titleTouched && title.length === 0}
        value={title}
        onChange={(event) => {
          setTitle({
            value: event.target.value,
            touched: true,
          });
        }}
        label="Lyrics Title"
        disabled={status === "pending"}
      />
      <Pane display="flex">
        <Pane
          width="30%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Pane>
            <Heading as="h5">Timing</Heading>
            <Text marginTop="1rem" display="block">
              From (seconds) - {from}
            </Text>
            <Text marginTop="1rem" display="block">
              To (seconds) - {to}
            </Text>
          </Pane>

          <Pane>
            <Button
              disabled={status === "pending"}
              onClick={() => {
                const currentTime = videoRef.current.plyr.currentTime;
                videoRef.current.plyr.currentTime = currentTime - 3;
              }}
            >
              <DoubleChevronLeftIcon /> 3s
            </Button>
            <Button
              disabled={status === "pending"}
              onClick={() => {
                const currentTime = videoRef.current.plyr.currentTime;
                videoRef.current.plyr.currentTime = currentTime + 3;
              }}
              marginLeft="5px"
            >
              <DoubleChevronRightIcon /> 3s
            </Button>
          </Pane>
        </Pane>
        <Pane width="70%">
          <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
            {tabs.map((tab, index) => (
              <Tab
                key={tab}
                id={tab}
                disabled={status === "pending"}
                onSelect={() => setSelectedIndex(index)}
                isSelected={index === selectedIndex}
                aria-controls={`panel-${tab}`}
              >
                {tab}
              </Tab>
            ))}
          </Tablist>
          <Pane padding={16} background="tint1" flex="1">
            {tabs.map((tab, index) => (
              <Pane
                key={tab}
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={tab}
                aria-hidden={index !== selectedIndex}
                display={index === selectedIndex ? "block" : "none"}
              >
                <Pane>
                  <Label htmlFor="textarea-2" marginBottom={4} display="block">
                    {tab} Lyrics
                  </Label>
                  <Textarea
                    id="textarea-2"
                    placeholder="Please enter your lyrics or translation here..."
                    value={lyricsText[tab]}
                    maxWidth="100%"
                    fontSize="1.1rem"
                    lineHeight={1.5}
                    rows="5"
                    disabled={status === "pending"}
                    onChange={(event) => {
                      setLyricsText((prevState) => {
                        return {
                          ...prevState,
                          [tab]: event.target.value,
                        };
                      });
                    }}
                  />
                </Pane>
              </Pane>
            ))}
          </Pane>
        </Pane>
      </Pane>
      <Pane display="flex" gap="5px">
        <Button
          disabled={status === "pending"}
          onClick={() => {
            setFrom(parseFloat(videoRef.current.plyr.currentTime.toFixed(2)));
          }}
        >
          Set Current Time As Start
        </Button>
        <Button
          disabled={status === "pending"}
          onClick={() => {
            setTo(parseFloat(videoRef.current.plyr.currentTime.toFixed(2)));
          }}
        >
          Set Current Time As End
        </Button>
        <Button
          intent="success"
          appearance="primary"
          disabled={
            lyricsText["EN"].length === 0 || from >= to || status === "pending"
          }
          onClick={() => {
            handleAddLyrics({
              from,
              to,
              lyricsText,
            });
          }}
        >
          {lyricsText.update ? "Update" : "Add Lyrics"}
        </Button>
        <Button
          disabled={status === "pending"}
          intent="danger"
          appearance="primary"
          onClick={clearAll}
        >
          {lyricsText.update ? "Cancel" : "Clear All"}
        </Button>
      </Pane>
      <Pane>
        <Heading as="h5" marginBottom={majorScale(2)}>
          Lyrics Lines
        </Heading>
        <Pane display="flex" gap="0.5rem" maxWidth="100%" overflow="auto">
          {lines.length > 0 ? (
            lines.map((l, idx) => {
              return (
                <Pane
                  key={l.from}
                  background="gray50"
                  marginY={majorScale(1)}
                  padding="1rem"
                  borderRadius="0.4rem"
                  elevation={1}
                  cursor={status === "pending" ? "not-allowed" : "pointer"}
                  flexShrink="0"
                  onClick={() => {
                    if (status === "pending") return;

                    videoRef.current.plyr.currentTime = l.from;
                    setTo(l.to);
                    setFrom(l.from);
                    setLyricsText({
                      ...l.lyricsText,
                      idx: idx,
                      update: true,
                    });
                  }}
                >
                  <Paragraph size={500} marginBottom={majorScale(1)}>
                    {l.from} - {l.to}s
                  </Paragraph>
                  <Paragraph>{`${l.lyricsText.EN.slice(0, 25)}${
                    l.lyricsText.EN.length > 25 ? "..." : ""
                  }`}</Paragraph>
                </Pane>
              );
            })
          ) : (
            <Text>There is nothing yet. Go add some!</Text>
          )}
        </Pane>
        <Button
          marginTop="1rem"
          intent="success"
          appearance="primary"
          size="large"
          disabled={
            lines.length === 0 || title.length === 0 || status === "pending"
          }
          onClick={() => {
            const data = {
              title: title,
              lyricsData: lines,
              youtubeEmbed: embedId,
            };
            handleSubmit(data);
          }}
        >
          {status === "pending" && <Spinner marginRight="5px" size={24} />}
          Submit
        </Button>
      </Pane>
    </Pane>
  );
}
