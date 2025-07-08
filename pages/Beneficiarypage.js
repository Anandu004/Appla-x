const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');


exports.Beneficiarypage =
  class Beneficiarypage {

    constructor(page) {
      this.page = page

      this.eurowallet = "//span[normalize-space()='Euro']"

      this.aud_wallet = "//span[normalize-space()='AUD']"

      this.manage_beneficiaries = "//a[normalize-space()='Manage Beneficiaries']"

      this.add_beneficiary_button = "//a[@id='company_contacts_drawer_button']"

      this.beneficiary_type = "//select[@id='contact_type']"

      this.company_name = "//input[@id='company_name']"

      this.beneficiary_firstname = "//input[@id='pep_first_name']"

      this.beneficiary_lastname = "//input[@id='pep_last_name']"

      this.addressline_1 = "//input[@name='address_1']"

      this.city = "//input[@name='city']"

      this.state = "//input[@name='state']"

      this.beneficiary_country = "//select[@id='bop_country']"

      this.postcode = "//input[@name='postcode']"

      this.email = "//input[@id='beneficiaryContactEmail']"

      this.phone = "//input[@id='phone1']"

      this.beneficiary_submit = "//button[@id='beneficiarysubmitButton']"

      this.add_bank_account_details = "//button[normalize-space()='Add Bank Account Details']"

      this.beneficiary_currency = "//select[@id='currency']"

      this.add_bank_account_country = "//select[@id='bank_account_country']"

      this.payment_methods = "//select[@id='payment_methods']"

      this.fetch_bank_details = "//a[normalize-space()='Fetch Bank Details']"

      this.iban_no = "//input[@id='test']"

      this.account_number = "//input[@placeholder='Acct number']"

      this.bic_swift = "//input[@placeholder='Bic swift']"

      this.bank_name = "//input[@placeholder='Bank Name']"

      this.bank_address_1 = "//input[@placeholder='Bank Address 1']"

      this.bank_city = "//input[@placeholder='Bank City']"

      this.bank_region = "//input[@placeholder='Bank Region']"

      this.bank_postal = "//input[@placeholder='Bank Postal']"

      this.save_changes_button = "//button[@id='addbeneficiary']"

      this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

      this.dashboard = "//span[normalize-space()='Dashboard']"

      this.beneficiary_list = "(//div[@class='card-body'])[1]"



    }

    async verifyBeneficiaryCreationforEuro() {

      await this.page.click(this.eurowallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(2000)
      await this.page.locator(this.beneficiary_type).selectOption('Company')

      const euro_beneficiary_company_name = faker.company.name();
      await this.page.fill(this.company_name, euro_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json');
      let data = {};
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }

      data.euro_beneficiary_company_name = euro_beneficiary_company_name;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));


      await this.page.fill(this.addressline_1, '116 Invalidenstraße')
      await this.page.fill(this.city, 'Berlin')
      await this.page.fill(this.state, 'Berlin')
      await this.page.locator(this.beneficiary_country).selectOption('Germany')
      await this.page.fill(this.postcode, '10115')

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, '22673456')
      await this.page.waitForTimeout(4000)

      await this.page.click(this.beneficiary_submit)

      await this.page.waitForSelector(this.add_bank_account_details)


    }


    async verifyAddingBankAccountdetails() {

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption('eur | Euro')
      await this.page.locator(this.add_bank_account_country).selectOption('Germany')

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption('sepa')

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.iban_no)
      await this.page.fill(this.iban_no, 'DE44TCCL16350677847092')
      await this.page.fill(this.bank_name, 'Commerzbank')
      await this.page.fill(this.bank_address_1, '114 Friedrichstraße')
      await this.page.fill(this.bank_city, 'Berlin')
      await this.page.fill(this.bank_region, 'Berlin')
      await this.page.fill(this.bank_postal, '10117')
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it)
      await this.page.click(this.ok_got_it)

    }

    async verifyBeneficiaryCreationforAud() {

      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(2000)
      await this.page.locator(this.beneficiary_type).selectOption('Company')

      const aud_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, aud_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {};
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }

      data.aud_beneficiary_company_name = aud_beneficiary_company_name;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      await this.page.fill(this.addressline_1, '1 Marienplatz')
      await this.page.fill(this.city, 'München')
      await this.page.fill(this.state, 'Bayern')
      await this.page.locator(this.beneficiary_country).selectOption('Germany')
      await this.page.fill(this.postcode, '80331')

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, '22673456')
      await this.page.waitForTimeout(4000)

      await this.page.click(this.beneficiary_submit)

      await this.page.waitForSelector(this.add_bank_account_details)


      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption('aud | AUD')
      await this.page.locator(this.add_bank_account_country).selectOption('Germany')

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption('swift')

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)
      await this.page.fill(this.account_number, '22354000')
      await this.page.fill(this.bic_swift, '451545')

      await this.page.fill(this.bank_name, 'Commerzbank')
      await this.page.fill(this.bank_address_1, '114 Friedrichstraße')
      await this.page.fill(this.bank_city, 'Berlin')
      await this.page.fill(this.bank_region, 'Berlin')
      await this.page.fill(this.bank_postal, '10117')
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it)
      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(2000)
      await this.page.click(this.dashboard)
      await this.page.click(this.aud_wallet)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForSelector(this.beneficiary_list)
      const beneficiary_list = await this.page.locator(this.beneficiary_list).all()

      let found = false
      for (const entry of beneficiary_list) {

        const text = await entry.textContent();
        if (text.includes(aud_beneficiary_company_name)) {
          found = true;
          console.log(` Beneficiary "${aud_beneficiary_company_name}" is listed.`)
          break;
        }

      }
      if (!found) {
        console.error(` Beneficiary "${aud_beneficiary_company_name}" not found in the list.`)
        throw new Error("Beneficiary not listed after creation.")
      }


    }


  }