import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';

test('Verify login with valid credentials', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const dashboard =  new Dashboardpage(page)
  await dashboard.appla_x_title()
  await page.waitForTimeout(3000)


})

test('Verify login with Invalid credentials', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu@seqato.com','Anandu@12345')
  await login.loginerror()


})

test('Verify validations for login', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.validationsForLogin()

})

test('Verify new user registration and login', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.registraion_And_Login_of_newUser()
 
})

