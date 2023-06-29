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

test('cc screening form should dispaly form sections and submit form properly', async ({ page }) => {
  const homePage = new HomePage(page);
  homePage.searchPatient(`${patientName.firstName + ' ' + patientName.givenName}`)
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await page.waitForTimeout(3000)

  // check availability of CC Screening form
  const cCScreeningForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(cCScreeningForm?.includes('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();
  await expect(page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeVisible();
  
  // display form sections
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click({ force: true });

  const reproductiveHistorySection = await page.locator('div.tab button:nth-child(1) span').textContent();
  await expect(reproductiveHistorySection?.includes('ប្រវត្តិបន្តពូជ')).toBeTruthy();

  const menstrualHistorySection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(menstrualHistorySection?.includes('ប្រវត្តិនៃការមករដូវ')).toBeTruthy();

  const riskFactorsSection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(riskFactorsSection?.includes('កត្តាហានិភ័យ')).toBeTruthy();

  const cervicalCancerSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(cervicalCancerSection?.includes('ជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();

  // submit form properly
  await page.locator('#sexDebutid').clear();
  await page.locator('#sexDebutid').type('20');
  await page.locator('#previousPregnancyid_1').check();
  await page.locator('#currentPregancyid_0').check();
  await page.locator('#WOAid').clear();
  await page.locator('#WOAid').type('5');
  await page.locator('#usingFPid_1').check();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await expect(page.getByText('The form has been submitted successfully.')).toBeVisible();
});

test.afterEach(async ( {page}) =>  {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
