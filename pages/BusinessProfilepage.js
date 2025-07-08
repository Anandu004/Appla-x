const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")

exports.BusinessProfilepage =
    class BusinessProfilepage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"

            this.brandname = "//input[@id='brand_name']"

            this.no_of_employees = "//input[@id='employee_count']"

            this.yearsof_operation = "//input[@id='years_in_operation']"

            this.previousname = "//input[@id='previous_name']"

            this.businessname_changeddate_field = "//input[@id='previous_name_changed_on']"

            //this.selectdate_fromcalender = "//div[@data-value='1745389800']"

            this.select_businessactivity = "//select[@id='areas_of_business']"

            this.additional_businessactivity = "//textarea[@id='area_of_business_description']"

            this.select_countries = "//select[@id='areas_of_operation']"



            this.sourceOfWealth_toggle = "//*[contains(text(), 'Source of Wealth and Expected Turnover')]"

            this.sourceoffund_addnewbutton = "//a[@id='boof_drawer_button']"

            this.source_dropdown = "//select[@id='source_f']"

            this.amount = "//form[@id='boof_frm']//input[@id='amount']"

            this.countries = "//select[@id='actual_country1']"

            this.source_submitbutton = "//button[@class='submitBtn1 btn btn-dark mt-5']"



            this.sourceofwealth_addnewbutton = "//a[@id='bsow_drawer_button']"

            this.source_2 = "//select[@id='source_w']"

            this.amount_2 = "//form[@id='bsow_frm']//input[@id='amount']"

            this.countries_2 = "//select[@id='actual_country']"

            this.wealth_submitbutton = "//button[@id='submitButton1']"



            this.turnover_addnewbutton = "//a[@id='baet_drawer_button']"

            this.turnover_amount = "(//input[@id='amount'])[3]"

            this.turnover_submitbutton = "//form[@id='baet_frm']//button[@name='submit'][normalize-space()='Submit']"



            this.nextbutton = "//button[text()='Next ']"

            this.dialogbox = "//div[@id='swal2-html-container']"

            this.businessProfile_fieldvalidation = "//label[normalize-space()='This field is required.']"

            this.sourceOfFund_fieldValidation = "//label[normalize-space()='This field is required.']"

            this.sourceOfWealth_fieldValidation = "//label[normalize-space()='This field is required.']"


            this.pep_toggle = "//*[contains(text(), ' Politically Exposed Persons (PEP)')]"

            this.pep_addNew_button = "//a[@id='pep_drawer_button']"

            this.pep_submit = "(//button[@class='btn btn-dark mt-5'])[5]"

            this.pep_fieldValidation = "//label[normalize-space()='This field is required.']"

        }



        async fillCompanyProfile() {

            await this.page.waitForSelector(this.ok_button, { state: 'visible' });
            await this.page.click(this.ok_button)
            await this.page.fill(this.brandname, "Cronin")
            await this.page.fill(this.no_of_employees, "500")
            await this.page.fill(this.yearsof_operation, "5")
            await this.page.fill(this.previousname, "LTXC")
            await this.page.click(this.businessname_changeddate_field)
            await this.page.waitForSelector(".caleran-days-container");
            const randomDay = Math.floor(Math.random() * 28) + 1;
            const dayElements = await this.page.locator(".caleran-days-container .caleran-day:not(.caleran-disabled)").all();
            for (const dayElement of dayElements) {
                const dayText = (await dayElement.textContent())?.trim();
                if (dayText === randomDay.toString()) {
                    await dayElement.click();
                    console.log("Selected date:", randomDay);
                    break;
                }
            }

            //await this.page.click(this.selectdate_fromcalender)
            await this.page.locator(this.select_businessactivity).selectOption("23")
            await this.page.fill(this.additional_businessactivity, "aerospace and construction")
            await this.page.locator(this.select_countries).selectOption(["1", "2", "3"])

        }

        async companyProfileValidations(){
            

            await this.page.waitForSelector(this.ok_button, { state: 'visible' })
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.nextbutton)
            console.log("Validating Company Profile validations....")
            const Total_validations = await this.page.locator(this.businessProfile_fieldvalidation).all()
            expect(Total_validations.length).toBe(4)
            const Validation_text = await Total_validations[0].textContent()
            if (Total_validations.length === 4) {
                console.log(' All 4 validation messages are displayed as expected.')
                console.log("validation message displayed is - "+Validation_text)
            }
            await this.page.reload()

        }

        async fillsourceOfWealth() {

            await this.page.click(this.sourceOfWealth_toggle)
            await this.page.click(this.sourceoffund_addnewbutton)
            await this.page.locator(this.source_dropdown).selectOption({ label: 'Bonus' });
            await this.page.fill(this.amount, "10000")
            await this.page.locator(this.countries).selectOption("144")
            await this.page.click(this.source_submitbutton)

            await this.page.click(this.sourceofwealth_addnewbutton)

            await this.page.locator(this.source_2).selectOption({ label: 'Private Investments' })
            await this.page.fill(this.amount_2, "50000")
            await this.page.locator(this.countries_2).selectOption("234")
            await this.page.click(this.wealth_submitbutton)

            await this.page.click(this.turnover_addnewbutton)
            await this.page.fill(this.turnover_amount, "100000")
            await this.page.click(this.turnover_submitbutton)

            await this.page.click(this.nextbutton)
            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "Business profile has been successfully saved."
            expect(actualmessage?.trim()).toBe(expectedmessage)
        }

        async fillsourceOfWealth_and_ExpectedTurnover_Validations() {

            //source of fund validation
            await this.page.click(this.sourceOfWealth_toggle)
            await this.page.click(this.sourceoffund_addnewbutton)

            await this.page.click(this.source_submitbutton)
            console.log("Validating source of fund validations....")
            const Total_validations = await this.page.locator(this.sourceOfFund_fieldValidation).all()
            expect(Total_validations.length).toBe(3)
            const Validation_text = await Total_validations[0].textContent()
            if (Total_validations.length === 3) {
                console.log(' All 3 validation messages are displayed as expected.')
                console.log("validation message displayed is - "+Validation_text)
            }
            await this.page.reload()


            //source of wealth validation
            await this.page.click(this.sourceofwealth_addnewbutton)
            await this.page.click(this.wealth_submitbutton)
            console.log("Validating source of wealth validations....")
            const Total_validations2 = await this.page.locator(this.sourceOfWealth_fieldValidation).all()
            expect(Total_validations.length).toBe(3)
            const Validation_text2 = await Total_validations2[0].textContent()
            if (Total_validations2.length === 3) {
                console.log(' All 3 validation messages are displayed as expected.')
                console.log("validation message displayed is - "+Validation_text2)
            }
            await this.page.reload()


            //Annual expected turn over validation


            await this.page.click(this.pep_toggle)
            await this.page.click(this.pep_addNew_button)
            await this.page.click(this.pep_submit)
            console.log("Validating Annual expected turnover validations....")
            const Total_validations3 = await this.page.locator(this.pep_fieldValidation).all()
            expect(Total_validations3.length).toBe(8)
            const Validation_text3 = await Total_validations2[0].textContent()
            if (Total_validations3.length === 8) {
                console.log(' All 3 validation messages are displayed as expected.')
                console.log("validation message displayed is - "+Validation_text3)
            }

        } 

    }
