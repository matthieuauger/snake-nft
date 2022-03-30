declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_TOKEN_URI: string;
      TOTAL_SUPPLY: number;
      STAGING_API_URL: string
      STAGING_PRIVATE_KEY: string
      STAGING_PUBLIC_KEY: string
      STAGING_ETHERSCAN_KEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}