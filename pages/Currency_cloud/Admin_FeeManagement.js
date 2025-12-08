const { expect } = require("@playwright/test")
const fs = require('fs');
const path = require('path');

exports.Admin_FeeManagement =
    class Admin_FeeManagement {

        constructor(page) {

            this.page = page

            this.Euro_wallet = "//span[normalize-space()='Euro']"


            this.fee_management_tab = "//span[normalize-space()='Fee Management']"

            this.fee_type = "//select[@id='typeFilter']"



            this.Tariff_fee_deduction_tab = "//span[normalize-space()='Tariff Fee Deducution']"

            this.Apply_tariff_fee_button = "//button[normalize-space()='Apply Tariff Fee']"

            this.company_dropdown = "//select[@id='modal_company_id']"

            this.type_dropdown = "//select[@id='modal_fee_type_id']"

            this.fee_amount = "//input[@id='modal_fee_amount']"

            this.reference_no = "//input[@id='modal_reference_no']"

            this.description = "//textarea[@name='description']"

            this.submit_button = "//button[normalize-space()='Submit']"

            this.ok_button = "//button[normalize-space()='OK']"

            this.success_message = "//div[@id='swal2-html-container']"



            this.activity_log = "//span[@class='menu-title'][normalize-space()='Activity Logs']"



            this.wallet_list = "//div[@class='owl-stage']//div[@class='item']"

            this.available_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"


        }
        

        


        async getReferenceNumberFromClient(page) {


            await this.page.click(this.Euro_wallet)
            const referenceNo = (await this.page.locator("//table/tbody/tr[2]/td[4]//span").textContent())?.trim()
            console.log(" Extracted Reference No:", referenceNo)

            const filePath = path.join(__dirname, '../../reference_no.json')
            fs.writeFileSync(filePath, JSON.stringify({ referenceNo }))

        }

        async getPrevious_Walletbalance(page) {

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
                    this.previousBalance = previous_wallet_balance

                }

            }

        }


        async getNew_Walletbalance(page) {

            await this.page.waitForTimeout(3000)
            await this.page.reload()
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
                    const new_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Actual balance in the wallet (EUR):", new_wallet_balance)

                    const expected = this.previousBalance - this.feeAmount
                    console.log("Expected New Balance:", expected)


                    if (Math.abs(new_wallet_balance - expected) < 0.01) {
                        console.log("✔ Wallet balance deduction correct!");
                    } else {
                        throw new Error(` Incorrect balance deduction. Expected: ${expected}, Actual: ${newBalance}`);
                    }

                }

            }

        }




        async verify_Tariff_Fee_deduction_for_Transaction_Investiagtion(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../reference_no.json')
            const { referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))

            console.log(" Reference retrieved inside method:", referenceNo)

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Transaction Investigation"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR TRANSACTION INVESTIGATION:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Transaction Investigation')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())

            //Enter reference number if present
            const refFieldVisible = await this.page.locator(this.reference_no).isVisible()
            if (refFieldVisible) {
                console.log("Entering reference number:", referenceNo)
                await this.page.fill(this.reference_no, referenceNo)
            } else {
                console.log("Reference Number not required for this fee type.")
            }


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)

            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            // Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_RecallorCancel_OutgoingTransaction(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../reference_no.json')
            const { referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            console.log(" Reference retrieved inside method:", referenceNo)

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Recall or Cancel Outgoing Transaction"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR RECALL OR CANCEL OUTGOING TRANSACTION:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Recall or Cancel Outgoing Transaction')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())

            //Enter reference number if present
            const refFieldVisible = await this.page.locator(this.reference_no).isVisible()
            if (refFieldVisible) {
                console.log("Entering reference number:", referenceNo)
                await this.page.fill(this.reference_no, referenceNo)
            } else {
                console.log("Reference Number not required for this fee type.")
            }


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)

            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            // Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_OutgoingTransaction_Amendment(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../reference_no.json')
            const { referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            //const referenceNo = Admin_FeeManagement.globalReferenceNo
            console.log(" Reference retrieved inside method:", referenceNo)

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Outgoing Transaction Amendment"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR OUTGOING TRANSACTION AMENDMENT:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Outgoing Transaction Amendment')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)

            //Enter reference number if present
            const refFieldVisible = await this.page.locator(this.reference_no).isVisible()
            if (refFieldVisible) {
                console.log("Entering reference number:", referenceNo)
                await this.page.fill(this.reference_no, referenceNo)
                //await this.page.fill(this.reference_no, String(referenceNo || ""));
            } else {
                console.log("Reference Number not required for this fee type.")
            }


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)

            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(referenceNo)


        }



         async verify_Tariff_Fee_deduction_for_CancelorReturn_IncomingTransaction(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../reference_no.json')
            const { referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            //const referenceNo = Admin_FeeManagement.globalReferenceNo
            console.log(" Reference retrieved inside method:", referenceNo)

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Cancel / Return Incoming Transaction"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR CANCEL / RETURN INCOMING TRANSACTION:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Cancel / Return Incoming Transaction')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)

            //Enter reference number if present
            const refFieldVisible = await this.page.locator(this.reference_no).isVisible()
            if (refFieldVisible) {
                console.log("Entering reference number:", referenceNo)
                await this.page.fill(this.reference_no, referenceNo)
                //await this.page.fill(this.reference_no, String(referenceNo || ""));
            } else {
                console.log("Reference Number not required for this fee type.")
            }


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)

            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_AnnualAudit_Reports(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Annual Audit Reports"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR ANNUAL AUDIT REPORTS:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Annual Audit Reports')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const reference_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Status:", status)


            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(reference_no).toBe('N/A')
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
           


        }


        async verify_Tariff_Fee_deduction_for_Closing_of_Account(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Closing of Account"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR CLOSING OF ACCOUNT:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Closing of Account')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const reference_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Status:", status)


            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(reference_no).toBe('N/A')
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
           

        }


         async verify_Tariff_Fee_deduction_for_Change_of_Ownership(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Change of Ownership Structure / Review"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR CHANGE OF OWNERSHIP STRUCTURE / REVIEW:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Change of Ownership Structure / Review')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const reference_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Status:", status)


            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(reference_no).toBe('N/A')
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
           

        }



        async verify_Tariff_Fee_deduction_for_Confirmation_or_ReferenceLetter(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Confirmation / Reference Letter"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR CHANGE OF CONFIRMATION / REFERENCE LETTER:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Confirmation / Reference Letter')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const reference_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Status:", status)


            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(reference_no).toBe('N/A')
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
           

        }



        async verify_Tariff_Fee_deduction_for_ExtraordinaryDueDiligance_fee(page) {

            const filePath = path.join(__dirname, '../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            await this.page.click(this.fee_management_tab)
            await this.page.locator(this.fee_type).selectOption('Tariff Fee')

            //Extract fee amount for fee type
            const feeTypeToApply = "Extraordinary Due Diligence Fee"
            const feeAmountInput = this.page.locator(`//div[contains(@class,'row') and contains(@class,'dynamic-field')]//strong[normalize-space(text())='${feeTypeToApply}']/ancestor::div[contains(@class,'dynamic-field')]//input[@name='fee_amount[]']`)
            const expectedFeeAmount = await feeAmountInput.inputValue()
            this.feeAmount = Number(expectedFeeAmount)
            console.log("EXPECTED FEE AMOUNT FOR EXTRAORDINARY DUE DILIGENCE FEE:", expectedFeeAmount)

            await this.page.click(this.Tariff_fee_deduction_tab)
            await this.page.click(this.Apply_tariff_fee_button)
            await this.page.locator(this.company_dropdown).selectOption(company_name)
            await this.page.waitForTimeout(3000)
            await this.page.locator(this.type_dropdown).selectOption('Extraordinary Due Diligence Fee')

            //verify autopopulated fee amount matches the real amount
            const autoFee = await this.page.inputValue("input[name='fee_amount']")
            console.log("AUTOPOPULATED FEE:", autoFee)
            expect(autoFee.trim()).toBe(expectedFeeAmount.trim())
            await this.page.waitForTimeout(3000)


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const reference_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Status:", status)


            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(reference_no).toBe('N/A')
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
           

        }



    }