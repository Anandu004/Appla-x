import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';

test('1. Verify login with valid credentials', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  //await login.giveLoginCredentials('ajay.vr@seqato.com','Qwerty123$')

  const dashboard =  new Dashboardpage(page)
  await dashboard.appla_x_title()
  await page.waitForTimeout(3000)

})



test('2. Verify login with Invalid credentials', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveInvalidLoginCredentials()
  //await login.giveLoginCredentials('ajay.vr@seqato.com','Qwerty123$')
  await login.loginerror()

})



test('3. Verify validations for login', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.validationsForLogin()

})



test('4. Verify new user registration and login', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.registraion_And_Login_of_newUser()
 
})


/*test.skip('5. Verify new user registration and login with empty data', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.registration_And_Login_of_newUser_With_EmptyData()
 
 
})*/

 
test('6. Verify new user registration with invalid emailid', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.NewUser_Registration_With_InvalidEmailID()
 
})

 
test('7. Verify new user registration with special character check in the firstname and lastname field', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.NewUser_Registration_With_SpecialCharacters_Firstname_Lastname()
 
})

 
test('8. Verify new user registration with different Password in the repeat password field', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.NewUser_Registration_With_PasswordMistmach()
 
})



test('9. Verify new user registration with existing user details', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.registration_And_Login_of_Existinguserdetils()
 
})


 
test('10. Verify Forgot password page redirection', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.forgot_password_Page_Redirection()
 
})



test('11. Verify Terms and condition without checking the box', async ({ page }) => {
 
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.NewUser_Registration_Without_TermsandCondition()
  
  
})
 
 
 