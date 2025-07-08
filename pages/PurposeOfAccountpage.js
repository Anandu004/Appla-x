const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")

exports.PurposeOfAccountpage =
    class PurposeOfAccountpage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"

            this.currencies = "//select[@id='currencies']"

            this.transaction_countries = "//select[@id='transaction_countries']"

            this.transaction_frequency = "//select[@id='transaction_frequency']"

            this.monthly_value = "//input[@id='hedging_transactions']"

            this.payment_service = "//select[@id='payment_products']"

            this.crossborder_transaction = "//input[@id='cross_boarder_transactions']"

            this.transaction_reason = "//select[@id='transaction_reasons']"

            this.lc_toggle = "//h3[normalize-space()='Letters of Credit (LC)']"

            this.lc_enable = "//input[@id='lc_account']"

            this.guarantees_toggle = "//i[@class='fa-duotone fa-file-certificate fs-2 me-3']"

            this.guarantees_enable = "//input[@id='guarantee_account']"

            this.purpose_nextbutton = "//button[normalize-space()='Next']"


            this.dialogbox = "//div[@id='swal2-html-container']"

        }


            async fillMulticurrencyAccounts() {

                await this.page.click(this.ok_button)
                await this.page.locator(this.currencies).selectOption({ label: 'EUR | Euro' });
                await this.page.locator(this.transaction_countries).selectOption({ label: 'Liberia' });
                await this.page.locator(this.transaction_frequency).selectOption({ label: 'Monthly' });
                await this.page.fill(this.monthly_value,"50000")
                await this.page.locator(this.payment_service).selectOption({ label: 'Mastercard Pre Paid Cards' });
                await this.page.fill(this.crossborder_transaction,"70000")
                await this.page.locator(this.transaction_reason).selectOption({ label: 'Cash invoices from client' });
                await this.page.click(this.lc_toggle)
                await this.page.click(this.lc_enable)
                await this.page.click(this.guarantees_toggle)
                await this.page.click(this.guarantees_enable)
                await this.page.click(this.purpose_nextbutton)
              
                

            }
        
    
    }
