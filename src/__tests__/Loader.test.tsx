import { render, screen } from "@testing-library/react";
import Loader from "../components/Loader";

describe("Loader Component", () => {
  it("should display loading text", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
