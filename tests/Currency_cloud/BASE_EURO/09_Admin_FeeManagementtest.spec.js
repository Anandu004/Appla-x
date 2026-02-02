import { test, expect } from '@playwright/test'


import { Adminloginpage } from '../../../pages/Currency_cloud/BASE_EURO/Adminloginpage'
import { Loginpage } from '../../../pages/Currency_cloud/BASE_EURO/Loginpage'
import { Admin_FeeManagement } from '../../../pages/Currency_cloud/BASE_EURO/Admin_FeeManagement'





test(' Verify tariff fee deduction for transaction investigation', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)
    await fee.getReferenceNumberFromClient(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_Transaction_Investiagtion(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})



test(' Verify tariff fee deduction for Recall or cancel outgoing transaction', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_RecallorCancel_OutgoingTransaction(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Outgoing Transaction Amendment', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_OutgoingTransaction_Amendment(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})



test(' Verify tariff fee deduction for Cancel / Return Incoming Transaction', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_CancelorReturn_IncomingTransaction(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Annual Audit Reports', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_AnnualAudit_Reports(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Closing of Account', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_Closing_of_Account(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Change of Ownership structure / Review', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_Change_of_Ownership(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Confimation / Reference Letter', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_Confirmation_or_ReferenceLetter(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})


test(' Verify tariff fee deduction for Extraordinary Due Diligance fee', async ({ page }) => {

    const clientlogin = new Loginpage(page)
    await clientlogin.goToLoginPage()
    await clientlogin.giveLoginCredentials()

    const fee = new Admin_FeeManagement(page)
    await fee.getPrevious_Walletbalance(page)

    const login =  new Adminloginpage(page)
    await login.goToAdminLoginPage()
    await login.verifyAdminlogin()

    await fee.verify_Tariff_Fee_deduction_for_ExtraordinaryDueDiligance_fee(page)

    await clientlogin.goToLoginPage()
    //await clientlogin.giveLoginCredentials()
    await fee.getNew_Walletbalance(page)

})

