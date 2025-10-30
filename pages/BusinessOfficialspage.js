const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

import { Dashboardpage } from '../pages/Dashboardpage';
const { selectPastDate , selectFutureDate } = require('../utils/calenderUtils');


exports.BusinessOfficialspage =
    class BusinessOfficialspage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"

            this.businessOfficials_tab = "//a[normalize-space()='Business Officials']"

            this.businessoff_addnewbutton = "//a[@id='business_officials_drawer_button']"

            this.business_and_companyType_error = "//div[@id='swal2-html-container']"

            this.official_type = "//select[@id='official_type']"

            this.firstname = "//div[@class='col-md-4']//input[@name='first_name']"

            this.lastname = "//div[@class='col-md-4']//input[@name='last_name']"

            this.homeaddress = "//input[@name='home_address']"

            this.cityname = "//div[@class='col-md-12']//input[@name='city']"

            this.postcode = "//div[@class='col-md-12']//input[@name='postbox']"

            this.email = "//div[@class='col-md-12']//input[@name='email']"

            this.phone = "//input[@id='phoneOfficial']"

            this.dateOfBirth_field = "//input[@id='date_of_birth']"

            this.year_click = "(//span[@class='caleran-year-switch'][normalize-space()='2025'])[9]"

            this.previous_year_arrow = "//i[@class='fa fa-angle-double-left']"

            this.selectdob_year = "(//div[normalize-space()='1995'])[1]"

            this.selectdob_day = "//body/div[21]/div[2]/div[2]/div[1]/div[2]/div[17]"

            this.nationality = "//select[@id='nationality']"

            this.country_of_citizenship = "//select[@id='country_of_citizenship']"

            this.country_of_birth = "//select[@id='country_of_birth']"

            this.country_of_residence = "//select[@id='country_of_residence']"

            this.identification_type = "//select[@id='identification_type']"

            this.identification_number = "//input[@name='identification_number']"

            this.issuedate_field = "//input[@id='id_issue_date']"

            this.currentmonth_header = "//div[@class='caleran-title']"

            this.nextmonth_arrow = "//div[@class='caleran-next']"

            this.dates_from_currentmonth = "//div[contains(@class, 'caleran-days')]"

            this.issuedate_select = "(//div[@class='caleran-day'])[198]"

            this.expirydate_field = "//input[@id='id_expiry_date']"

            this.expirydate_yearclick = "//body[1]/div[23]/div[2]/div[2]/div[1]/div[1]/span[1]"

            this.expirydate_yearselect = "//div[@data-year='2030']"

            this.expirydate_select = "//body/div[23]/div[2]/div[2]/div[1]/div[2]/div[24]"

            this.identification_issue = "//select[@id='id_country_of_issue']"

            this.businessofficial_submit = "//button[@id='addSubmitButton']"

            this.saveDraft = "//button[@id='submitSaveAllKYC']"

            this.businessofficial_next = "(//button[normalize-space()='Next'])[4]"

            this.dialogbox = "//div[@id='swal2-content']"

            this.businessOfficials_fieldvalidations = "//label[contains(@id, '-error')]"


            const dataPath = path.join(__dirname, '../TestData/Onboarding_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
            
            this.data = this.dataset["Business Officials"]


        }


        async fillBusinessofficialdetails() {

            const firstName = faker.person.firstName()
            const lastName = faker.person.lastName()
            await this.page.click(this.businessoff_addnewbutton)  
            await this.page.locator(this.official_type).selectOption([
                { label: 'Director *' },
                { label: 'Shareholder *' }
            ])

            await this.page.fill(this.firstname, firstName)
            await this.page.fill(this.lastname, lastName)

            const filePath = path.join(__dirname, '../businessofficial.json');
            fs.writeFileSync(filePath, JSON.stringify({ fullName: `${firstName} ${lastName}` }))

            await this.page.fill(this.homeaddress, this.data.homeaddress)
            await this.page.fill(this.cityname, this.data.City)
            await this.page.fill(this.postcode, this.data.Postcode)
            const email = firstName+"@gmail.com"
            await this.page.fill(this.email, email)
            await this.page.fill(this.phone, this.data.Phone)
            await this.page.click(this.dateOfBirth_field)
            await this.page.click(this.year_click)
            await this.page.click(this.previous_year_arrow)
            await this.page.click(this.previous_year_arrow)
            await this.page.click(this.selectdob_year)
            await selectFutureDate(this.page)
            //await this.page.click(this.selectdob_day)
            await this.page.locator(this.nationality).selectOption({ label: this.data.Nationality })
            
            await this.page.locator(this.country_of_citizenship).selectOption({ label: this.data.Citizenship })
            await this.page.locator(this.country_of_birth).selectOption({ label: this.data.Birth })
            await this.page.locator(this.country_of_residence).selectOption({ label: this.data.Residence})
            await this.page.locator(this.identification_type).selectOption({ label: this.data.identificatn_type})
            await this.page.fill(this.identification_number, this.data.identificatn_no)

            await this.page.click(this.issuedate_field)
            //await this.page.click(this.issuedate_select)
            await selectPastDate(this.page, 3)


            await this.page.click(this.expirydate_field)
            await this.page.click(this.expirydate_yearclick)
            await this.page.click(this.expirydate_yearselect)
            //await this.page.click(this.expirydate_select)
            await selectFutureDate(this.page)

            await this.page.locator(this.identification_issue).selectOption({ label: this.data.identificatn_issue })
            await this.page.click(this.businessofficial_submit)
            await this.page.waitForTimeout(2000)
            await this.page.click(this.ok_button)
            await this.page.click(this.businessofficial_next)

            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            const expectedmessage = "Business officials have been successfully saved."
            expect(actualmessage?.trim()).toBe(expectedmessage)

        }

        async checkBusinessofficial_validations() {        

            await this.page.click(this.ok_button)
            await this.page.click(this.businessoff_addnewbutton)
            await this.page.click(this.businessofficial_submit)
            console.log("Validating Business official field validations....")
            const Total_validations = await this.page.locator(this.businessOfficials_fieldvalidations).all()
           
            expect(Total_validations.length).toBe(18)
            const Validation_text = await Total_validations[0].textContent()
            if (Total_validations.length === 18) {
                console.log(' For Business officials - All 18 validation messages are displayed as expected.')
                //console.log("validation message displayed is - "+Validation_text)
            }
            await this.page.waitForTimeout(2000)
            await this.page.reload()
        }




        async businessType_and_CompanyType_error() {     
            
            await this.page.waitForTimeout(3000)
            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()
            await this.page.waitForTimeout(3000)

            await this.page.click(this.businessOfficials_tab)
            await this.page.click(this.businessoff_addnewbutton)
            await expect(this.page.locator(this.business_and_companyType_error)).toBeVisible()
            await this.page.waitForTimeout(2000)
            await this.page.click(this.ok_button)
 
        }

    }

