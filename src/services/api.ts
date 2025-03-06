import axios from "axios";

const API_KEY = "f090a778d74f4450a11ad417ad72740c";
const BASE_URL = "https://api.benzinga.com/api/v2.1/calendar/earnings";
const LOGO_URL = "https://api.benzinga.com/api/v2/logos/search";

/**
 * Get the start (Monday) and end (Friday) dates of the current week.
 */
const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4); // Set to Friday

  return {
    startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0], // YYYY-MM-DD
  };
};

/**
 * Fetches earnings data for the current week from the Benzinga API.
 * @returns {Promise<any[]>} List of earnings.
 */
export const fetchEarnings = async (): Promise<any[]> => {
  try {
    const { startDate, endDate } = getCurrentWeekDates();
   // console.log(`📡 Fetching earnings from ${startDate} to ${endDate}...`);

    const response = await axios.get(
      `${BASE_URL}?token=${API_KEY}&parameters[date_from]=${startDate}&parameters[date_to]=${endDate}&pagesize=1000`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (response.status !== 200 || !response.data || !response.data.earnings) {
      throw new Error(`API Error: Invalid response`);
    }

    const earnings = response.data.earnings;
    //console.log("📡 Raw API Earnings Data:", earnings);

    return earnings;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios error fetching earnings:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("❌ General error fetching earnings:", error.message);
    } else {
      console.error("❌ Unknown error fetching earnings");
    }
    return [];
  }
};

/**
 * Fetches company logos from the Benzinga API in batches (max 100 per request).
 * @param {string[]} tickers - List of stock ticker symbols.
 * @returns {Promise<Record<string, string>>} A mapping of tickers to logo URLs.
 */
export const fetchCompanyLogos = async (tickers: string[]): Promise<Record<string, string>> => {
  try {
    if (!tickers.length) {
      console.warn("⚠️ No tickers provided for fetching logos.");
      return {};
    }

   // console.log(`📡 Fetching logos for ${tickers.length} tickers...`);

    const logoMap: Record<string, string> = {};
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
      const batch = tickers.slice(i, i + BATCH_SIZE);

    //  console.log(`📡 Fetching batch: ${batch.join(", ")}`);

      const response = await axios.get(
        `${LOGO_URL}?token=${API_KEY}&search_keys=${batch.join(",")}&search_keys_type=symbol&fields=mark_vector_light,mark_vector_dark`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error(`API Error: Invalid response`);
      }

      // ✅ Extract `data` property correctly (API response might be wrapped inside { ok: true, data: [...] })
      const responseData = response.data.data || response.data;

      if (!Array.isArray(responseData)) {
        console.warn("⚠️ Unexpected response format:", responseData);
        continue;
      }

      responseData.forEach((logo) => {
        if (logo?.search_key) {
          logoMap[logo.search_key] = logo.files?.mark_vector_light ?? logo.files?.mark_vector_dark ?? "";
        }
      });
    }

    //console.log("✅ Logos Fetched:", logoMap);
    return logoMap;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios error fetching logos:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("❌ General error fetching logos:", error.message);
    } else {
      console.error("❌ Unknown error fetching logos");
    }
    return {};
  }
};