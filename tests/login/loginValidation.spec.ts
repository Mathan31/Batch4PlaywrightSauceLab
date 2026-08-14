import { test } from "@playwright/test"
import { LoginPage } from "../../src/pages/LoginPage"
import { Constants } from "../../src/utils/constants";
import { InventoryPage } from "../../src/pages/inventoryPage";
import { ExpectUtil } from "../../src/utils/expectUtil";
import { StringConstants } from "../../src/utils/stringConstance";


test.describe("Login Validation Test",()=>{
    test('Login with Valid Credential and verify the login is successful', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(Constants.USERNAME,Constants.PASSWORD);
        await page.waitForTimeout(3000);
        const inventoryPage = new InventoryPage(page);
        const isUserInInventory = await inventoryPage.isUserInInventoryPage();
        await ExpectUtil.expectToBeTrue(isUserInInventory);
        await inventoryPage.clickOnMenu();
        await inventoryPage.ClickOnLogout();
    })


     test('Login with InValid Credential and verify the failure message', async({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(Constants.USERNAME,'test');
        await page.waitForTimeout(2000);
        const errorMessage = await loginPage.getErrorMessage();
        await ExpectUtil.assertStringContains(errorMessage,StringConstants.LOGIN_ERROR);
    })
})