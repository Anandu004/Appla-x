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

            this.find_a_company = "//span[normalize-space()='Find a company']"

            this.keywords_field = "//input[@id='keywords']"

            this.search_button = "//span[@class='indicator-label']"

            this.companysearchresult = "//div[@class='me-5']/a"

            this.accountStatus_beforeApproval = "//h4[normalize-space()='Account Locked - KYC In review']"

            this.account_status = "//select[@id='active_status']"

            this.liquidity_provider = "//select[@id='liquidity_provider']"

            this.update_button = "//i[@class='fa-thin fa-save me-1']"



            this.dropdown = "//a[@role='button']"

            this.paymentfeeMaintanence = "//a[contains(text(), 'Payment Fee Maintenance')]"

            this.businessinformation = "//a[contains(text(), 'Business Information')]"

            this.checking_basecurrency = "//span[@id='select2-baseCurrency-container']"

            this.resetfilter_button = "//a[normalize-space()='Reset Filter']"

            this.dropdown_2 = "//select[@id='typeFilter']"

            this.fee_amount = "//input[@placeholder='Fee Amount']"

            this.fee_amount2 = "(//input[@placeholder='Fee Amount'])[2]"

            this.addField_button = "//button[@id='add-field']"

            this.minimum_value = "//input[@name='minimum_value[]']"

            this.maximum_value = "//input[@name='maximum_value[]']"

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



            this.fundtransferredto_customerwallet = "(//span[@style='float:right;'])[3]"

            this.euro_wallet = "(//span[normalize-space()='Euro'])[1]"


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
            const companies = await this.page.locator(this.companysearchresult).all();
            for (const company of companies) {
                const name = (await company.textContent())?.trim();
                console.log("Company:", name);

                if (name && name.includes(company_name)) {
                    await company.click();
                    break;
                }
            }

            await this.page.waitForSelector(this.account_status)
            const account_status = await this.page.locator(this.accountStatus_beforeApproval).textContent()
            console.log("Account status before approval - " + account_status)
            expect(account_status?.trim()).toBe('Account Locked - KYC In review')
            await this.page.locator(this.account_status).selectOption({ label: 'ACTIVE (ACTIVE)' });
            await this.page.locator(this.liquidity_provider).selectOption({ label: 'Corpay' });
            await this.page.click(this.update_button)
            await this.page.click(this.ok_button)


        }

        async verifyMaintanencefee() {
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

            await this.page.click(this.resetfilter_button)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.dropdown_2).selectOption('Inbound Swift');
            await this.page.fill(this.maximum_value,'10000')
            await this.page.locator(this.fee_amount).clear()
            await this.page.fill(this.fee_amount, '30');
            await this.page.click(this.updatebutton2);
            await this.page.click(this.ok_button);

            await this.page.locator(this.dropdown_2).selectOption('Inbound Sepa');
            await this.page.fill(this.maximum_value,'10000')
            await this.page.locator(this.fee_amount).clear()
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.fee_amount, '40');
            await this.page.click(this.updatebutton2);
            await this.page.click(this.ok_button);

        }

       
        async checkGetFee_calculation(){

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

            
            await this.page.click(this.addnew_button);
            await this.page.locator(this.wallet_currency_dropdown).selectOption('EUR | Euro')
            await this.page.click(this.wallet_submit)
            await this.page.waitForTimeout(3000)

            await this.page.click(this.euro_wallet)
            await this.page.waitForSelector(this.paymenttype_dropdown)
            await this.page.locator(this.paymenttype_dropdown).selectOption('swift')
            await this.page.fill(this.wallet_fund_field, '5000')
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)
            const swift_feeText = await this.page.locator(this.fee_listing).textContent()
            const swift_feeAmount = parseFloat(swift_feeText?.match(/[\d.]+/)?.[0])
            expect(swift_feeAmount).toBe(30)
            console.log("30 EURO deducted ....")
            await this.page.waitForTimeout(3000)

            await this.page.fill(this.wallet_fund_field, '')
            await this.page.locator(this.paymenttype_dropdown).selectOption('sepa')
            await this.page.fill(this.wallet_fund_field, '5000')
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)
            const feeText = await this.page.locator(this.fee_listing).textContent()
            const feeAmount = parseFloat(feeText?.match(/[\d.]+/)?.[0])
            expect(feeAmount).toBe(40)
             console.log("40 EURO deducted ....")
  

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
            await this.page.locator(this.dropdown_2).selectOption('Sepa fee')
            await this.page.fill(this.maximum_value,'1000')
            await this.page.fill(this.fee_amount,'')
            await this.page.fill(this.fee_amount, '25')
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)

            //sepa fee for payment between 1001- 3000
            await this.page.click(this.addField_button)
            await this.page.fill(this.minimum_value,'1001')
            await this.page.fill(this.maximum_value,'3000')
            await this.page.fill(this.fee_amount2,'')
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.fee_amount2, '30')
            await this.page.waitForTimeout(2000)
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)

            //payment fee setting for shared fee
            await this.page.locator(this.dropdown_2).selectOption('Shared fee')
            await this.page.fill(this.minimum_value,'1001')
            await this.page.fill(this.maximum_value,'3000')
            await this.page.fill(this.fee_amount,'')
            await this.page.fill(this.fee_amount, '40')
            await this.page.click(this.updatebutton2)
            await this.page.click(this.ok_button)
  
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
            await this.page.locator(this.payment_list).click();
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

                    //if base currency matches with wallet currency
                    if (firstThree === base_currency) {
                        currencyFound = true;
                        console.log(firstThree)
                        const balanceTextBefore = await item.locator(this.wallet_balance).textContent()

                        await item.click()
                        await this.page.waitForSelector(this.paymenttype_dropdown)
                        await this.page.locator(this.paymenttype_dropdown).selectOption('swift')
                        await this.page.fill(this.wallet_fund_field, '10000')
                        await this.page.click(this.getfee_button)
                        await this.page.waitForSelector(this.fundtransferredto_customerwallet)
                        const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
                        const amount = added_fund?.match(/[\d,.]+/)?.[0]
                        await this.page.fill(this.external_reference_field, 'no external reference')
                        await this.page.click(this.credit_button)
                        await this.page.waitForSelector(this.fundsuccess_ok)
                        await this.page.click(this.fundsuccess_ok)
                        await this.page.waitForTimeout(5000)

                        const balanceTextAfter = await item.locator(this.wallet_balance).textContent();

                        const cleanAmount = text => parseFloat(text.match(/[\d,.]+/)?.[0].replace(/,/g, ''));
                        const before = cleanAmount(balanceTextBefore);
                        const after = cleanAmount(balanceTextAfter);
                        const added = cleanAmount(amount);

                        const expectedAfter = before + added;

                        if (Math.abs(after - expectedAfter) < 0.01) {
                            console.log(" Wallet funded correctly. New Available balance -" + expectedAfter);
                        } else {
                            console.error(` Wallet funding mismatch. Expected: ${expectedAfter}, Found: ${after}`);
                            throw new Error("Wallet balance validation failed");
                        }
                        break;

                    }

                }
            }
            //if base currency does not match with wallet or if no wallet is present
            if (!currencyFound || !isWalletVisible) {
                console.log("Wallet not found for base currency, creating a new one...");
                await this.page.click(this.addnew_button);

                // Match dropdown option that includes currency code
                const options1 = await this.page.locator(this.wallet_currency_dropdown);
                const options = options1.locator('option')
                const optionCount = await options.count();

                let matchedValue = null;
                let walletCreatedAndFunded = false;
                for (let i = 0; i < optionCount; i++) {
                    const option = options.nth(i);
                    const labelRaw = await option.textContent();
                    const label = labelRaw?.toLowerCase().trim();
                    const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3);

                    if (firstThree === base_currency) {
                        console.log("Matched currency code:", firstThree);
                        matchedValue = await option.getAttribute('value');
                        //console.log("Matched value to select:", matchedValue);
                        await this.page.locator(this.wallet_currency_dropdown).selectOption(matchedValue);
                        await this.page.click(this.wallet_submit)
                        //await this.page.pause()
                        await this.page.waitForTimeout(3000)
                        const newWallets = this.page.locator(this.paymentlist_wallets);
                        const walletCount = await newWallets.count();

                        for (let i = 0; i < walletCount; i++) {
                            const item = newWallets.nth(i);
                            const text = await item.textContent();
                            const label = text?.toLowerCase().trim();
                            const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3);

                            if (firstThree === base_currency) {
                                console.log("New wallet found for currency:", firstThree);
                                const balanceTextBefore = await item.locator(this.wallet_balance).textContent();

                                await item.click();
                                await this.page.waitForSelector(this.paymenttype_dropdown);
                                await this.page.locator(this.paymenttype_dropdown).selectOption('swift');
                                await this.page.fill(this.wallet_fund_field, '10000');
                                await this.page.click(this.getfee_button);
                                await this.page.waitForSelector(this.fundtransferredto_customerwallet);
                                const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent();
                                const amount = added_fund?.match(/[\d,.]+/)?.[0];
                                await this.page.fill(this.external_reference_field, 'no external reference');
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
                                    console.error(`Wallet funding mismatch after creation. Expected: ${expectedAfter}, Found: ${after}`);
                                    throw new Error("Wallet balance validation failed after creation");
                                }

                                walletCreatedAndFunded = true;
                                break;
                            }


                        }
                        if (walletCreatedAndFunded)
                            break;
                    }

                }


            }

        }




        async verify_fundingdoneInnon_holding_currencyWallets_areConvertedandDeposited_in_basecurrency_wallet() {

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
                    break;
                }
            }

            await this.page.waitForTimeout(2000)
            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.businessinformation).click()
            await this.page.waitForSelector(this.checking_basecurrency)
            const base_currencyraw = await this.page.locator(this.checking_basecurrency).textContent()
            const base_currency = base_currencyraw.toLowerCase().trim()


            await this.page.locator(this.dropdown).click();
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click();

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
                        await this.page.locator(this.paymenttype_dropdown).selectOption('swift');
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
                                const balanceText = await item.locator(this.wallet_balance).textContent();
                                baseAfter = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''));
                                break;
                            }
                        }

                        // 6. Validate the balance
                        const expectedAfter = baseBefore + amount;
                        if (Math.abs(baseAfter - expectedAfter) < 0.01) {
                            console.log(" Base wallet updated correctly after non-base wallet funding.New Available balance - " + expectedAfter);
                        } else {
                            console.error(` Mismatch. Expected: ${expectedAfter}, Found: ${baseAfter}`);
                            throw new Error("Wallet balance validation failed");
                        }
                    }

                }
            }
        }

        async verifyWalletcreationforNonbase_currency() {

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForSelector(this.accountholders_tab)
            await this.page.click(this.accountholders_tab)
            await this.page.click(this.find_a_company)
            await this.page.waitForTimeout(2000)
            await this.page.fill(this.keywords_field, company_name)
            await this.page.click(this.search_button)

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
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_list).click();
            await this.page.waitForTimeout(6000)


            await this.page.click(this.addnew_button)
            const options1 = await this.page.locator(this.wallet_currency_dropdown);
            const options = options1.locator('option')
            const count = await options.count()

            // Collect all visible dropdown option texts
            const visibleOptionsText = [];
            for (let i = 0; i < count; i++) {
                const text = (await options.nth(i).textContent())?.trim();
                if (text) {
                    visibleOptionsText.push(text);
                }
            }
            const allowedOptions =
                ["AUD | AUD", "USD | USD", "CAD | CAD", "HKD | HKD", "JPY | JPY", "NZD | NZD", "SGD | SGD", "CHF | CHF",]

            let selectedValue = null
            let selectedLabel = null

            // Shuffle allowed options and try each one
            for (const allowed of allowedOptions) {
                const index = visibleOptionsText.indexOf(allowed);
                if (index !== -1) {
                    const value = await options.nth(index).getAttribute('value');
                    if (value) {
                        selectedValue = value;
                        selectedLabel = allowed;
                        this.selectedCurrency = allowed;
                        break;
                    }
                }
            }

            if (!selectedValue) {
                throw new Error("No allowed option found in the dropdown.");
            }

            await options1.selectOption(selectedValue)
            console.log(`Selected: ${selectedValue}`)
            await this.page.click(this.wallet_submit)
            await this.page.waitForTimeout(4000)



        }


        async verifyvalidationforfundingFornonbasecurrency() {

            const selected = this.selectedCurrency.toLowerCase().split('|')[0].trim();
            console.log("Setting selectedCurrency to:", selected);

            //1. Fetch base currency
            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.businessinformation).click()
            await this.page.waitForSelector(this.checking_basecurrency)
            const base_currencyraw = await this.page.locator(this.checking_basecurrency).textContent()
            const base_currency = base_currencyraw.toLowerCase().trim()
            console.log("Base currency:", base_currency)

            // 2. Navigate to Payment List again
            await this.page.locator(this.dropdown).click()
            await this.page.locator(this.payment_list).click()
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
            await this.page.locator(this.paymenttype_dropdown).selectOption('swift')
            await this.page.fill(this.wallet_fund_field, '10000')
            await this.page.click(this.getfee_button)
            await this.page.waitForSelector(this.fee_listing)

            const added_fund = await this.page.locator(this.fundtransferredto_customerwallet).textContent()
            const amount = parseFloat(added_fund?.match(/[\d,.]+/)?.[0].replace(/,/g, ''))

            await this.page.fill(this.external_reference_field, 'no external reference')
            await this.page.click(this.credit_button)
            await this.page.waitForSelector(this.fundsuccess_ok)
            await this.page.click(this.fundsuccess_ok)
            await this.page.waitForTimeout(5000)

            const updatedWallets = this.page.locator(this.paymentlist_wallets)
            const updatedCount = await updatedWallets.count()

            let baseAfter = 0
            for (let i = 0; i < updatedCount; i++) {
                const item = updatedWallets.nth(i);
                const text = await item.textContent();
                const label = text?.toLowerCase().trim();
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3);

                if (firstThree === base_currency) {
                    const balanceText = await item.locator(this.wallet_balance).textContent();
                    baseAfter = parseFloat(balanceText.match(/[\d,.]+/)?.[0].replace(/,/g, ''));
                    break;
                }
            }

            // 6. Validate the balance
            const expectedAfter = baseBefore + amount;
            if (Math.abs(baseAfter - expectedAfter) < 0.01) {
                console.log(" Base wallet updated correctly after non-base wallet funding.New Available balance - " + expectedAfter);
            } else {
                console.error(` Mismatch. Expected: ${expectedAfter}, Found: ${baseAfter}`);
                throw new Error("Wallet balance validation failed");
            }

        }


        async createAndFundWalletsForAllCurrenciesRandomly() {


            const allAllowedCurrencies = ["AUD | AUD", "CAD | CAD", "HKD | HKD", "JPY | JPY", "NZD | NZD", "SGD | SGD", "CHF | CHF"]
            const processedCurrencies = new Set()
            while (processedCurrencies.size < allAllowedCurrencies.length) {
                const remaining = allAllowedCurrencies.filter(c => !processedCurrencies.has(c))
                const selected = remaining[Math.floor(Math.random() * remaining.length)]

                this.selectedCurrency = selected;
                console.log(`\n🌐 Processing: ${selected}`)

                try {
                    await this.verifyWalletcreationforNonbase_currency()
                    await this.verifyvalidationforfundingFornonbasecurrency()
                    processedCurrencies.add(selected);
                } catch (err) {
                    console.error(`❌ Failed for ${selected}: ${err.message}`)
                    processedCurrencies.add(selected);
                }
            }

            console.log("🎉 All wallets created and funded.")

        }

    }