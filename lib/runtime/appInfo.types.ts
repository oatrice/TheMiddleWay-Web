export type AppEnvironment = "production" | "preview" | "development";

export type AppUrls = {
  current: string;
  prod?: string;
  preview?: string;
  dev: string;
  commit?: string;
  version?: string;
  tag?: string;
};

export type BuildInfo = {
  env: AppEnvironment;
  version?: string;
  tag?: string;
  commitSha?: string;
  commitRef?: string;
};
