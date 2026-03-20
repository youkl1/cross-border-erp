/// <reference types="vite/client" />

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly NODE_ENV: Environment
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
