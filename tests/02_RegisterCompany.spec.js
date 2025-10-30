import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';
import { RegisterCompanypage } from '../pages/RegisterCompanypage';
import { Admindashboardpage } from '../pages/Admindashboardpage';



  

  /*test.skip('1. Verify registering a company', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.clickOnRegister_a_company()
    
    const register = new RegisterCompanypage(page)
    await register.newCompanyRegistration('India')
  
  })*/


  test('2. Verify validations for company registration', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.clickOnRegister_a_company()
    
    const register = new RegisterCompanypage(page)
    await register.validationsForCompanyRegistration()
  
  })
  


  test('3. Verify validations for duplicate company name', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.clickOnRegister_a_company()
    
    const register = new RegisterCompanypage(page)
    await register.ExistinguserCompanyRegistration()
    
  
  })


  

  

