import { test, expect } from '@playwright/test';
import { HomePage } from '../utils/functions/testBase';
import { delay } from '../utils/functions/testBase';

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.initiateLogin();

  await expect(page).toHaveURL(/.*home/);
});

test('NCD Consultation form should load all the form sections', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  const consultationForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  const medicalAssessmentSection = await page.locator('form button.tablinks.completed.active span').textContent();
  await expect(medicalAssessmentSection?.includes('ការវាយតម្លៃវេជ្ជសាស្រ្ត')).toBeTruthy();

  const lifeStyleSection = await page.locator('div.tab button:nth-child(2) span').textContent();
  await expect(lifeStyleSection?.includes('របៀបរស់នៅ')).toBeTruthy();

  const physicalExaminationSection = await page.locator('div.tab button:nth-child(3) span').textContent();
  await expect(physicalExaminationSection?.includes('ការ​ពិនិត្យ​រាងកាយ')).toBeTruthy();

  const diagnosisSection = await page.locator('div.tab button:nth-child(4) span').textContent();
  await expect(diagnosisSection?.includes('រោគវិនិច្ឆ័យ')).toBeTruthy();

  const treatmentPlanSection = await page.locator('div.tab button:nth-child(5) span').textContent();
  await expect(treatmentPlanSection?.includes('ផែនការព្យាបាល')).toBeTruthy();

  const referralSection = await page.locator('div.tab button:nth-child(6) span').textContent();
  await expect(referralSection?.includes('បញ្ជូន')).toBeTruthy();
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
  await homePage.deletePatient();
});

test('NCD Consultation form should submit user input successfully', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // reply
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  const consultationForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();

  // verify
  await page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByLabel('បាទ').check();
  await page.locator('#TBSymptomsid span').first().click();
  await page.getByText('បែកញើស').click();
  await page.locator('#Htid').clear();
  await page.locator('#Htid').fill('165');
  await page.locator('#Wtid').clear();
  await page.locator('#Wtid').fill('78');
  const  computedBMI =   await page.locator('#BMIid').inputValue();
  let bMIValue = Number(computedBMI);
  await expect(bMIValue).toBe(28.7);
  await page.locator('#systoleid').clear();
  await page.locator('#systoleid').fill('25');
  await page.locator('#diastoleid').clear();
  await page.locator('#diastoleid').fill('35');
  await page.locator('#pulseid').clear();
  await page.locator('#pulseid').fill('18');
  await page.locator('#FBSid').clear();
  await page.locator('#FBSid').fill('15');
  await page.locator('#RBSid').clear();
  await page.locator('#RBSid').fill('42');
  await page.locator('li').filter({ hasText: 'កម្រិតជាតិស្ករក្នុងឈាម រកកម្រិតជាតិស្ករក្នុងឈាមមុនពេលហូបអាហារ រកកម្រិតជាតិស្ករក្' }).getByRole('spinbutton').nth(2).clear();
  await page.locator('li').filter({ hasText: 'កម្រិតជាតិស្ករក្នុងឈាម រកកម្រិតជាតិស្ករក្នុងឈាមមុនពេលហូបអាហារ រកកម្រិតជាតិស្ករក្' }).getByRole('spinbutton').nth(2).fill('14');
  await page.locator('#albuminid').clear();
  await page.locator('#albuminid').fill('12');
  await page.locator('#ketonesid').selectOption('1365AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#lowDenseLipoProteinid').clear();
  await page.locator('#lowDenseLipoProteinid').fill('8');
  await page.locator('#highDenseLipoProteinid').clear();
  await page.locator('#highDenseLipoProteinid').fill('36');
  await page.locator('#triglycerideid').clear();
  await page.locator('#triglycerideid').fill('16');
  await page.locator('#totalCholesterolid').clear();
  await page.locator('#totalCholesterolid').fill('25');
  await page.locator('#creatinineid').clear();
  await page.locator('#creatinineid').fill('19');
  await page.locator('#creatinineClearanceid').clear();
  await page.locator('#creatinineClearanceid').fill('17');
  await page.locator('#proteinuriaid').clear();
  await page.locator('#proteinuriaid').fill('26');
  await page.locator('#potassiumid').clear();
  await page.locator('#potassiumid').fill('11');
  await page.locator('#aceInhibitorid').clear();
  await page.locator('#aceInhibitorid').fill('13');
  await page.locator('#sodiumid').clear();
  await page.locator('#sodiumid').fill('18');
  await page.locator('#ALTid').clear();
  await page.locator('#ALTid').fill('5');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.locator('button.tablinks:nth-child(2) span').click();
  await page.getByLabel('អតីតអ្នកជក់បារី ឬ ធ្លាប់ជក់បារី').check();
  await page.locator('#quitSmokingid').clear();
  await page.locator('#quitSmokingid').fill('2014');
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
  await page.getByLabel('forms').getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ការ​ពិនិត្យ​រាងកាយ' }).click();
  await page.locator('#leftFootExamid span').first().click();
  await page.getByText('ការវះកាត់យកជើងខាងលើជង្គង់ចេញ').click();
  await page.locator('#leftFootExamid').getByRole('textbox').click();
  await page.getByRole('option', { name: 'កាត់ជើង' }).click();
  await page.locator('#rightFootExamid').getByRole('textbox').click();
  await page.getByRole('option', { name: 'ការវះកាត់យកជើងខាងលើជង្គង់ចេញ' }).click();
  await page.locator('#rightFootExamid').getByRole('textbox').click();
  await page.getByLabel('Options list').getByText('រោគសញ្ញាជំងឺសរសៃប្រសាទឈឺ',{ exact: true }).click();
  await page.locator('#leftEyeExamid').getByRole('textbox').click();
  await page.getByText('ម៉ាគុលឡា អឺដែម៉ា').click();
  await page.locator('#rightEyeExamid').getByRole('textbox').click();
  await page.getByText('ខ្សោយភ្នែក').click();
  await page.locator('#rightEyeExamid').getByRole('textbox').click();
  await page.getByLabel('Options list').getByText('ម៉ាគុលឡា អឺដែម៉ា').click();
  await page.locator('#rightEyeExamid').getByRole('textbox').click();
  await page.getByRole('option', { name: 'ព្រិលភ្នែក' }).click();
  await page.locator('#uroGenExamid div').first().click();
  await page.getByText('មីក្រូអាល់ប៊ុយមីននុយរី').click();
  await page.locator('#ENTExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#respiratoryExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#gastroIntestinalExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#skinExtremitiesExamid').selectOption('1116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#CNSExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#mentalStateExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#abdominalExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#othersExamid').selectOption('1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'រោគវិនិច្ឆ័យ' }).click();
  await page.locator('#Diagnosis1id_3').check();
  await page.locator('#Diagnosis2id_2').check();
  await page.locator('#otherHealthConditionsid span').first().click();
  await page.getByRole('option', { name: 'ជំំងឺអេដស៍' }).click();
  await page.locator('#currentMedicalComplicationsid div').first().click();
  await page.getByText('ជំងឺតំរងនោម').click();
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ផែនការព្យាបាល' }).click();
  await page.getByLabel('ថ្នាំលេបបញ្ចុះជាតិស្ករ', { exact: true }).check();
  await page.getByLabel('ទេ').check();
  await page.locator('#recommendationsid div').first().click();
  await page.getByText('របបអាហារដែលមានសុខុមាលភាព').click();
  await page.locator('#recommendationsid').getByRole('textbox').click();
  await page.getByText('ការប្រើប្រាស់គ្រឿងស្រវឹង').click();
  await page.getByPlaceholder('mm/dd/yyyy').fill('10/12/2023');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await delay(2000);

  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);
  await page.getByLabel('forms').getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'បញ្ជូន', exact: true }).click();
  await page.locator('input[type="text"]').click();
  await page.getByText('ក្រចេះ > ឆ្លូង > 100102').click();
  await page.locator('#reasonForReferralid').clear();
  await page.locator('#reasonForReferralid').fill('Scanning the skull');
  await page.getByRole('button', { name: 'រក្សាទុក និងបិទ' }).click();
  await expect(page.getByText('Tទម្រង់ទិន្នន័យបានបញ្ជូនដោយជោគជ័យ')).toBeVisible();
  if (await page.getByLabel('close notification').first().isVisible()) {
    await page.getByTitle('close notification').first().click();
  }
  await page.getByRole('button', { name: 'បិទ', exact: true }).click();
  await homePage.deletePatient();
});

test('NCD Consultation form should compute CVD risk score correctly', async ({ page }) => {
  // setup
  const homePage = new HomePage(page);
  await homePage.createPatient();

  // replay
  await page.getByLabel('ទម្រង់វេជ្ជសាស្ត្រ').click();
  await delay(4000);

  const consultationForm = await page.locator('table tbody tr:nth-child(1) td:nth-child(1) a').textContent();
  await expect(consultationForm?.includes('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeTruthy();
  await expect(page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង')).toBeVisible();
  await page.getByText('ការពិគ្រោះយោបល់ជំងឺមិនឆ្លង').click();
  await delay(3000);
  await page.getByRole('button', { name: 'ការវាយតម្លៃវេជ្ជសាស្រ្ត' }).click();
  await homePage.enterCVDRiskIndicatorsInNCDConsultationForm();

  // verify
  const  computedValue = await page.locator('input#CVDscoreid').inputValue();
  let cVDRiskScore = Number(computedValue);
  await expect(cVDRiskScore).toBe(10);
  await homePage.deletePatient();
});

test.afterEach(async ({ page }) => {
  await page.close();
});
