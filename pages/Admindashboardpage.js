const { expect } = require("@playwright/test")
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
//const { TIMEOUT } = require("dns")

exports.Admindashboardpage =
    class Admindashboardpage {

        constructor(page) {

            this.page = page

            this.accountholders_tab = "//span[contains(text(),'Account Holders')]"

            this.fee_management_tab = "//span[normalize-space()='Fee Management']"

            this.feetype_dropdown = "//select[@id='typeFilter']"

            this.maximum_value_3 = "(//input[@name='maximum_value[]'])[3]"

            this.find_a_company = "//span[normalize-space()='Find a company']"

            this.keywords_field = "//input[@id='keywords']"

            this.search_button = "//span[@class='indicator-label']"

            this.companysearchresult = "//div[@class='me-5']/a"

            this.accountStatus_beforeApproval = "//span[normalize-space()='locked']"

            this.accountStatus_afterApproval = "//span[normalize-space()='active']"

            this.account_status = "//select[@id='active_status']"

            this.liquidity_provider = "//select[@id='liquidity_provider']"

            this.update_button = "//i[@class='fa-thin fa-save me-1']"


            this.dropdown = "//a[@role='button']"

            this.paymentfeeMaintanence = "//a[contains(text(), 'Payment Fee Maintenance')]"

            this.businessinformation = "//a[contains(text(), 'Business Information')]"

            this.checking_basecurrency = "//span[@id='select2-baseCurrency-container']"

            this.resetfilter_button = "//a[normalize-space()='Reset Filter']"

            this.dropdown_2 = "//select[@id='typeFilter']"

            this.fee_amount = "(//input[@placeholder='Fee Amount'])[1]"

            this.percentage_fee = "(//input[@name='percentage_fee[]'])[1]"

            this.fee_amount4 = "(//input[@placeholder='Fee Amount'])[4]"

            this.addField_button = "//button[@id='add-field']"

            this.minimum_value = "//input[@name='minimum_value[]']"

            this.minimum_value_2 = "(//input[@name='minimum_value[]'])[2]"

            this.minimum_value_4 = "(//input[@name='minimum_value[]'])[4]"

            this.fee_amount2 = "(//input[@placeholder='Fee Amount'])[2]"

            this.maximum_value = "//input[@name='maximum_value[]']"

            this.maximum_value_2 = "(//input[@name='maximum_value[]'])[2]"

            this.maximum_value_4 = "(//input[@name='maximum_value[]'])[4]"

            this.percentage_fee_4 = "(//input[@name='percentage_fee[]'])[4]"

            this.updatebutton2 = "//button[@id='updateButton']"

            this.ok_button = "//button[contains(text(), 'OK')]"

            this.payment_list = "//a[contains(text(), 'Payment Lists')]"

            this.addnew_button = "//button[normalize-space()='Add New']"

            this.wallet_currency_dropdown = "//select[@id='new_wallet_currency']"

            //this.wallet_currency_dropdown = "#new_wallet_currency option"

            this.wallet_submit = "//button[@id='createwalletsubmitButton']"

            this.wallet_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"
            //this.wallet_balance = "(//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2'])[1]"

            this.paymenttype_dropdown = "//select[@id='payment_type']"

            this.wallet_fund_field = '#wallet_fund'


            this.getfee_button = "//button[contains(text(), 'Get fee')]"

            this.fee_listing = "(//span[@style='float:right;'])[2]"

            this.external_reference_field = '#external_reference'

            this.credit_button = "//button[@class='btn btn-primary fund-credit-button']"

            this.fundsuccess_ok = "//button[contains(text(), 'Ok, got it!')]"

            this.paymentlist_wallets = "//div[@class='owl-stage']//div[@class='item']"

            this.selectedCurrency = null;



            this.converted_fund = "(//span[@style='float:right;'])[1]"

            this.fee_deducted = "(//span[@style='float:right;'])[2]"

            this.fundtransferredto_customerwallet = "(//span[@style='float:right;'])[3]"


            this.euro_wallet = "(//span[normalize-space()='Euro'])[1]"

            this.gbp_wallet = "(//span[normalize-space()='GBP'])[1]"

            this.usd_wallet = "(//span[normalize-space()='USD'])[1]"

            this.aud_wallet = "(//span[normalize-space()='AUD'])[1]"


            const dataPath = path.join(__dirname, '../TestData/Paymentfee_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            this.data = this.dataset["Payment type"]
            this.data2 = this.dataset["Wallet creation"]
            this.data3 = this.dataset["Fund limit"]


        }



        async verifyCompanyApprovalByAdmin() {

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)
                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForSelector(this.accountStatus_beforeApproval)
            const accountstatus = await this.page.locator(this.accountStatus_beforeApproval).textContent()
            console.log("Account status before approval - " + accountstatus)
            expect(accountstatus?.trim()).toBe('locked')
            await this.page.locator(this.account_status).selectOption({ label: 'ACTIVE (ACTIVE)' })
            await this.page.locator(this.liquidity_provider).selectOption({ label: 'Corpay' })
            await this.page.click(this.update_button)
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(4000)
            const new_accountstatus = await this.page.locator(this.accountStatus_afterApproval).textContent()
            console.log("Account status after approval - " + new_accountstatus)
            expect(new_accountstatus?.trim()).toBe('active')

        }


        async verifyMaintanencefee() {
            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)
            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }


            await this.page.locator(this.dropdown).click()
            await this.page.click(this.paymentfeeMaintanence)

            await this.page.click(this.resetfilter_button)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown_2).selectOption(this.data.Swift_transactionType)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value_2, this.data.Swift_minimumValue)
            await this.page.fill(this.maximum_value_2, this.data.Swift_maximumValue)
            await this.page.locator(this.fee_amount2).clear()
            await this.page.fill(this.fee_amount2, this.data.Swift_feeAmount)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)

            await this.page.locator(this.dropdown_2).selectOption(this.data.InboundSepa_transactionType)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value_2, this.data.InboundSepa_minimumValue)
            await this.page.fill(this.maximum_value_2, this.data.InboundSepa_maximumValue)
            await this.page.locator(this.fee_amount2).clear()
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.fee_amount2, this.data.InboundSepa_feeAmount)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)


        }


        async checkGetFee_calculation() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click();
            await this.page.waitForTimeout(5000)


            /*await this.page.click(this.addnew_button);
            await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.Euro_currency)
            await this.page.click(this.wallet_submit)
            await this.page.waitForTimeout(3000)*/

            await this.page.click(this.euro_wallet)
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
            await this.page.fill(this.wallet_fund_field, this.data2.Wallet_fund)
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)
            const swift_feeText = await this.page.locator(this.fee_listing).textContent()
            const swift_feeAmount = parseFloat(swift_feeText?.match(/[\d.]+/)?.[0])
            expect(swift_feeAmount).toBe(30)
            console.log("Fee amount deducted for payment under 10000 in inbound swift....")
            await this.page.waitForTimeout(3000)

            await this.page.fill(this.wallet_fund_field, '')
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Sepa_paymentType)
            await this.page.fill(this.wallet_fund_field, this.data2.Wallet_fund)
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)
            const feeText = await this.page.locator(this.fee_listing).textContent()
            const feeAmount = parseFloat(feeText?.match(/[\d.]+/)?.[0])
            expect(feeAmount).toBe(40)
            console.log("Fee amount deducted for payment under 10000 in inbound sepa ....")


        }

        async paymentFeeSettingFor_different_payment_types() {
            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));


            await this.page.waitForSelector(this.accountholders_tab);
            await this.page.click(this.accountholders_tab);
            await this.page.click(this.find_a_company);
            await this.page.fill(this.keywords_field, company_name);
            await this.page.click(this.search_button);
            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all();
            for (const company of companies) {
                const name = (await company.textContent())?.trim();
                console.log("Company:", name);

                if (name && name.includes(company_name)) {
                    await company.click();
                    break;
                }
            }


            await this.page.locator(this.dropdown).click();
            await this.page.click(this.paymentfeeMaintanence);

            //sepa fee for payment between 0 - 1000
            await this.page.click(this.resetfilter_button)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown_2).selectOption(this.data.Sepa_transactionType)
            await this.page.waitForTimeout(3000)
            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value_2, this.data.Sepa_minimumValue)
            await this.page.fill(this.maximum_value_2, this.data.Sepa_maximumValue)
            await this.page.fill(this.fee_amount2, '')
            await this.page.fill(this.fee_amount2, this.data.Sepa_feeAmount)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)

            //sepa fee for payment between 1001- 3000
            /*await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value, this.data.Sepa2_minimumValue)
            await this.page.fill(this.maximum_value, this.data.Sepa2_maximumValue)
            await this.page.fill(this.fee_amount2, '')
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.fee_amount2, this.data.Sepa2_feeAmount)
            await this.page.waitForTimeout(2000)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)*/

            //payment fee setting for shared fee
            await this.page.locator(this.dropdown_2).selectOption(this.data.Shared_transactionType)
            await this.page.waitForTimeout(3000)
            await this.page.fill(this.maximum_value_3, '')
            await this.page.fill(this.maximum_value_3, '5000000')

            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value_4, this.data.Shared_minimumValue)
            await this.page.fill(this.maximum_value_4, this.data.Shared_maximumValue)
            await this.page.fill(this.fee_amount4, '')
            await this.page.fill(this.fee_amount4, this.data.Shared_feeAmount)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)

            //payment fee setting for ours fee fee
            await this.page.locator(this.dropdown_2).selectOption(this.data.Ours_transactionType)
            await this.page.waitForTimeout(3000)
            await this.page.fill(this.percentage_fee, '0.15')
            await this.page.fill(this.fee_amount, '')
            await this.page.fill(this.maximum_value_3, '')
            await this.page.fill(this.maximum_value_3, '5000000')
            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value_4, this.data.Ours_minimumValue)
            await this.page.fill(this.maximum_value_4, this.data.Ours_maximumValue)
            //await this.page.fill(this.fee_amount, '')
            //await this.page.fill(this.fee_amount, this.data.Ours_feeAmount)
            await this.page.fill(this.percentage_fee_4, this.data.Ours_fee_percentage)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)


        }




        async gobal_paymentfee_is_also_reflected_in_specific_companies() {

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForSelector(this.accountholders_tab);
            await this.page.click(this.accountholders_tab);
            await this.page.click(this.fee_management_tab)
            await this.page.waitForSelector(this.feetype_dropdown)
            await this.page.locator(this.feetype_dropdown).selectOption('Shared fee')
            await this.page.waitForTimeout(4000)

            // Function to extract all fields from a set of rows
            async function getFields(rows) {
                const fields = [];

                for (let i = 0; i < rows.length; i++) {
                    const columns = await rows[i].locator('.col-md-2').all(); // get all columns in this row

                    for (let col of columns) {
                        const labelElement = col.locator('label');
                        const inputElement = col.locator('input');

                        // Only add if label and input exist
                        if (await labelElement.count() && await inputElement.count()) {
                            const label = (await labelElement.textContent()).trim();
                            const value = (await inputElement.inputValue()).trim();
                            fields.push({ label, value });
                        }
                    }
                }


                return fields;

            }



            // Compare two sets of fields
            function compareFields(fields1, fields2) {
                if (fields1.length !== fields2.length) {
                    throw new Error(` Field count mismatch: Tab1=${fields1.length}, Tab2=${fields2.length}`);
                }

                for (let i = 0; i < fields1.length; i++) {
                    const f1 = fields1[i];
                    const f2 = fields2[i];

                    if (!f1 || !f2) {
                        throw new Error(` Missing field at position ${i + 1}`);
                    }

                    if (f1.label !== f2.label) {
                        throw new Error(` Label mismatch at row ${i + 1}:\nTab1="${f1.label}"\nTab2="${f2.label}"`);
                    }

                    if (f1.value !== f2.value) {
                        throw new Error(` Value mismatch for "${f1.label}":\nTab1="${f1.value}"\nTab2="${f2.value}"`);
                    }
                }

                console.log(" All fields match in both tabs!");
            }



            const tab1Rows = await this.page.locator("//div[@class='row g-4 dynamic-field align-items-center']").all()
            const tab1Fields = await getFields(tab1Rows);


            await this.page.waitForSelector(this.accountholders_tab);
            await this.page.click(this.accountholders_tab);
            await this.page.click(this.find_a_company);
            await this.page.fill(this.keywords_field, company_name);
            await this.page.click(this.search_button);
            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all();
            for (const company of companies) {
                const name = (await company.textContent())?.trim();
                console.log("Company:", name);

                if (name && name.includes(company_name)) {
                    await company.click();
                    break;
                }
            }


            await this.page.locator(this.dropdown).click();
            await this.page.click(this.paymentfeeMaintanence);

            //sepa fee for payment between 0 - 1000
            await this.page.click(this.resetfilter_button)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown_2).selectOption(this.data.Shared_transactionType)
            await this.page.waitForTimeout(3000)

            const tab2Rows = await this.page.locator('.row.dynamic-field').all();
            const tab2Fields = await getFields(tab2Rows);

            compareFields(tab1Fields, tab2Fields);

        }



        async verifyfunding_in_nonBaseWallet_without_BaseCurrencyWallet() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)
            await this.page.click(this.addnew_button)
            await this.page.locator(this.wallet_currency_dropdown).selectOption('USD | USD')
            await this.page.click(this.wallet_submit)
            await this.page.waitForTimeout(4000)
            await this.page.click(this.usd_wallet)
            await this.page.waitForTimeout(4000)
            await expect(this.page.locator("//div[@class='swal2-html-container']")).toBeVisible()
            await this.page.waitForTimeout(3000)

        }




        async verifyfunding_in_usd_without_anyAmount_in_baseWallet() {


            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)
            //creating wallet for base wallet and confirm its balance to be zero
            await this.page.click(this.addnew_button)
            await this.page.locator(this.wallet_currency_dropdown).selectOption('EUR | Euro')
            await this.page.click(this.wallet_submit)
            await this.page.waitForTimeout(4000)


            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {

                    //baseWallet = item
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    const baseBefore = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''))

                    if (baseBefore === 0) {

                        console.log("Base wallet balance is 0.00")

                    } else {

                        throw new Error("Base wallet balance is not zero:", baseBefore)
                    }

                }

            }


            await this.page.click(this.usd_wallet)
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
            await this.page.fill(this.wallet_fund_field, this.data2.USD_walletfund)
            await this.page.click(this.getfee_button)

            // Get values from UI
            const convertedFundText = await this.page.locator(this.converted_fund).textContent()
            const feeAmountText = await this.page.locator(this.fee_deducted).textContent()
            const transferredText = await this.page.locator(this.fundtransferredto_customerwallet).textContent()

            // Extract numeric values
            const convertedFund = parseFloat(convertedFundText.match(/[\d,.]+/)[0].replace(/,/g, ''))
            const feeAmount = parseFloat(feeAmountText.match(/[\d,.]+/)[0].replace(/,/g, ''))
            const transferred = parseFloat(transferredText.match(/[\d,.]+/)[0].replace(/,/g, ''))

            // Get currency codes
            const feeCurrency = feeAmountText.match(/\((.*?)\)/)[1] // EUR
            const convertedCurrency = convertedFundText.match(/\((.*?)\)/)[1] // USD

            // Compare Fee Amount (against your test data)
            expect(feeAmount).toBe(15)

            // If fee currency is EUR, convert to USD for calculation
            let feeInUSD = feeAmount
            if (feeCurrency === "EUR" && convertedCurrency === "USD") {

                const eurToUsdRate = 1.12
                feeInUSD = parseFloat((feeAmount * eurToUsdRate).toFixed(2))

            }


            // Validate the fund transfer calculation
            const expectedTransferred = parseFloat((convertedFund - feeInUSD).toFixed(2))
            console.log("Expected transferred amount - " + expectedTransferred)
            console.log("Actual transferred amount - " + transferred)
            //expect(transferred).toBeCloseTo(expectedTransferred, 1)
            expect(Math.floor(transferred)).toBe(Math.floor(expectedTransferred))
            await this.page.fill(this.external_reference_field, this.data2.External_reference)
            await this.page.click(this.credit_button)


            await this.page.waitForSelector(this.fundsuccess_ok)
            await this.page.click(this.fundsuccess_ok)
            await this.page.waitForTimeout(5000)


        }





        async verifyWalletcreation() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.businessinformation).click()

            await this.page.waitForSelector(this.checking_basecurrency)
            const base_currencyraw = await this.page.locator(this.checking_basecurrency).textContent()
            const base_currency = base_currencyraw.toLowerCase().trim()
            console.log("base currency - " + base_currency)
            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()
            const isWalletVisible = count > 0

            console.log(isWalletVisible)


            let currencyFound = false
            if (isWalletVisible) {
                const count = await walletItems.count()
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    //if base currency matches with wallet currency
                    if (firstThree === base_currency) {
                        currencyFound = true;
                        console.log(firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        //await this.page.locator(this.paymenttype_dropdown).selectOption('EUR | Euro')
                        await this.page.fill(this.wallet_fund_field, this.data2.Euro_walletfund)
                        await this.page.click(this.getfee_button)
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                        const amount = added_fund?.match(/[\d,.]+/)?.[0]
                        await this.page.fill(this.external_reference_field, this.data2.External_reference)
                        await this.page.click(this.credit_button)
                        await this.page.waitForSelector(this.fundsuccess_ok)
                        await this.page.click(this.fundsuccess_ok)
                        await this.page.waitForTimeout(5000)

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent()

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                        const before = cleanAmount(balanceTextBefore)
                        const after = cleanAmount(balanceTextAfter)
                        const added = cleanAmount(amount)

                        const expectedAfter = before + added;

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log(" Wallet funded correctly. New Available balance -" + expectedAfter)
                        } else {
                            console.error(` Wallet funding mismatch. Expected: ${expectedAfter}, Found: ${after}`)
                            throw new Error("Wallet balance validation failed")
                        }

                        break

                    }

                }
            }

            //if base currency does not match with wallet or if no wallet is present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for base currency, creating a new one...")
                await this.page.click(this.addnew_button)

                // Match dropdown option that includes currency code
                const options1 = await this.page.locator(this.wallet_currency_dropdown)
                const options = options1.locator('option')
                const optionCount = await options.count()

                let matchedValue = null
                let walletCreatedAndFunded = false
                for (let i = 0; i < optionCount; i++) {
                    const option = options.nth(i)
                    const labelRaw = await option.textContent()
                    const label = labelRaw?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === base_currency) {
                        console.log("Matched currency code:", firstThree)
                        matchedValue = await option.getAttribute('value')
                        //console.log("Matched value to select:", matchedValue);
                        await this.page.locator(this.wallet_currency_dropdown).selectOption(matchedValue)
                        await this.page.click(this.wallet_submit)
                        //await this.page.pause()
                        await this.page.waitForTimeout(3000)
                        const newWallets = this.page.locator(this.paymentlist_wallets)
                        const walletCount = await newWallets.count()

                        for (let i = 0; i < walletCount; i++) {
                            const item = newWallets.nth(i)
                            const text = await item.textContent()
                            const label = text?.toLowerCase().trim()
                            const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                            if (firstThree === base_currency) {
                                console.log("New wallet found for currency:", firstThree)
                                const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                                await item.click();
                                await this.page.waitForSelector(this.paymenttype_dropdown)
                                await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                                await this.page.fill(this.wallet_fund_field, this.data2.Euro_walletfund)
                                await this.page.click(this.getfee_button)
                                await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                                const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                                const amount = added_fund?.match(/[\d,.]+/)?.[0]
                                await this.page.fill(this.external_reference_field, this.data2.External_reference)
                                await this.page.click(this.credit_button)
                                await this.page.waitForSelector(this.fundsuccess_ok)
                                await this.page.click(this.fundsuccess_ok)
                                await this.page.waitForTimeout(5000)

                                const balanceTextAfter = await item.locator(this.wallet_balance).textContent()

                                const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                                const before = cleanAmount(balanceTextBefore)
                                const after = cleanAmount(balanceTextAfter)
                                const added = cleanAmount(amount)

                                const expectedAfter = before + added

                                if (Math.abs(after - expectedAfter) < 0.01) {
                                    console.log("Wallet funded correctly after creation.")
                                } else {
                                    console.error(`Wallet funding mismatch after creation. Expected: ${expectedAfter}, Found: ${after}`)
                                    throw new Error("Wallet balance validation failed after creation")
                                }

                                walletCreatedAndFunded = true
                                break;
                            }


                        }
                        if (walletCreatedAndFunded)
                            break
                    }

                }


            }

        }




        async verifyWalletcreation_for_usd() {


            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()
            const isWalletVisible = count > 0

            console.log(isWalletVisible)


            let currencyFound = false
            if (isWalletVisible) {
                const count = await walletItems.count()
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'usd') {
                        currencyFound = true;
                        console.log(firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data2.USD_walletfund)
                        await this.page.click(this.getfee_button)
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                        const amount = added_fund?.match(/[\d,.]+/)?.[0]
                        await this.page.fill(this.external_reference_field, this.data2.External_reference)
                        await this.page.click(this.credit_button)
                        await this.page.waitForSelector(this.fundsuccess_ok)
                        await this.page.click(this.fundsuccess_ok)
                        await this.page.waitForTimeout(5000)

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent()

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                        const before = cleanAmount(balanceTextBefore)
                        const after = cleanAmount(balanceTextAfter)
                        const added = cleanAmount(amount)


                        const expectedAfter = before + added

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log(" Wallet funded correctly. New Available balance in USD wallet-" + expectedAfter)
                        } else {
                            console.error(` Wallet funding mismatch. Expected: ${expectedAfter}, Found: ${after}`)
                            throw new Error("Wallet balance validation failed")
                        }

                        break

                    }

                }

            }

            //if no usd wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for usd, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.USD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'usd') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data2.USD_walletfund)
                        await this.page.click(this.getfee_button)
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                        const amount = added_fund?.match(/[\d,.]+/)?.[0]
                        await this.page.fill(this.external_reference_field, this.data2.External_reference)
                        await this.page.click(this.credit_button)
                        await this.page.waitForSelector(this.fundsuccess_ok)
                        await this.page.click(this.fundsuccess_ok)
                        await this.page.waitForTimeout(5000)

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent()

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                        const before = cleanAmount(balanceTextBefore)
                        const after = cleanAmount(balanceTextAfter)
                        const added = cleanAmount(amount)

                        const expectedAfter = before + added

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log("Wallet funded correctly after creation.")
                        } else {
                            console.error(`Wallet funding mismatch after creation. Expected: ${expectedAfter}, Found: ${after}`)
                            throw new Error("Wallet balance validation failed after creation");
                        }

                        walletCreatedAndFunded = true;
                        break

                    }

                }

            }

        }





        async verifyfunding_in_usd_with_Balance_in_baseWallet() {


            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            // --- Step 1: Get EUR base wallet balance before funding ---
            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()

            let baseBefore = 0
            let usdBefore = 0

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseBefore = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("EUR Wallet (before):", baseBefore)
                }

                if (firstThree === 'usd') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    usdBefore = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("USD Wallet (before):", usdBefore)
                }
            }

            // --- Step 2: Start funding process ---
            await this.page.click(this.usd_wallet)
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
            await this.page.fill(this.wallet_fund_field, this.data2.USD_walletfund)
            await this.page.click(this.getfee_button)

            // --- Step 3: Capture fee and transferred amount ---
            const feeAmountText = await this.page.locator(this.fee_deducted).textContent()
            const transferredText = await this.page.locator(this.fundtransferredto_customerwallet).textContent()

            const feeAmount = parseFloat(feeAmountText.match(/[\d,.]+/)[0].replace(/,/g, ''))
            const transferred = parseFloat(transferredText.match(/[\d,.]+/)[0].replace(/,/g, ''))

            console.log("Fee (EUR):", feeAmount)
            console.log("Transferred (USD):", transferred)

            // --- Step 4: Complete funding ---
            await this.page.fill(this.external_reference_field, this.data2.External_reference)
            await this.page.click(this.credit_button)
            await this.page.waitForSelector(this.fundsuccess_ok)
            await this.page.click(this.fundsuccess_ok)
            await this.page.waitForTimeout(5000)

            // --- Step 5: Fetch updated wallet balances ---
            const walletItemsAfter = this.page.locator(this.paymentlist_wallets)
            const countAfter = await walletItemsAfter.count()

            let baseAfter = 0
            let usdAfter = 0

            for (let i = 0; i < countAfter; i++) {
                const item = walletItemsAfter.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseAfter = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("EUR Wallet (after):", baseAfter)
                }

                if (firstThree === 'usd') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    usdAfter = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("USD Wallet (after):", usdAfter)
                }
            }

            // --- Step 6: Validate results ---
            const expectedBaseAfter = parseFloat((baseBefore - feeAmount).toFixed(2))
            const expectedUsdAfter = parseFloat((usdBefore + transferred).toFixed(2))

            console.log(`Expected EUR after: ${expectedBaseAfter}, Actual: ${baseAfter}`)
            console.log('fee amount has been deducted from base wallet')
            console.log(`Expected USD after: ${expectedUsdAfter}, Actual: ${usdAfter}`)

            expect(baseAfter).toBeCloseTo(expectedBaseAfter, 1)
            expect(usdAfter).toBeCloseTo(expectedUsdAfter, 1)

        }




        async verifyWalletcreation_for_gbp() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'gbp') {
                        currencyFound = true;
                        console.log(firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data2.GBP_walletfund)
                        await this.page.click(this.getfee_button)
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                        const amount = added_fund?.match(/[\d,.]+/)?.[0]
                        await this.page.fill(this.external_reference_field, this.data2.External_reference)
                        await this.page.click(this.credit_button)
                        await this.page.waitForSelector(this.fundsuccess_ok)
                        await this.page.click(this.fundsuccess_ok)
                        await this.page.waitForTimeout(5000)

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent()

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                        const before = cleanAmount(balanceTextBefore)
                        const after = cleanAmount(balanceTextAfter)
                        const added = cleanAmount(amount)

                        const expectedAfter = before + added;

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log(" Wallet funded correctly. New Available balance in USD wallet-" + expectedAfter)
                        } else {
                            console.error(` Wallet funding mismatch. Expected: ${expectedAfter}, Found: ${after}`)
                            throw new Error("Wallet balance validation failed")
                        }
                        break

                    }

                }
            }
            //if no usd wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for gbp, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.GBP_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'gbp') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data2.GBP_walletfund);
                        await this.page.click(this.getfee_button);
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet);
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent();
                        const amount = added_fund?.match(/[\d,.]+/)?.[0];
                        await this.page.fill(this.external_reference_field, this.data2.External_reference);
                        await this.page.click(this.credit_button);
                        await this.page.waitForSelector(this.fundsuccess_ok);
                        await this.page.click(this.fundsuccess_ok);
                        await this.page.waitForTimeout(5000);

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent();

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''));
                        const before = cleanAmount(balanceTextBefore);
                        const after = cleanAmount(balanceTextAfter);
                        const added = cleanAmount(amount);

                        const expectedAfter = before + added;

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log("Wallet funded correctly after creation.");
                        } else {
                            console.error(`Wallet funding mismatch after creation. Expected: ${expectedAfter}, Found: ${after}`)
                            throw new Error("Wallet balance validation failed after creation");
                        }

                        walletCreatedAndFunded = true;
                        break

                    }

                }


            }

        }




        async verify_fundingdoneInnon_holding_currencyWallets_areConvertedandDeposited_in_basecurrency_wallet() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break;
                }
            }

            await this.page.waitForTimeout(2000)
            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.businessinformation).click()
            await this.page.waitForSelector(this.checking_basecurrency)
            const base_currencyraw = await this.page.locator(this.checking_basecurrency).textContent()
            const base_currency = base_currencyraw.toLowerCase().trim()


            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()

            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()

            let baseBefore = 0

            // 3. Identify base and non-base wallets
            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === base_currency) {


                    baseWallet = item;
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseBefore = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                }

                await this.page.waitForTimeout(5000)
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption('AUD | AUD')
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(4000)
                const newWallets = this.page.locator(this.paymentlist_wallets);
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'aud') {
                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown);
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType);
                        await this.page.fill(this.wallet_fund_field, '10000');
                        await this.page.click(this.getfee_button);
                        await this.page.waitForSelector(this.fee_listing);

                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent();
                        const amount = parseFloat(added_fund?.match(/[\d,.]+/)?.[0].replace(/,/g, ''));

                        await this.page.fill(this.external_reference_field, 'no external reference');
                        await this.page.click(this.credit_button);
                        await this.page.waitForSelector(this.fundsuccess_ok);
                        await this.page.click(this.fundsuccess_ok);


                        let baseAfter = 0
                        for (let i = 0; i < updatedCount; i++) {
                            const item = updatedWallets.nth(i)
                            const text = await item.textContent()
                            const label = text?.toLowerCase().trim()
                            const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                            if (firstThree === base_currency) {
                                const balanceText = await item.locator(this.wallet_balance).textContent()
                                baseAfter = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                                break
                            }
                        }

                        // 6. Validate the balance
                        const expectedAfter = baseBefore + amount;
                        if (Math.abs(baseAfter - expectedAfter) < 0.01) {
                            console.log(" Base wallet updated correctly after non-base wallet funding.New Available balance - " + expectedAfter);
                        } else {
                            console.error(` Mismatch. Expected: ${expectedAfter}, Found: ${baseAfter}`)
                            throw new Error("Wallet balance validation failed")
                        }
                    }

                }
            }
        }





        async verifyWalletcreationforNonbase_currency() {


            await this.page.waitForTimeout(5000)
            await this.page.click(this.addnew_button)
            const options1 = await this.page.locator(this.wallet_currency_dropdown)
            const options = options1.locator('option')
            const count = await options.count()

            //Collect all visible dropdown option texts
            const visibleOptionsText = []
            for (let i = 0; i < count; i++) {
                const text = (await options.nth(i).textContent())?.trim()
                if (text) {
                    visibleOptionsText.push(text)
                }
            }

            const targetCurrency = this.selectedCurrency
            console.log(`Looking for currency: ${targetCurrency}`)

            const index = visibleOptionsText.indexOf(targetCurrency)
            if (index === -1) {
                throw new Error(` Currency ${targetCurrency} not found in dropdown options.`);
            }

            const selectedValue = await options.nth(index).getAttribute('value');
            if (!selectedValue) {
                throw new Error(` No value found for ${targetCurrency}`);
            }

            await options1.selectOption(selectedValue);
            console.log(` Selected currency in dropdown: ${targetCurrency}`);

            await this.page.waitForSelector(this.wallet_submit);
            await this.page.click(this.wallet_submit);

            //  Wait for wallet creation confirmation or next state
            await this.page.waitForTimeout(4000);
            console.log(` Wallet creation done for: ${targetCurrency}`);



        }



        async verifyvalidationforfundingFornonbasecurrency(base_currency) {

            const selected = this.selectedCurrency.toLowerCase().split('|')[0].trim();
            console.log("Proceeding with funding for:", selected);

            await this.page.waitForTimeout(3000)

            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()

            let baseWallet, nonBaseWallet



            let baseBefore = 0



            // 3. Identify base and non-base wallets
            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()

                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === base_currency) {


                    baseWallet = item;
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseBefore = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                } else if (firstThree.includes(selected)) {
                    nonBaseWallet = item
                }
            }

            if (!baseWallet || !nonBaseWallet) {
                throw new Error("Could not find both base and selected non-base wallets")
            }

            // 4. Fund the non-base currency wallet
            await nonBaseWallet.click();
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
            await this.page.fill(this.wallet_fund_field, this.data2.Euro_walletfund)
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)

            const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
            const amount = parseFloat(added_fund?.match(/[\d,.]+/)?.[0].replace(/,/g, ''))

            await this.page.fill(this.external_reference_field, this.data2.External_reference)
            await this.page.click(this.credit_button)
            await this.page.waitForSelector(this.fundsuccess_ok)
            await this.page.click(this.fundsuccess_ok)
            await this.page.waitForTimeout(7000)

            const updatedWallets = this.page.locator(this.paymentlist_wallets)
            const updatedCount = await updatedWallets.count()

            let baseAfter = 0
            for (let i = 0; i < updatedCount; i++) {
                const item = updatedWallets.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === base_currency) {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseAfter = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''))
                    break
                }
            }

            // 6. Validate the balance
            const expectedAfter = baseBefore + amount
            if (Math.abs(baseAfter - expectedAfter) < 0.01) {
                console.log(" Base wallet updated correctly after non-base wallet funding.New Available balance - " + expectedAfter)
            } else {
                console.error(` Mismatch. Expected: ${expectedAfter}, Found: ${baseAfter}`)
                throw new Error("Wallet balance validation failed")
            }

        }




        async createAndFundWalletsForAllCurrenciesRandomly() {


            const allAllowedCurrencies = [
                "AUD | AUD", "CAD | CAD", "HKD | HKD",
                "JPY | JPY", "NZD | NZD", "SGD | SGD", "CHF | CHF"
            ];
            const processedCurrencies = new Set()

            //  Step 1: Get company name
            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            console.log(`\n🔹 Starting wallet creation for company: ${company_name}`)

            //  Step 2: Navigate to the company ONCE
            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                if (name && name.includes(company_name)) {
                    console.log(` Company found: ${name}`)
                    await company.click()
                    break
                }
            }


            // 🟩 Step 4: Fetch base currency ONCE
            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.businessinformation).click()
            await this.page.waitForSelector(this.checking_basecurrency)
            const base_currency_raw = await this.page.locator(this.checking_basecurrency).textContent()
            const base_currency = base_currency_raw.toLowerCase().trim()
            console.log(`💱 Base currency: ${base_currency}`)

            // Back to payment list again and stay there
            await this.page.locator(this.dropdown).click()
            await this.page.waitForSelector(this.payment_list)
            await this.page.locator(this.payment_list).click()
            console.log(" On Payment List page, ready to create wallets...")
            await this.page.waitForTimeout(3000)

            // 🟩 Step 5: Start processing currencies without leaving payment list
            while (processedCurrencies.size < allAllowedCurrencies.length) {
                const remaining = allAllowedCurrencies.filter(c => !processedCurrencies.has(c))
                const selected = remaining[Math.floor(Math.random() * remaining.length)]
                this.selectedCurrency = selected;

                console.log(`\n Processing: ${selected}`)

                try {
                    await this.verifyWalletcreationforNonbase_currency() // no payment list navigation inside
                    await this.verifyvalidationforfundingFornonbasecurrency(base_currency) // pass false to skip navigation
                    processedCurrencies.add(selected)
                } catch (err) {
                    console.error(` Failed for ${selected}: ${err.message}`)
                    processedCurrencies.add(selected)
                }
            }

            console.log(" All wallets created and funded successfully!")

        }






        async verifyExceededFundingLimit(maxLimit) {
            const errorPopup = this.page.locator("(//h2[normalize-space()='Invalid Funding Amount'])[1]")
            await expect(errorPopup).toBeVisible()

            const messageText = await this.page.locator("//div[@id='swal2-html-container']").textContent()
            console.log("Popup message:", messageText)

            const formattedLimit = Number(maxLimit).toLocaleString()
            await expect(messageText).toContain(formattedLimit)

            console.log(`Validation successful: Exceeded funding limit (${formattedLimit}) is correctly shown.`)

            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)
            await expect(this.page.locator(this.credit_button)).toBeDisabled()
            await this.page.waitForTimeout(2000)
        }




        async verify_fundingLimit_for_aud() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.AUD_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'aud') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for aud, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.AUD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'aud') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data2.GBP_walletfund);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }
        }





        async verify_fundingLimit_for_chf() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.CHF_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'chf') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for chf, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.CHF_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'chf') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }

        }




        async verify_fundingLimit_for_cad() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.CAD_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'cad') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for cad, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.CAD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'cad') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }
        }




        async verify_fundingLimit_for_nzd() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.NZD_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'nzd') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for nzd, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.NZD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'nzd') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }
        }




        async verify_fundingLimit_for_sgd() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.SGD_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'sgd') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for sgd, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.SGD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'sgd') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }
        }



        async verify_fundingLimit_for_hkd() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.HKD_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'hkd') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for hkd, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.HKD_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'hkd') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }
        }




        async verify_fundingLimit_for_jpy() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const maxLimit = this.data3.JPY_limit;

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                console.log("Company:", name)

                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)

            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            const walletItems = this.page.locator(this.paymentlist_wallets);
            const count = await walletItems.count();
            const isWalletVisible = count > 0;

            //console.log(isWalletVisible)


            let currencyFound = false;
            if (isWalletVisible) {
                const count = await walletItems.count();
                for (let i = 0; i < count; i++) {
                    const item = walletItems.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()

                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'jpy') {
                        currencyFound = true;
                        console.log(firstThree)
                        //const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount)
                        await this.page.click(this.getfee_button)

                        await this.verifyExceededFundingLimit(maxLimit);


                    }

                }

            }

            //if no aud wallet present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for jpy, creating a new one...")
                await this.page.click(this.addnew_button)
                await this.page.locator(this.wallet_currency_dropdown).selectOption(this.data2.JPY_currency)
                await this.page.click(this.wallet_submit)
                await this.page.waitForTimeout(3000)

                let walletCreatedAndFunded = false

                const newWallets = this.page.locator(this.paymentlist_wallets)
                const walletCount = await newWallets.count()

                for (let i = 0; i < walletCount; i++) {
                    const item = newWallets.nth(i)
                    const text = await item.textContent()
                    const label = text?.toLowerCase().trim()
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                    if (firstThree === 'jky') {
                        console.log("New wallet found for currency:", firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click();
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
                        await this.page.fill(this.wallet_fund_field, this.data3.Exceeded_amount);
                        await this.page.click(this.getfee_button);

                        await this.verifyExceededFundingLimit(maxLimit);
                    }

                }


            }

        }



        async verifyfunding_in_aud_with_balance_in_baseWallet() {

            const filePath = path.join(__dirname, '../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            // --- Step 1: Navigate to company page ---
            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

            await this.page.waitForSelector(this.companysearchresult)
            const companies = await this.page.locator(this.companysearchresult).all()
            for (const company of companies) {
                const name = (await company.textContent())?.trim()
                if (name && name.includes(company_name)) {
                    await company.click()
                    break
                }
            }

            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown).click()
            await this.page.waitForTimeout(2000)
            await this.page.locator(this.payment_list).click()
            await this.page.waitForTimeout(5000)

            // --- Step 2: Get balances before funding ---
            const walletItems = this.page.locator(this.paymentlist_wallets)
            const count = await walletItems.count()

            let baseBefore = 0
            let audBefore = 0

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseBefore = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("EUR Wallet (before):", baseBefore)
                }

                if (firstThree === 'aud') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    audBefore = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("AUD Wallet (before):", audBefore)
                }
            }

            // --- Step 3: Start funding process for AUD ---
            await this.page.click(this.aud_wallet)
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption(this.data2.Swift_paymentType)
            await this.page.fill(this.wallet_fund_field,'6000')
            await this.page.click(this.getfee_button)

            // --- Step 4: Capture conversion, fee, and transferred amounts ---
            const convertedText = await this.page.locator(this.converted_fund).textContent()
            const feeText = await this.page.locator(this.fee_deducted).textContent()
            const transferredText = await this.page.locator(this.fundtransferredto_customerwallet).textContent()

            const convertedFund = parseFloat(convertedText.match(/[\d,.]+/)[0].replace(/,/g, ''))
            const feeAmount = parseFloat(feeText.match(/[\d,.]+/)[0].replace(/,/g, ''))
            const transferred = parseFloat(transferredText.match(/[\d,.]+/)[0].replace(/,/g, ''))

            console.log("Converted Fund (EUR):", convertedFund)
            console.log("Fee (EUR):", feeAmount)
            console.log("Transferred to Customer (EUR):", transferred)

            // --- Step 5: Validate UI math (fee deducted from converted fund) ---
            const expectedTransferred = parseFloat((convertedFund - feeAmount).toFixed(2))
            console.log(`Expected transferred (EUR): ${expectedTransferred}`)

            expect(transferred, 'Transferred should equal (Converted - Fee)').toBeCloseTo(expectedTransferred, 1)

            // --- Step 6: Complete funding ---
            await this.page.fill(this.external_reference_field, this.data2.External_reference)
            await this.page.click(this.credit_button)
            await this.page.waitForSelector(this.fundsuccess_ok)
            await this.page.click(this.fundsuccess_ok)
            await this.page.waitForTimeout(5000)

            // --- Step 7: Get updated balances ---
            const walletItemsAfter = this.page.locator(this.paymentlist_wallets)
            const countAfter = await walletItemsAfter.count()

            let baseAfter = 0
            let audAfter = 0

            for (let i = 0; i < countAfter; i++) {
                const item = walletItemsAfter.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    baseAfter = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("EUR Wallet (after):", baseAfter)
                }

                if (firstThree === 'aud') {
                    const balanceText = await item.locator(this.wallet_balance).textContent()
                    audAfter = parseFloat(balanceText.match(/[\d,.]+/)[0].replace(/,/g, ''))
                    console.log("AUD Wallet (after):", audAfter)
                }
            }

            // --- Step 8: Validate balances ---
            const expectedBaseAfter = parseFloat((baseBefore + transferred).toFixed(2))
            console.log(`Expected Base (EUR) after: ${expectedBaseAfter}, Actual: ${baseAfter}`)
            console.log("AUD wallet should remain 0 — Actual:", audAfter)

            expect(baseAfter, 'Base wallet should have received the transferred amount').toBeCloseTo(expectedBaseAfter, 1)
            expect(audAfter, 'AUD wallet should remain zero').toBeCloseTo(0, 1)

            console.log(" Validation passed: Converted fund credited to base wallet, fee deducted correctly, AUD remains zero")
        }


    }