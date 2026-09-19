import { portfolio } from "@/data/portfolio";

export function getPortfolio() {
  return structuredClone(portfolio);
}
