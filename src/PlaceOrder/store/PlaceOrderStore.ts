import { observable, computed, action } from "mobx";
import { uid } from "uid";

import { OrderSide, Input } from "../model";

export class PlaceOrderStore {
  @observable activeOrderSide: OrderSide = "buy";
  @observable price: number = 0;
  @observable amount: number = 0;
  @observable inputs: Array<Input> = [];

  @computed
  get total(): number {
    return this.price * this.amount;
  }

  @action.bound
  public setOrderSide(side: OrderSide) {
    this.activeOrderSide = side;
  }

  @action.bound
  public setPrice(price: number) {
    this.price = price;
  }

  @action.bound
  public setAmount(amount: number) {
    this.amount = amount;
  }

  @action.bound
  public setTotal(total: number) {
    this.amount = this.price > 0 ? total / this.price : 0;
  }

  @action.bound
  public addInput() {
    const profit =
      this.inputs.length === 0
        ? 2
        : this.inputs[this.inputs.length - 1].profit + 2;
    const amount = this.inputs.length === 0 ? 100 : 20;

    if (this.inputs.length < 5) {
      this.inputs.push({
        id: uid(32),
        profit,
        trade: 0,
        amount
      });
    }

    if (this.inputs.length > 1) {
      this.inputs[0].amount = 100 - 20 * (this.inputs.length - 1);
    }
  }

  @action.bound
  public deleteInput(id: string) {
    this.inputs = this.inputs.filter((input) => input.id !== id);
  }

  @action.bound
  public clearInputs() {
    this.inputs = [];
  }

  @action.bound
  public updateInputs(inputs: Array<Input>) {
    this.inputs = inputs;
  }
}
