import { test, expect } from '@playwright/test';
import { Loginpage } from '../pages/Loginpage';
import { Conversionpage } from '../pages/Conversionpage';



test('1. Verify currency conversion for buy option', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verifyConversionofCurrencyForBuy()

   
})


test('2. Verify currency conversion for sell option', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verifyConversionofCurrencyForSell()
   
})


test('3. Verify qoute expiry', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verifyQuoteExpiry()

})



test('4. Verify user is able to convert the funds without beneficiaries from EUR to USD for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_euro_to_usd_for_sell()

})



test('5. Verify user is able to convert the funds without  beneficiaries from EUR to USD for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_euro_to_usd_for_buy()
  
})


test('6. Verify user is able to convert the funds without  beneficiaries from EUR to GBP for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_euro_to_gbp_for_sell()
  
})


test('7. Verify user is able to convert the funds without  beneficiaries from EUR to GBP for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_euro_to_gbp_for_buy()
  
})


test('8. Verify user is able to convert the funds without  beneficiaries from USD to EUR for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_usd_to_euro_for_sell()
  
})


test('9. Verify user is able to convert the funds without  beneficiaries from USD to EUR for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_usd_to_euro_for_buy()
  
})


test('10. Verify user is able to convert the funds without  beneficiaries from USD to GBP for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_usd_to_gbp_for_sell()
  
})


test('11. Verify user is able to convert the funds without  beneficiaries from USD to GBP for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_usd_to_gbp_for_buy()
  
})


test('12. Verify user is able to convert the funds without  beneficiaries from GBP to EUR for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_gbp_to_euro_for_sell()
  
})


test('13. Verify user is able to convert the funds without  beneficiaries from GBP to EUR for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_gbp_to_euro_for_buy()
  
})


test('14. Verify user is able to convert the funds without  beneficiaries from GBP to USD for sell', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_gbp_to_usd_for_sell()
  
})


test('15.Verify user is able to convert the funds without  beneficiaries from GBP to USD for buy', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const convert = new Conversionpage(page)
  await convert.verify_DirectConversion_from_gbp_to_usd_for_buy()
  
})


