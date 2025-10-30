import { test, expect } from '@playwright/test';

import { Loginpage } from '../pages/Loginpage';
import { Dashboardpage } from '../pages/Dashboardpage';
import { BusinessInformationpage } from '../pages/BusinessInformationpage';
import { BusinessProfilepage } from '../pages/BusinessProfilepage';
import { PurposeOfAccountpage } from '../pages/PurposeOfAccountpage';
import { BusinessOfficialspage } from '../pages/BusinessOfficialspage';
import { DocumentUploadpage } from '../pages/DocumentUploadpage';
import { RegisterCompanypage } from '../pages/RegisterCompanypage';






test('1. Verify Business type and company type error for Business officials', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const dashboard = new Dashboardpage(page)
  await dashboard.clickOnRegister_a_company()

  const register = new RegisterCompanypage(page)
  await register.newCompanyRegistration('India')

  const bus_official = new BusinessOfficialspage(page)
  await bus_official.businessType_and_CompanyType_error()

})


test('2. Verify save draft for Business information after log out', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const bus_inf = new BusinessInformationpage(page)
  await bus_inf.savedraft_for_businessInformation_after_logOut() 

})


test('3. Verify save draft for Business information after refresh', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const bus_inf = new BusinessInformationpage(page)
  await bus_inf.savedraft_for_businessInformation_after_refresh()
  
})


test('4. Verify save draft for Business profile after log out', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const bus_profile = new BusinessProfilepage(page)
  await bus_profile.savedraft_for_businessProfile_after_logOut()

})


test('5. Verify save draft for Business profile after refresh', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const bus_profile = new BusinessProfilepage(page)
  await bus_profile.savedraft_for_businessProfile_after_refresh() 

})


test('6. Verify save draft for Purpose of Account after log out', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const poa = new PurposeOfAccountpage(page)
  await poa.savedraft_for_purposeOfAcoount_after_logOut()

})


test('7. Verify save draft for Purpose of Account after refresh', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const poa = new PurposeOfAccountpage(page)
  await poa.savedraft_for_purposeOfAcoount_after_refresh()

})


test('8. Verify onboarding for new company with validations', async ({ page }) => {


  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  //await login.giveLoginCredentials('ajay.vr@seqato.com','Qwerty123$')

  const dashboard = new Dashboardpage(page)
  await dashboard.appla_x_title()
  await dashboard.clickOnRegister_a_company()


  const register = new RegisterCompanypage(page)
  await register.newCompanyRegistration('India')

  await dashboard.clickOnCompleteKyc()

  const bus_inf = new BusinessInformationpage(page)
  await bus_inf.companyDetailsValidation()
  await bus_inf.companyAddressValidationForEmptyfields_and_InvalidDatas()
  await bus_inf.selfCertification_validation()

  await bus_inf.fillCompanyDetails()
  await bus_inf.fillCompanyAddress()
  await bus_inf.completeSelfCertification()

  const bus_profile = new BusinessProfilepage(page)
  await bus_profile.companyProfileValidations()
  await bus_profile.fillsourceOfWealth_and_ExpectedTurnover_Validations()

  await bus_profile.fillCompanyProfile()
  await bus_profile.fillsourceOfWealth()

  const poa = new PurposeOfAccountpage(page)
  await poa.fillMulticurrencyAccounts_EmptyFieldvalidation()
  await poa.fillMulticurrencyAccounts()

  const bus_official = new BusinessOfficialspage(page)
  await bus_official.checkBusinessofficial_validations()
  await bus_official.fillBusinessofficialdetails()

  const doc_upload = new DocumentUploadpage(page)
  await doc_upload.uploadLarge_file_size_ForKyc()

  await doc_upload.uploadCompanyDocumentsForKyc()
  await doc_upload.uploadIndividualDocumentsforKyc()
 

})


/*test.skip(' Verify onboarding for new company ', async ({ page }) => {


  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()
  //await login.giveLoginCredentials('ajay.vr@seqato.com','Qwerty123$')

  const dashboard = new Dashboardpage(page)
  await dashboard.appla_x_title()
  await dashboard.clickOnRegister_a_company()

  const register = new RegisterCompanypage(page)
  await register.newCompanyRegistration('India')

  await dashboard.clickOnCompleteKyc()

  const bus_inf = new BusinessInformationpage(page)
  await bus_inf.fillCompanyDetails()
  await bus_inf.fillCompanyAddress()
  await bus_inf.completeSelfCertification()

  const bus_profile = new BusinessProfilepage(page)
  await bus_profile.fillCompanyProfile()
  await bus_profile.fillsourceOfWealth()

  const poa = new PurposeOfAccountpage(page)
  await poa.fillMulticurrencyAccounts()

  const bus_official = new BusinessOfficialspage(page)
  await bus_official.fillBusinessofficialdetails()

  const doc_upload = new DocumentUploadpage(page)
  await doc_upload.uploadCompanyDocumentsForKyc()
  await doc_upload.uploadIndividualDocumentsforKyc()
 

})*/



test('9. Verify new account status is locked before admin approves', async ({ page }) => {

  const login = new Loginpage(page)
  await login.goToLoginPage()
  await login.giveLoginCredentials()

  const dashboard = new Dashboardpage(page)
  dashboard.new_account_Status_before_AdminApproval()

})










