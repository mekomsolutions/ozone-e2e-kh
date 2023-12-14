import * as dotenv from 'dotenv';
import {
  APIRequestContext,
  Page,
  PlaywrightWorkerArgs,
  WorkerFixture,
  request,
  test as base
}
  from '@playwright/test';

dotenv.config();

export const E2E_BASE_URL = `${process.env.E2E_TEST_ENVIRONMENT}` == 'uat' ? `${process.env.E2E_BASE_URL_UAT}` : `${process.env.E2E_BASE_URL_DEV}`;

async function globalSetup() {
  const requestContext = await request.newContext();
  const token = Buffer.from(`${process.env.E2E_USER_ADMIN_USERNAME}:${process.env.E2E_USER_ADMIN_PASSWORD}`).toString(
    'base64',
  );
  await requestContext.post(`${E2E_BASE_URL}/ws/rest/v1/session`, {
    data: {
      sessionLocation: process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID,
      locale: 'en',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  await requestContext.storageState({ path: 'tests/storageState.json' });
  await requestContext.dispose();
}

export const api: WorkerFixture<APIRequestContext, PlaywrightWorkerArgs> = async ({ playwright }, use) => {
  const ctx = await playwright.request.newContext({
    baseURL: `${E2E_BASE_URL}/ws/rest/v1/`,
    httpCredentials: {
      username: process.env.E2E_USER_ADMIN_USERNAME ?? "",
      password: process.env.E2E_USER_ADMIN_PASSWORD ?? "",
    },
  });

  await use(ctx);
};

export interface CustomTestFixtures {
  loginAsAdmin: Page;
}

export interface CustomWorkerFixtures {
  api: APIRequestContext;
}

export const test = base.extend<CustomTestFixtures, CustomWorkerFixtures>({
  api: [api, { scope: 'worker' }],
});

export default globalSetup;
