import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EarningsCard from "../components/EarningsCard";

const mockEarning = {
  ticker: "AAPL",
  epsActual: 1.5,
  epsEstimate: 1.2,
  date: "2025-02-05",
  time: "Before Market Open", // Required field
};

describe("EarningsCard Component", () => {
  let openMock: jest.SpyInstance; // Declare mock variable

  beforeEach(() => {
    openMock = jest.spyOn(window, "open").mockImplementation(() => null); // Mock window.open
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocks after each test
  });

  it("should display company ticker and EPS data", () => {
    render(<EarningsCard earning={mockEarning} />);

    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0);
    expect(screen.getByText("EPS: 1.5 (Est: 1.2)")).toBeInTheDocument();
  });

  it("should redirect to the Benzinga quote page when clicked", () => {
    render(<EarningsCard earning={mockEarning} />);

    const tickerElements = screen.getAllByText("AAPL");
    userEvent.click(tickerElements[0]); // Click the first matching element

    expect(openMock).toHaveBeenCalledWith("https://www.benzinga.com/quote/aapl", "_blank");
  });
});
