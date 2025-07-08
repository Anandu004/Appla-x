
import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Beneficiarypage } from '../pages/Beneficiarypage';

test('Verify Beneficiary', async ({ page }) => {
  
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforEuro()
  await beneficiary.verifyAddingBankAccountdetails()
    
})

test('Verify Beneficiary creation for AUD ', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const beneficiary = new Beneficiarypage(page)
  await beneficiary.verifyBeneficiaryCreationforAud()
   
})