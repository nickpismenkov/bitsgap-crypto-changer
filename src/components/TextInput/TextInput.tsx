/* eslint @typescript-eslint/no-use-before-define: 0 */

import React, { useState, ReactNode } from "react";
import block from "bem-cn-lite";
import {
  TextField,
  TextFieldProps,
  InputBaseProps as MUIInputProps,
  InputLabelProps as MUIInputLabelProps,
  TooltipProps
} from "@material-ui/core";

import { Tooltip } from "../Tooltip/Tooltip";
import "./FilledInput.scss";
import "./UnderlinedInput.scss";

type Props = Omit<
  TextFieldProps,
  "variant" | "onChange" | "className" | "classes" | "error"
> & {
  variant?: "underlined" | "filled";
  error?: ReactNode;
  InputLabelProps?: Omit<
    TextFieldProps["InputLabelProps"],
    "className" | "classes"
  >;
  InputProps?: Omit<
    TextFieldProps["InputProps"],
    "disableUnderline" | "classes" | "className"
  >;
  errorPlacement?: TooltipProps["placement"];
  onChange?(value: string): void;
};

const TextInput = ({
  variant = "filled",
  error,
  onChange,
  onFocus,
  onBlur,
  InputLabelProps,
  InputProps,
  errorPlacement = "top",
  ...rest
}: Props) => {
  const b =
    variant === "filled" ? block("filled-input") : block("underlined-input");
  const inputClasses: MUIInputProps["classes"] = {
    root: b("input-wrapper", { error: Boolean(error) }),
    focused: b("input-wrapper", { focused: true }),
    adornedEnd: b("input-wrapper", { adorned: "end" }),
    adornedStart: b("input-wrapper", { adorned: "start" }),
    input: b("input")
  };

  const labelClasses: MUIInputLabelProps["classes"] = {
    root: b("input-label")
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Tooltip
      open={isFocused && !!error}
      message={error ?? ""}
      isError
      placement={errorPlacement}
    >
      <TextField
        {...rest}
        className={b()}
        variant="filled"
        onChange={handleChange}
        InputLabelProps={{
          ...InputLabelProps,
          classes: labelClasses
        }}
        InputProps={{
          ...InputProps,
          onFocus: handleFocus,
          onBlur: handleBlur,
          disableUnderline: true,
          classes: inputClasses
        }}
      />
    </Tooltip>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    onFocus ? onFocus(event) : InputProps?.onFocus?.(event);
    setIsFocused(true);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    onBlur ? onBlur(event) : InputProps?.onBlur?.(event);
    setIsFocused(false);
  }
};

export { TextInput, Props as TextInputProps };
