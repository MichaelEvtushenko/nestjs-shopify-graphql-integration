export const PlatformOperationsErrorCode = {
  UNSUPPORTED_PLATFORM: {
    httpStatus: 400,
    code: 'UNSUPPORTED_PLATFORM',
  },
  PLATFORM_BAD_REQUEST: {
    httpStatus: 400,
    code: 'PLATFORM_BAD_REQUEST',
  },
  ORDERS_LIST_NOT_FOUND: {
    httpStatus: 404,
    code: 'ORDERS_LIST_NOT_FOUND',
  },
  ORDER_NOT_FOUND: {
    httpStatus: 404,
    code: 'ORDER_NOT_FOUND',
  },
} as const;

export class PlatformOperationsError extends Error {
  constructor(
    readonly message: string,
    readonly code: typeof PlatformOperationsErrorCode[keyof typeof PlatformOperationsErrorCode]
  ) {
    super(message);
    this.name = 'PlatformOperationsError';
  }
}