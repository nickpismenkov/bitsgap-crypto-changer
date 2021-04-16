import React from "react";
import { observer } from "mobx-react";
import block from "bem-cn-lite";

import { NumberInput, Button } from "components";

import { Input } from "./model";

import { BASE_CURRENCY, QUOTE_CURRENCY } from "./constants";
import { useStore } from "./context";
import { PlaceOrderTypeSwitch } from "./components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "./components/TakeProfit/TakeProfit";
import "./PlaceOrderForm.scss";

const b = block("place-order-form");

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
    addInput,
    inputs,
    clearInputs,
    deleteInput,
    updateInputs
  } = useStore();

  function doValidate(e: React.FormEvent<EventTarget>): void {
    e.preventDefault();

    const newInputs: Array<Input> = inputs.map((input: Input) => {
      if (input.trade === 0) input.tradeError = "Price must be greater than 0";
      if (input.profit === 0) input.profitError = "Minimum value is 0.01";
      return input;
    });

    updateInputs(newInputs);
  }

  return (
    <form className={b()} onSubmit={doValidate}>
      <div className={b("header")}>
        Binance: {`${BASE_CURRENCY} / ${QUOTE_CURRENCY}`}
      </div>
      <div className={b("type-switch")}>
        <PlaceOrderTypeSwitch
          activeOrderSide={activeOrderSide}
          onChange={setOrderSide}
        />
      </div>
      <div className={b("price")}>
        <NumberInput
          label="Price"
          value={price}
          onChange={(value) => setPrice(Number(value))}
          InputProps={{ endAdornment: QUOTE_CURRENCY }}
        />
      </div>
      <div className={b("amount")}>
        <NumberInput
          value={amount}
          label="Amount"
          onChange={(value) => setAmount(Number(value))}
          InputProps={{ endAdornment: BASE_CURRENCY }}
        />
      </div>
      <div className={b("total")}>
        <NumberInput
          value={total}
          label="Total"
          onChange={(value) => setTotal(Number(value))}
          InputProps={{ endAdornment: QUOTE_CURRENCY }}
        />
      </div>
      <div className={b("take-profit")}>
        <TakeProfit
          orderSide={activeOrderSide}
          addInput={addInput}
          inputs={inputs}
          clearInputs={clearInputs}
          deleteInput={deleteInput}
        />
      </div>
      <div className="submit">
        <Button
          color={activeOrderSide === "buy" ? "green" : "red"}
          type="submit"
          fullWidth
        >
          {activeOrderSide === "buy"
            ? `Buy ${BASE_CURRENCY}`
            : `Sell ${QUOTE_CURRENCY}`}
        </Button>
      </div>
    </form>
  );
});
