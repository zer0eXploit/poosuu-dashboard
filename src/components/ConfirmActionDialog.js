import React, { useState } from "react";

import { Pane, Dialog, Button } from "evergreen-ui";

export const ConfirmActionDialog = ({
  actionTitle = "Confirmation",
  actionBtnText = "Do something",
  actionInfo = "Please confirm what you intended to...",
  actionConfirmBtnText = "Proceed",
  intent = "danger",
  proceedActionFunc = () => null,
  marginTop = 16,
  isLoading = false,
}) => {
  const [isShown, setIsShown] = useState(false);
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title={actionTitle}
        intent={intent}
        confirmLabel={actionConfirmBtnText}
        minHeightContent={10}
        preventBodyScrolling
        onCloseComplete={() => {
          setIsShown(false);
        }}
        onConfirm={(close) => {
          proceedActionFunc();
          close();
        }}
      >
        {actionInfo}
      </Dialog>

      <Button
        marginTop={marginTop}
        intent={intent}
        appearance="primary"
        isLoading={isLoading}
        onClick={(e) => {
          e.preventDefault();
          setIsShown(true);
        }}
      >
        {actionBtnText}
      </Button>
    </Pane>
  );
};
