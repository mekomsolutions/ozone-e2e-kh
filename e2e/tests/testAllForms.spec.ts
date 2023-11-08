import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { delay } from '../utils/functions/testBase';

let homePage: HomePage;

test('All the forms should load on the patient chart page', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.initiateLogin();

  await expect(page).toHaveURL(/.*home/);
  await homePage.createPatient();

  // replay
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);

  // verify
  const ccScreeningForm = await page.locator('table tbody tr:nth-child(2) td:nth-child(1) a').textContent();
  await expect(ccScreeningForm?.includes('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();
  await expect(page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeVisible();

  const ncdScreeningForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(ncdScreeningForm?.includes('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeVisible();

  const consultationForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  const medicalHistoryForm = await page.locator('table tbody tr:nth-child(3) td:nth-child(1) a').textContent();
  await expect(medicalHistoryForm?.includes('ប្រវត្តជំងឺ')).toBeTruthy();
  await expect(page.getByText('ប្រវត្តជំងឺ')).toBeVisible();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
  await homePage.deletePatient();
});

test('Location picker should search locations by entering a numeric value, a Khmer value and an English value from the location code', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await page.goto(`${process.env.E2E_BASE_URL}`);

  // reply
  await homePage.goToLocation();

  // verify
  let location = await page.locator('form fieldset label');
  await page.locator('input[role="searchbox"]').type('100106');
  await delay(1000);
  await expect(page.getByText('100106')).toBeVisible();
  await expect(page.getByText('ពង្រ_HC')).toBeVisible();
  await expect(location).toHaveText('100106. ពង្រ_HC');
  await expect(page.getByText('100101')).not.toBeVisible();
  await expect(page.getByText('100102')).not.toBeVisible();
  await expect(page.getByText('100103')).not.toBeVisible();
  await expect(page.getByText('100105')).not.toBeVisible();
  await homePage.clearLocation();

  await page.locator('input[role="searchbox"]').type('មន្ទីរពេទ្យបង្អែកឆ្លូង_RH');
  await delay(1000);
  await expect(page.getByText('មន្ទីរពេទ្យបង្អែកឆ្លូង_RH')).toBeVisible();
  await expect(page.getByText('100101')).toBeVisible();
  await expect(location).toHaveText('100101. មន្ទីរពេទ្យបង្អែកឆ្លូង_RH');
  await expect(page.getByText('ចំបក់_HC')).not.toBeVisible();
  await expect(page.getByText('តាម៉ៅ_HC')).not.toBeVisible();
  await expect(page.getByText('ខ្សាច់អណ្តែត_HC ')).not.toBeVisible();
  await expect(page.getByText('ពង្រ_HC')).not.toBeVisible();
  await homePage.clearLocation();

  await page.locator('input[role="searchbox"]').type('Khsach Andet_HC');
  await delay(1000);
  await expect(page.getByText('ខ្សាច់អណ្តែត_HC')).toBeVisible();
  await expect(location).toHaveText('100105. ខ្សាច់អណ្តែត_HC');
  await expect(page.getByText('មន្ទីរពេទ្យបង្អែកឆ្លូង_RH ')).not.toBeVisible();
  await expect(page.getByText('ចំបក់_HC')).not.toBeVisible();
  await expect(page.getByText('តាម៉ៅ_HC')).not.toBeVisible();
  await expect(page.getByText('ពង្រ_HC')).not.toBeVisible();

  await location.click();
  await page.locator('button[type="submit"]').click();
  await delay(5000);
  await homePage.switchToEnglishLocale();
  await page.getByLabel('Users').click();
  await page.locator('button[aria-labelledby="Logout"]').click();
  await homePage.goToLocation();

  await page.locator('input[role="searchbox"]').type('100103');
  await delay(1000);
  await expect(page.getByText('100103')).toBeVisible();
  await expect(page.getByText('Ta Mao_HC')).toBeVisible();
  await expect(location).toHaveText('100103. Ta Mao_HC');
  await expect(page.getByText('100101')).not.toBeVisible();
  await expect(page.getByText('100102')).not.toBeVisible();
  await expect(page.getByText('100105')).not.toBeVisible();
  await expect(page.getByText('100106')).not.toBeVisible();
  await homePage.clearLocation();

  await page.locator('input[role="searchbox"]').type('Khsach Andet_HC');
  await delay(1000);
  await expect(page.getByText('Khsach Andet_HC')).toBeVisible();
  await expect(page.getByText('100105')).toBeVisible();
  await expect(location).toHaveText('100105. Khsach Andet_HC');
  await expect(page.getByText('Chhlong_RH')).not.toBeVisible();
  await expect(page.getByText('Chambak_HC')).not.toBeVisible();
  await expect(page.getByText('Ta Mao_HC ')).not.toBeVisible();
  await expect(page.getByText('Pongro_HC')).not.toBeVisible();
  await homePage.clearLocation();

  await page.locator('input[role="searchbox"]').type('ចំបក់_HC');
  await delay(1000);
  await expect(page.getByText('Chambak_HC')).toBeVisible();
  await expect(page.getByText('100102')).toBeVisible();
  await expect(location).toHaveText('100102. Chambak_HC');
  await expect(page.getByText('Chhlong_RH')).not.toBeVisible();
  await expect(page.getByText('Ta Mao_HC ')).not.toBeVisible();
  await expect(page.getByText('Khsach Andet_HC')).not.toBeVisible();
  await expect(page.getByText('Pongro_HC')).not.toBeVisible();
  await location.click();
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/.*home/);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
