const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test')

exports.Loginpage=
class Loginpage{

    constructor(page){
        this.page=page

        this.email_field="//input[@placeholder='Email']"

        this.password_field="//input[@placeholder='Password']"

        this.signIn_button='#kt_sign_in_submit'

        this.loginError_message="//h2[@id='swal2-title']"

        this.okbuttonfor_error = "button[class='swal2-confirm swal2-styled']"

        this.email_empty_validation = "//span[normalize-space()='The email field is required.']"

        this.password_empty_validation = "//span[normalize-space()='The password field is required.']"


        this.forgot_password = "//a[normalize-space()='Forgot Password?']"

        this.recover_password_email = "//input[@placeholder='Email']"

        this.send_passwordresetlink_button = "//span[@class='indicator-label']"

        this.ok_button_for_passwordreset = "//button[@class='swal2-confirm swal2-styled']"


        this.sign_up_link = "//a[normalize-space()='Sign Up']"

        this.firstName_field = "//input[@name='first_name']"

        this.lastName_field = "//input[@name='last_name']"

        this.email_field = "//input[@name='email']"

        this.mobile_field = "//input[@name='mobile']"

        this.reg_password_field = "//input[@id='passwordInput']"

        this.repeatPassword_field = "//input[@id='password-confirm']"

        this.terms_and_conditions = "//input[@name='toc']"

        this.signup_button = "//button[@id='kt_sign_up_submit']"

        this.registration_success_message = "//h2[@id='swal2-title']"

        this.registration_success_ok = "//button[@class='swal2-confirm swal2-styled']"



    }

    async goToLoginPage(){

        //await this.page.setViewportSize({ width: 1920, height: 1040 });
        await this.page.setViewportSize({ width: 1366, height: 768 });
        await this.page.goto('https://account.appla-x.work/login')
        //await this.page.screenshot({ path: 'layout_debug.png', fullPage: true });

    }

    async giveLoginCredentials(email,password){

        await this.page.fill(this.email_field,email)
        await this.page.fill(this.password_field,password)
        await this.page.click(this.signIn_button)
        await this.page.pause()
           
    }


    async loginerror(){

        await this.page.waitForSelector(this.loginError_message)
        const error_msg = this.page.locator(this.loginError_message); 
        console.log(await error_msg.textContent())
        await this.page.click(this.okbuttonfor_error)

    }

    
    async validationsForLogin(){

        console.log("Signing in without email and password")
        await this.page.click(this.signIn_button)
        await this.page.pause()
        const emailfield_error = await this.page.locator(this.email_empty_validation).isVisible()
        const passwordfield_error = await this.page.locator(this.password_empty_validation).isVisible()
        if(emailfield_error && passwordfield_error){
            const errormsg_1 = await this.page.locator(this.email_empty_validation).textContent()
            const errormsg_2 = await this.page.locator(this.password_empty_validation).textContent()
            console.log("Missing email field-"+errormsg_1)
            console.log("Missing password field-"+errormsg_2)
        }else{
            console.log("No error messages dispayed")
        }
        await this.page.reload()
        await this.page.waitForTimeout(2000)



        console.log("Signing in with email and without password")
        await this.page.fill(this.email_field,'anandu.a@seqato.com')
        await this.page.click(this.signIn_button)
        await this.page.waitForTimeout(4000)
        const emailfield_error1 = await this.page.locator(this.email_empty_validation).isVisible()
        const passwordfield_error1 = await this.page.locator(this.password_empty_validation).isVisible()
          if(!emailfield_error1 && passwordfield_error1){
            const errormsg_3 = await this.page.locator(this.password_empty_validation).textContent()
            console.log("Missing password field-"+errormsg_3)
        }else{
            console.log("No error message dispayed for empty password")
        }
        await this.page.reload()
        await this.page.waitForTimeout(2000)



        console.log("Signing in with password and without email")
        await this.page.fill(this.password_field,'Anandu@123')
        await this.page.click(this.signIn_button)
        await this.page.waitForTimeout(4000)
        const emailfield_error2 = await this.page.locator(this.email_empty_validation).isVisible()
        const passwordfield_error2 = await this.page.locator(this.password_empty_validation).isVisible()
          if(emailfield_error2 && !passwordfield_error2){
            const errormsg_1 = await this.page.locator(this.email_empty_validation).textContent()
            console.log("Missing password field-"+errormsg_1)
        }else{
            console.log("No error message dispayed for empty email")
        }    

    }


    async registraion_And_Login_of_newUser(){

       await this.page.waitForSelector(this.sign_up_link)
       await this.page.click(this.sign_up_link)
       await this.page.waitForSelector(this.firstName_field)

       const firstName = faker.person.firstName();
       const lastName = faker.person.lastName();
       const email = (firstName+lastName+"@gmail.com").toLowerCase()
       const password = firstName+"@1234"
       

       //Registering a new user
       await this.page.fill(this.firstName_field,firstName)
       await this.page.fill(this.lastName_field,lastName)
       await this.page.fill(this.email_field,email)
       console.log("Email-"+email)

       const randomDigits = faker.number.int({ min: 100000, max: 999999 }); // 6 digits
       const phoneNumber = `22${randomDigits}`;
       await this.page.fill(this.mobile_field,phoneNumber)
       await this.page.type(this.reg_password_field,password,{ delay: 100 })
       await this.page.type(this.repeatPassword_field,password,{ delay: 100 })
       console.log("Password-"+password)
       await this.page.click(this.terms_and_conditions)
       await this.page.pause()
       await this.page.click(this.signup_button)
       //await this.page.waitForTimeout(4000)
       await expect(this.page.locator(this.registration_success_message)).toBeVisible({ timeout: 3000 });
       const messageText = await this.page.locator(this.registration_success_message).textContent();
       console.log( messageText?.trim());

       await this.page.click(this.registration_success_ok)
       await this.page.waitForTimeout(3000)

       //sign in with new user
        await this.page.fill(this.email_field,email)
        await this.page.fill(this.password_field,password)
        await this.page.click(this.signIn_button)
        await this.page.pause()
        await this.page.waitForTimeout(4000)

    }

}
