const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');


exports.Makepaymentpage =
    class Makepaymentpage {

        constructor(page) {
            this.page = page

            this.eurowallet = "//span[normalize-space()='Euro']"

            this.dashboard_transactions = "//table[@class='table table-row-dashed align-middle gs-0 gy-4 my-0']"

            this.transaction_table = "//table[@class='table table-row-dashed align-middle gs-0 gy-4 my-0']"

            this.no_trasnsactions = "//div[normalize-space()='No transactions']"

            this.available_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"

            this.aud_wallet = "//span[normalize-space()='AUD']"

            this.make_payment = "//a[normalize-space()='Make Payment']"

            this.wallet_logo = "//span[@id='walletCurrency']"

            this.currency_dropdown = "//select[@id='sell_currency']"

            this.yes_button = "//button[normalize-space()='Yes!']"

            this.amount = "//input[@name='amount']"



            this.beneficiary_name = "//select[@id='beneficiary']"

            this.beneficiary_details = "//table[@id='bankDetailsTable']"

            this.create_new_beneficiary = "//a[normalize-space()='Create New Beneficiary']"

            this.beneficiary_list_header = "//h3[normalize-space()='List of beneficiaries']"

            this.beneficiary_field_error = "//label[@id='beneficiary-error']"

            this.insufficientBalance_error = "//label[@id='amount-error']"

            this.select_a_payer = "(//button[@class='btn btn-primary next-step'])[1]"


            this.payment_reason = "//select[@id='paymentReason']"

            this.ours_chargeType = "//input[@id='ours_charge_type']"

            this.payment_reference = "//input[@name='paymentReference']"

            this.review_payment = "//button[normalize-space()='Review Payment']"

            this.enter_otp = "//input[@id='otpInput']"

            this.get_otp_button = "//button[@id='getPaymentOtpBtn']"

            this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

            this.enter_otp_field = "//input[@id='otpInput']"

            this.payment_fees = "//td[@id='reviewPaymentFee']"

            this.create_payment_button = "//button[@id='completedBtn']"

            this.dashboard = "//span[normalize-space()='Dashboard']"

            this.wallet_list = "//div[@class='owl-stage']//div[@class='item']"

            this.available_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"

            this.manage_beneficiaries = "//a[normalize-space()='Manage Beneficiaries']"

            this.beneficiary_list = "(//div[@class='card-body'])[1]"

            this.beneficiaries = "//div[@class='fs-6 text-gray-800 text-hover-primary fw-bold']"


            const dataPath = path.join(__dirname, '../TestData/Payment_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

            this.data = this.dataset["Payment"]


            const dataPath2 = path.join(__dirname, '../TestData/Paymentfee_testdata.json')
            this.dataset2 = JSON.parse(fs.readFileSync(dataPath2, 'utf-8'))

            this.data2 = this.dataset2["Payment type"]




        }



        async verify_Payment_CannotbeDone_without_creating_benefeciary_for_corresponding_currency() {


            //const filePath = path.join(__dirname, '../beneficiary_company.json');
            //const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            //console.log(euro_beneficiary_company_name)

            await this.page.click(this.eurowallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, this.data.Payment_amount)
            await this.page.waitForTimeout(2000)

            console.log("Not choosing a beneficiary from dropdown")

            await this.page.click(this.select_a_payer)
            await expect(this.page.locator(this.beneficiary_field_error)).toBeVisible();
            const error_msg = await this.page.locator(this.beneficiary_field_error).textContent()
            console.log("cant proceed payment without beneficiary..")

        }





        async verifyPayment_fee_deduction_after_payment() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { usd_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            let usdWalletLocator = null;

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (EUR):", previous_wallet_balance)

                    let initial_usd_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'usd') {
                            const usdBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '')
                            initial_usd_wallet_balance = parseFloat(cleanedUsdBalance)
                            usdWalletLocator = otherItem; //  store the locator reference
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }

                    }


                    await usdWalletLocator.click()
                    await this.page.waitForSelector(this.make_payment)
                    await this.page.click(this.make_payment)
                    await this.page.waitForSelector(this.amount)

                    await this.page.fill(this.amount, this.data.Payment_amount)
                    const payment_amount = Math.trunc(parseFloat(this.data.Payment_amount))
                    console.log("payment amount - " + payment_amount)

                    await this.page.waitForTimeout(2000)

                    const optionLocator = await this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(usd_beneficiary_company_name, 'i') });
                    //await expect(optionLocator).toBeVisible();
                    await expect(optionLocator).toHaveCount(1)
                    const value = await optionLocator.getAttribute('value')
                    await this.page.locator(this.beneficiary_name).selectOption({ value })

                    await this.page.click(this.select_a_payer)
                    await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
                    await this.page.fill(this.payment_reference, this.data.Payment_reference)
                    await this.page.click(this.review_payment)
                    await this.page.waitForTimeout(4000)



                    const extractInteger = (text) => {
                        if (!text) return null;

                        // Clean up text (remove extra spaces, make uppercase)
                        const cleanedText = text.replace(/\s+/g, ' ').toUpperCase();

                        // Match a number, optionally followed by currency in parentheses
                        const match = cleanedText.match(/-?\d+(?:[.,]\d+)?(?=\s*\(?[A-Z]{3}\)?)/)
                        if (!match) {
                            console.warn('extractInteger() failed to find number:', text)
                            return null
                        }

                        const number = parseFloat(match[0].replace(',', ''))
                        return Math.trunc(number)
                    }


                    const element = await this.page.locator(this.payment_fees).textContent()
                    const received_paymentfee = extractInteger(element?.trim())
                    console.log("received payment fee - " + received_paymentfee)


                    const actual_paymentfee = Math.trunc(parseFloat(this.data2.Shared_feeAmount1))
                    console.log("actual payment fee - " + actual_paymentfee)

                    if (actual_paymentfee === received_paymentfee) {
                        console.log("payment fee matches")
                    } else {
                        throw new Error("Payment fee do NOT match!")
                    }


                    await this.page.click(this.get_otp_button)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field, this.data.Payment_otp)

                    await this.page.click(this.create_payment_button)
                    await this.page.click("button[class='swal2-confirm btn btn-primary']")
                    await this.page.waitForTimeout(5000)
                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(5000)

                    const walletItemsAfter = this.page.locator(this.wallet_list)
                    const countAfter = await walletItemsAfter.count()

                    let usdWalletAfter = 0;
                    let eurWalletAfter = 0;

                    for (let i = 0; i < countAfter; i++) {
                        const item = walletItemsAfter.nth(i);
                        const text = await item.textContent();
                        const label = text?.toLowerCase().trim();
                        const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3);

                        if (firstThree === 'usd') {
                            const usdBalanceText = await item.locator(this.available_balance).textContent();
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '');
                            usdWalletAfter = parseFloat(cleanedUsdBalance);
                            console.log("New Available balance in the wallet (USD):" + usdWalletAfter)
                        } else if (firstThree === 'eur') {
                            const eurBalanceText = await item.locator(this.available_balance).textContent();
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '');
                            eurWalletAfter = parseFloat(cleanedEurBalance);
                            console.log("New Available balance in the wallet (EUR):" + eurWalletAfter)
                        }
                    }

                    // Verify USD wallet deduction
                    const expectedUsdAfter = initial_usd_wallet_balance - payment_amount
                    if (Math.trunc(usdWalletAfter) === Math.trunc(expectedUsdAfter)) {
                        console.log("USD wallet deduction is correct")
                    } else {
                        throw new Error(`USD wallet deduction incorrect! Expected: ${expectedUsdAfter}, Actual: ${usdWalletAfter}`)
                    }

                    // Verify EUR wallet deduction (payment fee)
                    const expectedEurAfter = previous_wallet_balance - received_paymentfee
                    if (Math.trunc(eurWalletAfter) === Math.trunc(expectedEurAfter)) {
                        console.log("EUR wallet payment fee deduction is correct")
                    } else {
                        throw new Error(`EUR wallet payment fee deduction incorrect! Expected: ${expectedEurAfter}, Actual: ${eurWalletAfter}`)
                    }

                }

            }

        }





        async verifyPayment_fee_deduction_after_payment_forFeePercentage() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { usd_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            let usdWalletLocator = null;

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (EUR):", previous_wallet_balance)

                    let initial_usd_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'usd') {
                            const usdBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '')
                            initial_usd_wallet_balance = parseFloat(cleanedUsdBalance)
                            usdWalletLocator = otherItem// store the locator reference
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }

                    }


                    await usdWalletLocator.click()
                    await this.page.waitForSelector(this.make_payment)
                    await this.page.click(this.make_payment)
                    await this.page.waitForSelector(this.amount)

                    await this.page.fill(this.amount, this.data.Payment_amount)
                    const payment_amount = Math.trunc(parseFloat(this.data.Payment_amount))
                    console.log("payment amount - " + payment_amount)

                    await this.page.waitForTimeout(2000)


                    const optionLocator = await this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(usd_beneficiary_company_name, 'i') });
                    //await expect(optionLocator).toBeVisible();
                    await expect(optionLocator).toHaveCount(1)
                    const value = await optionLocator.getAttribute('value')
                    await this.page.locator(this.beneficiary_name).selectOption({ value })

                    await this.page.click(this.select_a_payer)
                    await this.page.click(this.ours_chargeType)
                    await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
                    await this.page.fill(this.payment_reference, this.data.Payment_reference)
                    await this.page.click(this.review_payment)
                    await this.page.waitForTimeout(4000)



                    const extractInteger = (text) => {
                        if (!text) return null;

                        // Remove extra spaces
                        const cleanedText = text.replace(/\s+/g, ' ').toUpperCase();

                        // Match number with optional commas and decimals
                        const match = cleanedText.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/);

                        if (!match) {
                            console.warn('extractInteger() failed to find number:', text);
                            return null;
                        }

                        // Remove commas and parse
                        const number = parseFloat(match[0].replace(/,/g, ''));

                        return Math.trunc(number);
                    };

                    const payment_fee_percentage = parseFloat(this.data2.Ours_fee_percentage1)
                    console.log("payment fee percentage - " + payment_fee_percentage)

                    const expected_payment_fee = Math.trunc((payment_amount * payment_fee_percentage) / 100)
                    console.log("Expected payment fee (" + payment_fee_percentage + "% of " + payment_amount + "): " + expected_payment_fee)


                    const element = await this.page.locator(this.payment_fees).textContent()
                    const received_paymentfee = extractInteger(element?.trim())
                    console.log("received payment fee - " + received_paymentfee)

                    // Verify fee
                    if (received_paymentfee === expected_payment_fee) {
                        console.log("✅ Payment fee deduction is correct — " + received_paymentfee + " matches " + payment_fee_percentage + "% of " + payment_amount)
                    } else {
                        throw new Error(`❌ Payment fee deduction incorrect! Expected: ${expected_payment_fee}, Actual: ${received_paymentfee}`)
                    }


                    await this.page.click(this.get_otp_button)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field, this.data.Payment_otp)

                    await this.page.click(this.create_payment_button)
                    await this.page.click("button[class='swal2-confirm btn btn-primary']")
                    await this.page.waitForTimeout(5000)
                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(5000)

                    const walletItemsAfter = this.page.locator(this.wallet_list)
                    const countAfter = await walletItemsAfter.count()

                    let usdWalletAfter = 0
                    let eurWalletAfter = 0

                    for (let i = 0; i < countAfter; i++) {
                        const item = walletItemsAfter.nth(i)
                        const text = await item.textContent()
                        const label = text?.toLowerCase().trim()
                        const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                        if (firstThree === 'usd') {
                            const usdBalanceText = await item.locator(this.available_balance).textContent()
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '')
                            usdWalletAfter = parseFloat(cleanedUsdBalance)
                            console.log("New Available balance in the wallet (USD):" + usdWalletAfter)
                        } else if (firstThree === 'eur') {
                            const eurBalanceText = await item.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            eurWalletAfter = parseFloat(cleanedEurBalance)
                            console.log("New Available balance in the wallet (EUR):" + eurWalletAfter)
                        }
                    }

                    // Verify USD wallet deduction
                    const expectedUsdAfter = initial_usd_wallet_balance - payment_amount
                    if (Math.trunc(usdWalletAfter) === Math.trunc(expectedUsdAfter)) {
                        console.log("USD wallet deduction is correct")
                    } else {
                        throw new Error(`USD wallet deduction incorrect! Expected: ${expectedUsdAfter}, Actual: ${usdWalletAfter}`)
                    }

                    // Verify EUR wallet deduction (payment fee)
                    const expectedEurAfter = previous_wallet_balance - received_paymentfee
                    if (Math.trunc(eurWalletAfter) === Math.trunc(expectedEurAfter)) {
                        console.log("EUR wallet payment fee deduction is correct")
                    } else {
                        throw new Error(`EUR wallet payment fee deduction incorrect! Expected: ${expectedEurAfter}, Actual: ${eurWalletAfter}`)
                    }

                }

            }

        }




        async verifyPayment_fee_deduction_after_payment_forFeePercentage_and_feeAmount() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { usd_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            let usdWalletLocator = null;

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (EUR):", previous_wallet_balance)

                    let initial_usd_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'usd') {
                            const usdBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '')
                            initial_usd_wallet_balance = parseFloat(cleanedUsdBalance)
                            usdWalletLocator = otherItem// store the locator reference
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }

                    }


                    await usdWalletLocator.click()
                    await this.page.waitForSelector(this.make_payment)
                    await this.page.click(this.make_payment)
                    await this.page.waitForSelector(this.amount)

                    await this.page.fill(this.amount, this.data.Payment_amount2)
                    const payment_amount = Math.trunc(parseFloat(this.data.Payment_amount2))
                    console.log("payment amount - " + payment_amount)

                    await this.page.waitForTimeout(2000)


                    const optionLocator = await this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(usd_beneficiary_company_name, 'i') });
                    //await expect(optionLocator).toBeVisible();
                    await expect(optionLocator).toHaveCount(1)
                    const value = await optionLocator.getAttribute('value')
                    await this.page.locator(this.beneficiary_name).selectOption({ value })

                    await this.page.click(this.select_a_payer)
                    await this.page.click(this.ours_chargeType)
                    await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
                    await this.page.fill(this.payment_reference, this.data.Payment_reference)
                    await this.page.click(this.review_payment)
                    await this.page.waitForTimeout(4000)



                    const extractInteger = (text) => {
                        if (!text) return null;

                        // Remove extra spaces
                        const cleanedText = text.replace(/\s+/g, ' ').toUpperCase();

                        // Match number with optional commas and decimals
                        const match = cleanedText.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/);

                        if (!match) {
                            console.warn('extractInteger() failed to find number:', text)
                            return null;
                        }

                        // Remove commas and parse
                        const number = parseFloat(match[0].replace(/,/g, ''));

                        return Math.trunc(number);
                    }


                    const payment_fee_percentage = parseFloat(this.data2.Ours_fee_percentage2)
                    console.log("payment fee percentage - " + payment_fee_percentage)

                    const payment_fee_amount = Math.trunc(parseFloat(this.data2.Ours_fee_amount))
                    console.log("payment fee amount - " + payment_fee_amount)

                    const expected_payment_fee = Math.trunc((payment_amount * payment_fee_percentage) / 100) + payment_fee_amount
                    console.log(`Expected payment fee = (${payment_amount} * ${payment_fee_percentage}% ) + ${payment_fee_amount} = ${expected_payment_fee}`)


                    const element = await this.page.locator(this.payment_fees).textContent()
                    const received_paymentfee = extractInteger(element?.trim())
                    console.log("received payment fee - " + received_paymentfee)

                    // Verify fee
                    if (received_paymentfee === expected_payment_fee) {
                        console.log(" Payment fee deduction is correct ... ")
                    } else {
                        throw new Error(` Payment fee deduction incorrect! Expected: ${expected_payment_fee}, Actual: ${received_paymentfee}`)
                    }


                    await this.page.click(this.get_otp_button)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field, this.data.Payment_otp)

                    await this.page.click(this.create_payment_button)
                    await this.page.click("button[class='swal2-confirm btn btn-primary']")
                    await this.page.waitForTimeout(5000)
                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(5000)

                    const walletItemsAfter = this.page.locator(this.wallet_list)
                    const countAfter = await walletItemsAfter.count()

                    let usdWalletAfter = 0
                    let eurWalletAfter = 0

                    for (let i = 0; i < countAfter; i++) {
                        const item = walletItemsAfter.nth(i)
                        const text = await item.textContent()
                        const label = text?.toLowerCase().trim()
                        const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                        if (firstThree === 'usd') {
                            const usdBalanceText = await item.locator(this.available_balance).textContent()
                            const cleanedUsdBalance = usdBalanceText?.replace(/[^\d.]/g, '')
                            usdWalletAfter = parseFloat(cleanedUsdBalance)
                            console.log("New Available balance in the wallet (USD):" + usdWalletAfter)
                        } else if (firstThree === 'eur') {
                            const eurBalanceText = await item.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            eurWalletAfter = parseFloat(cleanedEurBalance)
                            console.log("New Available balance in the wallet (EUR):" + eurWalletAfter)
                        }
                    }

                    // Verify USD wallet deduction
                    const expectedUsdAfter = initial_usd_wallet_balance - payment_amount
                    if (Math.trunc(usdWalletAfter) === Math.trunc(expectedUsdAfter)) {
                        console.log("USD wallet deduction is correct")
                    } else {
                        throw new Error(`USD wallet deduction incorrect! Expected: ${expectedUsdAfter}, Actual: ${usdWalletAfter}`)
                    }

                    // Verify EUR wallet deduction (payment fee)
                    const expectedEurAfter = previous_wallet_balance - received_paymentfee
                    if (Math.trunc(eurWalletAfter) === Math.trunc(expectedEurAfter)) {
                        console.log("EUR wallet payment fee deduction is correct")
                    } else {
                        throw new Error(`EUR wallet payment fee deduction incorrect! Expected: ${expectedEurAfter}, Actual: ${eurWalletAfter}`)
                    }

                }

            }

        }





        async verifyPayment() {

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            console.log(euro_beneficiary_company_name)

            await this.page.click(this.eurowallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, this.data.Payment_amount)
            await this.page.waitForTimeout(2000)

            const optionLocator = await this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(euro_beneficiary_company_name, 'i') });
            //await expect(optionLocator).toBeVisible();
            await expect(optionLocator).toHaveCount(1);
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.beneficiary_name).selectOption({ value });

            await this.page.click(this.select_a_payer)
            await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
            await this.page.fill(this.payment_reference, this.data.Payment_reference)
            await this.page.click(this.review_payment)

            await this.page.waitForTimeout(4000)
            await this.page.click(this.get_otp_button)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field, this.data.Payment_otp)

            await this.page.click(this.create_payment_button)

        }


        /*async verifyPayment_using_otherOption_in_PaymentReason() {

            const filePath = path.join(__dirname, '../beneficiary_company.json')
            const { euro_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            console.log(euro_beneficiary_company_name)

            await this.page.click(this.eurowallet)
            await this.page.waitForSelector(this.make_payment)

            await this.page.click(this.make_payment)
            await this.page.waitForSelector(this.amount)
            await this.page.fill(this.amount, this.data.Payment_amount)
            await this.page.waitForTimeout(2000)

            const optionLocator = await this.page.locator(this.beneficiary_name).locator('option', { hasText: new RegExp(euro_beneficiary_company_name, 'i') })
            //await expect(optionLocator).toBeVisible();
            await expect(optionLocator).toHaveCount(1);
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.beneficiary_name).selectOption({ value })

            await this.page.click(this.select_a_payer)
            await this.page.locator(this.payment_reason).selectOption("Other")
            await this.page.fill("//input[@id='paymentReasonOther']",'Purchase')
            await this.page.fill(this.payment_reference, this.data.Payment_reference)
            await this.page.click(this.review_payment)

            await this.page.waitForTimeout(4000)
            await this.page.click(this.get_otp_button)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field, this.data.Payment_otp)

            await this.page.click(this.create_payment_button)

        }*/



        async verify_visibilityOf_paymentPage_fields() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 2)

            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim()
                const item_code = item_text?.substring(0, 3).toUpperCase()
                await wallet.click()
                await this.page.locator(this.make_payment).click()
                await this.page.waitForTimeout(3000)

                const missingFields = []

                const currencyVisible = await this.page.locator(this.currency_dropdown).isVisible()
                if (!currencyVisible) missingFields.push("Currency dropdown")

                const amountVisible = await this.page.locator(this.amount).isVisible()
                if (!amountVisible) missingFields.push("Amount field")

                const beneficiaryVisible = await this.page.locator(this.beneficiary_name).isVisible()
                if (!beneficiaryVisible) missingFields.push("Beneficiary dropdown")

                if (missingFields.length > 0) {
                    throw new Error(` In wallet '${item_code}', missing field(s): ${missingFields.join(", ")}`)
                } else {
                    console.log(` All necessary fields are visible in '${item_code}' wallet.`)
                }

                await this.page.click(this.dashboard)
                await this.page.waitForSelector(this.wallet_list)

            }


        }





        async verify_DefaultCurrency_chosen_in_makePaymentpage() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 3);

            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i);
                const item_text = (await wallet.textContent())?.trim();
                const item_code = item_text?.substring(0, 3).toUpperCase();
                await wallet.click()
                await this.page.locator(this.make_payment).click()
                await this.page.waitForSelector(this.currency_dropdown)
                const default_currency = await this.page.locator(`${this.currency_dropdown} >> option:checked`).textContent();
                const default_CurrencyCode = default_currency?.substring(0, 3).toUpperCase();

                if (item_code === default_CurrencyCode) {

                    console.log(` Default currency '${default_currency}' is correctly set for wallet '${item_code}'`)
                } else {
                    throw new Error(` Default currency mismatch: wallet='${item_code}', default='${default_currency}'`)
                }

                await this.page.click(this.dashboard)
                await this.page.waitForSelector(this.wallet_list)

            }

        }






        async verify_paymentPage_redirection_from_currencyDropdown() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 2)

            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim()
                const item_code = item_text?.substring(0, 3).toUpperCase()
                await wallet.click()
                await this.page.locator(this.make_payment).click()
                await this.page.waitForTimeout(3000)

                const currency_dropdown = await this.page.locator(this.currency_dropdown)
                const dropdown_options = await currency_dropdown.locator('option').all()

                const optionValues = []
                for (const option of dropdown_options) {

                    const value = await option.getAttribute('value')
                    if (value) optionValues.push(value)
                }

                // Get currently selected value
                const selectedValue = await currency_dropdown.inputValue()

                // Filter out the default selected option
                const otherOptions = optionValues.filter(v => v !== selectedValue)

                const randomOption = otherOptions[Math.floor(Math.random() * otherOptions.length)]
                await currency_dropdown.selectOption(randomOption)

                await this.page.locator(this.yes_button).click()
                await this.page.waitForTimeout(4000)

                const new_selected_option = (await this.page.locator(`${this.currency_dropdown} >> option:checked`).textContent())?.toUpperCase()
                const new_wallet_logo = (await this.page.locator(this.wallet_logo).textContent())?.toUpperCase()

                await expect(new_selected_option).toContain(new_wallet_logo)
                console.log(`New selected currency: ${new_selected_option} | Wallet shows: ${new_wallet_logo}`)
                await this.page.waitForTimeout(3000)

                await this.page.click(this.dashboard)
                await this.page.waitForSelector(this.wallet_list)

            }

        }






        async verifypayment_with_insufficient_Fund() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()


            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'eur') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '');
                    const wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet:", wallet_balance)

                    await item.click()
                    await this.page.locator(this.make_payment).click()
                    await this.page.waitForTimeout(3000)
                    await this.page.waitForSelector(this.currency_dropdown)

                    //  amount greater than wallet balance
                    const greaterAmount = (wallet_balance + 1000).toFixed(2)
                    console.log("Entered amount :", greaterAmount)
                    await this.page.fill(this.amount, greaterAmount.toString())

                    await expect(this.page.locator(this.insufficientBalance_error)).toBeVisible()
                    const error_msg = await this.page.locator(this.insufficientBalance_error).textContent()
                    console.log(error_msg)
                    break;


                }

            }

        }







        async verify_CreateNewBeneficiary_button() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 1)
            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                await wallet.click()
                await this.page.locator(this.make_payment).click()
                await this.page.waitForTimeout(3000)

                try {
                    await this.page.locator(this.create_new_beneficiary).click({ trial: true }) // checks if clickable
                    console.log("Create new beneficiary button is clickable.");
                    await this.page.locator(this.create_new_beneficiary).click()
                    await expect(this.page.locator(this.beneficiary_list_header)).toBeVisible()
                    console.log("successfully naviagted to beneficiary page on clicking the create new beneficiary button")
                } catch {
                    throw new Error("Create new beneficiary button is not clickable..")
                }
            }

        }


        /*async verify_beneficiaries_are_listed_in_dropdown() {

            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 1)
            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim();
                const item_code = item_text?.substring(0, 3).toUpperCase()
                console.log(`Checking wallet: ${item_code}`)

                await wallet.click()
                await this.page.locator(this.manage_beneficiaries).click()
                await expect(this.page.locator(this.beneficiary_list_header)).toBeVisible()

                const listVisible = await this.page.locator(this.beneficiary_list).isVisible();

                if (!listVisible) {
                    console.log(`No beneficiaries found for wallet: ${item_code}. Skipping...`);
                    await this.page.click(this.dashboard); // Go back to wallet list
                    await this.page.waitForSelector(this.wallet_list)
                    continue
                }

                //take all beneficiaries 
                const raw_beneficiaries = await this.page.locator(this.beneficiaries).allTextContents();
                // Clean each name: remove extra whitespace, newlines, and trim
                const beneficiaries = raw_beneficiaries.map(text => text.replace(/\s+/g, ' ').trim()).map(text => text.split(',')[0].trim()).filter(name => name.length > 0)
                console.log('Found beneficiaries:', beneficiaries)

                await this.page.click(this.dashboard);
                await this.page.waitForSelector(this.wallet_list)
                await wallet.click();
                await this.page.click(this.make_payment)

                await this.page.waitForTimeout(3000)
                const beneficiary_dropdown = this.page.locator(this.beneficiary_name)
                const dropdownOptions = await beneficiary_dropdown.locator('option').allTextContents()
                const cleanedDropdownOptions = dropdownOptions.map(option => option.replace(/\(.*?\)/, '').trim())
                console.log('Found beneficiaries in dropdown:', cleanedDropdownOptions)

                for (const beneficiary of beneficiaries) {
                    const matchFound = dropdownOptions.some(option =>
                        option.toLowerCase().includes(beneficiary.toLowerCase())
                    )

                    if (!matchFound) {
                        throw new Error(` Beneficiary '${beneficiary}' not found in dropdown for wallet: ${item_code}`)
                    }
                }

                console.log(` All beneficiaries created for wallet '${item_code}' are present Beneficiary dropdown.`)

                await this.page.click(this.dashboard);
                await this.page.waitForSelector(this.wallet_list);



            }

        }*/



        async checck_beneficiary_Details_are_shown() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 2)

            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim()
                const item_code = item_text?.substring(0, 3).toUpperCase()
                console.log(`Checking beneficiary details in wallet: ${item_code}`)

                await wallet.click()
                await this.page.waitForTimeout(3000)
                await this.page.locator(this.make_payment).click()
                await this.page.waitForTimeout(3000)

                const dropdown = await this.page.locator(this.beneficiary_name)
                const dropdown_options = await dropdown.locator('option').allTextContents()

                const validOptions = dropdown_options.filter(opt =>
                    opt && !opt.toLowerCase().includes('select')
                )

                if (dropdown_options.length === 0) {

                    console.log("⚠️ No beneficiaries in this wallet. Moving to next...")
                    await this.page.click(this.dashboard)
                    await this.page.waitForSelector(this.wallet_list)
                    continue

                }

                const random = validOptions[Math.floor(Math.random() * validOptions.length)]
                console.log(` Selecting beneficiary: ${random}`)
                await dropdown.selectOption({ label: random })

                const isDetailsVisible = await this.page.locator(this.beneficiary_details).isVisible()
                if (!isDetailsVisible) {
                    throw new Error(` Beneficiary details not visible after selecting: ${random}`)
                } else {
                    console.log(` Beneficiary details are visible for: ${random}`)
                }

                const bankAccount_holderName = await this.page.locator("//td[normalize-space()='Bank Account Holder Name:']/following-sibling::td").textContent()
                const bankName = await this.page.locator("//td[normalize-space()='Bank Name:']/following-sibling::td").textContent()
                const bankAddress = await this.page.locator("//td[normalize-space()='Bank Address:']/following-sibling::td").textContent()
                const bankCountry = await this.page.locator("//td[normalize-space()='Bank Account Country:']/following-sibling::td").textContent()

                console.log("📋Beneficiary Details:")
                console.log(`   Bank Account Holder Name   : ${bankAccount_holderName?.trim()}`)
                console.log(`   Bank Name     : ${bankName?.trim()}`)
                console.log(`   Bank Address  : ${bankAddress?.trim()}`)
                console.log(`   Bank Account Country  : ${bankCountry?.trim()}`)

                await this.page.waitForTimeout(2000)
                await this.page.click(this.dashboard)
                await this.page.waitForSelector(this.wallet_list)



            }


        }







        async check_transactions_are_shown_in_walletDetails_page() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 3)
            console.log(walletCount)
            for (let i = 0; i < limit; i++) {
                console.log(`entered for loop`)

                const wallet = await this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim()
                const item_code = item_text?.substring(0, 3).toUpperCase()
                console.log(`Checking transactions in wallet: ${item_code}`)
                await this.page.waitForTimeout(2000)
                await expect(wallet).toBeVisible({ timeout: 10000 })
                await wallet.click()
                await this.page.waitForTimeout(2000)

                const transactionTable = this.page.locator(this.transaction_table)
                const noTransactions = this.page.locator(this.no_trasnsactions)

                if (await transactionTable.first().isVisible()) {
                    console.log(` Transactions are listed for ${item_code} in wallet details page`)
                } else {
                    await expect(noTransactions).toBeVisible();
                    console.log(`No transactions made for ${item_code}, moving to next wallet...`)
                }

                await this.page.locator(this.dashboard).click()
                await this.page.waitForSelector(this.wallet_list)

            }

        }


        

        async check_transactions_are_shown_in_dashboard_page() {

            try {

                await expect(this.page.locator(this.dashboard_transactions)).toBeVisible()
                console.log(`Transactions are listed in dashboard`)

            }
            catch {
                await expect(this.page.locator(this.no_trasnsactions)).toBeVisible()
                throw new Error('Transactions are not listed..')
            }

        }




        async verifyWalletDetailpage() {

            await this.page.click(this.aud_wallet)
            await expect(this.page.locator('//a[@id="showBalance"]')).toBeVisible()
            const balanceLocator = this.page.locator("//a[starts-with(normalize-space(), 'Wallet Balance:')]")
            await expect(balanceLocator).toBeVisible()
            const ibanLocator = this.page.locator("//a[starts-with(normalize-space(), 'IBAN:')]")
            await expect(ibanLocator).toBeVisible()

        }

        


        async check_payment_details_are_shown_in_a_popup() {

            await this.page.waitForTimeout(3000)
            const walletCount = await this.page.locator(this.wallet_list).count()
            const limit = Math.min(walletCount, 1)

            for (let i = 0; i < limit; i++) {

                const wallet = this.page.locator(this.wallet_list).nth(i)
                const item_text = (await wallet.textContent())?.trim()
                const item_code = item_text?.substring(0, 3).toUpperCase()
                console.log(`Checking transactions in wallet: ${item_code}`)
                await wallet.click()
                await this.page.waitForTimeout(3000)

                const isTransactionVisible = await this.page.locator(this.transaction_table).isVisible()
                if (!isTransactionVisible) {
                    await expect(this.page.locator(this.no_trasnsactions)).toBeVisible()
                    console.log('No transactions made for this wallet,moving to next wallet..')
                    await this.page.click(this.dashboard)
                    continue
                }

                if (isTransactionVisible) {
                    /*const firstRow = this.page.locator("table >> tbody >> tr").first()
                    const Transaction_date = (await firstRow.locator("td:nth-child(1) span.text-dark").textContent())?.trim();
                    const Scheduled_date = (await firstRow.locator("td:nth-child(2) span.text-dark").textContent())?.trim();
                    const Transaction_type = (await firstRow.locator("td:nth-child(3) span.text-dark").textContent())?.trim();
 
                    const getFirstLine = async (locator) => {
                        const text = await locator.textContent();
                        return text?.split('\n')[0].trim(); // Get only the first line
                    }
 
                    const Mode = await getFirstLine(firstRow.locator('td').nth(4))
                    const Status = await getFirstLine(firstRow.locator('td').nth(5))
                    const Amount = (await firstRow.locator("td:nth-child(6) span.text-dark").textContent())?.trim();
 
                    console.log(" First row transaction data:");
                    console.log({ Transaction_date, Scheduled_date, Transaction_type, Mode, Status, Amount })*/

                    // Step 3: Click the arrow icon (→)
                    const firstRow = this.page.locator("table >> tbody >> tr").first()
                    await firstRow.locator("td:last-child i").click()
                    await this.page.waitForTimeout(3000)
                    await expect(this.page.locator("//h5[@id='transactionDetailsModalLabel']")).toBeVisible()

                    const Transaction_details = await this.page.locator("//div[@class='pdfDataView']").evaluate(el => el.textContent);
                    console.log(" Raw Popup Text:\n", Transaction_details);


                }

            }

        }

    }

