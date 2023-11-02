import { Page, expect } from '@playwright/test';

export var patientName = {
  firstName : '',
  givenName : ''
}

var patientFullName = '';

export const delay = (mills) => {
  let datetime1 = new Date().getTime();
  let datetime2 = datetime1 + mills;
  while(datetime1 < datetime2) {
     datetime1 = new Date().getTime();
    }
}

export class HomePage {
  constructor(readonly page: Page) {}

  readonly patientSearchIcon = () => this.page.locator('[data-testid="searchPatientIcon"]');
  readonly patientSearchBar = () => this.page.locator('[data-testid="patientSearchBar"]');
  readonly floatingSearchResultsContainer = () => this.page.locator('[data-testid="floatingSearchResultsContainer"]');

  async initiateLogin() {
    await this.page.goto(`${process.env.E2E_BASE_URL}`);
    await this.page.locator('#username').fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await this.page.locator('button[type="submit"]').click();
    await this.page.locator('#password').fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await this.page.locator('button[type="submit"]').click();
    await this.page.locator('input[role="searchbox"]').click();
    await this.page.locator('input[role="searchbox"]').fill('100102');
    await this.page.locator('span').first().click();
    await this.page.locator('button[type="submit"]').click();
    await delay(5000);
    await this.page.getByLabel('Users').click();
    await this.page.locator('#selectLocale').selectOption('km');
    await delay(5000);
    await expect(this.page.getByRole('button', { name: 'ស្វែងរកអ្នកជំងឺ' })).toBeEnabled();
    await expect(this.page.getByRole('button', { name: 'Implementer Tools' })).toBeEnabled();
    await expect(this.page.getByRole('button', { name: 'Add Patient' })).toBeEnabled();
    await expect(this.page.getByRole('button', { name: 'Users' })).toBeEnabled();
    await expect(this.page.getByRole('button', { name: 'App Menu' })).toBeEnabled();
  }

  async createPatient() {
    patientName = {
      firstName : `e2eTest${Math.floor(Math.random() * 1000)}`,
      givenName : `${(Math.random() + 1).toString(36).substring(2)}`
    }
    patientFullName = patientName.firstName + ' ' + patientName.givenName;

    await this.page.getByRole('button', { name: 'Add Patient' }).click();
    await expect(this.page.getByRole('button', { name: 'ចុះឈ្មោះអ្នកជំងឺ' })).toBeEnabled();
    if (await this.page.getByTitle('close notification').first().isVisible()) {
      await this.page.getByTitle('close notification').first().click();
    }
    await this.page.getByLabel('នាមត្រកូល').clear();
    await this.page.getByLabel('នាមត្រកូល').fill(`${patientName.givenName}`);
    await this.page.getByLabel('នាមខ្លួន').clear();
    await this.page.getByLabel('នាមខ្លួន').fill(`${patientName.firstName}`);
    await this.page.locator('label').filter({ hasText: 'ប្រុស' }).locator('span').first().click();
    await this.page.getByRole('combobox', { name: 'តើអ្នកគិតថាអ្នកជាអ្វីដែរ?' }).selectOption('83c0a1ad-9605-4369-a725-b0049c103554');
    await this.page.getByPlaceholder('dd/mm/YYYY').fill('14/01/1959');
    await this.page.getByRole('button', { name: 'ចុះឈ្មោះអ្នកជំងឺ' }).click();
    await expect(this.page.getByText('បង្កើតការចុះឈ្មោះអ្នកជំងឺថ្')).toBeVisible();
    await expect(this.page.getByText('កត់ត្រាសញ្ញាជីវិត')).toBeVisible();
    await expect(this.page.getByText('បង្ហាញលម្អិត')).toBeVisible();
    await expect(this.page.getByText('ជ្រើសរើសមុខងារ')).toBeVisible();
    await delay(4000);
    await this.page.getByRole('button', { name: 'ចាប់ផ្តើមការពិនិត្' }).click();
    await this.page.locator('label').filter({ hasText: 'មកពិនិត្យតាមដានជំងឺមិនឆ្លង' }).locator('span').first().click();
    await this.page.locator('section').filter({ hasText: 'ប្រភេទធានារ៉ាប់រងសូមជ្រើសរើសជម្រើសណាមួយបង់ពេញថ្លៃបង់បញ្ចុះថ្លៃលើកលែងថ្លៃមូលនិធិស' }).getByRole('combobox').first().selectOption('3c2d3d22-afc1-48cf-a46f-0267182aa5e7');
    await this.page.locator('section').filter({ hasText: 'ប្រភេទធានារ៉ាប់រងសូមជ្រើសរើសជម្រើសណាមួយបង់ពេញថ្លៃបង់បញ្ចុះថ្លៃលើកលែងថ្លៃមូលនិធិស' }).getByRole('combobox').nth(1).selectOption('9f3d41d0-1bcb-49bc-8022-f9c0295aa996');
    await this.page.locator('div').filter({ hasText: /^សូមជ្រើសរើសជម្រើសណាមួយតំបន់ កតំំបន់ ខតំបន់់ គ$/ }).getByRole('combobox').selectOption('3b592418-9f6a-4526-83c4-1b0e243938fe');
    await this.page.locator('div').filter({ hasText: /^សូមជ្រើសរើសជម្រើសណាមួយបាទ\/ចាសទេ$/ }).getByRole('combobox').selectOption('1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await this.page.getByRole('button', { name: 'ចាប់ផ្តើមការមកពិនិត្យជំងឺ' }).click();
    await expect(this.page.getByText('ការមកពិនិត្យជំងឺសកម្')).toBeEnabled();
    await delay(4000);
  }

  async searchPatient(searchText: string) {
    await this.page.getByTestId('searchPatientIcon').click();
    await this.page.getByTestId('patientSearchBar').type(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('link', { name: `${patientFullName}`}).first().click();
  }

  async startPatientVisit() {
    await this.page.getByTestId('searchPatientIcon').click();
    await this.page.getByTestId('patientSearchBar').fill(`${patientName.firstName + ' ' + patientName.givenName}`);
    await this.page.getByRole('link', { name: `${patientName.firstName + ' ' + patientName.givenName}` }).click();
    await this.page.getByRole('button', { name: 'ចាប់ផ្តើមការពិនិត្' }).click();
    await this.page.locator('label').filter({ hasText: 'មកពិនិត្យតាមដានជំងឺមិនឆ្លង' }).locator('span').first().click();
    await this.page.locator('section').filter({ hasText: 'ប្រភេទធានារ៉ាប់រងសូមជ្រើសរើសជម្រើសណាមួយបង់ពេញថ្លៃបង់បញ្ចុះថ្លៃលើកលែងថ្លៃមូលនិធិស' }).getByRole('combobox').first().selectOption('3c2d3d22-afc1-48cf-a46f-0267182aa5e7');
    await this.page.locator('section').filter({ hasText: 'ប្រភេទធានារ៉ាប់រងសូមជ្រើសរើសជម្រើសណាមួយបង់ពេញថ្លៃបង់បញ្ចុះថ្លៃលើកលែងថ្លៃមូលនិធិស' }).getByRole('combobox').nth(1).selectOption('9f3d41d0-1bcb-49bc-8022-f9c0295aa996');
    await this.page.locator('div').filter({ hasText: /^សូមជ្រើសរើសជម្រើសណាមួយតំបន់ កតំំបន់ ខតំបន់់ គ$/ }).getByRole('combobox').selectOption('3b592418-9f6a-4526-83c4-1b0e243938fe');
    await this.page.locator('div').filter({ hasText: /^សូមជ្រើសរើសជម្រើសណាមួយបាទ\/ចាសទេ$/ }).getByRole('combobox').selectOption('1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await this.page.getByRole('button', { name: 'ចាប់ផ្តើមការមកពិនិត្យជំងឺ' }).click();
    await this.page.getByRole('button', { name: 'បិទ' }).click();
  }

  async endPatientVisit() {
    await this.searchPatient(`${patientFullName}`)
    await this.page.getByRole('button', { name: 'Actions', exact: true }).click();
    await this.page.getByRole('menuitem', { name: 'End visit' }).click();
    await this.page.getByRole('button', { name: 'danger End Visit' }).click();
    await expect(this.page.getByText('Visit ended')).toBeVisible();
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async deletePatient(){
    await this.page.goto(`${process.env.E2E_BASE_URL}/openmrs/admin/patients/index.htm`);
    await this.page.getByPlaceholder(' ').type(`${patientFullName}`);
    await this.page.locator('#openmrsSearchTable tbody tr.odd td:nth-child(1)').click();
    await this.page.locator('input[name="voidReason"]').fill('Delete patient created by smoke tests');
    await this.page.getByRole('button', { name: 'Delete Patient', exact: true }).click();

    const message = await this.page.locator('//*[@id="patientFormVoided"]').textContent();
    expect(message?.includes('This patient has been deleted')).toBeTruthy();
    await this.page.getByRole('link', { name: 'Log out' }).click();
  }

  async enterCVDRiskIndicatorsInNCDScreeningForm() {
    await this.page.locator('#Htid').clear();
    await this.page.locator('#Htid').type('164');
    await this.page.locator('#Wtid').clear();
    await this.page.locator('#Wtid').type('75');
    await this.page.locator('#systoleid').clear();
    await this.page.locator('#systoleid').type('14');
    await this.page.getByRole('button', { name: 'របៀបរស់នៅ' }).click();
    await this.page.getByLabel('អតីតអ្នកជក់បារី ឬ ធ្លាប់ជក់បារី').check();
    await this.page.locator('#quitSmokingid').fill('2018');
    await this.page.getByRole('button', { name: 'រោគវិនិច្ឆ័យ' }).click();
    delay(5000);
  }

  async enterCVDRiskIndicatorsInNCDConsultationForm() {
    await this.page.locator('#Htid').clear();
    await this.page.locator('#Htid').type('160');
    await this.page.locator('#Wtid').clear();
    await this.page.locator('#Wtid').type('88');
    await this.page.locator('#systoleid').clear();
    await this.page.locator('#systoleid').type('25');
    await this.page.getByRole('button', { name: 'របៀបរស់នៅ' }).click();
    await this.page.getByLabel('អតីតអ្នកជក់បារី ឬ ធ្លាប់ជក់បារី').check();
    await this.page.locator('#quitSmokingid').fill('2002');
    await this.page.getByRole('button', { name: 'រោគវិនិច្ឆ័យ' }).click();
    delay(5000);
  }

  async goToLocation() {
    await this.page.locator('#username').fill(`${process.env.E2E_USER_ADMIN_USERNAME}`);
    await this.page.locator('button[type="submit"]').click();
    await this.page.locator('#password').fill(`${process.env.E2E_USER_ADMIN_PASSWORD}`);
    await this.page.locator('button[type="submit"]').click();
  }

  async clearLocation() {
    await this.page.locator('input[role="searchbox"]').clear();
    await delay(2000);
  }

  async switchToEnglishLocale() {
    await this.page.getByLabel('Users').click();
    await this.page.locator('#selectLocale').selectOption('en');
    await delay(5000);
    await expect(this.page.getByRole('button', { name: 'Search Patient' })).toBeEnabled();
  }
}
