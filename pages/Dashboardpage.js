const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")

exports.Dashboardpage =
    class Dashboardpage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"

            this.appla_x_logo = "//img[@class='h-45px theme-light-show']"

            this.hamburger_menu = "//i[@class='fa-duotone fa-bars fs-1']"

            this.register_company_button = "div[class='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-3 show'] a[class='menu-link px-3 text-capitalize fs-7']"

            this.complete_kyc_button = "//a[@class = 'btn btn-danger m-2']"

            this.Account_locked_status = "//h1[normalize-space()='Account Locked - KYC In review']"

            this.new_walletCreation_card = "//div[@class='card-body d-flex justify-content-between align-items-start flex-column']"

            this.walletCurrency_dropdown = "//select[@id='new_wallet_currency']"

            this.createWallet_button = "//button[@id='submitButton']"

            this.wallet_ok_button = "//button[@class='swal2-confirm swal2-styled']"

            this.wallet_Lists = "//div[@class='owl-stage']//div[@class='item']"


        }

        async appla_x_title() {
            await expect(this.page.locator(this.appla_x_logo)).toBeVisible()
        }


        async clickOnRegister_a_company() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false);
            if (okButtonVisible) {

                await this.page.click(this.ok_button);
            }
            await this.page.click(this.hamburger_menu)
            await this.page.click(this.register_company_button)

        }

        async clickOnCompleteKyc() {
            await this.page.waitForSelector(this.ok_button)
            await this.page.click(this.ok_button)
            await this.page.waitForSelector(this.complete_kyc_button)
            await this.page.click(this.complete_kyc_button)
            await this.page.waitForTimeout(3000)
        }

        async new_account_Status_before_AdminApproval() {
            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false);
            if (okButtonVisible) {

                await this.page.click(this.ok_button);
            }
            await this.page.waitForSelector(this.Account_locked_status)
            const accountstatus = await this.page.locator(this.Account_locked_status).textContent()
            console.log("Status of Account before admin approval-" + " " + accountstatus)
            expect(accountstatus?.trim()).toContain('Account Locked - KYC In review')


        }

        async new_account_Status_after_AdminApproval() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false)
            if (okButtonVisible) {

                await this.page.click(this.ok_button)
            }
            const isLockedStatusVisible = await this.page.locator(this.Account_locked_status).isVisible().catch(() => false)
            expect(isLockedStatusVisible).toBeFalsy()

            await expect(this.page.locator(this.new_walletCreation_card)).toBeVisible()
            console.log("New wallet creation card is visible..")
            console.log("Account activated successfully...")


        }

        async walletCreationFrom_ClientAccount() {

            await this.page.click(this.new_walletCreation_card)
            await this.page.locator(this.walletCurrency_dropdown).selectOption('CHF')
            await this.page.click(this.createWallet_button)
            await this.page.click(this.wallet_ok_button)

            let found=false
            const wallet_lists = await this.page.locator(this.wallet_Lists).all()
            for (const item of wallet_lists) {
                const text = await item.textContent()
                if (text.includes('CHF')) {
                    found = true
                    console.log(" CHF wallet successfully added.");
                    break
                }
            }
            if (!found) {
                console.error("❌ CHF wallet not found in wallet list.");
                throw new Error("Wallet creation failed: GBP not found.");
            }

        }

    }

