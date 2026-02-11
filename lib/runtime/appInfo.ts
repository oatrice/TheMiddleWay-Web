import "server-only";

import packageJson from "../../package.json";
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
  const raw = readValue(process.env.VERCEL_ENV, process.env.NEXT_PUBLIC_VERCEL_ENV);
  if (raw === "production" || raw === "preview" || raw === "development") return raw;
  return process.env.NODE_ENV === "production" ? "production" : "development";
};

const isLikelyTag = (ref?: string) => {
  if (!ref) return false;
  return /^v?\d+\.\d+\.\d+/.test(ref);
};

export const getBuildInfo = (): BuildInfo => {
  const env = getEnvironment();
  const version = readValue(process.env.APP_VERSION, process.env.NEXT_PUBLIC_APP_VERSION) ??
    packageJson.version;
  const commitRef = readValue(
    process.env.VERCEL_GIT_COMMIT_REF,
    process.env.NEXT_PUBLIC_GIT_COMMIT_REF,
    process.env.GIT_COMMIT_REF
  );
  const commitSha = readValue(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.NEXT_PUBLIC_GIT_COMMIT_SHA,
    process.env.GIT_COMMIT_SHA
  );
  const tag = readValue(process.env.APP_GIT_TAG, process.env.NEXT_PUBLIC_APP_GIT_TAG) ??
    (isLikelyTag(commitRef) ? commitRef : undefined);

  return {
    env,
    version,
    tag,
    commitSha,
    commitRef,
  };
};

export const getAppUrls = (): AppUrls => {
  const env = getEnvironment();
  const buildInfo = getBuildInfo();
  const dev = ensureUrl(
    readValue(
      process.env.APP_URL_DEV,
      process.env.NEXT_PUBLIC_APP_URL_DEV,
      process.env.DEV_URL,
      process.env.NEXT_PUBLIC_DEV_URL
    ),
    "http://"
  ) ?? DEFAULT_DEV_URL;
  const prod = ensureUrl(
    readValue(
      process.env.APP_URL_PROD,
      process.env.NEXT_PUBLIC_APP_URL_PROD,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
    )
  );
  const preview = ensureUrl(
    readValue(
      process.env.APP_URL_PREVIEW,
      process.env.NEXT_PUBLIC_APP_URL_PREVIEW,
      process.env.VERCEL_BRANCH_URL
    )
  );
  const commit = ensureUrl(
    readValue(
      process.env.APP_URL_COMMIT,
      process.env.NEXT_PUBLIC_APP_URL_COMMIT,
      process.env.VERCEL_URL,
      process.env.NEXT_PUBLIC_VERCEL_URL
    )
  );
  const version = ensureUrl(
    readValue(
      process.env.APP_URL_VERSION,
      process.env.NEXT_PUBLIC_APP_URL_VERSION
    )
  ) ?? (buildInfo.version ? prod ?? commit : undefined);
  const tag = ensureUrl(
    readValue(
      process.env.APP_URL_TAG,
      process.env.NEXT_PUBLIC_APP_URL_TAG
    )
  ) ?? (buildInfo.tag ? commit ?? preview : undefined);

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

export const getMetadataBase = () => {
  const current = getAppUrls().current;
  return current ? new URL(current) : undefined;
};
