import React, { createContext, useContext } from "react";

import { PlaceOrderStore } from "./store/PlaceOrderStore";

const store = new PlaceOrderStore();
const storeContext = createContext(store);

const useStore = () => {
  return useContext(storeContext);
};

const StoreProvider: React.FC = ({ children }) => (
  <storeContext.Provider value={store}>{children}</storeContext.Provider>
);

export { useStore, StoreProvider };
