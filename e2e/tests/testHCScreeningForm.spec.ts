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

test('hc screening form should dispaly form sections and submit form properly', async ({ page }) => {
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await page.waitForTimeout(3000);

  // check availability of HC Screening form
  const hCScreeningForm = await page.locator('table tbody tr:nth-child(2) td:nth-child(1) a').textContent();
  await expect(hCScreeningForm?.includes('ពិនិត្យស្វែងរកជំងឺមិនឆ្លងនៅមណ្ឌលសុខភាព')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យស្វែងរកជំងឺមិនឆ្លងនៅមណ្ឌលសុខភាព')).toBeVisible();

  // display form sections
  await page.getByText('ពិនិត្យស្វែងរកជំងឺមិនឆ្លងនៅមណ្ឌលសុខភាព').click({ force: true });

  const medicalHistorySection = await page.locator('div.tab button:nth-child(1) span').textContent();
  await expect(medicalHistorySection?.includes('ប្រវត្តិជំងឺ')).toBeTruthy();

  const investigationsSection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(investigationsSection?.includes('ការពិនិត្យវិភាគ')).toBeTruthy();

  const assessmentSection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(assessmentSection?.includes('របៀបរស់នៅ')).toBeTruthy();

  const lifeStyleSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(lifeStyleSection?.includes('ការវាយតម្លៃ')).toBeTruthy();

  const managementSection = await page.locator('div.tab button:nth-child(5) span').textContent();
  await expect(managementSection?.includes('ការគ្រប់គ្រង')).toBeTruthy();

  // submit the form properly
  await page.getByRole('button', { name: 'របៀបរស់នៅ' }).click();
  await page.getByLabel('មិនដែលជក់បារីទេ').check();
  await page.locator('#exerciseid_0').check();
  await page.locator('#drinkAlcoholid_1').check();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await expect(page.getByText('The form has been submitted successfully.')).toBeVisible();
});

test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
