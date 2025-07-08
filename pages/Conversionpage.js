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

            this.ok_got_it = "//button[@class='swal2-confirm btn btn-primary']"

            this.next_button = "//button[@id='nextBtn']"

            this.selling_amount = "//div[@class='col-md-8 org-selling-amount']"

            this.buying_amount = "//div[@class='col-md-8 org-buying-amount']"

            this.payment_fees = "(//div[@class='col-md-8 payment-method'])[3]"

            this.quote_checkbox = "//input[@type='checkbox']"

            this.convert_button = "//button[@class='btn btn-primary convert-btn']"

            this.dealsuccess_ok = "//button[@class='swal2-confirm btn btn-success mr-2']"

        }



        async verifyConversionofCurrencyForBuy() {

            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.fill(this.amount_to, '300')
            await this.page.waitForTimeout(3000)

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { aud_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const optionLocator = this.page.locator(this.select_beneficiary).locator('option', { hasText: new RegExp(aud_beneficiary_company_name, 'i') });
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.select_beneficiary).selectOption({ value });

            //await this.page.locator(this.select_beneficiary).selectOption('Heaney - Stoltenberg (Commerzbank)')
            await this.page.locator(this.payment_charge_type).selectOption('Shared fee')
            await this.page.locator(this.payment_reason).selectOption('Investment related payment')
            await this.page.fill(this.payment_reference, '3456')
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.pause()
            await this.page.click(this.next_button)

            const normalize = (text) => {
                if (!text) return '';

                const cleanedText = text.replace(/\s+/g, ' ').toUpperCase();

                const match = cleanedText.match(/-?\d+(?:[.,]\d{1,})?\s?[A-Z]{3}/);
                if (!match) {
                    console.warn('normalize() failed to match:', text);
                    return cleanedText.trim(); // fallback
                }

                const [amountPart, currencyPart] = match[0].split(' ');
                const number = Math.abs(parseFloat(amountPart.replace(',', ''))); 
                const currency = currencyPart;

                const formattedAmount = Number.isInteger(number) ? number.toFixed(0) : number.toFixed(2);
                return `${formattedAmount} ${currency}`;
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
            const firstRowStatus = await firstRow.locator('td').nth(4).textContent();
            const firstRowAmount = await firstRow.locator('td').nth(5).textContent();

            const status = firstRowStatus?.trim()
            const paymentfee = firstRowAmount?.trim()
            console.log("payment fee status-" + status)
            console.log("paymentfee-" + paymentfee)

             //Second row 
            const secondRow = rows.nth(1);
            const secondRowStatus = await secondRow.locator('td').nth(4).textContent();
            const secondRowAmount = await secondRow.locator('td').nth(5).textContent();

            const conversionstatus = secondRowStatus?.trim()
            const sellingamount = secondRowAmount?.trim()
            console.log("conversion status-" + conversionstatus)
            console.log("selling amount-" + sellingamount)


            console.log('Received paymentfee:', normalize(paymentfee))
            console.log('Received sellamount:', normalize(sellingamount));

            expect(normalize(paymentfee)).toBe(actual_paymentfee);
            expect(normalize(sellingamount)).toBe(actual_sellamount);


        }


        async verifyConversionofCurrencyForSell() {

            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.locator(this.amount_to_dropdown).selectOption('Sell')
            await this.page.fill(this.amount_to, '500')
            await this.page.waitForTimeout(3000)

            const filePath = path.join(__dirname, '../beneficiary_company.json');
            const { aud_beneficiary_company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const optionLocator = this.page.locator(this.select_beneficiary).locator('option', { hasText: new RegExp(aud_beneficiary_company_name, 'i') });
            const value = await optionLocator.getAttribute('value');
            await this.page.locator(this.select_beneficiary).selectOption({ value });

            //await this.page.locator(this.select_beneficiary).selectOption('Heaney - Stoltenberg (Commerzbank)')
            await this.page.locator(this.payment_charge_type).selectOption('Shared fee')
            await this.page.locator(this.payment_reason).selectOption('Investment related payment')
            await this.page.fill(this.payment_reference, '3456')
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)
            await this.page.pause()
            await this.page.click(this.next_button)
            await this.page.waitForSelector(this.quote_checkbox)
            await this.page.click(this.quote_checkbox)
            await this.page.click(this.convert_button)
            await this.page.waitForSelector(this.dealsuccess_ok)
            await this.page.click(this.dealsuccess_ok)

        }

        async verifyDirect_Conversion_is_possible_to_non_holding_currencies() {

            await this.page.click(this.eurowallet)
            await this.page.click(this.convert_funds)
            await this.page.waitForSelector(this.buy_currency)
            await this.page.locator(this.buy_currency).selectOption('AUD | AUD')
            await this.page.locator(this.amount_to_dropdown).selectOption('Sell')
            await this.page.fill(this.amount_to, '500')
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.payment_charge_type).selectOption('Shared fee')
            await this.page.locator(this.payment_reason).selectOption('Investment related payment')
            await this.page.fill(this.payment_reference, '3456')
            await this.page.click(this.get_otp)
            await this.page.waitForSelector(this.ok_got_it)
            await this.page.click(this.ok_got_it)

            await this.page.pause()
            await this.page.click(this.next_button)
            await expect(this.page.locator(this.beneficiary_error)).toBeVisible()
            console.log("Beneficiary required for non holding currency...")

        }
    }
