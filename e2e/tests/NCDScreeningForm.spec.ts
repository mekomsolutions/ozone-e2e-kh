import { test, expect } from '@playwright/test';
import { OpenMRS } from '../utils/functions/openmrs';
import { delay } from '../utils/functions/openmrs';

let openmrs: OpenMRS;

test.beforeEach(async ({ page }) => {
  const openmrs = new OpenMRS(page);
  await openmrs.login();

  await expect(page).toHaveURL(/.*home/);
});

test('NCD Screening form should load all the form sections', async ({ page }) => {
  // setup
  const openmrs = new OpenMRS(page);
  await openmrs.createPatient();

  // replay
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  const ncdScreeningForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(ncdScreeningForm?.includes('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  const medicalHistorySection = await page.locator('form button.tablinks.completed.active span').textContent();
  await expect(medicalHistorySection?.includes('ប្រវត្តិជំងឺ')).toBeTruthy();

  const investigationsSection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(investigationsSection?.includes('ការពិនិត្យវិភាគ')).toBeTruthy();

  const lifeStyleSection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(lifeStyleSection?.includes('របៀបរស់នៅ')).toBeTruthy();

  const assessmentSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(assessmentSection?.includes('ការវាយតម្លៃ')).toBeTruthy();

  const diagnosisSection = await page.locator('div.tab button:nth-child(5) span').textContent();
  await expect(diagnosisSection?.includes('រោគវិនិច្ឆ័យ')).toBeTruthy();

  const managementSection = await page.locator('div.tab button:nth-child(6) span').textContent();
  await expect(managementSection?.includes('ការគ្រប់គ្រង')).toBeTruthy();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test('NCD screening form should submit user input successfully', async ({ page }) => {
  // setup
  const openmrs = new OpenMRS(page);
  await openmrs.createPatient();

  // reply
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  const ncdScreeningForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(ncdScreeningForm?.includes('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.locator('#screenedForDMid_0').check();
  await page.locator('#knownHypertensiveid_0').check();
  await page.locator('#knownHypertensivemedsUseid_1').check();
  await page.locator('#knownDiabeticid_0').check();
  await page.locator('#antidiabeticmedsUseid_0').check();
  await page.locator('#hxHeartDiseaseid_1').check();
  await page.locator('#hxDiabetesAndHeartDiseaseid_0').check();
  await page.locator('#hxHeartDiseaseid_1').check();
  await page.locator('#previousMedicalComplicationsid').getByRole('combobox').click();
  await page.getByText('ការខ្សោយតំរងនោមរ៉ាំរ៉ៃ').click();
  await page.locator('input[type="text"]').click();
  await page.getByText('ជំងឺខូចសាច់ដុំបេះដូងស្រួចស្រាល់').click();
  await page.locator('#otherHealthComplicationsid').clear();
  await page.locator('#otherHealthComplicationsid').fill('Pressure');
  await page.locator('#presenceOfAllergiesid_0').check();
  await page.locator('#allergiesDetailsid').clear();
  await page.locator('#allergiesDetailsid').fill('Skin allergen');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.locator('button.tablinks:nth-child(2) span').click();

  await page.locator('#Htid').clear();
  await page.locator('#Htid').fill('168');
  await page.locator('#Wtid').clear();
  await page.locator('#Wtid').fill('60');
  const  computedBMI =   await page.locator('#BMIid').inputValue();
  let bMIValue = Number(computedBMI);
  await expect(bMIValue).toBe(21.3);
  await page.locator('#systoleid').clear();
  await page.locator('#systoleid').fill('47');
  await page.locator('#diastoleid').clear();
  await page.locator('#diastoleid').fill('75');
  await page.locator('#pulseid').clear();
  await page.locator('#pulseid').fill('110');
  await page.locator('#tempid').clear();
  await page.locator('#tempid').fill('35.5');
  await page.locator('#FBSid').clear();
  await page.locator('#FBSid').fill('98');
  await page.locator('#RBSid').clear();
  await page.locator('#RBSid').fill('85');
  await page.locator('li').filter({ hasText: 'កម្រិតជាតិស្ករក្នុងឈាម រកកម្រិតជាតិស្ករក្នុងឈាមមុនពេលហូបអាហារ រកកម្រិតជាតិស្ករក្' }).getByRole('spinbutton').nth(2).clear();
  await page.locator('li').filter({ hasText: 'កម្រិតជាតិស្ករក្នុងឈាម រកកម្រិតជាតិស្ករក្នុងឈាមមុនពេលហូបអាហារ រកកម្រិតជាតិស្ករក្' }).getByRole('spinbutton').nth(2).fill('6.5');
  await page.locator('#OGTTid').clear();
  await page.locator('#OGTTid').fill('150');
  await page.locator('#albuminid').clear();
  await page.locator('#albuminid').fill('5.5');
  await page.locator('#ketonesid').selectOption('1365AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#totalCholesterolid').clear();
  await page.locator('#totalCholesterolid').fill('220');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'របៀបរស់នៅ' }).click();
  await page.getByLabel('កំពុងជក់បារី').check();
  await page.locator('#exerciseid_0').check();
  await page.locator('#drinkAlcoholid_1').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ការវាយតម្លៃ' }).click();
  await page.getByLabel('វេជ្ជបណ្ឌិត/គ្រូពេទ្យមធ្យម').check();
  await page.locator('#teleConsultationid_0').check();
  await page.locator('#footExamid_1').check();
  await page.locator('#TBsxid_1').check();
  await page.locator('#tbsid_0').check();
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#eyeExamid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#visualAcuityid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#eyelidsEyelashesid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#conjunctivaid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#corneaid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#pupilid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#lensid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#corneaid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#pupilid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('li').filter({ hasText: 'ការពិនិត្យភ្នែកខាងឆ្វេង ការពិនិត្យភ្នែក' }).locator('#lensid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'រោគវិនិច្ឆ័យ' }).click();
  await page.locator('#Diagnosis1id_1').check();
  await page.locator('#Diagnosis2id_3').check();
  await page.locator('#otherHealthConditionsid').getByRole('textbox').click();
  await page.getByText('ជំំងឺអេដស៍').click();
  await page.locator('#facilityid').getByRole('textbox').click();
  await page.getByText('ក្រចេះ > ឆ្លូង > 100102').click();

  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ការគ្រប់គ្រង' }).click();
  await page.getByLabel('ធ្វើការតាមដានរៀងរាល់៦ខែម្តង (ហានិភ័យ 20% ទៅ <30%)').check();
  await page.getByLabel('ហានិភ័យនៃជំងឺសរសៃឈាម-បេះដូង').check();
  await page.getByPlaceholder('mm/dd/yyyy').fill('11/18/2023');
  await page.locator('#recommendationsid div').first().click();
  await page.getByText('របបអាហារដែលមានសុខុមាលភាព').click();
  await page.locator('#recommendationsid').getByRole('textbox').click();
  await page.getByText('កាយវប្បកម្ម (សកម្មភាពរាងកាយ)').click();
  await page.getByLabel('ទេ').check();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
});

test('NCD screening form should compute CVD risk score correctly', async ({ page }) => {
  // setup
  const openmrs = new OpenMRS(page);
  await openmrs.createPatient();

  // replay
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);

  const ncdScreeningForm = await page.locator('table tbody tr:nth-child(4) td:nth-child(1) a').textContent();
  await expect(ncdScreeningForm?.includes('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង')).toBeVisible();
  await page.getByText('ពិនិត្យរកជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.locator('button.tablinks:nth-child(2) span').click();
  await openmrs.enterCVDRiskIndicatorsInNCDScreeningForm();

  // verify
  const  computedValue = await page.locator('input#CVDscoreid').inputValue();
  let cVDRiskScore = Number(computedValue);
  await expect(cVDRiskScore).toBe(9);
  await page.locator('button.tablinks:nth-child(6) span').click();
  await delay(1000);
  switch (true) {
    case cVDRiskScore < 20:
      await expect(await page.getByLabel('ធ្វើការតាមដានរៀងរាល់ឆ្នាំ (ហានិភ័យ <20%)')).toBeChecked();
      break;
    case cVDRiskScore >= 20 && cVDRiskScore < 30:
      await expect(await page.getByLabel('ធ្វើការតាមដានរៀងរាល់៦ខែម្តង (ហានិភ័យ 20% ទៅ <30%)')).toBeChecked();
      break;
    case cVDRiskScore >= 30:
      await expect(await page.getByLabel('្វើការតាមដានរៀងរាល់៣ខែម្តង (ហានិភ័យ >=30%)')).toBeChecked();
      break;
  }
});

test.afterEach(async ({ page }) => {
  const openmrs = new OpenMRS(page);
  await openmrs.voidPatient();
  await page.close();
});
