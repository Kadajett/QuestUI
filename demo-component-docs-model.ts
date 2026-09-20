import { componentCatalog } from "./cli/catalog";

export const registryUrl = "https://questui.yougotserved.dev/r";

export type CatalogEntry = (typeof componentCatalog)[number];

export function displayName(name: string): string {
  if (name === "input-otp") return "Input OTP";
  return name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

export function primaryExport(name: string): string {
  if (name === "input-otp") return "InputOTP";
  return name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join("");
}
