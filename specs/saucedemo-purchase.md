# SauceDemo E-commerce Purchase Test Plan

## Application

- URL: https://www.saucedemo.com
- Framework: Playwright Test
- Scope: Sign in, sort the inventory by ascending price, add the first two products to the cart, verify the cart, complete checkout, and verify the order confirmation.

## Preconditions and test data

- Start each test in a fresh browser context so cart and session state do not leak between cases.
- Use the SauceDemo account `standard_user` / `secret_sauce`.
- Use `Sauce Labs` / `Playwright` / `12345` for checkout information.
- The ascending-price inventory is expected to begin with Sauce Labs Onesie ($7.99) and Sauce Labs Bike Light ($9.99). Their expected subtotal is $17.98, tax is $1.44, and total is $19.42.
- Use accessible, user-facing locators first: `getByRole`, `getByLabel`, `getByPlaceholder`, and `getByText`. Use an available test ID for controls without an accessible name (such as the cart icon); do not use brittle CSS or XPath selectors.

## Test cases

### 1. Complete a purchase with the two lowest-priced products (primary end-to-end)

**Arrange**

1. Open `https://www.saucedemo.com` in a fresh browser context.
2. Verify the Username and Password fields and the Login button are visible.

**Act**

1. Fill Username with `standard_user` and Password with `secret_sauce`; activate Login.
2. Verify the inventory page is displayed.
3. Select `Price (low to high)` from the product sort control. Locate it by its accessible label if available; otherwise use its stable test ID.
4. Add the first two products in the sorted inventory to the cart by locating each product's Add to cart button within its product container. Do not select the products by hard-coded positional CSS selectors.
5. Open the cart using the accessible link name if available, otherwise its stable test ID.
6. Fill First Name, Last Name, and Zip/Postal Code with `Sauce Labs`, `Playwright`, and `12345`, then activate Continue.
7. Review the order overview and activate Finish.

**Assert**

1. Verify the inventory products are ordered by nondecreasing price and the first two are Sauce Labs Onesie ($7.99) and Sauce Labs Bike Light ($9.99).
2. Verify the cart badge shows 2 and the cart contains exactly those two products, each with quantity 1 and the expected price.
3. Verify the checkout overview contains the same two products, item total $17.98, tax $1.44, and total $19.42.
4. Verify the completion page displays the `Thank you for your order!` confirmation.

### 2. Reject invalid login credentials (negative)

1. Open the login page and submit an invalid username/password pair.
2. Verify an error message is displayed and the inventory page is not opened.
3. Verify the user can correct the credentials and sign in successfully with the standard account.

### 3. Require checkout information (negative)

1. Sign in, add a product, open the cart, and activate Checkout.
2. Leave a required customer-information field empty and activate Continue.
3. Verify checkout does not advance and a validation error identifies the missing required information.
4. Enter valid information and verify Continue advances to the order overview.

### 4. Preserve ascending order when prices are equal (boundary)

1. Sign in and select `Price (low to high)`.
2. Inspect every displayed product price.
3. Verify each price is less than or equal to the next price; equal-priced products are acceptable and must not break the ordering assertion.

### 5. Verify the one-product cart boundary (boundary)

1. Sign in, sort by `Price (low to high)`, and add only the first product.
2. Open the cart.
3. Verify exactly one item is present, its quantity is 1, and its name and price match the first sorted inventory product.
4. Verify no second product is added implicitly.

### 6. Return to inventory from an empty cart (boundary)

1. Sign in and open the cart without adding any products.
2. Verify the cart has no product rows.
3. Verify Continue Shopping returns to the inventory page.

## Locator notes

- Login: `getByPlaceholder('Username')`, `getByPlaceholder('Password')`, and `getByRole('button', { name: 'Login' })`.
- Inventory: locate the sort control by its accessible label or stable test ID; locate product names by text and scope the matching Add to cart button to that product's container.
- Cart: prefer the cart link's accessible name; use its stable test ID if it has no accessible name. Locate item names and prices by visible text.
- Checkout: use labels for First Name, Last Name, and Zip/Postal Code, and role-based names for Continue and Finish.
- Error and order confirmation: assert visible message text rather than implementation-specific selectors.
