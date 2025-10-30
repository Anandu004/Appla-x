import { test, expect } from '@playwright/test';


import { Adminloginpage } from '../pages/Adminloginpage';
import { Admindashboardpage } from '../pages/Admindashboardpage';
import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';

test('1. Verify Account status gets active after company approval by admin', async ({ page }) => {

    const login1 =  new Adminloginpage(page)
    await login1.goToAdminLoginPage()
    await login1.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyCompanyApprovalByAdmin()

    //const userPage = await context.newPage();
    const login2 = new Loginpage(page)
    await login2.goToLoginPage()
    await login2.giveLoginCredentials()

    const db = new Dashboardpage(page)
    await db.new_account_Status_after_AdminApproval()
    
})



test('2. Verify setting company maintanence fee', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyMaintanencefee()
    
})



test('3.Verfi When payment types are set globally in the Fee Management tab, they are automatically applied to all specific companies.',async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.gobal_paymentfee_is_also_reflected_in_specific_companies()

})



test('4. Verify different payment fees  can be set for different payment types.',async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.paymentFeeSettingFor_different_payment_types()

})







test('5. Verify funding in non base wallet without base wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyfunding_in_nonBaseWallet_without_BaseCurrencyWallet()
    
})



test('6. Verify funding in holding account without any amount in base wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyfunding_in_usd_without_anyAmount_in_baseWallet()
    
})





test('7. Verify wallet creation for base currency wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyWalletcreation() 

    
})


test('8. Verify get fee calculation varies from one payment type to other',async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.checkGetFee_calculation()

})



test('9. Verify wallet creation for USD ', async ({ page }) => {

    const login =  new Adminloginpage(page)

    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyWalletcreation_for_usd() 

    
})



test('10. Verify funding in holding account with amount in base wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyfunding_in_usd_with_Balance_in_baseWallet()
    
})



test('11. Verify wallet creation for GBP', async ({ page }) => {

    const login =  new Adminloginpage(page)

    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyWalletcreation_for_gbp() 
    
})

/*test('Verify funding done in non holding accounts is deposited in base currency wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingdoneInnon_holding_currencyWallets_areConvertedandDeposited_in_basecurrency_wallet()
    
})

test('Verify wallet creation for non holding currencies', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyWalletcreationforNonbase_currency()
    await dashboard.verifyvalidationforfundingFornonbasecurrency()
    
})*/


test('12. Verify creating wallet for non holding accounts', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.createAndFundWalletsForAllCurrenciesRandomly()
   
    
})



test('13. Verify funding limit for AUD', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_aud()
   
    
})



test('14. Verify funding limit for CHF', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_chf()
   
    
})



test('15. Verify funding limit for CAD', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_cad()
   
    
})



test('16. Verify funding limit for NZD', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_nzd()
   
    
})



test('17. Verify funding limit for SGD', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_sgd()
   
    
})



test('18. Verify funding limit for HKD', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_hkd()
   
    
})




test('19. Verify funding limit for JPY', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verify_fundingLimit_for_jpy()
   
    
})



test('20. Verify funding in non holding account with amount in base wallet', async ({ page }) => {

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    const dashboard = new Admindashboardpage(page)
    await dashboard.verifyfunding_in_aud_with_balance_in_baseWallet()

    
})


