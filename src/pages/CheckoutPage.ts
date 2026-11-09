import { expect, type Locator, type Page } from '@playwright/test';

const CHECKOUT_URL = 'https://www.saucedemo.com/checkout-step-one.html';

export class CheckoutPage {
  readonly cartItems: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly finishButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(readonly page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.orderConfirmation = page.getByText('Thank you for your order!', { exact: true });
  }

  async goto(url: string = CHECKOUT_URL): Promise<void> {
    await this.page.goto(url);
  }

  async verifyCartItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async enterCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.orderConfirmation).toBeVisible();
  }
}
