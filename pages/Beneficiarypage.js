const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');
const { error } = require('console');
const fs = require('fs');
const path = require('path');


exports.Beneficiarypage =
  class Beneficiarypage {

    constructor(page) {
      this.page = page

      this.wallet_list = "//div[@class='owl-stage']//div[@class='item']"

      this.eurowallet = "//span[normalize-space()='Euro']"

      this.aud_wallet = "//span[normalize-space()='AUD']"

      this.usd_wallet = "//span[normalize-space()='USD']"

      this.gbp_wallet = "//span[normalize-space()='GBP']"

      this.chf_wallet = "//span[normalize-space()='CHF']"

      this.hkd_wallet = "//span[normalize-space()='HKD']"

      this.sgd_wallet = "//span[normalize-space()='SGD']"

      this.jpy_wallet = "//span[normalize-space()='JPY']"

      this.nzd_wallet = "//span[normalize-space()='NZD']"

      this.cad_wallet = "//span[normalize-space()='CAD']"

      this.make_payment = "//a[normalize-space()='Make Payment']"

      this.beneficiary_name = "//select[@id='beneficiary']"

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

      this.edit_beneficiary_country = "//select[@id='bop_countryedit']"

      this.postcode = "//input[@name='postcode']"

      this.email = "//input[@id='beneficiaryContactEmail']"

      this.phone = "//input[@id='phone1']"

      this.beneficiary_submit = "//button[@id='beneficiarysubmitButton']"

      this.close_button = "//div[@id='company_contacts_drawer_close']"

      this.beneficiary_emptyField_errors = "//label[contains(text(), 'required')]"

      this.add_bank_account_details = "//button[normalize-space()='Add Bank Account Details']"

      this.beneficiary_currency = "//select[@id='currency']"

      this.add_bank_account_country = "//select[@id='bank_account_country']"

      this.payment_methods = "//select[@id='payment_methods']"

      this.ok_got_it_button = "//button[@class='swal2-confirm btn btn-danger']"

      this.add_currencybeneficiary_validation = "//div[@id='swal2-html-container']"

      this.fetch_bank_details = "//a[normalize-space()='Fetch Bank Details']"

      this.iban_no = "//input[@id='test']"

      this.account_number = "//input[@placeholder='Acct number']"

      this.routing_code = "//input[@placeholder='Routing code']"

      this.bic_swift = "//input[@placeholder='Bic swift']"

      this.sort_code = "//input[@placeholder = 'Sort code']"

      this.bsb_number = "//input[@placeholder = 'BSB number']"

      this.hk_clearing_code = "//input[@placeholder='HK clearing code']"

      this.bank_name = "//input[@placeholder='Bank Name']"

      this.bank_address_1 = "//input[@placeholder='Bank Address 1']"

      this.bank_city = "//input[@placeholder='Bank City']"

      this.bank_region = "//input[@placeholder='Bank Region']"

      this.bank_postal = "//input[@placeholder='Bank Postal']"

      this.save_changes_button = "//button[@id='addbeneficiary']"

      this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

      this.dashboard = "//span[normalize-space()='Dashboard']"

      this.beneficiary_search = "//input[@class= 'search-input  form-control form-control-flush ps-10']"

      this.beneficiary_list = "(//div[@class='card-body'])[1]"

      this.beneficiaries = "//div[@class='fs-6 text-gray-800 text-hover-primary fw-bold']"

      this.modify_beneficiary = "//h3[normalize-space()='Modify Beneficiary']"

      this.back_button = "//i[@class='p-4 fa-thin fa-chevron-left fs-2']"

      this.beneficiary_list_header = "//h3[normalize-space()='List of beneficiaries']"

      this.beneficiary_delete ="//a[@class='confirm-delete btn btn-light-danger btn-active-danger mt-5']"

      this.delete_yes_proceed = "//button[text()='Yes proceed']"

      this.Beneficiary_update_changes = "//button[@id ='updateBeneficiaryChange']"


     //Load Test data
      const dataPath = path.join(__dirname, '../TestData/Beneficiary_testdata.json');
      this.data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      this.data1 = this.data["Euro beneficiary"]
      this.data2 = this.data["AUD beneficiary"]
      this.data3 = this.data["USD beneficiary"]
      this.data4 = this.data["GBP beneficiary"]
      this.data5 = this.data["CHF beneficiary"]
      this.data6 = this.data["HKD beneficiary"]
      this.data7 = this.data["SGD beneficiary"]
      this.data8 = this.data["JPY beneficiary"]
      this.data9 = this.data["NZD beneficiary"]
      this.data10 = this.data["CAD beneficiary"]
    

    }




    async verifyBeneficiaryCreationforEuro() {

      await this.page.click(this.eurowallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      //await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(2000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data1.Beneficiary_type)

      const euro_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, euro_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json');
      let data = {};
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.euro_beneficiary_company_name = euro_beneficiary_company_name

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))


      await this.page.fill(this.addressline_1, this.data1.Address)
      await this.page.fill(this.city, this.data1.City)
      await this.page.fill(this.state, this.data1.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data1.Beneficiary_country)
      await this.page.fill(this.postcode, this.data1.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data1.Phone)
      await this.page.waitForTimeout(4000)

      await this.page.click(this.beneficiary_submit)

      await this.page.waitForSelector(this.add_bank_account_details)

    }


    async verifyAddingBankAccountdetails() {

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data1.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data1.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data1.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.iban_no)
      await this.page.fill(this.iban_no, this.data1.Iban_no)
      await this.page.fill(this.bank_name, this.data1.Bank_name)
      await this.page.fill(this.bank_address_1, this.data1.Bank_address)
      await this.page.fill(this.bank_city, this.data1.Bank_city)
      await this.page.fill(this.bank_region, this.data1.Bank_region)
      await this.page.fill(this.bank_postal, this.data1.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it)
      await this.page.click(this.ok_got_it)

      await this.page.waitForTimeout(4000)
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      await this.page.click(this.eurowallet)
      await this.page.click(this.make_payment)

      const filePath = path.join(__dirname, '../beneficiary_company.json');
      const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(euro_beneficiary_company_name);
      console.log(` Beneficiary "${euro_beneficiary_company_name}" is listed in dropdown.`);


    }

    async verifyBeneficiaryCreationforAud() {

      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data2.Beneficiary_type)

      const aud_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, aud_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {};
      if (fs.existsSync(filePath)) {

        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

      }

      data.aud_beneficiary_company_name = aud_beneficiary_company_name;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

      await this.page.fill(this.addressline_1, this.data2.Address)
      await this.page.fill(this.city, this.data2.City)
      await this.page.fill(this.state, this.data2.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data2.Beneficiary_country)
      await this.page.fill(this.postcode, this.data2.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data2.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data2.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data2.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data2.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      const accountNumber = faker.string.numeric(10);
      await this.page.fill(this.account_number, accountNumber)

      await this.page.fill(this.bsb_number, this.data2.Bsb_number)
      await this.page.fill(this.bic_swift, this.data2.Bic_swift)
      await this.page.waitForTimeout(3000)

      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data2.Bank_name)
      await this.page.fill(this.bank_address_1, this.data2.Bank_address)
      await this.page.fill(this.bank_city, this.data2.Bank_city)
      await this.page.fill(this.bank_region, this.data2.Bank_region)
      await this.page.fill(this.bank_postal, this.data2.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })

      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)  
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 });
      await this.page.click(this.dashboard, { force: true });
      //await this.page.waitForTimeout(4000)
      await this.page.waitForSelector(this.aud_wallet, { state: 'visible', timeout: 10000 });
      await this.page.click(this.aud_wallet)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(4000)
      await this.page.waitForSelector(this.beneficiary_list)
      const beneficiary_list = await this.page.locator(this.beneficiary_list).all()

      let found = false
      for (const entry of beneficiary_list) {

        const text = await entry.textContent()
        if (text.includes(aud_beneficiary_company_name)) {
          found = true
          console.log(` Beneficiary "${aud_beneficiary_company_name}" is listed.`)
          break

        }

      }

      if (!found) {
        console.error(` Beneficiary "${aud_beneficiary_company_name}" not found in the list.`)
        throw new Error("Beneficiary not listed after creation.")
      }


    }


    async verifyBeneficiaryCreationforUsd() {

      await this.page.click(this.usd_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data3.Beneficiary_type)

      const usd_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, usd_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json');
      let data = {};
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.usd_beneficiary_company_name = usd_beneficiary_company_name

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      await this.page.fill(this.company_name, usd_beneficiary_company_name)
  
      await this.page.fill(this.addressline_1, this.data3.Address)
      await this.page.fill(this.city, this.data3.City)
      await this.page.fill(this.state, this.data3.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data3.Beneficiary_country)
      await this.page.fill(this.postcode, this.data3.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data3.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data3.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data3.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data3.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      const accountNumber = faker.string.numeric(10)
      await this.page.fill(this.account_number, accountNumber)
      await this.page.fill(this.routing_code,this.data3.Routing_code)
      await this.page.fill(this.bic_swift, this.data3.Bic_swift)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data3.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data3.Bank_address)
      await this.page.fill(this.bank_city, this.data3.Bank_city)
      await this.page.fill(this.bank_region, this.data3.Bank_region)
      await this.page.fill(this.bank_postal, this.data3.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard);
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.usd_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(usd_beneficiary_company_name);
      console.log(`✅ Beneficiary "${usd_beneficiary_company_name}" is listed in dropdown.`);

    }


    
    async verifyBeneficiaryCreationforGbp() {

      await this.page.click(this.gbp_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data4.Beneficiary_type)

      const gbp_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, gbp_beneficiary_company_name)
  
      await this.page.fill(this.addressline_1, this.data4.Address)
      await this.page.fill(this.city, this.data4.City)
      await this.page.fill(this.state, this.data4.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data4.Beneficiary_country)
      await this.page.fill(this.postcode, this.data4.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)
      await this.page.fill(this.phone, this.data4.Phone)
      await this.page.waitForTimeout(4000)

      await this.page.click(this.beneficiary_submit)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data4.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data4.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data4.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForTimeout(2000)
      await this.page.fill(this.iban_no, '34568900')
      await this.page.fill(this.sort_code,'123456')
      await this.page.fill(this.bic_swift, this.data4.Bic_swift)
      //await this.page.waitForTimeout(3000)

      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_name, this.data4.Bank_name)
      await this.page.fill(this.bank_address_1, this.data4.Bank_address)
      await this.page.fill(this.bank_city, this.data4.Bank_city)
      await this.page.fill(this.bank_region, this.data4.Bank_region)
      await this.page.fill(this.bank_postal, this.data4.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })

      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard);
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.gbp_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(gbp_beneficiary_company_name);
      console.log(`Beneficiary "${gbp_beneficiary_company_name}" is listed in dropdown.`);

    }




    async verifyBeneficiaryCreationfor_CHF() {

      await this.page.click(this.chf_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data5.Beneficiary_type)

      const chf_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, chf_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.chf_beneficiary_company_name = chf_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data5.Address)
      await this.page.fill(this.city, this.data5.City)
      await this.page.fill(this.state, this.data5.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data5.Beneficiary_country)
      await this.page.fill(this.postcode, this.data5.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data5.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data5.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data5.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data5.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.iban_no)

      await this.page.fill(this.iban_no,this.data5.Iban_no)
      await this.page.fill(this.bic_swift, this.data5.Bic_swift)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data5.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data5.Bank_address)
      await this.page.fill(this.bank_city, this.data5.Bank_city)
      await this.page.fill(this.bank_region, this.data5.Bank_region)
      await this.page.fill(this.bank_postal, this.data5.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.chf_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(chf_beneficiary_company_name);
      console.log(`✅ Beneficiary "${chf_beneficiary_company_name}" is listed in dropdown.`);

    }



    
    async verifyBeneficiaryCreationfor_HKD() {

      await this.page.click(this.hkd_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data6.Beneficiary_type)

      const hkd_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, hkd_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.hkd_beneficiary_company_name = hkd_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data6.Address)
      await this.page.fill(this.city, this.data6.City)
      await this.page.fill(this.state, this.data6.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data6.Beneficiary_country)
      //await this.page.fill(this.postcode, this.data6.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data6.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data6.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data6.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data5.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      await this.page.fill(this.account_number,this.data6.Accnt_no)
      await this.page.fill(this.bic_swift, this.data6.Bic_swift)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data6.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data6.Bank_address)
      await this.page.fill(this.bank_city, this.data6.Bank_city)
      await this.page.fill(this.bank_region, this.data6.Bank_region)
      //await this.page.fill(this.bank_postal, this.data6.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.hkd_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(hkd_beneficiary_company_name);
      console.log(`✅ Beneficiary "${hkd_beneficiary_company_name}" is listed in dropdown.`);

    }




      async verifyBeneficiaryCreationfor_SGD() {

      await this.page.click(this.sgd_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data7.Beneficiary_type)

      const sgd_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, sgd_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.sgd_beneficiary_company_name = sgd_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data7.Address)
      await this.page.fill(this.city, this.data7.City)
      await this.page.fill(this.state, this.data7.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data7.Beneficiary_country)
      await this.page.fill(this.postcode, this.data7.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data7.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data7.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data7.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      //await this.page.locator(this.payment_methods).selectOption(this.data7.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      await this.page.fill(this.account_number,this.data7.Accnt_no)
      await this.page.fill(this.bic_swift, this.data7.Bic_swift)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data6.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data7.Bank_address)
      await this.page.fill(this.bank_city, this.data7.Bank_city)
      await this.page.fill(this.bank_region, this.data7.Bank_region)
      await this.page.fill(this.bank_postal, this.data7.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.sgd_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(sgd_beneficiary_company_name);
      console.log(`✅ Beneficiary "${sgd_beneficiary_company_name}" is listed in dropdown.`);

    }




     async verifyBeneficiaryCreationfor_JPY() {

      await this.page.click(this.jpy_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data7.Beneficiary_type)

      const jpy_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, jpy_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.jpy_beneficiary_company_name = jpy_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data8.Address)
      await this.page.fill(this.city, this.data8.City)
      await this.page.fill(this.state, this.data8.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data8.Beneficiary_country)
      await this.page.fill(this.postcode, this.data8.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data8.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data8.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data8.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      await this.page.locator(this.payment_methods).selectOption(this.data8.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)
      

      await this.page.fill(this.account_number,this.data8.Accnt_no)
      await this.page.fill(this.bic_swift, this.data8.Bic_swift)
      await this.page.click("//input[@placeholder='Branch name']")
      await this.page.waitForTimeout(3000)
      await this.page.fill("//input[@placeholder='Branch name']","Manila branch")
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data8.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data8.Bank_address)
      await this.page.fill(this.bank_city, this.data8.Bank_city)
      await this.page.fill(this.bank_region, this.data8.Bank_region)
      await this.page.fill(this.bank_postal, this.data8.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.jpy_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(jpy_beneficiary_company_name);
      console.log(`✅ Beneficiary "${jpy_beneficiary_company_name}" is listed in dropdown.`);

    }


    async verifyBeneficiaryCreationfor_NZD() {

      await this.page.click(this.nzd_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data9.Beneficiary_type)

      const nzd_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, nzd_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.nzd_beneficiary_company_name = nzd_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data9.Address)
      await this.page.fill(this.city, this.data9.City)
      await this.page.fill(this.state, this.data9.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data9.Beneficiary_country)
      await this.page.fill(this.postcode, this.data9.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data9.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data9.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data9.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      //await this.page.locator(this.payment_methods).selectOption(this.data7.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      await this.page.fill(this.account_number,this.data9.Accnt_no)
      await this.page.fill(this.bsb_number, this.data9.Bsb_number)
      await this.page.fill(this.bic_swift, this.data9.Bic_swift)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data9.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data9.Bank_address)
      await this.page.fill(this.bank_city, this.data9.Bank_city)
      await this.page.fill(this.bank_region, this.data9.Bank_region)
      await this.page.fill(this.bank_postal, this.data9.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.nzd_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(nzd_beneficiary_company_name);
      console.log(`✅ Beneficiary "${nzd_beneficiary_company_name}" is listed in dropdown.`);

    }



    async verifyBeneficiaryCreationfor_CAD() {

      await this.page.click(this.cad_wallet)

      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForTimeout(2000)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(3000)
      await this.page.locator(this.beneficiary_type).selectOption(this.data10.Beneficiary_type)

      const cad_beneficiary_company_name = faker.company.name()
      await this.page.fill(this.company_name, cad_beneficiary_company_name)
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      let data = {}
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      data.cad_beneficiary_company_name = cad_beneficiary_company_name
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    
  
      await this.page.fill(this.addressline_1, this.data10.Address)
      await this.page.fill(this.city, this.data10.City)
      await this.page.fill(this.state, this.data10.State)
      await this.page.locator(this.beneficiary_country).selectOption(this.data10.Beneficiary_country)
      await this.page.fill(this.postcode, this.data10.Postcode)

      const email = faker.internet.email()
      await this.page.fill(this.email, email)

      await this.page.fill(this.phone, this.data10.Phone)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.beneficiary_submit)
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.add_bank_account_details)

      await this.page.click(this.add_bank_account_details)
      await this.page.locator(this.beneficiary_currency).selectOption(this.data10.Beneficiary_currency)
      await this.page.locator(this.add_bank_account_country).selectOption(this.data10.Bank_account_country)

      const paymentMethodDropdown = this.page.locator(this.payment_methods)
      await expect(paymentMethodDropdown).toBeEnabled()
      //await this.page.locator(this.payment_methods).selectOption(this.data7.Payment_method)

      await this.page.click(this.fetch_bank_details)
      await this.page.waitForSelector(this.account_number)

      await this.page.fill(this.account_number,this.data10.Accnt_no)
      await this.page.fill(this.routing_code, this.data10.Routing_code)
      //await this.page.waitForTimeout(3000)
      await this.page.click(this.bank_name)
      await this.page.waitForTimeout(3000)

      await this.page.fill(this.bank_name, this.data10.Bank_name)
      //await this.page.waitForTimeout(3000)
      await this.page.fill(this.bank_address_1, this.data10.Bank_address)
      await this.page.fill(this.bank_city, this.data10.Bank_city)
      await this.page.fill(this.bank_region, this.data10.Bank_region)
      await this.page.fill(this.bank_postal, this.data10.Bank_postal)
      await this.page.click(this.save_changes_button)
      await this.page.waitForSelector(this.ok_got_it, { state: 'visible' })



      await this.page.click(this.ok_got_it)
      await this.page.waitForTimeout(4000)
      
      await this.page.waitForSelector(this.dashboard, { state: 'visible', timeout: 10000 })
      await this.page.click(this.dashboard)
      await this.page.waitForSelector(this.wallet_list)
      //await this.page.waitForTimeout(4000)
      await this.page.click(this.cad_wallet)
      await this.page.waitForTimeout(4000)
      await this.page.click(this.make_payment)


      await this.page.waitForTimeout(3000)
      const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
      const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
      const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
      console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

      expect(cleanedDropdownOptions).toContain(cad_beneficiary_company_name);
      console.log(`✅ Beneficiary "${cad_beneficiary_company_name}" is listed in dropdown.`);

    }





    async verifyBeneficiaryCreationforAud_Search() {
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const savedCompany = data.aud_beneficiary_company_name
      console.log(savedCompany)
      await this.page.fill(this.beneficiary_search, savedCompany)
      await this.page.keyboard.press('Enter')
      await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(this.beneficiary_list)

      const firstResult = this.page.locator(this.beneficiary_list).first()

      // Assert the result contains the saved company name
      await expect(firstResult).toContainText(savedCompany)

      console.log(`Verified that searched result contains: "${savedCompany}"`)

    }


    async verifyBeneficiaryCreationforAud_Edit() {
      const filePath = path.join(__dirname, '../beneficiary_company.json')
      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const savedCompany = data.aud_beneficiary_company_name
      await this.page.fill(this.beneficiary_search, savedCompany);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector(this.beneficiary_list);

      const firstResult = this.page.locator(this.beneficiary_list).first();
      await firstResult.click();
      await this.page.waitForTimeout(2000);
      await this.page.fill(this.addressline_1, '')
      await this.page.fill(this.addressline_1, "1 Saint Martin's Le Grand");
      await this.page.fill(this.city, 'Greater London');
      await this.page.fill(this.state, 'England');
      await this.page.locator(this.edit_beneficiary_country).selectOption('United Kingdom');
      await this.page.fill(this.postcode, 'EC1A 1BB');
      await this.page.click(this.Beneficiary_update_changes);

    }


    async verifyBeneficiaryCreationforAud_BeneficiaryDelete() {
      const filePath = path.join(__dirname, '../beneficiary_company.json');
      await this.page.click(this.aud_wallet);
      await this.page.waitForSelector(this.manage_beneficiaries);
      await this.page.click(this.manage_beneficiaries);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const savedCompany = data.aud_beneficiary_company_name
      await this.page.fill(this.beneficiary_search, savedCompany);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector(this.beneficiary_list);

      const firstResult = this.page.locator(this.beneficiary_list).first();
      await firstResult.click();
      await this.page.click(this.beneficiary_delete)
      await this.page.click(this.delete_yes_proceed)
      await this.page.waitForTimeout(6000);

    }


    async verifyWalletDetailpage() {
      await this.page.click(this.aud_wallet);
      await expect(this.page.locator('//a[@id="showBalance"]')).toBeVisible();
      const balanceLocator = this.page.locator("//a[starts-with(normalize-space(), 'Wallet Balance:')]");
      await expect(balanceLocator).toBeVisible();
      const ibanLocator = this.page.locator("//a[starts-with(normalize-space(), 'IBAN:')]");
      await expect(ibanLocator).toBeVisible();

    }



    async check_Beneficiary_list_isVisible() {

      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await expect(this.page.locator(this.beneficiary_list_header)).toBeVisible()

      const isListVisible = await this.page.locator(this.beneficiary_list).isVisible().catch(() => false)

      if (isListVisible) {
        console.log(" Beneficiary list is visible.")
      } else {
        console.warn(" Beneficiary list is not visible — possibly no beneficiaries added yet for this company.")
      }

    }

    async check_ValidationFor_beneficiary_creation() {

      await this.page.click(this.aud_wallet)
      await this.page.waitForSelector(this.manage_beneficiaries)
      await this.page.click(this.manage_beneficiaries)
      await this.page.waitForSelector(this.add_beneficiary_button)
      await this.page.click(this.add_beneficiary_button)
      await this.page.waitForTimeout(2000)
      await this.page.click(this.beneficiary_submit)

      const validations = await this.page.locator(this.beneficiary_emptyField_errors).allTextContents()

      let specificFound = false
      let generic_errorCount = 0
      let phoneValidationFound = false

      for (const msg of validations) {
        if (msg.includes("Company name is required")) {
          specificFound = true
        }
        if (msg === "This field is required") {
          genericCount++
        }
        if (line === "Please enter a valid phone number") {
          phoneValidationFound = true
        }

      }

      // Assertions
      expect(specificFound).toBe(true)
      expect(generic_errorCount).toBe(7)
      expect(phoneValidationFound).toBe(true)

    }



    async check_beneficiaryPage_loads() {

      await this.page.waitForTimeout(3000)
      const walletCount = await this.page.locator(this.wallet_list).count()
      const limit = Math.min(walletCount, 1)
      for (let i = 0; i < limit; i++) {

        const wallet = this.page.locator(this.wallet_list).nth(i)
        const item_text = (await wallet.textContent())?.trim();
        const item_code = item_text?.substring(0, 3).toUpperCase()
        console.log(`Checking wallet: ${item_code}`)

        await wallet.click()
        await this.page.locator(this.manage_beneficiaries).click()
        await expect(this.page.locator(this.beneficiary_list_header)).toBeVisible()

        const listVisible = await this.page.locator(this.beneficiary_list).isVisible();

        /*if (!listVisible) {
          console.log(`No beneficiaries found for wallet: ${item_code}. Skipping...`);
          await this.page.click(this.dashboard); // Go back to wallet list
          await this.page.waitForSelector(this.wallet_list)
          continue
        }*/

        const total = await this.page.locator(this.beneficiaries).count();

        for (let index = 0; index < total; index++) {
          const beneficiaryItem = this.page.locator(this.beneficiaries).nth(index);

          const nameRaw = (await beneficiaryItem.textContent()) || "";
          const name = nameRaw.replace(/\s+/g, ' ').trim().split(',')[0].trim();

          console.log(` Clicking on beneficiary: ${name}`);
          await beneficiaryItem.click();
          await this.page.waitForTimeout(3000)

          // Wait and validate the details page
          const isDetailsVisible = await this.page.locator(this.modify_beneficiary).isVisible()
          if (!isDetailsVisible) {
            throw new Error(` Details not visible for beneficiary: ${name}`)
          }
          console.log(` Details page loaded for: ${name?.trim()}`)


          await this.page.locator(this.back_button).click()
          await this.page.waitForTimeout(3000)

        }

      }

    }



    async checkuser_is_able_to_close_the_facet_by_clicking_on_the_close_button() {

      await this.page.waitForTimeout(3000)
      const walletCount = await this.page.locator(this.wallet_list).count()
      const limit = Math.min(walletCount, 1)
      for (let i = 0; i < limit; i++) {

        const wallet = this.page.locator(this.wallet_list).nth(i)
        const item_text = (await wallet.textContent())?.trim();
        const item_code = item_text?.substring(0, 3).toUpperCase()
        console.log(`Checking wallet: ${item_code}`)

        await wallet.click()
        await this.page.locator(this.manage_beneficiaries).click()
        await this.page.waitForTimeout(3000)
        await this.page.waitForSelector(this.add_beneficiary_button)
        await this.page.click(this.add_beneficiary_button)
        await this.page.waitForTimeout(2000)
        await expect(this.page.locator(this.close_button)).toBeVisible()
        await this.page.locator(this.close_button).click()
        await this.page.waitForTimeout(2000)

        /*try {
          await this.page.locator(this.beneficiary_type).waitFor({ state: 'hidden', timeout: 5000 });
          console.log(' Form is closed.');
        } catch {
          throw new Error(' Form is still open — field is still visible or not detached.');
        }*/

      }

    }



    async verify_ibanForm_loads_when_BeneficiaryDetails_are_submitted() {

      await this.page.waitForTimeout(3000)
      const walletCount = await this.page.locator(this.wallet_list).count()
      const limit = Math.min(walletCount, 1)
      for (let i = 0; i < limit; i++) {

        const wallet = this.page.locator(this.wallet_list).nth(i)
        const item_text = (await wallet.textContent())?.trim();
        const item_code = item_text?.substring(0, 3).toUpperCase()
        console.log(`Checking wallet: ${item_code}`)

        await wallet.click()
        await this.page.locator(this.manage_beneficiaries).click()
        await this.page.waitForTimeout(3000)
        await this.page.click(this.add_beneficiary_button)
        await this.page.waitForTimeout(2000)
        await this.page.locator(this.beneficiary_type).selectOption(this.data1.Beneficiary_type)

        const euro_beneficiary_company_name = faker.company.name()
        await this.page.fill(this.company_name, euro_beneficiary_company_name)

        await this.page.fill(this.addressline_1, this.data1.Address)
        await this.page.fill(this.city, this.data1.City)
        await this.page.fill(this.state, this.data1.State)
        await this.page.locator(this.beneficiary_country).selectOption(this.data1.Beneficiary_country)
        await this.page.fill(this.postcode, this.data1.Postcode)

        const email = faker.internet.email()
        await this.page.fill(this.email, email)
        await this.page.fill(this.phone, this.data1.Phone)
        await this.page.waitForTimeout(4000)
        await this.page.click(this.beneficiary_submit)
        await this.page.waitForSelector(this.add_bank_account_details)

        await this.page.click(this.add_bank_account_details)
        await this.page.waitForSelector(this.fetch_bank_details)
        await this.page.click(this.fetch_bank_details)
        await expect(this.page.locator(this.ok_got_it_button)).toBeVisible()
        await this.page.click(this.ok_got_it_button)

        const is_IbanVisible = await this.page.locator(this.iban_no).isVisible()

        if (is_IbanVisible) {
          throw new Error('Bank details loaded before submitting beneficiary details')
        }

        await this.page.locator(this.beneficiary_currency).selectOption(this.data1.Beneficiary_currency)
        await this.page.locator(this.add_bank_account_country).selectOption(this.data1.Bank_account_country)

        const paymentMethodDropdown = this.page.locator(this.payment_methods)
        await expect(paymentMethodDropdown).toBeEnabled()
        await this.page.locator(this.payment_methods).selectOption(this.data1.Payment_method)

        await this.page.click(this.fetch_bank_details)
        await this.page.waitForTimeout(3000)
        const is_IbanVisibleNow = await this.page.locator(this.iban_no).isVisible()

        if (!is_IbanVisibleNow) {

          throw new Error('Bank details does not loaded after submitting beneficiary details')

        }

      }

    }


    async check_addCurrency_beneficiary_form_and_bankDetailsForm_throws_propervalidation() {

      await this.page.waitForTimeout(3000)
      const walletCount = await this.page.locator(this.wallet_list).count()
      const limit = Math.min(walletCount, 1)
      for (let i = 0; i < limit; i++) {

        const wallet = this.page.locator(this.wallet_list).nth(i)
        const item_text = (await wallet.textContent())?.trim()
        const item_code = item_text?.substring(0, 3).toUpperCase()
        console.log(`Checking wallet: ${item_code}`)

        await wallet.click()
        await this.page.locator(this.manage_beneficiaries).click()
        await expect(this.page.locator(this.beneficiary_list_header)).toBeVisible()

        const listVisible = await this.page.locator(this.beneficiary_list).isVisible()

        /*if (!listVisible) {
          console.log(`No beneficiaries found for wallet: ${item_code}. Skipping this wallet...`)
          await this.page.click(this.dashboard)
          await this.page.waitForSelector(this.wallet_list)
          continue
        }*/

        const raw_beneficiaries = await this.page.locator(this.beneficiaries).allTextContents()
        const beneficiary_text = raw_beneficiaries.map(text => text.replace(/\s+/g, ' ').trim()).map(text => text.split(',')[0].trim()).filter(name => name.length > 0)
        //const beneficiaries = await this.page.locator(this.beneficiaries).elementHandles()
        const count = await this.page.locator(this.beneficiaries).count();

        //for (let j = 0; j < count; j++) {
        if (count > 0) {

          // Re-fetch the list each time to avoid stale element errors
          //console.log(beneficiaries.length)
          //const beneficiary = beneficiaries[i]
          const beneficiary = this.page.locator(this.beneficiaries).nth(0);
          const name = beneficiary_text[0]

          console.log(`➡️ Clicking on beneficiary: ${name?.trim()}`)

          await beneficiary.click()
          await this.page.waitForTimeout(3000)
          await this.page.click(this.add_bank_account_details)
          await this.page.waitForSelector(this.fetch_bank_details)

          await this.page.click(this.fetch_bank_details)
          const validation_error = await this.page.locator(this.add_currencybeneficiary_validation).isVisible()
          if (validation_error) {
            const error_shown = await this.page.locator(this.add_currencybeneficiary_validation).textContent()
            console.log(error_shown)
          }
          else {
            throw new Error('No validation shown...')
          }

          await expect(this.page.locator(this.ok_got_it_button)).toBeVisible()
          await this.page.click(this.ok_got_it_button)

          await this.page.locator(this.beneficiary_currency).selectOption(this.data1.Beneficiary_currency)
          await this.page.locator(this.add_bank_account_country).selectOption(this.data1.Bank_account_country)

          const paymentMethodDropdown = this.page.locator(this.payment_methods)
          await expect(paymentMethodDropdown).toBeEnabled()
          await this.page.locator(this.payment_methods).selectOption('swift')

          await this.page.click(this.fetch_bank_details)
          await this.page.waitForTimeout(2000)

          await this.page.click(this.save_changes_button)

          const expectedErrors = [
            'Please enter the bank name',
            'Please enter the Bank Address 1',
            'Please enter the Bank City',
            'Please enter the Bank Region',
            'Please enter the Bank Postal'
          ]

          const errorLocators = await this.page.locator("//label[contains(text(), 'Please enter')]").allTextContents()
          for (const expected of expectedErrors) {
            if (!errorLocators.includes(expected)) {
              throw new Error(` Expected error message not found: "${expected}"`);
            }
          }
          console.log(" All expected error messages are present.")

        }
        //break
      }

    }

  }