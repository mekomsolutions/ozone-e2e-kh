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

test('All the forms should load on the patient chart', async ({ page }) => {
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await page.waitForTimeout(1000);

  // check availability of CC Screening form
  const cCScreeningForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(cCScreeningForm?.includes('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();
  await expect(page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeVisible();

  // check availability of HC Screening form
  const hCScreeningForm = await page.locator('table tbody tr:nth-child(2) td:nth-child(1) a').textContent();
  await expect(hCScreeningForm?.includes('ពិនិត្យស្វែងរកជំងឺមិនឆ្លងនៅមណ្ឌលសុខភាព')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យស្វែងរកជំងឺមិនឆ្លងនៅមណ្ឌលសុខភាព')).toBeVisible();

  // check availability of NCD Consultation form
  const consultationForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  // check availability of Medical History form
  const medicalHistoryForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(medicalHistoryForm?.includes('ប្រវត្តជំងឺ')).toBeTruthy();
  await expect(page.getByText('ប្រវត្តជំងឺ')).toBeVisible();
});

test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});