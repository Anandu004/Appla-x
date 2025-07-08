const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');


exports.Makepaymentpage =
    class Makepaymentpage {

        constructor(page) {
            this.page = page

            this.eurowallet = "//span[normalize-space()='Euro']"

            this.aud_wallet = "//span[normalize-space()='AUD']"

            this.make_payment = "//a[normalize-space()='Make Payment']"

            this.amount = "//input[@name='amount']"



            this.beneficiary_name = "//select[@id='beneficiary']"

            this.beneficiary_field_error = "//label[@id='beneficiary-error']"

            this.insufficientBalance_error = "//label[@id='amount-error']"

            this.select_a_payer = "(//button[@class='btn btn-primary next-step'])[1]"


            this.payment_reason = "//select[@id='paymentReason']"

            this.payment_reference = "//input[@name='paymentReference']"

            this.review_payment = "//button[normalize-space()='Review Payment']"

            this.enter_otp = "//input[@id='otpInput']"

            this.get_otp_button = "//button[@id='getPaymentOtpBtn']"

            this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

            this.create_payment_button = "//button[@id='completedBtn']"


        }

        async verify_Payment_CannotbeDone_without_creating_benefeciary_for_corresponding_currency() {


            //const filePath = path.join(__dirname, '../beneficiary_company.json');
            //const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            //console.log(euro_beneficiary_company_name)

            await this.page.click(this.eurowallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, '300')
            await this.page.waitForTimeout(2000)

            console.log("Not choosing a beneficiary from dropdown")

            await this.page.click(this.select_a_payer)
            await expect(this.page.locator(this.beneficiary_field_error)).toBeVisible();
            const error_msg = await this.page.locator(this.beneficiary_field_error).textContent()
            console.log("cant proceed payment without beneficiary..")

        }

        async verifyPayment() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            console.log(euro_beneficiary_company_name)

            await this.page.click(this.eurowallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, '300')
            await this.page.waitForTimeout(2000)

            const optionLocator = this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(euro_beneficiary_company_name, 'i') });
            await expect(optionLocator).toBeVisible();
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.beneficiary_name).selectOption({ value });

            await this.page.click(this.select_a_payer)
            await this.page.locator(this.payment_reason).selectOption('Investment related payment')
            await this.page.fill(this.payment_reference, '6787')
            await this.page.click(this.review_payment)

            await this.page.waitForTimeout(4000)
            await this.page.click(this.get_otp_button)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.pause()
            await this.page.click(this.create_payment_button)

        }

        async verifypayment_can_be_created_without_having_any_amount_in_wallet() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            console.log(euro_beneficiary_company_name)

            await this.page.click(this.aud_wallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, '300')

            await expect(this.page.locator(this.insufficientBalance_error)).toBeVisible();

            const error_msg = await this.page.locator(this.insufficientBalance_error).textContent()
            console.log("error msg on amount field -" + error_msg)


        }


       
    }

