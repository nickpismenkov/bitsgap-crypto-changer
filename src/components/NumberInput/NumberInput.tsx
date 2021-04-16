import React from "react";

import { TextInput, TextInputProps } from "../TextInput/TextInput";
import { useNumberFormat } from "./useNumberFormat";

type Props = Omit<TextInputProps, "onChange" | "onBlur" | "value"> & {
  value: number | null;
  min?: number;
  max?: number;
  decimalScale?: number;
  onChange?(value: number | null): void;
  onBlur?(value: number | null): void;
};

function NumberInput({
  value,
  min,
  max,
  decimalScale,
  onChange,
  onBlur,
  onFocus,
  onMouseUp,
  onKeyUp,
  InputProps,
  ...rest
}: Props) {
  const numberInput = useNumberFormat(
    value,
    { onChange, onBlur, onFocus, onMouseUp, onKeyUp },
    { min, max, decimalScale }
  );
  return <TextInput {...rest} InputProps={{ ...InputProps, ...numberInput }} />;
}

export { NumberInput, Props as NumberInputProps };
