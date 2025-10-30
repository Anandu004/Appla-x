
import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Beneficiarypage } from '../pages/Beneficiarypage';
import { Makepaymentpage } from '../pages/Makepaymentpage';
import { Conversionpage } from '../pages/Conversionpage';



test('1. Verify payment without beneficiary', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

 const payment = new Makepaymentpage(page)
 await payment.verify_Payment_CannotbeDone_without_creating_benefeciary_for_corresponding_currency()

   
})


test('2. Verify payment fee deduction from base currency wallet', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifyPayment_fee_deduction_after_payment()
   
})


test('3. Verify payment fee percentage deduction from base currency wallet', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifyPayment_fee_deduction_after_payment_forFeePercentage()
   
})


test('4. Verify payment amount and payment fee percentage deduction from base currency wallet', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifyPayment_fee_deduction_after_payment_forFeePercentage_and_feeAmount()
   
})


test('5. Verify payment', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifyPayment()

   
})



test('6. Verify currency corresponding to the wallet chosen is shown in the currency dropdown by default', async ({ page }) => {
  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verify_DefaultCurrency_chosen_in_makePaymentpage()
   
})



test('7. Verify fields are available in the make payment page', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verify_visibilityOf_paymentPage_fields()

})


test('8. Verify payment page redirects to the wallet of the currency chosen from the currency dropdown', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verify_paymentPage_redirection_from_currencyDropdown()

})


test('9. Verify appropriate warning message is shown when an amount greater than wallet balance is entered in the amount field', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifypayment_with_insufficient_Fund()

})


/*test.skip('7. Verify all beneficiaries listed in a wallet’s "Manage Beneficiaries" page are present in the beneficiary dropdown in the Make Payment page.', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verify_beneficiaries_are_listed_in_dropdown()


})*/


test('10. Verify beneficiary details are shown when clicked on the beneficiary name in the dropdown.', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.checck_beneficiary_Details_are_shown()


})

test('11. Verify all the transactions related to the wallet is displayed under the wallet details page', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.check_transactions_are_shown_in_walletDetails_page()


})

test('12. Verify user is able view all the wallet transactions in dashboard ', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.check_transactions_are_shown_in_dashboard_page()


})

test('13. Verify payment details are shown in a popup on clicking the arrow shown against each transaction ', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.check_payment_details_are_shown_in_a_popup()

})


test('14. Verify wallet details ', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const payment = new Makepaymentpage(page)
  await payment.verifyWalletDetailpage()

})




