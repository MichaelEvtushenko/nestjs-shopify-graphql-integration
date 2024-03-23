const getOrThrowErrorIfNotExists = (variable: string): string => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`${variable} is missing in env`)
  }
  return value;
}

export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  shopify: {
    storeUrl: getOrThrowErrorIfNotExists('TEST_PLATFORM_SHOPIFY_STORE_URL'),
    apiKey: getOrThrowErrorIfNotExists('TEST_PLATFORM_SHOPIFY_API_KEY'),
    password: getOrThrowErrorIfNotExists('TEST_PLATFORM_SHOPIFY_PASSWORD'),
    apiVersion: getOrThrowErrorIfNotExists('TEST_PLATFORM_SHOPIFY_API_VERSION'),
  }
});