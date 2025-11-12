const { expect } = require("@playwright/test")
const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');
//const { TIMEOUT } = require("dns")

exports.Adminloginpage =
    class Adminloginpage {

        constructor(page) {

            this.page = page

            this.emailfield = "//input[@placeholder='Email']"

            this.passwordfield = "//input[@placeholder='Password']"

            this.signinbutton = "//button[@id='kt_sign_in_submit']"


            const dataPath = path.join(__dirname, '../TestData/Login_testdata.json')
            this.dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
                    
            this.data = this.dataset["Admin Login Credentials"]
 

        }

        async goToAdminLoginPage(){

            await this.page.setViewportSize({ width: 1920, height: 1040 });
            //await this.page.setViewportSize({ width: 1366, height: 768 });
            await this.page.goto('https://admin.appla-x.work/en/login')
        }


        async verifyAdminlogin(){

            await this.page.fill(this.emailfield, this.data.Email)
            await this.page.fill(this.passwordfield, this.data.Password)
            await this.page.click(this.signinbutton)
   
        }
    
    }