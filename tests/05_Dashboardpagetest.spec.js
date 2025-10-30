import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';


 test('1. Verify wallet creation from client account', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
    
    const dashboard =  new Dashboardpage(page)
    await dashboard.walletCreationFrom_ClientAccount()
   
  })

   test('2. Verify that all the created wallets are populated in the dashboard', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.check_created_Wallet_is_populated_in_dashboard()
   
  })

   test('3. Verify User is naviagted to wallet details page on clicking wallet', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.check_naviagtion_to_walletDetails_page()
   
  })

   test('4. Verify all tabs are visible under wallet details page', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.check_all_tabs_are_visile_in_walletDetails_page()
   
  })


   test('5. Verify statement button in wallet details page', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.check_statement_button_in_wallet()
   
  })

  test('6. Verify home page redirects to wallet details page', async ({ page }) => {

    const login = new Loginpage(page)
    await login.goToLoginPage()
    await login.giveLoginCredentials()
  
    const dashboard =  new Dashboardpage(page)
    await dashboard.check_homePage_redirects_to_walletPage()
   
  })


