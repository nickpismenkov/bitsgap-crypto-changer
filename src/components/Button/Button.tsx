import React from "react";
import { Button as MUIButton, ButtonProps } from "@material-ui/core";
import block from "bem-cn-lite";

import "./Button.scss";

type Props = Omit<ButtonProps, "color" | "size"> & {
  color: "green" | "red";
  size?: "small" | "normal";
  inactive?: boolean;
};

const b = block("button");

const Button: React.FC<Props> = ({
  children,
  color,
  size = "normal",
  inactive = false,
  ...rest
}) => (
  <MUIButton disableRipple className={b({ color, inactive, size })} {...rest}>
    {children}
  </MUIButton>
);

export { Button };
