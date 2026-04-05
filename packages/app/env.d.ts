/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_ZERODEV_PROJECT_ID: string;
  readonly VITE_ZERODEV_BUNDLER_URL: string;
  readonly VITE_ZERODEV_PAYMASTER_URL: string;
  readonly VITE_ZERODEV_PASSKEY_SERVER_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_COFHE_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
