const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

exports.Conversionpage =
    class Conversionpage {

        constructor(page) {
            this.page = page

            this.transaction_tab = "//a[normalize-space()='Transactions']"

            this.eurowallet = "//span[normalize-space()='Euro']"

            this.convert_funds = "//a[normalize-space()='Convert Funds']"

            this.sell_currency = "//select[@id='sell_currency']"

            this.buy_currency = "//select[@id='buy_currency']"

            this.amount_to_dropdown = "//select[@id='fixed_side']"

            this.amount_to = "//input[@name='amount']"

            this.select_beneficiary = "//select[@id='beneficiary']"

            this.beneficiary_error = "//label[@id='beneficiary-error']"

            this.payment_charge_type = "//select[@id='paymentChargeType']"

            this.payment_reason = "//select[@id='paymentReason']"

            this.payment_reference = "//input[@id='paymentReference']"

            this.get_otp = "//button[@id='getConvertOtpBtn']"

            this.enter_otp_field = "//input[@id='convertOtpInput']"

            this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

            this.next_button = "//button[@id='nextBtn']"

            this.selling_amount = "//div[@class='col-md-8 org-selling-amount']"

            this.buying_amount = "//div[@class='col-md-8 org-buying-amount']"

            this.payment_fees = "(//div[@class='col-md-8 payment-method'])[3]"

            this.quote_checkbox = "//input[@type='checkbox']"

            this.convert_button = "//button[@class='btn btn-primary convert-btn']"

            this.dealsuccess_ok = "//button[@class='swal2-confirm btn btn-success mr-2']"

            this.dashboard = "//span[normalize-space()='Dashboard']"

            this.wallet_list = "//div[@class='owl-stage']//div[@class='item']"

            this.available_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"


            const dataPath = path.join(__dirname, '../TestData/Conversion_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
                                            
            this.data = this.dataset["Conversion"]

        }



        async verifyConversionofCurrencyForBuy() {

            await this.page.waitForTimeout(3000)
            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.fill(this.amount_to, "500")
            await this.page.waitForTimeout(3000)

            const filePath = path.join(__dirname, '../beneficiary_company.json')
            const { aud_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const optionLocator = this.page.locator(this.select_beneficiary).locator('option', { hasText: new RegExp(aud_beneficiary_company_name, 'i') })
            const value = await optionLocator.getAttribute('value')
            await this.page.locator(this.select_beneficiary).selectOption({ value })

            //await this.page.locator(this.select_beneficiary).selectOption('Heaney - Stoltenberg (Commerzbank)')
            await this.page.locator(this.payment_charge_type).selectOption(this.data.SharedPayment_type)
            await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
            await this.page.fill(this.payment_reference, this.data.Payment_reference)
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
             
            await this.page.click(this.next_button)

            const normalize = (text) => {
                if (!text) return '';

                const cleanedText = text.replace(/\s+/g, ' ').toUpperCase()

                const match = cleanedText.match(/-?\d+(?:[.,]\d{1,})?\s?[A-Z]{3}/)
                if (!match) {
                    console.warn('normalize() failed to match:', text)
                    return cleanedText.trim(); // fallback
                }

                const [amountPart, currencyPart] = match[0].split(' ')
                const number = Math.abs(parseFloat(amountPart.replace(',', '')))
                const currency = currencyPart

                const formattedAmount = Number.isInteger(number) ? number.toFixed(0) : number.toFixed(2)
                return `${formattedAmount} ${currency}`
            };


            const element = await this.page.locator(this.payment_fees).textContent()
            const actual_paymentfee = normalize(element?.trim())
            const element2 = await this.page.locator(this.selling_amount).textContent()
            const actual_sellamount = normalize(element2?.trim())

            await this.page.waitForSelector(this.quote_checkbox)
            await this.page.click(this.quote_checkbox)
            await this.page.click(this.convert_button)
            await this.page.waitForSelector(this.dealsuccess_ok)
            await this.page.click(this.dealsuccess_ok)
            await this.page.click(this.transaction_tab)
            await this.page.waitForTimeout(5000)

            const rows = await this.page.locator('table tbody tr')
            const firstRow = rows.nth(0);
            const firstRowStatus = await firstRow.locator('td').nth(4).textContent()
            const firstRowAmount = await firstRow.locator('td').nth(5).textContent()

            const status = firstRowStatus?.trim()
            const paymentfee = firstRowAmount?.trim()
            console.log("payment fee status-" + status)
            console.log("paymentfee-" + paymentfee)

            //Second row 
            const secondRow = rows.nth(1)
            const secondRowStatus = await secondRow.locator('td').nth(4).textContent()
            const secondRowAmount = await secondRow.locator('td').nth(5).textContent()

            const conversionstatus = secondRowStatus?.trim()
            const sellingamount = secondRowAmount?.trim()
            console.log("conversion status-" + conversionstatus)
            console.log("selling amount-" + sellingamount)

            console.log('Received paymentfee:', normalize(paymentfee))
            console.log('Received sellamount:', normalize(sellingamount))

            expect(normalize(paymentfee)).toBe(actual_paymentfee)
            expect(normalize(sellingamount)).toBe(actual_sellamount)
            expect(conversionstatus).toContain('Completed')

        }


        async verifyConversionofCurrencyForSell() {

            await this.page.waitForTimeout(3000)
            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
            await this.page.fill(this.amount_to, "300")
            await this.page.waitForTimeout(3000)

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { aud_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const optionLocator = this.page.locator(this.select_beneficiary).locator('option', { hasText: new RegExp(aud_beneficiary_company_name, 'i') });
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.select_beneficiary).selectOption({ value });

            //await this.page.locator(this.select_beneficiary).selectOption('Heaney - Stoltenberg (Commerzbank)')
            await this.page.locator(this.payment_charge_type).selectOption(this.data.SharedPayment_type)
            await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
            await this.page.fill(this.payment_reference, this.data.Payment_reference)

            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
             
            await this.page.click(this.next_button)
            await this.page.waitForSelector(this.quote_checkbox)
            await this.page.click(this.quote_checkbox)
            await this.page.click(this.convert_button)
            await this.page.waitForSelector(this.dealsuccess_ok)
            await this.page.click(this.dealsuccess_ok)

        }

        async verifyDirect_Conversion_is_not_possible_to_non_holding_currencies() {

            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
            await this.page.fill(this.amount_to, this.data.Sell_amount)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_charge_type).selectOption(this.data.SharedPayment_type)
            await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
            await this.page.fill(this.payment_reference, this.data.Payment_reference)
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
             
            await this.page.click(this.next_button)
            await expect(this.page.locator(this.beneficiary_error)).toBeVisible()
            console.log("Beneficiary required for non holding currency...")

        }


        async verifyQuoteExpiry() {
            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
            await this.page.fill(this.amount_to, "500")
            await this.page.waitForTimeout(3000)

            const filePath = path.join(__dirname, '../beneficiary_company.json')
            const { aud_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const optionLocator = this.page.locator(this.select_beneficiary).locator('option', { hasText: new RegExp(aud_beneficiary_company_name, 'i') })
            const value = await optionLocator.getAttribute('value')
            await this.page.locator(this.select_beneficiary).selectOption({ value })

            await this.page.locator(this.payment_charge_type).selectOption(this.data.SharedPayment_type)
            await this.page.locator(this.payment_reason).selectOption(this.data.Payment_reason)
            await this.page.fill(this.payment_reference, this.data.Payment_reference)
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.fill(this.enter_otp_field,this.data.Payment_otp) 
            await this.page.click(this.next_button)
            await this.page.waitForTimeout(30000)

            const quoteExpiredMessage = this.page.locator('//span[normalize-space()="Quote Expired, Get Another Quote"]')
            await expect(quoteExpiredMessage).toBeVisible({ timeout: 5000 })

            //button[normalize-space()='Requote']
            await this.page.click("//button[normalize-space()='Requote']")
            await expect(this.page.locator('//span[@id="seconds"]')).toBeVisible()

        }


        async verify_DirectConversion_from_euro_to_usd_for_sell() {

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
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }
                    }


                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('USD | USD')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (EUR): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
                     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (USD) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (EUR):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBe(new_wallet_balance)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'usd') {
                            const newUsdBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewUsdBalance = newUsdBalanceText?.replace(/[^\d.]/g, '')
                            const new_usd_wallet_balance = parseFloat(cleanedNewUsdBalance)
                            console.log("New Wallet Balance (USD):", new_usd_wallet_balance)

                            const expected_usd_balance = initial_usd_wallet_balance + buy_amount
                            expect(expected_usd_balance).toBeCloseTo(new_usd_wallet_balance, 2)
                            break
                        }
                    }


                }

            }


        }


        async verify_DirectConversion_from_euro_to_usd_for_buy() {

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
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('USD | USD')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (usd): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)  
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (EUR) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (EUR):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance, 2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'usd') {
                            const newUsdBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewUsdBalance = newUsdBalanceText?.replace(/[^\d.]/g, '')
                            const new_usd_wallet_balance = parseFloat(cleanedNewUsdBalance)
                            console.log("New Wallet Balance (USD):", new_usd_wallet_balance)

                            const expected_usd_balance = initial_usd_wallet_balance + buying_amount
                            expect(expected_usd_balance).toBeCloseTo(new_usd_wallet_balance, 2)
                            break

                        }

                    }

                }

            }

        }



        async verify_DirectConversion_from_euro_to_gbp_for_sell() {

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
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (EUR):", previous_wallet_balance)

                    let initial_gbp_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'gbp') {
                            const gbpBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedGbpBalance = gbpBalanceText?.replace(/[^\d.]/g, '')
                            initial_gbp_wallet_balance = parseFloat(cleanedGbpBalance)
                            console.log("Available balance in the wallet (GBP):", initial_gbp_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('GBP | GBP')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (EUR): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,'123456')  
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (GBP) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (EUR):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBe(new_wallet_balance)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'gbp') {
                            const newGbpBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewGbpBalance = newGbpBalanceText?.replace(/[^\d.]/g, '')
                            const new_gbp_wallet_balance = parseFloat(cleanedNewGbpBalance)
                            console.log("New Wallet Balance (GBP):", new_gbp_wallet_balance)

                            const expected_gbp_balance = initial_gbp_wallet_balance + buy_amount
                            expect(expected_gbp_balance).toBeCloseTo(new_gbp_wallet_balance, 2)
                            break
                        }

                    }


                }

            }

        }


         async verify_DirectConversion_from_euro_to_gbp_for_buy() {

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
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (EUR):", previous_wallet_balance)

                    let initial_gbp_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'gbp') {
                            const gbpBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedGbpBalance = gbpBalanceText?.replace(/[^\d.]/g, '')
                            initial_gbp_wallet_balance = parseFloat(cleanedGbpBalance)
                            console.log("Available balance in the wallet (GBP):", initial_gbp_wallet_balance)
                            break
                        }
                    }


                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('GBP | GBP')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (gbp): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)               
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (EUR) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (EUR):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance, 2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'gbp') {
                            const newGbpBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewGbpBalance = newGbpBalanceText?.replace(/[^\d.]/g, '')
                            const new_gbp_wallet_balance = parseFloat(cleanedNewGbpBalance)
                            console.log("New Wallet Balance (GBP):", new_gbp_wallet_balance)

                            const expected_gbp_balance = initial_gbp_wallet_balance + buying_amount
                            expect(expected_gbp_balance).toBeCloseTo(new_gbp_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }



        async verify_DirectConversion_from_usd_to_euro_for_sell() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (USD):", previous_wallet_balance)

                    let initial_euro_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'eur') {
                            const eurBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            initial_euro_wallet_balance = parseFloat(cleanedEurBalance)
                            console.log("Available balance in the wallet (EUR):", initial_euro_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('EUR | Euro')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (USD): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (EUR) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (USD):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'eur') {
                            const newEurBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewEurBalance = newEurBalanceText?.replace(/[^\d.]/g, '')
                            const new_eur_wallet_balance = parseFloat(cleanedNewEurBalance)
                            console.log("New Wallet Balance (EUR):", new_eur_wallet_balance)

                            const expected_eur_balance = initial_euro_wallet_balance + buy_amount
                            expect(expected_eur_balance).toBeCloseTo(new_eur_wallet_balance, 2)
                            break
                        }

                    }

                }

            }

        }


        async verify_DirectConversion_from_usd_to_euro_for_buy() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
          

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (USD):", previous_wallet_balance)

                    let initial_euro_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'eur') {
                            const eurBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            initial_euro_wallet_balance = parseFloat(cleanedEurBalance)
                            console.log("Available balance in the wallet (EUR):", initial_euro_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('EUR | Euro')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (EUR): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)                    
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (USD) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (USD):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'eur') {
                            const newEurBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewEurBalance = newEurBalanceText?.replace(/[^\d.]/g, '')
                            const new_eur_wallet_balance = parseFloat(cleanedNewEurBalance)
                            console.log("New Wallet Balance (EUR):", new_eur_wallet_balance)

                            const expected_eur_balance = initial_euro_wallet_balance + buying_amount
                            expect(expected_eur_balance).toBeCloseTo(new_eur_wallet_balance, 2)
                            break

                        }
                    }

                }

            }

        }


         async verify_DirectConversion_from_usd_to_gbp_for_sell() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
          

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (USD):", previous_wallet_balance)

                    let initial_gbp_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'gbp') {
                            const gbpBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedGbpBalance = gbpBalanceText?.replace(/[^\d.]/g, '')
                            initial_gbp_wallet_balance = parseFloat(cleanedGbpBalance)
                            console.log("Available balance in the wallet (GBP):", initial_gbp_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('GBP | GBP')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (USD): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)                
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (GBP) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (USD):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'gbp') {
                            const newGbpBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewGbpBalance = newGbpBalanceText?.replace(/[^\d.]/g, '')
                            const new_gbp_wallet_balance = parseFloat(cleanedNewGbpBalance)
                            console.log("New Wallet Balance (GBP):", new_gbp_wallet_balance)

                            const expected_gbp_balance = initial_gbp_wallet_balance + buy_amount
                            expect(expected_gbp_balance).toBeCloseTo(new_gbp_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }

         async verify_DirectConversion_from_usd_to_gbp_for_buy() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (USD):", previous_wallet_balance)

                    let initial_gbp_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'gbp') {
                            const gbpBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedGbpBalance = gbpBalanceText?.replace(/[^\d.]/g, '')
                            initial_gbp_wallet_balance = parseFloat(cleanedGbpBalance)
                            console.log("Available balance in the wallet (GBP):", initial_gbp_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('GBP | GBP')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (EUR): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)                     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (USD) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (USD):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'gbp') {
                            const newGbpBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewGbpBalance = newGbpBalanceText?.replace(/[^\d.]/g, '')
                            const new_gbp_wallet_balance = parseFloat(cleanedNewGbpBalance)
                            console.log("New Wallet Balance (GBP):", new_gbp_wallet_balance)

                            const expected_gbp_balance = initial_gbp_wallet_balance + buying_amount
                            expect(expected_gbp_balance).toBeCloseTo(new_gbp_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }


         async verify_DirectConversion_from_gbp_to_euro_for_sell() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
           

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'gbp') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (GBP):", previous_wallet_balance)

                    let initial_euro_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'eur') {
                            const eurBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            initial_euro_wallet_balance = parseFloat(cleanedEurBalance)
                            console.log("Available balance in the wallet (EUR):", initial_euro_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('EUR | Euro')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (USD): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)                
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (GBP) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (GBP):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'eur') {
                            const newEurBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewEurBalance = newEurBalanceText?.replace(/[^\d.]/g, '')
                            const new_eur_wallet_balance = parseFloat(cleanedNewEurBalance)
                            console.log("New Wallet Balance (EUR):", new_eur_wallet_balance)

                            const expected_eur_balance = initial_euro_wallet_balance + buy_amount
                            expect(expected_eur_balance).toBeCloseTo(new_eur_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }



        async verify_DirectConversion_from_gbp_to_euro_for_buy() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)


                if (firstThree === 'gbp') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (GBP):", previous_wallet_balance)

                    let initial_euro_wallet_balance = 0
                    for (let j = 0; j < count; j++) {
                        const otherItem = walletItems.nth(j)
                        const otherText = await otherItem.textContent()
                        const otherLabel = otherText?.toLowerCase().trim()
                        const otherFirstThree = otherLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (otherFirstThree === 'eur') {
                            const eurBalanceText = await otherItem.locator(this.available_balance).textContent()
                            const cleanedEurBalance = eurBalanceText?.replace(/[^\d.]/g, '')
                            initial_euro_wallet_balance = parseFloat(cleanedEurBalance)
                            console.log("Available balance in the wallet (EUR):", initial_euro_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('EUR | Euro')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (EUR): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)

                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
                     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (GBP) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const gbpItem = updatedWalletItems.nth(i)
                    const newBalanceText = await gbpItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (GBP):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'eur') {
                            const newEurBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewEurBalance = newEurBalanceText?.replace(/[^\d.]/g, '')
                            const new_eur_wallet_balance = parseFloat(cleanedNewEurBalance)
                            console.log("New Wallet Balance (EUR):", new_eur_wallet_balance)

                            const expected_eur_balance = initial_euro_wallet_balance + buying_amount
                            expect(expected_eur_balance).toBeCloseTo(new_eur_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }

         async verify_DirectConversion_from_gbp_to_usd_for_sell() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'gbp') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '');
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (GBP):", previous_wallet_balance)

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
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('USD | USD')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Sell_option)
                    const selling_amount = this.data.Sell_amount
                    await this.page.fill(this.amount_to, selling_amount.toString())
                    console.log("Selling amount (EUR): " + selling_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field,this.data.Payment_otp)
                     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.buying_amount).textContent()
                    const buy_amount_text = element?.replace(/[^\d.]/g, '')
                    const buy_amount = parseFloat(buy_amount_text)
                    console.log("Buying amount (GBP) -" + buy_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const gbpItem = updatedWalletItems.nth(i)
                    const newBalanceText = await gbpItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (GBP):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - selling_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance,2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'usd') {
                            const newUsdBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewUsdBalance = newUsdBalanceText?.replace(/[^\d.]/g, '')
                            const new_usd_wallet_balance = parseFloat(cleanedNewUsdBalance)
                            console.log("New Wallet Balance (USD):", new_usd_wallet_balance)

                            const expected_usd_balance = initial_usd_wallet_balance + buy_amount
                            expect(expected_usd_balance).toBeCloseTo(new_usd_wallet_balance, 2)
                            break
                        }
                    }


                }

            }


        }


        async verify_DirectConversion_from_gbp_to_usd_for_buy() {

            await this.page.waitForTimeout(3000)
            const walletItems = this.page.locator(this.wallet_list)
            const count = await walletItems.count()
            

            for (let i = 0; i < count; i++) {
                const item = walletItems.nth(i)
                const text = await item.textContent()
                const label = text?.toLowerCase().trim()
                const firstThree = label.replace(/[^a-z]/g, '').substring(0, 3)

                if (firstThree === 'gbp') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '');
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (GBP):", previous_wallet_balance)

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
                            console.log("Available balance in the wallet (USD):", initial_usd_wallet_balance)
                            break
                        }
                    }

                    await item.click()
                    await this.page.click(this.convert_funds)
                    await this.page.waitForSelector(this.buy_currency)
                    await this.page.locator(this.buy_currency).selectOption('USD | USD')
                    await this.page.locator(this.amount_to_dropdown).selectOption(this.data.Buy_option)
                    const buying_amount = this.data.Buy_amount
                    await this.page.fill(this.amount_to, buying_amount.toString())
                    console.log("Buying amount (usd): " + buying_amount)
                    await this.page.click(this.get_otp)
                    await this.page.waitForSelector(this.ok_got_it)
                    await this.page.click(this.ok_got_it)
                    await this.page.fill(this.enter_otp_field, this.data.Payment_otp)
                     
                    await this.page.click(this.next_button)

                    await this.page.waitForSelector(this.quote_checkbox)
                    const element = await this.page.locator(this.selling_amount).textContent()
                    const sell_amount_text = element?.replace(/[^\d.]/g, '')
                    const sell_amount = parseFloat(sell_amount_text)
                    console.log("Selling amount (GBP) -" + sell_amount)

                    await this.page.click(this.quote_checkbox)
                    await this.page.click(this.convert_button)
                    await this.page.waitForSelector(this.dealsuccess_ok)
                    await this.page.click(this.dealsuccess_ok)
                    await this.page.waitForTimeout(3000)

                    await this.page.click(this.dashboard)
                    await this.page.waitForTimeout(4000)

                    const updatedWalletItems = this.page.locator(this.wallet_list)
                    const eurItem = updatedWalletItems.nth(i)
                    const newBalanceText = await eurItem.locator(this.available_balance).textContent()
                    const cleanedNewBalance = newBalanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedNewBalance)
                    console.log("New Wallet Balance (GBP):", new_wallet_balance)

                    const expected_balance = previous_wallet_balance - sell_amount
                    expect(expected_balance).toBeCloseTo(new_wallet_balance, 2)


                    for (let k = 0; k < count; k++) {
                        const updatedItem = updatedWalletItems.nth(k)
                        const updatedText = await updatedItem.textContent()
                        const updatedLabel = updatedText?.toLowerCase().trim()
                        const updatedFirstThree = updatedLabel.replace(/[^a-z]/g, '').substring(0, 3)

                        if (updatedFirstThree === 'usd') {
                            const newUsdBalanceText = await updatedItem.locator(this.available_balance).textContent()
                            const cleanedNewUsdBalance = newUsdBalanceText?.replace(/[^\d.]/g, '')
                            const new_usd_wallet_balance = parseFloat(cleanedNewUsdBalance)
                            console.log("New Wallet Balance (USD):", new_usd_wallet_balance)

                            const expected_usd_balance = initial_usd_wallet_balance + buying_amount
                            expect(expected_usd_balance).toBeCloseTo(new_usd_wallet_balance, 2)
                            break
                        }
                    }


                }

            }

        }

    }
