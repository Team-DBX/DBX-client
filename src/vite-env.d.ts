interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_S3_ACCESS_KEY_ID: string;
  readonly VITE_S3_SECRET_ACCESS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
