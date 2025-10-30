
import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Beneficiarypage } from '../pages/Beneficiarypage';

test('1. Verify Beneficiary creation for Euro', async ({ page }) => {
  
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforEuro()
  await beneficiary.verifyAddingBankAccountdetails()
    
})

test('2. Verify Beneficiary creation for AUD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforAud()
   
})

test('3. Verify Beneficiary creation for USD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforUsd()
   
})

test('4. Verify Beneficiary creation for GBP ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforGbp()
   
})


test('4. Verify Beneficiary creation for CHF ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_CHF()
   
})


test('4. Verify Beneficiary creation for HKD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_HKD()
   
})


test('4. Verify Beneficiary creation for SGD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_SGD()
   
})

test('4. Verify Beneficiary creation for JPY ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_JPY()
   
})


test.only('4. Verify Beneficiary creation for CAD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_CAD()
   
})


test('4. Verify Beneficiary creation for NZD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationfor_NZD()
   


})



test('5. Verify Beneficiary search ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
 
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforAud_Search()
})


test('6. Verify Beneficiary edit ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
 
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforAud_Edit()
})
 
/*test.skip('7. Verify Beneficiary delete ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
 
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforAud_BeneficiaryDelete()
})*/


test('8. Verify Wallet Details ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
 
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyWalletDetailpage()
})


test('9. Verify beneficiary details page loads on clicking the beneficiary name from the beneficiary list ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.check_beneficiaryPage_loads()
   
})


test('10. Verify beneficiary form closes', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.checkuser_is_able_to_close_the_facet_by_clicking_on_the_close_button()

})

test('11. Verify iban loads', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verify_ibanForm_loads_when_BeneficiaryDetails_are_submitted()

})


test('12. add currency form throws proper validation when mandatory fields are not filled.', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  
  const beneficiary = new Beneficiarypage(page)
  await beneficiary.check_addCurrency_beneficiary_form_and_bankDetailsForm_throws_propervalidation()

})