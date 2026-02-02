const { expect } = require("@playwright/test")
const fs = require('fs');
const path = require('path');

exports.Admin_FeeManagement =
    class Admin_FeeManagement {

        constructor(page) {

            this.page = page

            this.Usd_wallet = "//span[normalize-space()='USD']"


            this.fee_management_tab = "//span[normalize-space()='Fee Management']"

            this.fee_type = "//select[@id='typeFilter']"



            this.Tariff_fee_deduction_tab = "//span[normalize-space()='Tariff Fee Deduction']"

            this.Apply_tariff_fee_button = "//button[normalize-space()='Apply Tariff Fee']"

            this.company_dropdown = "//select[@id='modal_company_id']"

            this.type_dropdown = "//select[@id='modal_fee_type_id']"

            this.fee_amount = "//input[@id='modal_fee_amount']"

            this.reference_no = "//input[@id='modal_reference_no']"

            this.description = "//textarea[@name='description']"

            this.submit_button = "//button[normalize-space()='Submit']"

            this.ok_button = "//button[normalize-space()='OK']"

            this.success_message = "//div[@id='swal2-html-container']"

            this.search_record = "//input[@id='keywords']"

            this.filter_button = "//button[normalize-space()='Filter']"



            this.activity_log = "//span[@class='menu-title'][normalize-space()='Activity Logs']"



            this.wallet_list = "//div[@class='owl-stage']//div[@class='item']"

            this.available_balance = "//span[@class='fw-semibold fs-2x text-gray-800 lh-1 ls-n2']"


        }





        async getReferenceNumberFromClient(page) {


            await this.page.click(this.Usd_wallet)
            const usd_referenceNo = (await this.page.locator("//table/tbody/tr[2]/td[4]//span").textContent())?.trim()
            console.log(" Extracted Reference No:", usd_referenceNo)

            const filePath = path.join(__dirname, '../../../reference_no.json')

            let data = {}
            if (fs.existsSync(filePath)) {
                data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }

            // 2. Update ONLY the USD reference
            data.usd_referenceNo = usd_referenceNo;

            // 3. Save back to JSON
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

            //fs.writeFileSync(filePath, JSON.stringify({ usd_referenceNo }))

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

                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const previous_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Available balance in the wallet (USD):", previous_wallet_balance)
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

                if (firstThree === 'usd') {

                    const balanceText = await item.locator(this.available_balance).textContent()
                    const cleanedBalance = balanceText?.replace(/[^\d.]/g, '')
                    const new_wallet_balance = parseFloat(cleanedBalance)
                    console.log("Actual New balance in the wallet (USD):", new_wallet_balance)

                    const expected = this.previousBalance - this.convertedAmount
                    console.log("Expected New Balance:", expected)


                    if (Math.abs(new_wallet_balance - expected) < 0.01) {
                        console.log(" Wallet balance deduction correct!")
                    } else {
                        throw new Error(` Incorrect balance deduction. Expected: ${expected}, Actual: ${new_wallet_balance}`)
                    }

                }

            }

        }




        async verify_Tariff_Fee_deduction_for_Transaction_Investiagtion(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../../reference_no.json')
            const { usd_referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))

            console.log(" Reference retrieved inside method:", usd_referenceNo)

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
                console.log("Entering reference number:", usd_referenceNo)
                await this.page.fill(this.reference_no, usd_referenceNo)
            } else {
                console.log("Reference Number not required for this fee type.")
            }


            await this.page.fill(this.description, 'Description')
            await this.page.click(this.submit_button)
            await this.page.waitForTimeout(2000)
            await expect(this.page.locator(this.success_message)).toBeVisible()
            await this.page.click(this.ok_button)
            await this.page.waitForTimeout(3000)

            //search for reference no in list
            await this.page.fill(this.search_record, usd_referenceNo)
            await this.page.click(this.filter_button)
            await this.page.waitForTimeout(3000)

            const rows = await this.page.locator("//table/tbody/tr")
            const rowCount = await rows.count()
            //  No rows found → throw error
            if (rowCount === 0) {
                 throw new Error(` No record found for Reference No: ${usd_referenceNo}`)
            }


            // Extract values from Tariff fee deduction list
            const firstRow = await this.page.locator("//table/tbody/tr[1]")
            const actualCompany = (await firstRow.locator("td:nth-child(2)").textContent()).trim()
            const actualType = (await firstRow.locator("td:nth-child(3)").textContent()).trim()
            const actualFee = (await firstRow.locator("td:nth-child(4)").textContent()).trim()
            const ref_no = (await firstRow.locator("td:nth-child(7)").textContent()).trim()
            const status = (await firstRow.locator("td:nth-child(8)").textContent()).trim()

            console.log("VALIDATION IN TARIFF FEE DEDUCTION LIST →")
            console.log("Company:", actualCompany)
            console.log("Type:", actualType)
            console.log("Fee Amount:", actualFee)
            console.log("Reference no:", ref_no)
            console.log("Status", status)

            expect(actualCompany).toContain(company_name)
            expect(actualType).toBe(feeTypeToApply)
            expect(Number(actualFee)).toBe(Number(expectedFeeAmount))
            expect(ref_no).toBe(usd_referenceNo)
            expect(status).toBe('Completed')

            await this.page.click(this.activity_log)
            await this.page.fill(this.search_record, usd_referenceNo)
            await this.page.click(this.filter_button)
            await this.page.waitForTimeout(3000)

            const logrows = await this.page.locator("//table/tbody/tr")
            const log_rowCount = await logrows.count()
            //  No rows found → throw error
            if (log_rowCount === 0) {
                 throw new Error(` No record found in Activity log for Reference No: ${usd_referenceNo}`)
            }

            console.log("VALIDATION IN ACTIVITY LOG →")
            await this.page.waitForTimeout(4000)
            const log_Row = await this.page.locator("//table/tbody/tr[1]")
            const module = (await log_Row.locator("td:nth-child(3)").textContent()).trim()
            const actionMessage = (await log_Row.locator("td:nth-child(4)").textContent()).trim()

            console.log("Module :", module)
            console.log("Action :", actionMessage)

            // Extract converted amount using regex
            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            // Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(usd_referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_RecallorCancel_OutgoingTransaction(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../../reference_no.json')


            const { usd_referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            console.log(" Reference retrieved inside method:", usd_referenceNo)

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
                console.log("Entering reference number:", usd_referenceNo)
                await this.page.fill(this.reference_no, usd_referenceNo)
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            // Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(usd_referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_OutgoingTransaction_Amendment(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../../reference_no.json')
            const { usd_referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            //const referenceNo = Admin_FeeManagement.globalReferenceNo
            console.log(" Reference retrieved inside method:", usd_referenceNo)

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
                console.log("Entering reference number:", usd_referenceNo)
                await this.page.fill(this.reference_no, usd_referenceNo)
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(usd_referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_CancelorReturn_IncomingTransaction(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            const referencePath = path.join(__dirname, '../../../reference_no.json')
            const { usd_referenceNo } = JSON.parse(fs.readFileSync(referencePath, 'utf-8'))


            //const referenceNo = Admin_FeeManagement.globalReferenceNo
            console.log(" Reference retrieved inside method:", usd_referenceNo)

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
                console.log("Entering reference number:", usd_referenceNo)
                await this.page.fill(this.reference_no, usd_referenceNo)
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)
            expect(actionMessage).toContain(usd_referenceNo)


        }



        async verify_Tariff_Fee_deduction_for_AnnualAudit_Reports(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)



        }


        async verify_Tariff_Fee_deduction_for_Closing_of_Account(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)


        }


        async verify_Tariff_Fee_deduction_for_Change_of_Ownership(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)


        }



        async verify_Tariff_Fee_deduction_for_Confirmation_or_ReferenceLetter(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)


        }



        async verify_Tariff_Fee_deduction_for_ExtraordinaryDueDiligance_fee(page) {

            const filePath = path.join(__dirname, '../../../companyname.json')
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

            const convertedMatch = actionMessage.match(/Converted Amount:\s*([0-9.]+)/)
            const convertedAmount = Number(convertedMatch[1]);
            console.log("Extracted Converted Amount:", convertedAmount)
            this.convertedAmount = convertedAmount

            //Validations on action message in activity log
            expect(actionMessage).toContain(feeTypeToApply)
            expect(actionMessage).toContain(`${expectedFeeAmount} EUR`)
            expect(actionMessage).toContain(company_name)


        }



    }