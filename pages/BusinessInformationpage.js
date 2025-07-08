const { expect } = require("@playwright/test")
const { faker } = require('@faker-js/faker');
//const { TIMEOUT } = require("dns")
const path = require('path');
const fs = require('fs');

exports.BusinessInformationpage =
    class BusinessInformationpage {

        constructor(page) {

            this.page = page

            this.CompanyType = "//select[@id='business_type']"

            this.SelectCompanyType = "//select[@id='company_type']"

            this.CompanyRegNo = "//input[@name='company_registration']"

            this.ComapnyVat = "//input[@name='company_vat']"

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

            this.best_describe_your_business = "//select[@id='crs_classification_fe']"

            this.addnew_button = "//a[@id='tax_residency_drawer_button']"

            this.secondCountry = "//select[@id='ctr_country']"

            this.documentType = "//input[@id='ctr_document']"

            this.ssn_dropdown = "//select[@id='ctr_no_tin']"

            this.second_submitbutton = "//div[@class='row mb-7 g-3']//button[@name='submit'][normalize-space()='Submit']"

            this.next_button = "//i[@class='fa-duotone fa-chevron-right ms-2']"


            this.dialogbox = "//div[@id='swal2-html-container']"


            this.companyDetails_fieldvalidations = "//label[normalize-space()='This field is required.']"

            this.BusinessAddress_fieldvalidations = "//label[normalize-space()='This field is required.']"

            this.invalidData_errorForm = "//div[@id='swal2-html-container']"

            this.errorForm_okbutton = "//button[@class='swal2-confirm btn btn-danger']"

            this.selfcertification_fieldvalidations = "//label[normalize-space()='This field is required.']"


        }


        async fillCompanyDetails() {

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const domain = company_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
            const companyUrl = `https://www.${domain}`

            await this.page.locator(this.CompanyType).selectOption('Company')
            await this.page.locator(this.SelectCompanyType).selectOption("5")
            await this.page.fill(this.CompanyRegNo, '8956')
            await this.page.fill(this.ComapnyVat, '322')
            await this.page.fill(this.IncorportationNumber, '3345')
            await this.page.fill(this.CompanySIC, '566')
            await this.page.fill(this.CompanyContact, '9898090989')
            await this.page.fill(this.CompanyContactPosition, 'Manager')
            await this.page.locator(this.CompanyJurisdiction).selectOption("14")
            await this.page.fill(this.CompanyUrl, companyUrl)


        }

        async companyDetailsValidation() {

            await this.page.click(this.next_button)
            await this.page.waitForSelector(this.companyDetails_fieldvalidations)
            console.log("Validating Company Details Validation")

            const Total_validations = await this.page.locator(this.companyDetails_fieldvalidations).all();

            expect(Total_validations.length).toBe(7)
            const Validation_text = await Total_validations[0].textContent();
            if (Total_validations.length === 7) {
                console.log(' All 7 validation messages are displayed as expected.');
                console.log("validation message displayed is - " + Validation_text)
            }
            else {
                console.warn("⚠️ Not all validation messages are as expected.");
            }
        }




        async fillCompanyAddress() {

            await this.page.waitForSelector(this.second_collapsible)
            await this.page.click(this.second_collapsible)

            await this.page.click(this.Add_newbutton)
            await this.page.locator(this.AddressType).selectOption(["12", "15"])
            await this.page.fill(this.StreetName, '8th Avenue')
            await this.page.fill(this.StreetNumber, '789')
            await this.page.fill(this.Postcode, '10036')
            await this.page.locator(this.country).selectOption('United States')
            await this.page.fill(this.city, 'New York')
            await this.page.fill(this.phone, '22456787')

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
                console.log(' All 6 validation messages are displayed as expected.')
                console.log("validation message displayed under each field - " + Validation_text)
            }
            else {
                console.warn("⚠️ Not all validation messages are as expected.");
            }

            await this.page.waitForTimeout(3000)

            //Invalid data validation
            await this.page.locator(this.AddressType).selectOption(["12", "15"])
            await this.page.fill(this.StreetName, 'New street')  //invalid street name
            await this.page.fill(this.StreetNumber, '567')  //invalid street number
            await this.page.fill(this.Postcode, '135789')  // invalid postcode
            await this.page.locator(this.country).selectOption('United States')
            await this.page.fill(this.city, 'New York')
            await this.page.fill(this.phone, '22456787')
            const email = faker.internet.email()
            await this.page.fill(this.email, email)
            await this.page.click(this.submit_button)
            await expect(this.page.locator(this.invalidData_errorForm)).toBeVisible()
            if (await this.page.locator(this.invalidData_errorForm).isVisible()) {
                await this.page.click(this.errorForm_okbutton)
            }

        }





        async completeSelfCertification() {


            await this.page.click(this.selfcertification_collapse)
            await this.page.click(this.radiobutton_1)
            await this.page.click(this.radiobutton_2)
            await this.page.click(this.radiobutton_3)
            await this.page.locator(this.best_describe_your_business).selectOption("186")
            await this.page.click(this.addnew_button)
            await this.page.locator(this.secondCountry).selectOption("14")
            await this.page.fill(this.documentType, "private")
            await this.page.locator(this.ssn_dropdown).selectOption("191")
            await this.page.click(this.second_submitbutton)
            await this.page.click(this.next_button)
            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "Business information has been successfully saved."
            expect(actualmessage?.trim()).toBe(expectedmessage);

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
                console.log(' All 4 validation messages are displayed as expected.');
                console.log("validation message displayed is - " + Validation_text)
            }
            else {
                console.warn(" Not all validation messages are as expected.");
            }

        }


    }
