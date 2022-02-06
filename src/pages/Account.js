import React from "react";

import { Pane, Tab, Tablist, majorScale } from "evergreen-ui";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const tabs = [
  {
    to: "account-security",
    name: "Account Security",
  },
  {
    to: "update-account-info",
    name: "Update Account Info",
  },
  {
    to: "manage-admins",
    name: "Manage Admins",
  },
  {
    to: "manage-api-keys",
    name: "Manage API Keys",
  },
];

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();

  //   To Determine Current Active Tab
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const handleSelect = (to) => {
    navigate(`/dashboard/my-account/${to}`);
  };

  return (
    <Pane display="flex" height={"100%"} padding={majorScale(2)}>
      <Tablist
        marginBottom={16}
        flexBasis={240}
        marginRight={24}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={5}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.to}
            id={tab.to}
            onSelect={() => handleSelect(tab.to)}
            isSelected={tab.to === lastSegment}
            aria-controls={`panel-${tab.name}`}
            width="100%"
            display="block"
          >
            {tab.name}
          </Tab>
        ))}
      </Tablist>
      <Outlet />
    </Pane>
  );
}
