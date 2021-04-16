/* eslint @typescript-eslint/no-use-before-define: 0 */

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import block from "bem-cn-lite";
import { AddCircle, Cancel } from "@material-ui/icons";

import { Switch, TextButton, NumberInput } from "components";

import { QUOTE_CURRENCY } from "../../constants";
import { OrderSide, Input } from "../../model";
import "./TakeProfit.scss";

type Props = {
  orderSide: OrderSide;
  addInput: () => void;
  clearInputs: () => void;
  deleteInput: (id: string) => void;
  inputs: Array<Input>;
};

const b = block("take-profit");

const TakeProfit = observer(
  ({ orderSide, addInput, clearInputs, inputs, deleteInput }: Props) => {
    const [check, setCheck] = useState<boolean>(false);

    useEffect(() => {
      if (inputs.length === 0 && check === true) addInput();
      if (check === false) clearInputs();
    }, [check]);

    return (
      <div className={b()}>
        <div className={b("switch")}>
          <span>Take profit</span>
          <Switch checked={check} onChange={setCheck} />
        </div>
        {check && (
          <div className={b("content")}>
            {inputs.map((input) => (
              <div key={input.id}>
                {renderTitles()}
                {renderInputs(input)}
              </div>
            ))}
            {inputs.length < 5 && (
              <TextButton
                className={b("add-button")}
                onClick={() => addInput()}
              >
                <AddCircle className={b("add-icon")} />
                <span>Add profit target {inputs.length}/5</span>
              </TextButton>
            )}
            <div className={b("projected-profit")}>
              <span className={b("projected-profit-title")}>
                Projected profit
              </span>
              <span className={b("projected-profit-value")}>
                <span>0</span>
                <span className={b("projected-profit-currency")}>
                  {QUOTE_CURRENCY}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    );

    type renderInputsType = {
      id: string;
      profit: number;
      trade: number;
      amount: number;
      tradeError?: string;
      profitError?: string;
    };

    function renderInputs({
      id,
      profit,
      trade,
      amount,
      tradeError,
      profitError
    }: renderInputsType) {
      return (
        <div className={b("inputs")} key={id}>
          <NumberInput
            error={profitError ? profitError : ""}
            value={profit}
            decimalScale={2}
            InputProps={{ endAdornment: "%" }}
            variant="underlined"
          />
          <NumberInput
            error={tradeError ? tradeError : ""}
            value={trade}
            decimalScale={2}
            InputProps={{ endAdornment: QUOTE_CURRENCY }}
            variant="underlined"
          />
          <NumberInput
            value={amount}
            decimalScale={2}
            InputProps={{ endAdornment: "%" }}
            variant="underlined"
          />
          <div className={b("cancel-icon")}>
            <Cancel onClick={() => deleteInputById(id)} />
          </div>
        </div>
      );
    }

    function deleteInputById(id: string) {
      if (inputs.length === 1) setCheck(false);
      deleteInput(id);
    }

    function renderTitles() {
      return (
        <div className={b("titles")}>
          <span>Profit</span>
          <span>Trade price</span>
          <span>Amount to {orderSide === "buy" ? "sell" : "buy"}</span>
        </div>
      );
    }
  }
);

export { TakeProfit };
