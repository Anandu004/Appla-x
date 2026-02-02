const { expect } = require("@playwright/test")
const { error } = require("console")
const path = require('path');
const fs = require('fs');
//const { TIMEOUT } = require("dns")

exports.Dashboardpage =
    class Dashboardpage {

        constructor(page) {

            this.page = page

            this.ok_button = "button.swal2-confirm"
            //this.ok_button = "//button[@class='swal2-confirm swal2-styled']"

            this.appla_x_logo = "//img[@class='h-45px theme-light-show']"

            this.hamburger_menu = "(//button[@class='btn btn-sm'])[2]"

            this.register_company_button = "div[class='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-3 show'] a[class='menu-link px-3 text-capitalize fs-7']"

            this.complete_kyc_button = "//a[@class = 'btn btn-danger m-2']"

            this.Account_locked_status = "//h1[normalize-space()='Account Locked - KYC In review']"

            this.new_walletCreation_card = "//div[@class='card-body d-flex justify-content-between align-items-start flex-column']"

            this.walletCurrency_dropdown = "//select[@id='new_wallet_currency']"

            this.createWallet_button = "//button[@id='submitButton']"

            this.wallet_ok_button = "//button[@class='swal2-confirm swal2-styled']"

            this.wallet_Lists = "//div[@class='owl-stage']//div[@class='item']"

            this.transaction_tab = "//a[normalize-space()='Transactions']"

            this.add_funds_tab = "//a[normalize-space()='Add Funds']"

            this.make_payment_tab = "//a[normalize-space()='Make Payment']"

            this.convert_funds_tab = "//a[normalize-space()='Convert Funds']"

            this.manage_beneficiaries_tab = "//a[normalize-space()='Manage Beneficiaries']"

            this.statement_button = "//button[normalize-space()='Statement']"

            this.export_statement_form = "//h5[@id='statementModalLabel']"

        }

        async appla_x_title() {
            await expect(this.page.locator(this.appla_x_logo)).toBeVisible()
            //await expect(this.page.locator(this.manage_beneficiaries_tab)).toBeVisible()
        }


        async clickOnRegister_a_company() {
            await this.page.waitForTimeout(1000)
            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false);
            if (okButtonVisible) {
                await this.page.click(this.ok_button);
            }
            await this.page.click(this.hamburger_menu)
            await this.page.waitForSelector(this.register_company_button)
            await this.page.click(this.register_company_button)

        }

        async clickOnCompleteKyc() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false);
            if (okButtonVisible) {

                await this.page.click(this.ok_button);
            }
            await this.page.waitForSelector(this.complete_kyc_button)
            await this.page.click(this.complete_kyc_button)
            await this.page.waitForTimeout(3000)
        }

        async new_account_Status_before_AdminApproval() {
            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false);
            if (okButtonVisible) {

                await this.page.click(this.ok_button);
            }
            //await this.page.waitForTimeout(2000)
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
            await this.page.locator(this.walletCurrency_dropdown).selectOption('QAR | QAR')
            await this.page.click(this.createWallet_button)
            await this.page.click(this.wallet_ok_button)

            let found = false
            const wallet_lists = await this.page.locator(this.wallet_Lists).all()
            for (const item of wallet_lists) {
                const text = await item.textContent()
                if (text.includes('QAR')) {
                    found = true
                    console.log(" QAR wallet successfully added.");
                    break
                }
            }
            if (!found) {
                console.error(" QAR wallet not found in wallet list.");
                throw new Error("Wallet creation failed: GBP not found.");
            }

        }

        async check_created_Wallet_is_populated_in_dashboard() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false)
            if (okButtonVisible) {

                await this.page.click(this.ok_button)
            }

            await this.page.click(this.new_walletCreation_card)
            await this.page.locator(this.walletCurrency_dropdown).selectOption('CZK | CZK')
            await this.page.click(this.createWallet_button)
            await this.page.click(this.wallet_ok_button)

            let wallet_created = false
            const wallet_list = await this.page.locator(this.wallet_Lists).all()
            for (const wallet of wallet_list) {
                const text = await wallet.textContent()
                if (text.includes('CZK')) {
                    wallet_created = true
                    console.log(' CZK Wallet is populated on the dashboard.');
                    break
                }
            }
            if (!wallet_created) {
                console.error(' CZK Wallet was not found in the dashboard.');
                throw new Error('Wallet creation validation failed.');
            }

        }

        async check_naviagtion_to_walletDetails_page() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false)
            if (okButtonVisible) {

                await this.page.click(this.ok_button)
            }


            await this.page.waitForTimeout(3000)
            const wallet_list = await this.page.locator(this.wallet_Lists).all()
            for (const wallet of wallet_list) {
                const text = await wallet.textContent()
                if (text.includes('CZK')) {
                    await wallet.click()
                    await this.page.waitForTimeout(3000)
                    break
                }
            }

            const tabs = [
                { locator: this.transaction_tab, name: "Transactions" },
                { locator: this.add_funds_tab, name: "Add Funds" },
                { locator: this.make_payment_tab, name: "Make Payment" },
                { locator: this.convert_funds_tab, name: "Convert Funds" },
                { locator: this.manage_beneficiaries_tab, name: "Manage Beneficiaries" },
            ]

            // Check each tab visibility and throw error if not visible
            for (const tab of tabs) {
                const isVisible = await this.page.locator(tab.locator).isVisible().catch(() => false);
                if (!isVisible) {
                    throw new Error(` Tab "${tab.name}" is not visible after wallet navigation.`);
                }
            }

            console.log(" User is naviagted to wallet details page on clicking wallet...");

        }


        async check_all_tabs_are_visile_in_walletDetails_page() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false)
            if (okButtonVisible) {

                await this.page.click(this.ok_button)
            }

            await this.page.waitForTimeout(3000)
            const wallet_list = await this.page.locator(this.wallet_Lists).all()
            for (const wallet of wallet_list) {
                const text = await wallet.textContent()
                if (text.includes('Euro')) {
                    await wallet.click()
                    await this.page.waitForTimeout(3000)
                    break
                }
            }

            const tabs = [
                { locator: this.transaction_tab, name: "Transactions" },
                { locator: this.add_funds_tab, name: "Add Funds" },
                { locator: this.make_payment_tab, name: "Make Payment" },
                { locator: this.convert_funds_tab, name: "Convert Funds" },
                { locator: this.manage_beneficiaries_tab, name: "Manage Beneficiaries" },
            ]

            // Check each tab visibility and throw error if not visible
            for (const tab of tabs) {
                const isVisible = await this.page.locator(tab.locator).isVisible().catch(() => false);
                if (!isVisible) {
                    throw new Error(` Tab "${tab.name}" is not visible after wallet navigation.`);
                }
            }

            console.log("✅ All tabs are visible under wallet details page...");

        }


        async check_statement_button_in_wallet() {

            const okButtonVisible = await this.page.locator(this.ok_button).isVisible().catch(() => false)
            if (okButtonVisible) {


                await this.page.click(this.ok_button)
            }


            await this.page.waitForTimeout(3000)
            const wallet_list = await this.page.locator(this.wallet_Lists).all()
            for (const wallet of wallet_list) {
                const text = await wallet.textContent()
                if (text.includes('CZK')) {
                    await wallet.click()
                    await this.page.waitForTimeout(3000)
                    break
                }
            }

            await expect(this.page.locator(this.statement_button)).toBeVisible()
            await this.page.locator(this.statement_button).click()

            await expect(this.page.locator(this.export_statement_form)).toBeVisible()

        }

        async check_homePage_redirects_to_walletPage() {

            await this.page.waitForTimeout(3000)
            const rows = await this.page.locator("table tbody tr").all()
            for (const row of rows) {
                const walletName = await row.locator('td:nth-child(2) span').first().textContent()
                if (walletName?.includes('Euro Wallet')) {

                    await row.locator("i.ki-outline.ki-arrow-right.fs-2").click()
                    await this.page.waitForTimeout(2000)
                    break

                }

            }

            await expect(this.page.locator("//span[@id='walletCurrency']")).toBeVisible();
            const wallet_logo = await this.page.locator("//span[@id='walletCurrency']").textContent()

            if(wallet_logo?.trim().includes('eur')){
                console.log('Successfully navigated to corresponding wallet...')
            }else{
                throw new Error('navigation failed...')
            }
        }

    }

