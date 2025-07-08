import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';
import { RegisterCompanypage } from '../pages/RegisterCompanypage';
import { Admindashboardpage } from '../pages/Admindashboardpage';




  /*test('Verify new account status is locked before admin approves', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

    const dashboard = new Dashboardpage(page)
    dashboard.new_account_Status_before_AdminApproval()

  
  })

  

  test('Verify registering a company', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.clickOnRegister_a_company()
    
    const register = new RegisterCompanypage(page)
    await register.newCompanyRegistration('India')
  
  
  })

  test('Verify validations for company registration', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.clickOnRegister_a_company()
    
    const register = new RegisterCompanypage(page)
    await register.validationsForCompanyRegistration()
  
  })*/

   test('Verify wallet creation from client account', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.walletCreationFrom_ClientAccount()
   
  })

  

