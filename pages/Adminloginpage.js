const { expect } = require("@playwright/test")
const { faker } = require('@faker-js/faker');
//const { TIMEOUT } = require("dns")

exports.Adminloginpage =
    class Adminloginpage {

        constructor(page) {

            this.page = page

            this.emailfield = "//input[@placeholder='Email']"

            this.passwordfield = "//input[@placeholder='Password']"

            this.signinbutton = "//button[@id='kt_sign_in_submit']"
 

        }

        async goToAdminLoginPage(){

            //await this.page.setViewportSize({ width: 1920, height: 1040 });
            await this.page.setViewportSize({ width: 1366, height: 768 });
            await this.page.goto('https://admin.appla-x.work/en/login')
        }


        async verifyAdminlogin(email,password){

            await this.page.fill(this.emailfield, email)
            await this.page.fill(this.passwordfield, password)
            await this.page.click(this.signinbutton)
            await this.page.pause()
   
        }
    
    }