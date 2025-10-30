const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")
const path = require('path');
const fs = require('fs');

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';


exports.PurposeOfAccountpage =
    class PurposeOfAccountpage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"

            this.purpose_of_account_tab = "//a[normalize-space()='Purpose of Account']"

            this.multicurrency_account = "//input[@id='multi_currency_account']"

            this.currencies = "//select[@id='currencies']"

            this.transaction_countries = "//select[@id='transaction_countries']"

            this.transaction_frequency = "//select[@id='transaction_frequency']"

            this.monthly_value = "//input[@id='hedging_transactions']"

            this.payment_service = "//select[@id='payment_products']"

            this.crossborder_transaction = "//input[@id='cross_boarder_transactions']"

            this.transaction_reason = "//select[@id='transaction_reasons']"

            this.lc_toggle = "//h3[normalize-space()='Letters of Credit (LC)']"

            this.lc_enable = "//input[@id='lc_account']"

            this.guarantees_toggle = "(//i[@class='fa-duotone fa-file-certificate fs-2 me-3'])[2]"

            this.guarantees_enable = "//input[@id='guarantee_account']"

            this.purpose_nextbutton = "(//button[normalize-space()='Next'])[3]"

            this.PurposeOfAccount_validation = "//label[contains(@id, '-error')]"

            this.dialogbox = "//div[@id='swal2-html-container']"



            this.saveDraft = "//button[@id='submitSaveAllKYC']"

            this.userlogo = "(//p[@class='initial-text'])[1]"

            this.signOut = "//a[normalize-space()='Sign Out']"


            const dataPath = path.join(__dirname, '../TestData/Onboarding_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            this.data = this.dataset["Purpose of Account"]

        }


        async fillMulticurrencyAccounts() {

            //await this.page.click(this.ok_button)
            await this.page.locator(this.currencies).selectOption({ label: this.data.Currencies });
            await this.page.locator(this.transaction_countries).selectOption({ label: this.data.TransnCountries });
            await this.page.locator(this.transaction_frequency).selectOption({ label: this.data.TransnFrequency });
            await this.page.fill(this.monthly_value, this.data.Monthly_value)
            await this.page.locator(this.payment_service).selectOption({ label: this.data.Payment_service });
            await this.page.fill(this.crossborder_transaction, this.data.CrossBordertransn)
            await this.page.locator(this.transaction_reason).selectOption({ label: this.data.Transaction_reason });
            await this.page.click(this.lc_toggle)
            await this.page.click(this.lc_enable)
            await this.page.click(this.guarantees_toggle)
            await this.page.click(this.guarantees_enable)
            await this.page.click(this.purpose_nextbutton)

        }


        async fillMulticurrencyAccounts_EmptyFieldvalidation() {

            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)
            // await this.page.click(this.purpose_ofAccount_icon)
            await this.page.click(this.purpose_nextbutton)
            await this.page.waitForTimeout(3000)
            const errorMessage = this.page.locator('//label[@id="multi_currency_account-error"]');
            await expect(errorMessage).toHaveText("Please select at least one purpose of account")
            await this.page.click(this.multicurrency_account)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.purpose_nextbutton)
            await this.page.waitForTimeout(3000)

            //validation

            const allValidations = this.page.locator(this.PurposeOfAccount_validation)
            const visibleValidations = [];

            const count = await allValidations.count();
            for (let i = 0; i < count; i++) {
                const element = allValidations.nth(i);
                if (await element.isVisible()) {
                    visibleValidations.push(element);
                }
            }

            console.log('Visible validations:', visibleValidations.length);
            expect(visibleValidations.length).toBe(5);
            console.log(' For purpose of account - All 5 validation messages are displayed as expected.');

            const Validation_text = await visibleValidations[0].textContent();
            console.log("Validation message displayed is - " + Validation_text);
            await this.page.reload()

        }



        async savedraft_for_purposeOfAcoount_after_logOut() {

            await this.page.waitForTimeout(3000)
            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            await this.page.click(this.purpose_of_account_tab)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.currencies).selectOption({ label: this.data.Currencies });
            await this.page.locator(this.transaction_countries).selectOption({ label: this.data.TransnCountries });
            await this.page.locator(this.transaction_frequency).selectOption({ label: this.data.TransnFrequency });
            await this.page.fill(this.monthly_value, this.data.Monthly_value)
            await this.page.locator(this.payment_service).selectOption({ label: this.data.Payment_service });
            await this.page.fill(this.crossborder_transaction, this.data.CrossBordertransn)
            await this.page.locator(this.transaction_reason).selectOption({ label: this.data.Transaction_reason });

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
            await this.page.click(this.purpose_of_account_tab)

            await expect(this.page.locator(`${this.currencies}/option[@selected]`)).toHaveText(this.data.Currencies)
            await expect(this.page.locator(`${this.transaction_countries}/option[@selected]`)).toHaveText(this.data.TransnCountries)
            await expect(this.page.locator(`${this.transaction_frequency}/option[@selected]`)).toHaveText(this.data.TransnFrequency)
            await expect(this.page.locator(this.monthly_value)).toHaveValue(this.data.Monthly_value)
            await expect(this.page.locator(`${this.payment_service}/option[@selected]`)).toHaveText(this.data.Payment_service)
            await expect(this.page.locator(this.crossborder_transaction)).toHaveValue(this.data.CrossBordertransn)
            await expect(this.page.locator(`${this.transaction_reason}/option[@selected]`)).toHaveText(this.data.Transaction_reason)

        }


        async savedraft_for_purposeOfAcoount_after_refresh() {

            await this.page.waitForTimeout(3000)
            const dashboard = new Dashboardpage(this.page)
            await dashboard.clickOnCompleteKyc()

            await this.page.click(this.purpose_of_account_tab)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.currencies).selectOption('USD | USD')
            await this.page.locator(this.transaction_countries).selectOption({ label: this.data.TransnCountries })
            await this.page.locator(this.transaction_frequency).selectOption({ label: this.data.TransnFrequency })
            await this.page.fill(this.monthly_value, this.data.Monthly_value)
            await this.page.locator(this.payment_service).selectOption({ label: this.data.Payment_service })
            await this.page.fill(this.crossborder_transaction, this.data.CrossBordertransn)
            await this.page.locator(this.transaction_reason).selectOption({ label: this.data.Transaction_reason })

            await this.page.click(this.saveDraft)
            const draftMessageLocator = this.page.locator("//div[@id='draftMessage']")
            await expect(draftMessageLocator).toBeVisible()
            await expect(draftMessageLocator).toHaveText('Your changes have been saved.')

            await this.page.reload()

            await expect(this.page.locator(`${this.currencies}/option[@selected]`)).toHaveText('USD | USD')
            await expect(this.page.locator(`${this.transaction_countries}/option[@selected]`)).toHaveText(this.data.TransnCountries)
            await expect(this.page.locator(`${this.transaction_frequency}/option[@selected]`)).toHaveText(this.data.TransnFrequency)
            await expect(this.page.locator(this.monthly_value)).toHaveValue(this.data.Monthly_value)
            await expect(this.page.locator(`${this.payment_service}/option[@selected]`)).toHaveText(this.data.Payment_service)
            await expect(this.page.locator(this.crossborder_transaction)).toHaveValue(this.data.CrossBordertransn)
            await expect(this.page.locator(`${this.transaction_reason}/option[@selected]`)).toHaveText(this.data.Transaction_reason)

        }

    }
