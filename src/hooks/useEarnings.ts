import { useState, useEffect } from "react";
import { fetchEarnings, fetchCompanyLogos } from "../services/api";

/**
 * Interface for earnings data.
 */
export interface EarningsData {
  ticker: string;
  date: string;
  time: string;  // Add time field for "Before Open" or "After Close"
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
 * Structure for grouping earnings by day.
 */
interface EarningsByDay {
  beforeOpen: EarningsData[];
  afterClose: EarningsData[];
}

/**
 * Custom hook to fetch earnings and corresponding company logos.
 */
export const useEarnings = () => {
  const [earningsByDay, setEarningsByDay] = useState<Record<string, EarningsByDay>>({});
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEarningsData = async () => {
      setLoading(true);
      try {
        // Fetch earnings data
        const earningsData: EarningsData[] = await fetchEarnings();

        // Group earnings by weekday
        const groupedEarnings: Record<string, EarningsByDay> = {
          Monday: { beforeOpen: [], afterClose: [] },
          Tuesday: { beforeOpen: [], afterClose: [] },
          Wednesday: { beforeOpen: [], afterClose: [] },
          Thursday: { beforeOpen: [], afterClose: [] },
          Friday: { beforeOpen: [], afterClose: [] },
        };

        earningsData.forEach((earning) => {
          const day = new Date(earning.date).toLocaleDateString("en-US", { weekday: "long" });
          if (groupedEarnings[day]) {
            if (earning.time.toLowerCase().includes("before market")) {
              groupedEarnings[day].beforeOpen.push(earning);
            } else {
              groupedEarnings[day].afterClose.push(earning);
            }
          }
        });

        setEarningsByDay(groupedEarnings);

        // Extract tickers from earnings data
        const tickers = earningsData.map((item) => item.ticker);
        if (tickers.length === 0) {
          console.warn("No tickers found in earnings data.");
          setLoading(false);
          return;
        }

        // Fetch company logos
        const logoResponse = await fetchCompanyLogos(tickers);
        if (logoResponse && Array.isArray(logoResponse.data)) {
          const logoMap: Record<string, string> = {};
          logoResponse.data.forEach((logo: CompanyLogo) => {
            if (logo.search_key && logo.files?.mark_vector_light) {
              logoMap[logo.search_key] = logo.files.mark_vector_light;
            }
          });
          setLogos(logoMap);
        }
      } catch (error) {
        console.error("Error fetching earnings/logos:", error);
      } finally {
        setLoading(false);
      }
    };

    getEarningsData();
  }, []);

  return { earningsByDay, logos, loading };
};
