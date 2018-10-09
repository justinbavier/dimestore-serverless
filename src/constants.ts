export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const DYNAMO_ACCESS_KEY_ID = process.env.DIME_AWS_ACCESS_KEY;
export const DYNAMO_SECRET_ACCESS_KEY = process.env.DIME_AWS_SECRET_KEY;
export const STRIPE_SECRET = process.env.DIME_STRIPE_SECRET;
export const PLAID_CLIENT_ID = process.env.DIME_PLAID_CLIENT_ID;
export const PLAID_SECRET = process.env.DIME_PLAID_SECRET;
export const PLAID_PUBLIC_KEY = process.env.DIME_PLAID_PUBLIC_KEY;
export const STRIPE_ENV = process.env.STRIPE_ENV || 'develop';