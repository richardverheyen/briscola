import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

function CopyToClipboard({ url }) {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Copied to clipboard"
      >
        <IconButton
          aria-label="copy to clipboard"
          onClick={() =>
            navigator.clipboard.writeText(url).then(handleTooltipOpen)
          }
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
}

export default CopyToClipboard;
