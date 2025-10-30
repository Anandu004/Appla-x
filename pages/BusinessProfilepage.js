const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")
const path = require('path');
const fs = require('fs');

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';

const { selectPastDate ,selectFutureDate } = require('../utils/calenderUtils');


exports.BusinessProfilepage =
    class BusinessProfilepage {

        constructor(page) {

            this.page = page

            this.businessProfile_tab = "//a[normalize-space()='Business Profile']"

            this.ok_button = "button.swal2-confirm"

            this.brandname = "//input[@id='brand_name']"

            this.companyProfile_toggle = "//*[contains(text(), ' Company Profile')]"

            this.no_of_employees = "//input[@id='employee_count']"

            this.yearsof_operation = "//input[@id='years_in_operation']"

            this.previousname = "//input[@id='previous_name']"

            this.businessname_changeddate_field = "//input[@id='previous_name_changed_on']"

            // this.selectdate_fromcalender = "(//div[@class='caleran-day caleran-not-in-month' and @data-value='1756881000'])[2]"


            this.select_businessactivity = "//select[@id='areas_of_business']"

            this.additional_businessactivity = "//textarea[@id='area_of_business_description']"

            this.select_countries = "//select[@id='areas_of_operation']"


            this.saveDraft = "//button[@id='submitSaveAllKYC']"

            this.userlogo = "(//p[@class='initial-text'])[1]"

            this.signOut = "//a[normalize-space()='Sign Out']"



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

            this.turnover_submitbutton = "//button[@name='submitTurnOver']"



            this.nextbutton = "(//button[text()='Next '])[2]"

            this.dialogbox = "//div[@id='swal2-html-container']"

            this.businessProfile_fieldvalidation = "//label[contains(@id, '-error')]"

            this.sourceOfFund_fieldValidation = "//label[contains(@id, '-error')]"

            this.sourceOfWealth_fieldValidation = "//label[contains(@id, '-error')]"


            this.pep_toggle = "//*[contains(text(), ' Politically Exposed Persons (PEP)')]"

            this.pep_addNew_button = "//a[@id='pep_drawer_button']"

            this.pep_submit = "//button[@name='submitPep']"

            this.pep_fieldValidation = "//label[contains(@id, '-error')]"


            const dataPath = path.join(__dirname, '../TestData/Onboarding_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            this.data = this.dataset["Business Profile"]

        }



        async fillCompanyProfile() {

            //await this.page.waitForSelector(this.ok_button, { state: 'visible' });
            //await this.page.click(this.ok_button)
            await this.page.click(this.companyProfile_toggle)
            await this.page.fill(this.brandname, this.data.BrandName)
            await this.page.fill(this.no_of_employees, this.data.No_of_Employees)
            await this.page.fill(this.yearsof_operation, this.data.Years_Of_Opern)
            await this.page.fill(this.previousname, this.data.Previous_Name)
            await this.page.click(this.businessname_changeddate_field)

            await selectPastDate(this.page, 5)
            //await this.page.click("//body/div[15]/div[2]/div[2]/div[1]/div[2]/div[10]")
            //await this.page.click(this.selectdate_fromcalender)
            await this.page.locator(this.select_businessactivity).selectOption(this.data.BusinessActivity)
            await this.page.fill(this.additional_businessactivity, this.data.AdditonalActivity)
            await this.page.locator(this.select_countries).selectOption(this.data.Country)

        }


        async companyProfileValidations() {


            await this.page.waitForSelector(this.ok_button, { state: 'visible' })
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.nextbutton)
            console.log("Validating Company Profile validations....")
            const Total_validations = await this.page.locator(this.businessProfile_fieldvalidation).all()
            // expect(Total_validations.length).toBe(7)
            const Validation_text = await Total_validations[0].textContent()
            if (Total_validations.length === 7) {
                console.log(' For Company profile - All 7 validation messages are displayed as expected.')
                //
                console.log("For Company profile - validation message displayed is - " + Validation_text)
            }

            await this.page.reload()

        }

        async fillsourceOfWealth() {

            await this.page.click(this.sourceOfWealth_toggle)
            await this.page.click(this.sourceoffund_addnewbutton)
            await this.page.locator(this.source_dropdown).selectOption({ label: this.data.Source });
            await this.page.fill(this.amount, this.data.Amount)
            await this.page.locator(this.countries).selectOption(this.data.Countries)
            await this.page.click(this.source_submitbutton)

            await this.page.click(this.sourceofwealth_addnewbutton)

            await this.page.locator(this.source_2).selectOption({ label: this.data.Source_2 })
            await this.page.fill(this.amount_2, this.data.Amount_2)
            await this.page.locator(this.countries_2).selectOption(this.data.Countries_2)
            await this.page.click(this.wealth_submitbutton)

            await this.page.click(this.turnover_addnewbutton)
            await this.page.fill(this.turnover_amount, this.data.TurnOver)
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
                console.log('For Source of fund - All 3 validation messages are displayed as expected.')
                console.log("validation message displayed is - " + Validation_text)
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
                console.log(' For Source of wealth - All 3 validation messages are displayed as expected.')
                console.log("validation message displayed is - " + Validation_text2)
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
                console.log(' For Source of Annual expected Turnover - All 8 validation messages are displayed as expected.')
                console.log("validation message displayed is - " + Validation_text3)
            }
            await this.page.reload()

        }




        async savedraft_for_businessProfile_after_logOut() {

            await this.page.waitForTimeout(3000)
            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            await this.page.click(this.businessProfile_tab)
            await this.page.waitForTimeout(3000)
            await this.page.fill(this.brandname, this.data.BrandName)
            await this.page.fill(this.no_of_employees, this.data.No_of_Employees)
            await this.page.fill(this.yearsof_operation, this.data.Years_Of_Opern)
            await this.page.fill(this.previousname, this.data.Previous_Name)

            await this.page.click(this.businessname_changeddate_field)
            await selectPastDate(this.page, 3);
            //await this.page.click("//body/div[15]/div[2]/div[2]/div[1]/div[2]/div[10]")

            await this.page.locator(this.select_businessactivity).selectOption(this.data.BusinessActivity)
            await this.page.fill(this.additional_businessactivity, this.data.AdditonalActivity)
            await this.page.locator(this.select_countries).selectOption(this.data.Country)
            await this.page.click(this.saveDraft)
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
            await this.page.click(this.businessProfile_tab)

            await expect(this.page.locator(this.brandname)).toHaveValue(this.data.BrandName)
            await expect(this.page.locator(this.no_of_employees)).toHaveValue(this.data.No_of_Employees)
            await expect(this.page.locator(this.yearsof_operation)).toHaveValue(this.data.Years_Of_Opern)
            await expect(this.page.locator(this.previousname)).toHaveValue(this.data.Previous_Name)
            //await expect(this.page.locator(`${this.select_businessactivity}/option[@selected]`)).toHaveText(this.data.BusinessActivity)
            await expect(this.page.locator(this.additional_businessactivity)).toHaveValue(this.data.AdditonalActivity)
            //await expect(this.page.locator(`${this.select_countries}/option[@selected]`)).toHaveText(this.data.Country)

        }



        async savedraft_for_businessProfile_after_refresh() {

            await this.page.waitForTimeout(3000)
            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            await this.page.click(this.businessProfile_tab)
            await this.page.waitForTimeout(3000)
            await this.page.fill(this.brandname, 'Swift llc')
            await this.page.fill(this.no_of_employees, '500')
            await this.page.fill(this.yearsof_operation, this.data.Years_Of_Opern)
            await this.page.fill(this.previousname, this.data.Previous_Name)

            await this.page.click(this.businessname_changeddate_field)
            await selectPastDate(this.page, 3);
            //await this.page.click("//body/div[15]/div[2]/div[2]/div[1]/div[2]/div[10]")

            await this.page.locator(this.select_businessactivity).selectOption(this.data.BusinessActivity)
            await this.page.fill(this.additional_businessactivity, this.data.AdditonalActivity)
            await this.page.locator(this.select_countries).selectOption(this.data.Country)
            await this.page.click(this.saveDraft)
            const draftMessageLocator = this.page.locator("//div[@id='draftMessage']")
            await expect(draftMessageLocator).toBeVisible()
            await expect(draftMessageLocator).toHaveText('Your changes have been saved.')

            await this.page.reload()

            await expect(this.page.locator(this.brandname)).toHaveValue('Swift llc')
            await expect(this.page.locator(this.no_of_employees)).toHaveValue('500')
            await expect(this.page.locator(this.yearsof_operation)).toHaveValue(this.data.Years_Of_Opern)
            await expect(this.page.locator(this.previousname)).toHaveValue(this.data.Previous_Name)
            //await expect(this.page.locator(`${this.select_businessactivity}/option[@selected]`)).toHaveText(this.data.BusinessActivity)
            await expect(this.page.locator(this.additional_businessactivity)).toHaveValue(this.data.AdditonalActivity)
            //await expect(this.page.locator(`${this.select_countries}/option[@selected]`)).toHaveText(this.data.Country)

        }



    }
