import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { delay } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.initiateLogin();

  await expect(page).toHaveURL(/.*home/);
});

test('CC Screening form should load all the form sections', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // replay
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const ccScreeningForm = await page.locator('table tbody tr:nth-child(2) td:nth-child(1) a').textContent();
  await expect(ccScreeningForm?.includes('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();
  await expect(page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeVisible();

  // verify
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  const historyOfCervicalCancerScreeningSection = await page.locator('form button.tablinks.completed.active span').textContent();
  await expect(historyOfCervicalCancerScreeningSection?.includes('ប្រវត្តិនៃការពិនិត្យជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();

  const reproductiveHistorySection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(reproductiveHistorySection?.includes('ប្រវត្តិបន្តពូជ')).toBeTruthy();

  const menstrualHistorySection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(menstrualHistorySection?.includes('ប្រវត្តិនៃការមករដូវ')).toBeTruthy();

  const riskFactorsSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(riskFactorsSection?.includes('កត្តាហានិភ័យ')).toBeTruthy();

  const cancerSection = await page.locator('div.tab button:nth-child(5) span').textContent();
  await expect(cancerSection?.includes('ជំងឺមហារីក')).toBeTruthy();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test('CC Screening form should submit user input successfully', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  const ccScreeningForm = await page.locator('table tbody tr:nth-child(2) td:nth-child(1) a').textContent();
  await expect(ccScreeningForm?.includes('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeTruthy();
  await expect(page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន')).toBeVisible();

  // verify
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  await page.getByLabel('បាទ/ចាស').check();
  await page.getByLabel('តេស្តវីអាយអេ').check();
  await page.getByRole('radio', { name: 'វិជ្ជមាន', exact: true }).check();
  await page.getByLabel('បានព្យាបាល', { exact: true }).check();
  await page.locator('#typeOfTreatmentid').clear();
  await page.locator('#typeOfTreatmentid').fill('Injection');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ប្រវត្តិបន្តពូជ' }).click();
  await page.locator('#sexDebutid').click();
  await page.locator('#sexDebutid').fill('18');
  await page.locator('#previousPregnancyid_0').check();
  await page.locator('#numberOfPregnanciesid').clear();
  await page.locator('#numberOfPregnanciesid').fill('4');
  await page.locator('#numberOfDeliveriesid').clear();
  await page.locator('#numberOfDeliveriesid').fill('4');
  await page.locator('#numberOfMiscarriagesid').clear();
  await page.locator('#numberOfMiscarriagesid').fill('0');
  await page.locator('#currentPregancyid_0').check();
  await page.locator('#WOAid').clear();
  await page.locator('#WOAid').fill('6');
  await page.locator('#usingFPid_0').check();
  await page.getByLabel('កងដាក់់ដៃសម្រាប់ពន្យារកំណើត').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await page.getByRole('button', { name: 'ប្រវត្តិនៃការមករដូវ' }).click();
  await page.locator('#menarcheid').clear();
  await page.locator('#menarcheid').fill('12');
  await page.getByPlaceholder('mm/dd/yyyy').fill('11/10/2023');
  await page.getByLabel('មករដូវទៀងទាត់').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await page.getByRole('button', { name: 'កត្តាហានិភ័យ' }).click();
  await page.locator('#bleedingAfterSexid_0').check();
  await page.getByLabel('មិនដែលជក់បារីទេ').check();
  await page.locator('#corticosteroidUseid_0').check();
  await page.locator('#corticosteroidUseDurationid').clear();
  await page.locator('#corticosteroidUseDurationid').fill('3');
  await page.locator('[id="COCuseForMoreThan\\%yrsid_0"]').check();
  await page.locator('#numberOfSexPartnersid_1').check();
  await page.locator('#numberOfPartnerzSexPartnersid_0').check();
  await page.locator('#historyOfSTIsid_1').check();
  await page.locator('#HIVStatusid_0').check();
  await page.getByLabel('ប្រើថ្នាំប្រឆាំងមេរោគមិនបានទៀងទាត់').check();
  await page.locator('#familyHistoryOfCancerid_0').check();
  await page.locator('#typeOfCancerid span').first().click();
  await page.getByText('ជំងឺមហារីកថ្លើម').click();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.locator('div').filter({ hasText: /^ទម្រង់$/ }).getByRole('button').click();
  await delay(4000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await delay(3000);
  await page.getByText('ការពិនិត្យស្រាវជ្រាវរកជំងឺមហារីកមាត់ស្បូន').click();
  await page.getByRole('button', { name: 'ជំងឺមហារីក', exact: true }).click();
  await page.locator('#cervicalCancerEducid_1').check();
  await page.locator('#HPVTestResultid_0').check();
  await page.getByLabel('មើលឃើញដោយផ្នែក').check();
  await page.getByLabel('លទ្ធផលមិនច្បាស់').check();
  await page.locator('#VIATestResultsid_1').check();
  await page.locator('#appForRetestid_0').check();
  await page.locator('#appForRetestid_1').check();
  await page.locator('label').filter({ hasText: 'កាដ្រង់ទី៣' }).click();
  await page.getByLabel('ច្រើនជាង 75%').check();
  await page.locator('#colposcopyid_2').check();
  await page.getByLabel('មិនមែនជំងឺមហារីក').check();
  await page.getByText('ការយកសំណាកមាត់ស្បូនដើម្បីពិនិត្យ (រកជំងឺមហារីក)').click();
  await page.locator('#papSmearid_0').check();
  await page.getByLabel('ការខូចខាតកម្រិតខ្ពស់នៃស្រទាប់ជាលិកាក្នុងមាត់ស្បូន (កម្រិតទី២ និងទី៣)').check();
  await page.locator('#referralSiteid').selectOption('d583bf9f-1117-4dd6-8bd3-f3e337615bb6');
  await page.locator('label').filter({ hasText: 'ការធ្វើតេស្តបញ្ជាក់/ការព្យាបាល' }).click();
  await page.locator('label').filter({ hasText: 'ផ្សេងទៀត' }).first().click();
  await page.locator('label').filter({ hasText: 'ទម្រង់ការវះកាត់ដោយការជាសាច់ជុំវិញមាត់ស្បូន' }).click();
  await page.locator('label').filter({ hasText: 'ការព្យាបាលដោយប្រើកាំរស្មី' }).click();
  await page.locator('aside').filter({ hasText: 'Medicationsកំណត់សម្គាល់ទម្រង់បញ្ជីអ្នកជំងឺ' }).click();
  await page.locator('#followUpid_2').check();
  await page.getByLabel('ដុំំសាច់ដែលមិនមានចលនា').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test.afterEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.deletePatient();
  await page.close();
});
