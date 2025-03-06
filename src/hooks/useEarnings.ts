import { useState, useEffect } from "react";
import { fetchEarnings, fetchCompanyLogos } from "../services/api";

/**
 * Interface for earnings data.
 */
export interface EarningsData {
  ticker: string;
  date: string;
  time: string;
  epsActual?: number;
  epsEstimate?: number;
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
        // ✅ Fetch earnings data
        const earningsData: EarningsData[] = await fetchEarnings();

        if (!earningsData.length) {
          console.warn("⚠️ No earnings data available for this week.");
          setLoading(false);
          return;
        }

        // ✅ Extract unique tickers (fix for TypeScript Set iteration issue)
        const tickers = Array.from(new Set(earningsData.map((item) => item.ticker)));

        // ✅ Fetch company logos in batches
        const logoResponse = await fetchCompanyLogos(tickers);
        setLogos(logoResponse);

        // ✅ Group earnings by weekday
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
            if (earning.time.toLowerCase().includes("before")) {
              groupedEarnings[day].beforeOpen.push(earning);
            } else {
              groupedEarnings[day].afterClose.push(earning);
            }
          }
        });

        setEarningsByDay(groupedEarnings);
      } catch (error) {
        console.error("❌ Error fetching earnings/logos:", error);
      } finally {
        setLoading(false);
      }
    };

    getEarningsData();
  }, []);

  return { earningsByDay, logos, loading };
};