import React from "react";
import { Button, ButtonProps } from "@material-ui/core";
import block from "bem-cn-lite";

import "./TextButton.scss";

const b = block("text-button");

const classes: ButtonProps["classes"] = {
  root: b(),
  focusVisible: b({ focused: true })
};

function TextButton({ children, ...rest }: ButtonProps) {
  return (
    <Button disableRipple classes={classes} {...rest}>
      {children}
    </Button>
  );
}

export { TextButton };
