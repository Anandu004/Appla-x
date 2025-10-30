const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');

const fs = require('fs');
const path = require('path');


exports.RegisterCompanypage =
    class RegisterCompanypage {

        constructor(page) {

            this.page = page

            this.companyname_field = "input[name='company_name']"

            this.jurisdiction_field = "//span[@class=\"select2-selection select2-selection--single form-select\"]"

            this.searchOn_Jurisdiction = "//input[@class=\"select2-search__field\"]"

            this.suggestionsOn_jurisdiction = "//li[contains(@class, 'select2-results__option') and normalize-space(text())='India']"

            this.submit_button = "button[name='submitCompany']"

            this.ok_button = "//button[normalize-space()='OK']"

            this.dialogbox = "//div[@id='swal2-html-container']"


            this.companyName_error = "//label[@id='company_name-error']"

            this.companyName_error2 = "//p[@class='text-muted']"

            this.jurisdiction_error = "//label[@id='jurisdiction-error']"


        }


        async newCompanyRegistration(jurisdiction) {

          const company_name = "testcompany " + faker.company.name()

            await this.page.fill(this.companyname_field, company_name)
            await this.page.click(this.jurisdiction_field)
            await this.page.fill(this.searchOn_Jurisdiction, jurisdiction)
            const company_suggestions = await this.page.$$(this.suggestionsOn_jurisdiction)
            for (let required_company of company_suggestions) {
                const required = await required_company.textContent()
                if (required.includes(jurisdiction)) {
                    await required_company.click()
                    break
                }
            }

            await this.page.click(this.submit_button)

            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "Your company has been successfully registered."
                + " In order to conduct business with this company, "
                + "KYC is required. Please follow the instructions "
                + "on the dashboard to start your KYC process"

            expect(actualmessage?.trim()).toBe(expectedmessage);

            const filePath = path.join(__dirname, '../companyname.json');
            fs.writeFileSync(filePath, JSON.stringify({ company_name }));
        }
        

        async validationsForCompanyRegistration() {

            //company reg without company name and jurisdiction
            await this.page.waitForTimeout(3000)
            console.log("Clicking submit button without company name and jurisdiction on company registration")
            await this.page.click(this.submit_button)
            const isErrorVisible = await this.page.locator(this.companyName_error).isVisible()
            const isErrorVisible2 = await this.page.locator(this.companyName_error2).isVisible()
            if (isErrorVisible && isErrorVisible2) {
                const companyName_validation = await this.page.locator(this.companyName_error).textContent()
                const companyName_suggestion = await this.page.locator(this.companyName_error2).textContent()
                const jurisdiction_validation = await this.page.locator(this.jurisdiction_error).textContent()
                console.log("Company Name -" + companyName_validation + "-" + companyName_suggestion)
                console.log("Jurisdiction -" + jurisdiction_validation)
            } else {
                console.log("No company name error displayed.")
            }
            await this.page.reload()
            await this.page.waitForTimeout(3000)


            //company reg without jurisdiction
            console.log("Clicking submit button with company name only")
            const company_name = faker.company.name()
            await this.page.fill(this.companyname_field, company_name)
            await this.page.click(this.submit_button)
            const isErrorVisible3 = await this.page.locator(this.companyName_error2).isVisible()
            if (isErrorVisible3) {
                const jurisdiction_validation = await this.page.locator(this.jurisdiction_error).textContent()
                console.log("Jurisdiction -" + jurisdiction_validation)
            } else {
                console.log("No jurisdiction error displayed.")
            }
            await this.page.reload()
            await this.page.waitForTimeout(3000)


            //company reg without company name
            console.log("Clicking submit button with jurisdiction only")
            await this.page.locator("//select[@id='jurisdiction']").selectOption(`Albania`)
            await this.page.click(this.submit_button)
            const isErrorVisible4 = await this.page.locator(this.companyName_error).isVisible()
            if (isErrorVisible4) {
                const companyName_validation = await this.page.locator(this.companyName_error).textContent()
                const companyName_suggestion = await this.page.locator(this.companyName_error2).textContent()
                console.log("Company Name -" + companyName_validation + "-" + companyName_suggestion)
            } else {
                console.log("No company name error displayed.")
            }


        }
        async ExistinguserCompanyRegistration() {
            
            const jurisdiction = "India";

            await this.page.fill(this.companyname_field, "Smitham-Schmidt")
            await this.page.click(this.jurisdiction_field)
            await this.page.fill(this.searchOn_Jurisdiction, 'India')
            const company_suggestions = await this.page.$$(this.suggestionsOn_jurisdiction)
            for (let required_company of company_suggestions) {
                const required = await required_company.textContent()
                if (required.includes(jurisdiction)) {
                    await required_company.click()
                    break
                }
            }

            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(6000)
            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "The company name is already taken"

            expect(actualmessage?.trim()).toBe(expectedmessage);
        }
        
    }



