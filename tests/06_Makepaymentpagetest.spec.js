
import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Beneficiarypage } from '../pages/Beneficiarypage';
import { Makepaymentpage } from '../pages/Makepaymentpage';
import { Conversionpage } from '../pages/Conversionpage';



test('Verify payment without beneficiary', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

 const payment = new Makepaymentpage(page)
 await payment.verify_Payment_CannotbeDone_without_creating_benefeciary_for_corresponding_currency()

   
})

test('Verify payment without sufficient balance', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

 const payment = new Makepaymentpage(page)
 await payment.verifypayment_can_be_created_without_having_any_amount_in_wallet()
 
})

test('Verify payment', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const payment = new Makepaymentpage(page)
  await payment.verifyPayment()
   
})


test('Verify currency conversion for buy option', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const convert = new Conversionpage(page)
  await convert.verifyConversionofCurrencyForBuy()

   
})

test('Verify currency conversion for sell option', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials('anandu.a@seqato.com','Anandu@123')

  const convert = new Conversionpage(page)
  await convert.verifyConversionofCurrencyForSell()
   
})

