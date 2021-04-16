import React from "react";
import block from "bem-cn-lite";
import { Tooltip as MUITooltip, TooltipProps } from "@material-ui/core";

import "./Tooltip.scss";

const b = block("tooltip");

type Props = {
  message: React.ReactNode;
  children: TooltipProps["children"];
  open?: boolean;
  isError?: boolean;
  placement?: TooltipProps["placement"];
  small?: boolean;
  interactive?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  onClose?(): void;
};

function Tooltip({
  children,
  message,
  isError,
  placement = "bottom",
  small,
  open,
  interactive,
  disableHoverListener,
  disableTouchListener,
  onClose
}: Props) {
  return (
    <MUITooltip
      title={<>{message}</>}
      classes={{
        tooltip: b({ error: isError, small }),
        arrow: b("arrow", { error: isError }),
        popper: b("popper")
      }}
      placement={placement}
      open={open}
      arrow
      disableFocusListener // onFocus and onBlur do not work if using a Tooltip with TextField https://github.com/mui-org/material-ui/issues/19883#issuecomment-592980194
      interactive={interactive}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
      onClose={onClose}
    >
      {children}
    </MUITooltip>
  );
}

export { Tooltip };
