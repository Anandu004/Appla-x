const { expect } = require("@playwright/test")
//const { TIMEOUT } = require("dns")
const path = require('path');
const fs = require('fs');



exports.DocumentUploadpage =
    class DocumentUploadpage{

        constructor(page) {

            this.page =  page

            this.ok_button =  "button.swal2-confirm"

            this.uploaddocument_tab =  "//li[@class='nav-item mt-5'][5]"

            this.upload_1 = "//button[@id='document_upload_drawer_button']"

            this.required_options =  "//option[@data-required='1']"

            this.documenttype1 =  "//select[@id='document_type_id']"

            this.issuedatefield1 = "//input[@id='issued_on']"

            this.issuedateselect1 = "(//div[@class='caleran-day caleran-today'])[6]"

            this.expirydatefield1 =  "//input[@id='expires_on']"

            this.expiryyearclick = "//body/div[19]/div[2]/div[2]/div[1]/div[1]/span[1]"

            this.expiryyearselect = "//div[normalize-space()='2030']"

            this.expirydateselect =  "//body/div[19]/div[2]/div[2]/div[1]/div[2]/div[39]"

            this.addfile1 =  "//input[@type='file' and contains(@class, 'media-library-hidden')]"

            this.uploadbutton1 = "//button[@id='submit_button1']"




            this.upload_2 = "//button[@id='document_upload_individual_drawer_button']"

            this.businessofficials = "//select[@name='business_officials']"

            this.documenttype2 = "//select[@id='identification_type_test']"

            this.required_options_2 = "//option[contains(text(), 'Curriculum vitae') or contains(text(), 'Passport/ID') or contains(text(), 'Proof of the permanent residential address')]"

            this.issuedatefield2 = "//input[@id='issued_on_id']"

            this.issuedateselect2 = "//body[1]/div[20]/div[2]/div[2]/div[1]/div[2]/div[11]"

            
            this.expirydatefield2 = "//input[@id='expires_on_id']"

            this.expiry_year = "//body/div[21]/div[2]/div[2]/div[1]/div[1]/span[1]"

            this.expiryyear_select = "//div[normalize-space()='2030']"

            this.expirydateselect2 = "//body/div[21]/div[2]/div[2]/div[1]/div[2]/div[39]"

            this.addfile2 = "//input[@type='file' and contains(@class, 'media-library-hidden')]"

            this.uploadbutton2 = "//button[@id='submit_button']"


            this.togglebutton = "//input[@id='accept_terms']"

 
            this.submitkyc_button = "//button[normalize-space()='Submit KYC']"


            this.dialogbox = "//div[@id='swal2-html-container']"

            this.Account_locked_status = "//h1[normalize-space()='Account Locked - KYC In review']"

            this.largeFile_error = "//div[normalize-space()='Please select a file smaller than 10 MB.']"

            

        }

        
         async uploadCompanyDocumentsForKyc() {

            const filenames = [
               
                'tests\\Document_upload\\Memorandum and Articles of Association of the company.pdf',
            
                'tests\\Document_upload\\Proof of permanent company address.pdf',
                
                'tests\\Document_upload\\Certificate of Good Standing.pdf',
              
                'tests\\Document_upload\\Certificate of Incorporation.pdf',
              
                'tests\\Document_upload\\Certificate of Registered Office.pdf',
              
                'tests\\Document_upload\\Certificate of Shareholders.pdf',
               
                'tests\\Document_upload\\Recent Financial Statements  Management Accounts.pdf',
               
                'tests\\Document_upload\\Tax Returns.pdf'
                                             
            ]

            const requiredOptions = await this.page.locator(this.required_options);
            const count = await requiredOptions.count();
            await this.page.click(this.ok_button)
            

            for (let i = 0; i < count; i++) {
                await this.page.click(this.upload_1)
                await this.page.waitForSelector(this.documenttype1, { state: 'visible' });


                const optionValue = await requiredOptions.nth(i).getAttribute('value');
                await this.page.locator(this.documenttype1).selectOption(optionValue);

                const isIssueVisible = await this.page.locator(this.issuedatefield1).isVisible().catch(() => false);
                if (isIssueVisible) {
                    await this.page.click(this.issuedatefield1);
                    await this.page.click(this.issuedateselect1);
                }

                const isExpiryVisible = await this.page.locator(this.expirydatefield1).isVisible().catch(() => false);
                if (isExpiryVisible) {
                    await this.page.click(this.expirydatefield1)
                    await this.page.click(this.expiryyearclick)
                    await this.page.click(this.expiryyearselect)
                    await this.page.click(this.expirydateselect)

                }

            const filePath  = path.resolve(filenames[i])
            await this.page.locator(this.addfile1).nth(0).setInputFiles(filePath)
            await this.page.waitForTimeout(5000)
            await this.page.click(this.uploadbutton1)
            await this.page.waitForSelector(this.ok_button, { state: 'visible' });
            await this.page.click(this.ok_button)

        }

        }

        async uploadIndividualDocumentsforKyc() {

            const filenames = [
               
                'tests\\Document_upload\\Curriculum vitae.pdf',
            
                'tests\\Document_upload\\Passport.pdf',
                
                'tests\\Document_upload\\Proof of permanent residential address.pdf'
            ]

            const requiredOptions = await this.page.locator(this.required_options_2);
            const count = await requiredOptions.count();

            for (let i = 0; i < count; i++) {
                await this.page.click(this.upload_2)
                await this.page.waitForSelector(this.businessofficials, { state: 'visible' });

                const filePath1 = path.join(__dirname, '../businessofficial.json');
                const { fullName } = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
                await this.page.locator(this.businessofficials).selectOption({ label: fullName });


                const optionValue = await requiredOptions.nth(i).getAttribute('value');
                await this.page.locator(this.documenttype2).selectOption(optionValue);

                const isIssueVisible = await this.page.locator(this.issuedatefield2).isVisible().catch(() => false);
                if (isIssueVisible) {
                    await this.page.click(this.issuedatefield2);
                    await this.page.click(this.issuedateselect2);
                }

                const isExpiryVisible = await this.page.locator(this.expirydatefield2).isVisible().catch(() => false);
                if (isExpiryVisible) {
                    await this.page.click(this.expirydatefield2)
                    await this.page.click(this.expiry_year)
                    await this.page.click(this.expiryyear_select)
                    await this.page.click(this.expirydateselect2)
    
                }

            const filePath  = path.resolve(filenames[i])
            await this.page.locator(this.addfile2).nth(1).setInputFiles(filePath)
            await this.page.waitForTimeout(5000)
            await this.page.click(this.uploadbutton2)
            await this.page.waitForSelector(this.ok_button, { state: 'visible' })
            await this.page.click(this.ok_button)


        }
            await this.page.click(this.togglebutton)
            await this.page.click(this.submitkyc_button)

            const filePath = path.join(__dirname, '../companyname.json');
            const { company_name } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const actualmessage = await this.page.locator(this.dialogbox).textContent()
            console.log(actualmessage)
            const expectedmessage = `You are now operating under the company ${ company_name }`
            expect(actualmessage?.trim()).toContain(expectedmessage);

            await this.page.click(this.ok_button)

            await this.page.waitForSelector(this.Account_locked_status)
            const accountstatus = await this.page.locator(this.Account_locked_status).textContent()
            console.log("Status of Account before admin approval-"+" "+accountstatus)
            expect(accountstatus?.trim()).toContain('Account Locked - KYC In review');
    
            
        }

        async uploadLarge_file_size_ForKyc() {

             const filenames = [
               
                'tests\\Document_upload\\Large file.zip'
            ]

            await this.page.click(this.ok_button)
            await this.page.click(this.upload_1)
            await this.page.waitForSelector(this.documenttype1, { state: 'visible' })

            //await this.page.locator(this.documenttype1).selectOption(' Memorandum and Articles of Association of the company. * ')
            await this.page.locator(this.documenttype1).selectOption('11');
            await this.page.click(this.issuedatefield1)
            await this.page.click(this.issuedateselect1)

            const filePath = path.resolve(filenames[0])
            await this.page.locator(this.addfile1).nth(0).setInputFiles(filePath)
            await this.page.waitForTimeout(5000)
            await expect(this.page.locator(this.largeFile_error)).toBeVisible()
            const error_msg = await this.page.locator(this.largeFile_error).textContent()
            console.log("Uploading failed - "+error_msg)
            await this.page.click(this.ok_button)


         }

    
    }