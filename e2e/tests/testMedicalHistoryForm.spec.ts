import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { patientName } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) =>  {
    const homePage = new HomePage(page);
    await homePage.initiateLogin();

    await expect(page).toHaveURL(/.*home/);

    await homePage.createPatient();
    await homePage.startPatientVisit();
});

test('medical history form should  dispaly sections and submit form properly', async ({ page }) => {
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await page.waitForTimeout(3000)

  // check availability of Medical History form
  const medicalHistoryForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(medicalHistoryForm?.includes('ប្រវត្តជំងឺ')).toBeTruthy();
  await expect(page.getByText('ប្រវត្តជំងឺ')).toBeVisible();

  // display form sections
  await page.getByText('ប្រវត្តជំងឺ').click({ force: true });

  const generalSection = await page.locator('div.tab button:nth-child(1) span').textContent();
  await expect(generalSection?.includes('ទូទៅ')).toBeTruthy();

  const medicalHistorySection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(medicalHistorySection?.includes('ប្រវត្តិជំងឺ')).toBeTruthy();

  // submit the form properly
  await page.getByRole('button', { name: 'ប្រវត្តិជំងឺ' }).click();
  await page.locator('#diagnosedForDMid_1').check();
  await page.getByRole('radio', { name: 'មិនដឹង' }).check();
  await page.locator('#prematureHeartOrStrokeDiseaseid_1').check();
  await page.locator('#diabetesOrKidneyDiseaseid_1').check();
  await page.locator('#traditionmedicineUseid_0').check();
  await page.locator('#presenceOfAllergiesid_1').check();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await expect(page.getByText('The form has been submitted successfully.')).toBeVisible();
});

test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
