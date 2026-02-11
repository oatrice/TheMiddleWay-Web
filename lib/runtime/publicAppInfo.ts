import type { AppEnvironment, AppUrls, BuildInfo } from "./appInfo.types";

const DEFAULT_DEV_URL = "http://localhost:3000";

const readValue = (...values: Array<string | undefined>) =>
  values.find((value) => value && value.trim().length > 0)?.trim();

const ensureUrl = (value?: string, defaultProtocol = "https://") => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${defaultProtocol}${value}`;
};

const getEnvironment = (): AppEnvironment => {
  const raw = readValue(process.env.NEXT_PUBLIC_VERCEL_ENV);
  if (raw === "production" || raw === "preview" || raw === "development") return raw;
  return process.env.NODE_ENV === "production" ? "production" : "development";
};

export const getPublicBuildInfo = (): BuildInfo => {
  const env = getEnvironment();
  const version = readValue(process.env.NEXT_PUBLIC_APP_VERSION);
  const tag = readValue(process.env.NEXT_PUBLIC_APP_GIT_TAG);
  const commitRef = readValue(process.env.NEXT_PUBLIC_GIT_COMMIT_REF);
  const commitSha = readValue(process.env.NEXT_PUBLIC_GIT_COMMIT_SHA);

  return {
    env,
    version,
    tag,
    commitSha,
    commitRef,
  };
};

export const getPublicAppUrls = (): AppUrls => {
  const env = getEnvironment();
  const dev = ensureUrl(
    readValue(
      process.env.NEXT_PUBLIC_APP_URL_DEV,
      process.env.NEXT_PUBLIC_DEV_URL
    ),
    "http://"
  ) ?? DEFAULT_DEV_URL;
  const prod = ensureUrl(readValue(process.env.NEXT_PUBLIC_APP_URL_PROD));
  const preview = ensureUrl(readValue(process.env.NEXT_PUBLIC_APP_URL_PREVIEW));
  const commit = ensureUrl(
    readValue(
      process.env.NEXT_PUBLIC_APP_URL_COMMIT,
      process.env.NEXT_PUBLIC_VERCEL_URL
    )
  );
  const version = ensureUrl(readValue(process.env.NEXT_PUBLIC_APP_URL_VERSION));
  const tag = ensureUrl(readValue(process.env.NEXT_PUBLIC_APP_URL_TAG));

  const current = env === "production"
    ? prod ?? commit ?? dev
    : env === "preview"
      ? commit ?? preview ?? dev
      : dev;

  return {
    current,
    prod,
    preview,
    dev,
    commit,
    version,
    tag,
  };
};
