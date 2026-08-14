import { test } from '@playwright/test';
import { ExpectUtil } from '../../src/utils/expectUtil';
import { FakerDataUtil } from '../../src/utils/fakerDataUtil';
 import { Constants } from '../../src/utils/constants';
import { WaitActions } from '../../src/wrapper/waitActions';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/inventoryPage';
import { CartPage } from '../../src/pages/cartPage';
import { CheckoutPage } from '../../src/pages/checkoutPage';
import { CheckoutCompletePage } from '../../src/pages/checkoutCompletePage';

test.describe('Order Validation Tests', () => { 
    test('Submit the order and validated the product name and price', async (
        { page }) => {
        const waitActions = new WaitActions(page);
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(Constants.USERNAME, Constants.PASSWORD);
        const inventoryPage = new InventoryPage(page);
        const isInInventoryPage = await inventoryPage.isUserInInventoryPage();
        await ExpectUtil.assertStringEquals(isInInventoryPage.toString(), "true", 
        "User should be in inventory page after successful login");
        const firstProductName = await inventoryPage.getFirstProductName();
        const firstProductPrice = await inventoryPage.getFirstProductPrice();
        await inventoryPage.addFirstProductToCart();
        await waitActions.waitForTimeout(2000);
        await inventoryPage.goToCart(); 
        await waitActions.waitForTimeout(2000);
        const cartPage = new CartPage(page);
        const cartProductName = await cartPage.getProductName();
        const cartProductPrice = await cartPage.getProductPrice();
        await ExpectUtil.assertStringEquals(cartProductName, firstProductName, 
            "Product name in cart should match the selected product");
        await ExpectUtil.assertStringEquals(cartProductPrice, firstProductPrice, 
            "Product price in cart should match the selected product");
        await cartPage.clickCheckout();
        await waitActions.waitForTimeout(2000);
        const firstName = FakerDataUtil.generateFirstName();
        const lastName = FakerDataUtil.generateLastName();
        const postalCode = FakerDataUtil.generatePostalCode();
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.enterCheckoutInformation(firstName, lastName, postalCode);
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        await waitActions.waitForTimeout(2000);
        const checkoutCompletePage = new CheckoutCompletePage(page);
        const thankYouMessage = await checkoutCompletePage.getThankYouMessage();
        await ExpectUtil.assertStringContains(thankYouMessage, "Thank you for your order", 
            "Thank you message should be displayed after successful order submission");
        await checkoutCompletePage.clickBackHome();
        await waitActions.waitForTimeout(2000);
        await inventoryPage.clickOnMenu();
        await inventoryPage.clickOnLogout();
       
    });

    test('Validate Remove Product from cart page', async ({ page }) => {
        const waitActions = new WaitActions(page);
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(Constants.USERNAME, Constants.PASSWORD);
        const inventoryPage = new InventoryPage(page);
        const isInInventoryPage = await inventoryPage.isUserInInventoryPage();
        await ExpectUtil.assertStringEquals(isInInventoryPage.toString(), "true", 
        "User should be in inventory page after successful login");
        const firstProductName = await inventoryPage.getFirstProductName();
        const firstProductPrice = await inventoryPage.getFirstProductPrice();
        await inventoryPage.addFirstProductToCart();
        await waitActions.waitForTimeout(2000);
        await inventoryPage.goToCart();
        await waitActions.waitForTimeout(2000);
        const cartPage = new CartPage(page);
        const cartProductName = await cartPage.getProductName();
        const cartProductPrice = await cartPage.getProductPrice();
        await ExpectUtil.assertStringEquals(cartProductName, firstProductName, 
            "Product name in cart should match the selected product");
        await ExpectUtil.assertStringEquals(cartProductPrice, firstProductPrice, 
            "Product price in cart should match the selected product");
        await cartPage.removeProduct();
        await waitActions.waitForTimeout(2000);
        const isProductInCart = await cartPage.isProductInCart();
        await ExpectUtil.expectToBeFalse(isProductInCart); 
         await inventoryPage.clickOnMenu();
        await inventoryPage.clickOnLogout();
    });

}); 
  
