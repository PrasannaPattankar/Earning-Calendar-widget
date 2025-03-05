import { useState, useEffect } from "react";
import { fetchEarnings, fetchCompanyLogos } from "../services/api";

/**
 * Interface for earnings data.
 */
export interface EarningsData {
  ticker: string;
  date: string;
  epsActual?: number;
  epsEstimate?: number;
}

/**
 * Interface for company logo data.
 */
export interface CompanyLogo {
  search_key: string;
  files: {
    mark_vector_light?: string;
  };
}

/**
 * Custom hook to fetch earnings and corresponding company logos.
 * @returns {object} { earnings, logos, loading }
 */
export const useEarnings = () => {
  const [earnings, setEarnings] = useState<EarningsData[]>([]);
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEarningsData = async () => {
      setLoading(true);

      try {
        // Fetch earnings data
        const earningsData: EarningsData[] = await fetchEarnings();
        setEarnings(earningsData);

        // Extract tickers from earnings data
        const tickers = earningsData.map((item: EarningsData) => item.ticker);
        console.log("Fetched Earnings Data:", earningsData);
        console.log("Extracted Tickers:", tickers);

        if (tickers.length === 0) {
          console.warn("No tickers found in earnings data.");
          setLoading(false);
          return;
        }

        // Fetch company logos based on tickers
        const logoResponse = await fetchCompanyLogos(tickers);
        console.log("Fetched Logo Response:", logoResponse);

        // Ensure logoResponse has expected structure
        if (logoResponse && Array.isArray(logoResponse.data)) {
          const logoMap: Record<string, string> = {};

          logoResponse.data.forEach((logo: CompanyLogo) => {
            if (logo.search_key && logo.files?.mark_vector_light) {
              logoMap[logo.search_key] = logo.files.mark_vector_light;
            }
          });

          setLogos(logoMap);
        } else {
          console.error("Unexpected logoResponse format:", logoResponse);
        }
      } catch (error) {
        console.error("Error fetching earnings/logos:", error);
      } finally {
        setLoading(false);
      }
    };

    getEarningsData();
  }, []);

  return { earnings, logos, loading };
};
