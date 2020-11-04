import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import store from "./features/store";

describe("App Container", () => {
  it("should be able to render the app container without errors", () => {
    const container = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(container.getByTestId("app")).toBeInTheDocument();
  });
});
