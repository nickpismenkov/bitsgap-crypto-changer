import React from "react";
import block from "bem-cn-lite";

import { Button } from "components";
import { OrderSide } from "../../model";

import "./PlaceOrderTypeSwitch.scss";

const b = block("place-order-type-switch");

type Props = {
  activeOrderSide: OrderSide;
  onChange(orderSide: OrderSide): void;
};

const PlaceOrderTypeSwitch = ({ activeOrderSide, onChange }: Props) => {
  const handleToggle = (orderType: OrderSide) => {
    onChange(orderType);
  };

  return (
    <div className={b()}>
      <Button
        color="green"
        size="small"
        fullWidth
        inactive={activeOrderSide !== "buy"}
        onClick={() => handleToggle("buy")}
      >
        Buy
      </Button>
      <Button
        color="red"
        size="small"
        fullWidth
        inactive={activeOrderSide === "buy"}
        onClick={() => handleToggle("sell")}
      >
        Sell
      </Button>
    </div>
  );
};

export { PlaceOrderTypeSwitch };
