import { expect, test, type Locator, type Page } from '@playwright/test';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { InventoryPage } from '../../src/pages/InventoryPage';

const credentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

async function signIn(inventoryPage: InventoryPage): Promise<void> {
  await inventoryPage.goto();
  await inventoryPage.login(credentials.username, credentials.password);
  await expect(inventoryPage.page.getByText('Products', { exact: true })).toBeVisible();
}

async function openCart(page: Page): Promise<void> {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();
}

async function expectPricesAscending(prices: Locator): Promise<void> {
  await expect
    .poll(async () => {
      const values = (await prices.allTextContents()).map((price) =>
        Number(price.replace('$', '')),
      );
      return values.every((price, index) => index === 0 || values[index - 1] <= price);
    })
    .toBe(true);
}

test.describe('SauceDemo purchase', () => {
  test('purchases the two lowest-priced products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await signIn(inventoryPage);
    await inventoryPage.sortProducts('Price (low to high)');

    const inventoryItems = page.getByTestId('inventory-item');
    const inventoryPrices = inventoryItems.getByTestId('inventory-item-price');

    await expect(inventoryItems).toHaveCount(6);
    await expectPricesAscending(inventoryPrices);
    await expect(inventoryItems.nth(0).getByTestId('inventory-item-name')).toHaveText(
      'Sauce Labs Onesie',
    );
    await expect(inventoryPrices.nth(0)).toHaveText('$7.99');
    await expect(inventoryItems.nth(1).getByTestId('inventory-item-name')).toHaveText(
      'Sauce Labs Bike Light',
    );
    await expect(inventoryPrices.nth(1)).toHaveText('$9.99');

    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
    await openCart(page);

    const cartItems = page.getByTestId('inventory-item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.getByTestId('inventory-item-name')).toHaveText([
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
    ]);
    await expect(cartItems.getByTestId('inventory-item-price')).toHaveText(['$7.99', '$9.99']);
    await expect(cartItems.getByTestId('item-quantity')).toHaveText(['1', '1']);
    await page.getByRole('button', { name: 'Checkout' }).click();

    await checkoutPage.enterCustomerInformation('Sauce Labs', 'Playwright', '12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    await checkoutPage.verifyCartItemCount(2);
    await expect(page.getByText('Item total: $17.98', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $1.44', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $19.42', { exact: true })).toBeVisible();

    await checkoutPage.finishCheckout();
    await checkoutPage.verifyOrderConfirmation();
  });

  test('rejects invalid credentials and allows a valid retry', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.login('invalid_user', 'invalid_password');
    await expect(page.getByTestId('error')).toContainText(
      'Username and password do not match any user in this service',
    );
    await expect(page.getByText('Products', { exact: true })).toBeHidden();

    await inventoryPage.login(credentials.username, credentials.password);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('requires checkout information before continuing', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await signIn(inventoryPage);
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await openCart(page);
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByTestId('error')).toContainText('Error: First Name is required');
    await expect(page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();

    await checkoutPage.enterCustomerInformation('Sauce Labs', 'Playwright', '12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  });

  test('keeps inventory prices in ascending order when prices are equal', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await signIn(inventoryPage);
    await inventoryPage.sortProducts('Price (low to high)');

    const inventoryPrices = page.getByTestId('inventory-item-price');
    await expect(inventoryPrices).toHaveCount(6);
    await expectPricesAscending(inventoryPrices);
  });

  test('adds only the first sorted product to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await signIn(inventoryPage);
    await inventoryPage.sortProducts('Price (low to high)');
    await inventoryPage.addProductToCart('Sauce Labs Onesie');
    await openCart(page);

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.verifyCartItemCount(1);
    const cartItem = page.getByTestId('inventory-item');
    await expect(cartItem.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Onesie');
    await expect(cartItem.getByTestId('inventory-item-price')).toHaveText('$7.99');
    await expect(cartItem.getByTestId('item-quantity')).toHaveText('1');
  });

  test('returns to inventory from an empty cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await signIn(inventoryPage);
    await openCart(page);

    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page.getByText('Products', { exact: true })).toBeVisible();

  });
});
