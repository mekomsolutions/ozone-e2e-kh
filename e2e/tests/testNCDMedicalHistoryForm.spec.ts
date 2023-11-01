import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { delay } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.initiateLogin();

  await expect(page).toHaveURL(/.*home/);
});

test('NCD Medical history form should load all form sections', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const medicalHistoryForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(medicalHistoryForm?.includes('ប្រវត្តជំងឺ')).toBeTruthy();
  await expect(page.getByText('ប្រវត្តជំងឺ')).toBeVisible();

  // verify
  await page.getByText('ប្រវត្តជំងឺ').click();
  await delay(3000);
  const medicalHistorySection = await page.locator('div button.tablinks.completed.active span').textContent();
  await expect(medicalHistorySection?.includes('ប្រវត្តិជំងឺ')).toBeTruthy();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test('NCD Medical history form should submit user input successfully', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const medicalHistoryForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(medicalHistoryForm?.includes('ប្រវត្តជំងឺ')).toBeTruthy();
  await expect(page.getByText('ប្រវត្តជំងឺ')).toBeVisible();

  // verify
  await page.getByText('ប្រវត្តជំងឺ').click();
  await delay(3000);
  await page.locator('#screenedForDMid_0').check();
  await page.locator('#diagnosedForDMid_1').check();
  await page.locator('#HighBloodPressureSxid_1').check();
  await page.locator('#prematureHeartOrStrokeDiseaseid_0').check();
  await page.locator('#diabetesOrKidneyDiseaseid_0').check();
  await page.locator('#traditionmedicineUseid_1').check();
  await page.locator('#presenceOfAllergiesid_1').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test.afterEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
