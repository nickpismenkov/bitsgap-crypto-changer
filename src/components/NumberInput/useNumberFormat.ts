/* eslint @typescript-eslint/no-use-before-define: 0 */
import React from "react";
import { useState, useEffect, useRef } from "react";
import { pipe, replace, test, propEq, clamp } from "ramda";

type FormatOptions = {
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  decimalScale?: number;
};

type Handlers = {
  onChange?(value: number | null): void;
  onBlur?(value: number | null): void;
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
  onMouseUp?(event: React.MouseEvent<HTMLInputElement>): void;
  onKeyUp?(event: React.KeyboardEvent<HTMLInputElement>): void;
};

const xor = (a: boolean, b: boolean) => (a ? !b : b);
const escapeRegexpSymbols = (str: string) =>
  str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");

function useNumberFormat(
  numberValue: number | null,
  { onChange, onBlur, onFocus, onMouseUp, onKeyUp }: Handlers,
  {
    prefix = "",
    suffix = "",
    min = -Infinity,
    max = Infinity,
    decimalScale
  }: FormatOptions = {}
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [caretPosition, setCaretPosition] = useState([0, 0]);
  const [formattedValue, setFormattedValue] = useState(formatNumber(numberValue));

  const safePrefix = escapeRegexpSymbols(prefix);
  const safeSuffix = escapeRegexpSymbols(suffix);
  const prefixRegExp = RegExp(`^(-)?(${safePrefix})`);
  const suffixRegExp = RegExp(`(${safeSuffix})$`);
  const signRegExp = RegExp(`^-(${safePrefix})`);
  const rawValueRegExp = RegExp("^(-)?(\\d*)?(\\.\\d*)?$");
  const numberRegExp = RegExp(
    "^(-)?(\\d*)?(\\.\\d{0," + (decimalScale ?? "") + "})?"
  );

  const hasPrefix = test(prefixRegExp);
  const hasSuffix = test(suffixRegExp);
  const hasSign = test(signRegExp);
  const hasOnlyValidSymbols = pipe(
    removePrefix,
    removeSuffix,
    replace(/[-\d.]/g, ""),
    propEq("length", 0)
  );

  const isRawStringValid = test(rawValueRegExp);
  const isFormattingBroken = (value: string) =>
    !test(/^-?\s*$/, formattedValue) && xor(hasPrefix(value), hasSuffix(value));
  const areValuesValid = (value: string, rawString: string) =>
    hasOnlyValidSymbols(value) &&
    !isFormattingBroken(value) &&
    isRawStringValid(rawString);

  useEffect(() => {
    const [start, end] = caretPosition;
    inputRef.current?.setSelectionRange(start, end);
  }, [caretPosition]);

  useEffect(() => {
    if (!focused) {
      setFormattedValue(formatNumber(numberValue));
    }
  }, [numberValue]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    const rawValue = getRawValue(value);

    if (areValuesValid(value, rawValue)) {
      setFormattedValue(formatString(rawValue));
      onChange?.(convertToNumber(rawValue));
    } else {
      const [start] = caretPosition;
      setCaretPosition([start, start]);
    }
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { value } = event.target;
    const rawValue = getRawValue(value);
    setFormattedValue(formatNumber(numberValue));
    onBlur?.(convertToNumber(rawValue));
    setFocused(false);
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const { selectionStart, selectionEnd } = event.currentTarget;
    const position = correctCaretPosition(
      Number(selectionStart),
      Number(selectionEnd)
    );
    setCaretPosition(position);
    onKeyUp?.(event);
  }

  function handleMouseUp(event: React.MouseEvent<HTMLInputElement>) {
    const position = correctCaretPosition(
      inputRef.current?.selectionStart ?? 0,
      inputRef.current?.selectionEnd ?? 0
    );

    setCaretPosition(position);
    onMouseUp?.(event);
  }

  function correctCaretPosition(start: number, end: number) {
    const value = inputRef.current?.value || "";
    const leftBound = prefix.length + (hasSign(value) ? 1 : 0);
    const rightBound = value.length - suffix.length;
    const position =
      leftBound <= rightBound ? clamp(leftBound, rightBound, start) : start;

    return start === end ? [position, position] : [start, end];
  }

  function formatNumber(value: number | null) {
    return formatString(value !== null ? value.toString() : "");
  }

  function getRawValue(value: string) {
    return pipe(
      removePrefix,
      removeSuffix,
      maybeAddSign,
      trimDecimals
    )(value);
  }

  function formatString(value: string) {
    if (value === "-" || value === "") {
      return value;
    }

    const [, sign = "", whole = "", decimal = ""] =
      value.match(numberRegExp) ?? [];
    return `${sign}${prefix}${whole}${decimal}${suffix}`;
  }

  function convertToNumber(value: string): number | null {
    const number = parseFloat(value);
    return Number.isNaN(number) ? null : toRange(number);
  }

  function maybeAddSign(value: string) {
    const needNegate = (value.match(/-/g)?.length ?? 0) % 2 !== 0;
    const valueWithoutSign = value.replace(/-/g, "");
    return needNegate ? `-${valueWithoutSign}` : valueWithoutSign;
  }

  function toRange(value: number) {
    return clamp(min, max, value);
  }

  function trimDecimals(value: string) {
    return value.match(numberRegExp)?.[0] ?? value;
  }

  function removePrefix(value: string) {
    return value.replace(prefixRegExp, "$1");
  }

  function removeSuffix(value: string) {
    return value.replace(suffixRegExp, "");
  }

  return {
    inputRef,
    value: formattedValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyUp: handleKeyUp,
    onMouseUp: handleMouseUp
  } as const;
}

export { useNumberFormat };
