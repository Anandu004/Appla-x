const { expect } = require("@playwright/test")
const { faker } = require('@faker-js/faker');
//const { TIMEOUT } = require("dns")
const path = require('path');
const fs = require('fs');

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';

exports.BusinessInformationpage =
    class BusinessInformationpage {

        constructor(page) {

            this.page = page

            this.Account_locked_status = "//h1[normalize-space()='Account Locked - KYC In review']"

            this.first_collapsible = "//div[@data-bs-target=\"#ov_business_information_item_1\"]"

            this.CompanyType = "//select[@id='business_type']"

            this.SelectCompanyType = "//select[@id='company_type']"

            this.CompanyRegNo = "//input[@name='company_registration']"

            this.CompanyVat = "//input[@name='company_vat']"

            this.IncorportationNumber = "//input[@name='incorporation_number']"

            this.CompanySIC = "//input[@name='company_sic']"

            this.CompanyContact = "//input[@name='company_contact_name']"

            this.CompanyContactPosition = "//input[@name='company_contact_position']"

            this.CompanyJurisdiction = "//select[@id='jurisdiction']"

            this.CompanyUrl = "//input[@name='company_url']"



            this.second_collapsible = "//div[@data-bs-target=\"#ov_business_information_item_2\"]"

            this.Add_newbutton = "//a[@id=\"business_information_address_drawer_button\"]"

            this.AddressType = "//select[@id='ba_address_type']"

            this.StreetName = "//input[@name= 'address_1']"

            this.StreetNumber = "//input[@name= 'address_2']"

            this.Postcode = "//input[@name= 'postcode']"

            this.country = "//select[@id='ba_country']"

            this.city = "//input[@name= 'city']"

            this.phone = "//input[@name= 'phone']"

            this.email = "//input[@name= 'email']"

            this.submit_button = "//button[@class='btn btn-dark' and text()='Submit Address']"

            this.ok_button = "//button[@class='swal2-confirm swal2-styled']"



            this.selfcertification_collapse = "//h3[contains(text(),'Self-Certification / US FATCA / Common Reporting S')]"

            this.radiobutton_1 = "//input[@id = 'is_fe_yes']"

            this.radiobutton_2 = "//input[@id = 'is_us_entity_yes']"

            this.radiobutton_3 = "//input[@id = 'has_us_tin_yes']"

            this.radiobutton_no = "//input[@id = 'has_us_tin_no']"

            this.us_fatca_dropdown = "//select[@id='facta_classification_fe']"

            this.best_describe_your_business = "//select[@id='crs_classification_fe']"

            this.addnew_button = "//a[@id='tax_residency_drawer_button']"

            this.secondCountry = "//select[@id='ctr_country']"

            this.documentType = "//input[@id='ctr_document']"

            this.ssn_dropdown = "//select[@id='ctr_no_tin']"

            this.second_submitbutton = "//button[@name='submitTax']"

            this.next_button = "//i[@class='fa-duotone fa-chevron-right ms-2']"


            this.dialogbox = "//div[@id='swal2-html-container']"


            this.companyDetails_fieldvalidations = "//label[contains(@id, '-error')]"

            this.BusinessAddress_fieldvalidations = "//label[contains(@id, '-error')]"

            this.invalidData_errorForm = "//div[@id='swal2-html-container']"

            this.errorForm_okbutton = "//button[@class='swal2-confirm btn btn-danger']"

            this.selfcertification_fieldvalidations = "//label[contains(@id, '-error')]"



            this.saveDraft = "//button[@id='submitSaveAllKYC']"

            this.userlogo = "(//p[@class='initial-text'])[1]"

            this.signOut = "//a[normalize-space()='Sign Out']"


            const dataPath = path.join(__dirname, '../TestData/Onboarding_testdata.json');
            this.data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

            this.business_info = this.data["Business info"]


        }


        async fillCompanyDetails() {

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const domain = company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
            const companyUrl = `https://www.${domain}`

            await this.page.locator(this.first_collapsible).click()
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyType).selectOption(this.business_info.companyType)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.SelectCompanyType).selectOption(this.business_info.selectCompanyType)
            await this.page.fill(this.CompanyRegNo, this.business_info.regNo)
            await this.page.fill(this.CompanyVat, this.business_info.vatNo)
            await this.page.fill(this.IncorportationNumber, this.business_info.incorporationNo)
            await this.page.fill(this.CompanySIC, this.business_info.sicCode)
            await this.page.fill(this.CompanyContact, this.business_info.contact)
            await this.page.fill(this.CompanyContactPosition, this.business_info.contactPosition)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyJurisdiction).selectOption(this.business_info.jurisdiction)
            await this.page.fill(this.CompanyUrl, companyUrl)


        }

        async companyDetailsValidation() {

            await this.page.click(this.next_button)
            await this.page.waitForSelector(this.companyDetails_fieldvalidations)
            console.log("Validating Company Details Validation")

            const Total_validations = await this.page.locator(this.companyDetails_fieldvalidations).all()
            
            expect(Total_validations.length).toBe(10)

            const Validation_text = await Total_validations[0].textContent();
            if (Total_validations.length === 10) {
                console.log('For Company details -  All 10 validation messages are displayed as expected.');
                //console.log("validation message displayed is - " + Validation_text)
            }
            else {
                console.warn(" For Company details - Not all validation messages are as expected.");
            }
        }




        async fillCompanyAddress() {

            await this.page.waitForSelector(this.second_collapsible)
            await this.page.click(this.second_collapsible)

            await this.page.click(this.Add_newbutton)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.AddressType).selectOption(this.business_info.AddressType)
            await this.page.fill(this.StreetName, this.business_info.StreetName)
            await this.page.fill(this.StreetNumber, this.business_info.StreetNumber)
            await this.page.fill(this.Postcode, this.business_info.Postcode)
            await this.page.locator(this.country).selectOption(this.business_info.Country)
            await this.page.fill(this.city, this.business_info.City)
            await this.page.fill(this.phone, this.business_info.Phone)

            const email = faker.internet.email()
            await this.page.fill(this.email, email)

            await this.page.click(this.submit_button)

        }


        async companyAddressValidationForEmptyfields_and_InvalidDatas() {

            //empty field validation
            await this.page.reload();
            await this.page.waitForSelector(this.second_collapsible)
            await this.page.click(this.second_collapsible)
            await this.page.click(this.Add_newbutton)
            await this.page.waitForSelector(this.submit_button)
            await this.page.click(this.submit_button)

            const Total_validations = await this.page.locator(this.BusinessAddress_fieldvalidations).all()
            expect(Total_validations.length).toBe(6)
            const Validation_text = await Total_validations[0].textContent();
            if (Total_validations.length === 6) {
                console.log('For Company address -  All 6 validation messages are displayed as expected.')
                console.log("validation message displayed under each field - " + Validation_text)
            }
            else {
                console.warn(" For Company address - Not all validation messages are as expected.");
            }

            await this.page.waitForTimeout(3000)
           
        }




        async completeSelfCertification() {


            await this.page.click(this.selfcertification_collapse)
            await this.page.click(this.radiobutton_1)
            await this.page.click(this.radiobutton_2)
            //await this.page.click(this.radiobutton_3)
            await this.page.click(this.radiobutton_no)
            await expect(this.page.locator(this.us_fatca_dropdown)).toBeVisible()
            await this.page.locator(this.us_fatca_dropdown).selectOption('Participating FFI')
            await this.page.locator(this.best_describe_your_business).selectOption(this.business_info.Describe_business)
            await this.page.click(this.addnew_button)
            //await this.page.waitForTimeout(2000)
            await this.page.locator(this.secondCountry).selectOption(this.business_info.SecondCountry)
            await this.page.fill(this.documentType, this.business_info.DocumentType)
            await this.page.locator(this.ssn_dropdown).selectOption(this.business_info.ssn_dropdown)
            await this.page.waitForTimeout(2000)
            await this.page.click(this.second_submitbutton)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.next_button)
            await this.page.waitForSelector(this.dialogbox)
            //await this.page.waitForTimeout(8000)
            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "Business information has been successfully saved."
            expect(actualmessage?.trim()).toBe(expectedmessage)

        }


        async selfCertification_validation() {

            await this.page.reload()
            await this.page.waitForSelector(this.selfcertification_collapse)
            await this.page.click(this.selfcertification_collapse)
            await this.page.click(this.radiobutton_1)
            await this.page.click(this.radiobutton_2)
            await this.page.click(this.radiobutton_3)
            await this.page.locator(this.best_describe_your_business).selectOption("186")
            await this.page.click(this.addnew_button)
            await this.page.click(this.second_submitbutton)

            const Total_validations = await this.page.locator(this.selfcertification_fieldvalidations).all();
            expect(Total_validations.length).toBe(4)
            const Validation_text = await Total_validations[0].textContent();
            if (Total_validations.length === 4) {
                console.log(' For Self certification - All 4 validation messages are displayed as expected.');
                console.log("validation message displayed is - " + Validation_text)
            }
            else {
                console.warn(" For Self certification - Not all validation messages are as expected.");
            }
            await this.page.reload()

        }




        async savedraft_for_businessInformation_after_logOut() {

            await this.page.waitForTimeout(3000)

            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const domain = company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
            const companyUrl = `https://www.${domain}`

            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyType).selectOption(this.business_info.companyType)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.SelectCompanyType).selectOption(this.business_info.selectCompanyType)
            await this.page.fill(this.CompanyRegNo, this.business_info.regNo)
            await this.page.fill(this.CompanyVat, this.business_info.vatNo)
            await this.page.fill(this.IncorportationNumber, this.business_info.incorporationNo)
            await this.page.fill(this.CompanySIC, this.business_info.sicCode)
            await this.page.fill(this.CompanyContact, this.business_info.contact)
            await this.page.fill(this.CompanyContactPosition, this.business_info.contactPosition)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyJurisdiction).selectOption(this.business_info.jurisdiction)
            await this.page.fill(this.CompanyUrl, companyUrl)
            await this.page.click(this.saveDraft)
            await this.page.waitForTimeout(2000)
            const draftMessageLocator = this.page.locator("//div[@id='draftMessage']")
            await expect(draftMessageLocator).toBeVisible()
            await expect(draftMessageLocator).toHaveText('Your changes have been saved.')

            await this.page.click(this.userlogo)
            await this.page.click(this.signOut)

            const login = new Loginpage(this.page)
            await login.goToLoginPage()
            await login.giveLoginCredentials()
            await this.page.waitForTimeout(3000)

            await dashboard.clickOnCompleteKyc()

            // --- Verify that the previously entered values persist ---
            await expect(this.page.locator(`${this.CompanyType}/option[@selected]`)).toHaveText(this.business_info.companyType);
            await expect(this.page.locator(`${this.SelectCompanyType}/option[@selected]`)).toHaveText(this.business_info.selectCompanyType);
            await expect(this.page.locator(this.CompanyRegNo)).toHaveValue(this.business_info.regNo);
            await expect(this.page.locator(this.CompanyVat)).toHaveValue(this.business_info.vatNo);
            await expect(this.page.locator(this.IncorportationNumber)).toHaveValue(this.business_info.incorporationNo);
            await expect(this.page.locator(this.CompanySIC)).toHaveValue(this.business_info.sicCode);
            await expect(this.page.locator(this.CompanyContact)).toHaveValue(this.business_info.contact);
            await expect(this.page.locator(this.CompanyContactPosition)).toHaveValue(this.business_info.contactPosition);
            await expect(this.page.locator(`${this.CompanyJurisdiction}/option[@selected]`)).toHaveText(this.business_info.jurisdiction);
            await expect(this.page.locator(this.CompanyUrl)).toHaveValue(companyUrl);


        }


         async savedraft_for_businessInformation_after_refresh() {

            await this.page.waitForTimeout(3000)

            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            const domain = company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'
            const companyUrl = `https://www.${domain}`

            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyType).selectOption(this.business_info.companyType)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.SelectCompanyType).selectOption(this.business_info.selectCompanyType)
            await this.page.fill(this.CompanyRegNo, '3509')
            await this.page.fill(this.CompanyVat, this.business_info.vatNo)
            await this.page.fill(this.IncorportationNumber, '4545')
            await this.page.fill(this.CompanySIC, this.business_info.sicCode)
            await this.page.fill(this.CompanyContact, this.business_info.contact)
            await this.page.fill(this.CompanyContactPosition, this.business_info.contactPosition)
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.CompanyJurisdiction).selectOption(this.business_info.jurisdiction)
            await this.page.fill(this.CompanyUrl, companyUrl)
            await this.page.click(this.saveDraft)
            await this.page.waitForTimeout(2000)
            const draftMessageLocator = this.page.locator("//div[@id='draftMessage']")
            await expect(draftMessageLocator).toBeVisible()
            await expect(draftMessageLocator).toHaveText('Your changes have been saved.')

            await this.page.reload()

            // --- Verify that the previously entered values persist ---
            await expect(this.page.locator(`${this.CompanyType}/option[@selected]`)).toHaveText(this.business_info.companyType);
            await expect(this.page.locator(`${this.SelectCompanyType}/option[@selected]`)).toHaveText(this.business_info.selectCompanyType);
            await expect(this.page.locator(this.CompanyRegNo)).toHaveValue('3509');
            await expect(this.page.locator(this.CompanyVat)).toHaveValue(this.business_info.vatNo);
            await expect(this.page.locator(this.IncorportationNumber)).toHaveValue('4545');
            await expect(this.page.locator(this.CompanySIC)).toHaveValue(this.business_info.sicCode);
            await expect(this.page.locator(this.CompanyContact)).toHaveValue(this.business_info.contact);
            await expect(this.page.locator(this.CompanyContactPosition)).toHaveValue(this.business_info.contactPosition);
            await expect(this.page.locator(`${this.CompanyJurisdiction}/option[@selected]`)).toHaveText(this.business_info.jurisdiction);
            await expect(this.page.locator(this.CompanyUrl)).toHaveValue(companyUrl);


        }



    }

