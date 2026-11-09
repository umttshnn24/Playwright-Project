import type { Page } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';

export type ProductSortOrder =
  | 'Name (A to Z)'
  | 'Name (Z to A)'
  | 'Price (low to high)'
  | 'Price (high to low)';

export class InventoryPage {
  constructor(readonly page: Page) {}

  async goto(url: string = SAUCEDEMO_URL): Promise<void> {
    await this.page.goto(url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async sortProducts(order: ProductSortOrder = 'Price (low to high)'): Promise<void> {
    await this.page.getByTestId('product-sort-container').selectOption({ label: order });
  }

  async addProductToCart(productName: string): Promise<void> {
    const productId = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }
}
