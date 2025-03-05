import axios, { AxiosError } from "axios";

const API_KEY = "f090a778d74f4450a11ad417ad72740c"; // Replace with a valid API key
const BASE_URL = "https://api.benzinga.com/api/v2.1/calendar/earnings";
const LOGO_URL = "https://api.benzinga.com/api/v2/logos/search";

/**
 * Fetches earnings data from the Benzinga API.
 * Retrieves earnings details for the last quarter.
 * @returns {Promise<any[]>} List of earnings.
 */
export const fetchEarnings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}?token=${API_KEY}`, {
      headers: { Accept: "application/json" },
    });

    if (response.status !== 200) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.data.earnings || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching earnings:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("General error fetching earnings:", error.message);
    } else {
      console.error("Unknown error fetching earnings:", error);
    }
    return [];
  }
};

/**
 * Fetches company logos from the Benzinga API for a given list of tickers.
 * @param {string[]} tickers - List of stock ticker symbols.
 * @returns {Promise<any[]>} List of logo data.
 */
export const fetchCompanyLogos = async (tickers: string[]) => {
  try {
    if (!tickers.length) {
      console.warn("No tickers provided for fetching logos.");
      return [];
    }

    // Encode tickers for URL (AAPL,TSLA -> AAPL%2CTSLA)
    const encodedTickers = encodeURIComponent(tickers.join(","));

    const response = await axios.get(
      `${LOGO_URL}?token=${API_KEY}&search_keys=${encodedTickers}&search_keys_type=symbol&fields=mark_vector_light`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching logos:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("General error fetching logos:", error.message);
    } else {
      console.error("Unknown error fetching logos:", error);
    }
    return [];
  }
};
