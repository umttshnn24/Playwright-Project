import { expect, test, type Page } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc';
const newTodoInput = (page: Page) => page.getByPlaceholder('What needs to be done?');
const todoItems = (page: Page) => page.locator('.todo-list li');
const todoItem = (page: Page, title: string) =>
  todoItems(page).filter({ hasText: title });

async function addTodo(page: Page, title: string) {
  await newTodoInput(page).fill(title);
  await newTodoInput(page).press('Enter');
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(TODO_URL);
});

test('shows an empty list on first load', async ({ page }) => {
  await expect(newTodoInput(page)).toBeVisible();
  await expect(todoItems(page)).toHaveCount(0);
  await expect(page.locator('.footer')).toBeHidden();
});

test('adds a todo with Enter', async ({ page }) => {
  await addTodo(page, 'Buy groceries');

  await expect(todoItem(page, 'Buy groceries')).toHaveCount(1);
  await expect(todoItem(page, 'Buy groceries').getByRole('checkbox')).not.toBeChecked();
  await expect(newTodoInput(page)).toHaveValue('');
  await expect(page.getByText('1 item left')).toBeVisible();
  await expect(page.getByRole('link', { name: 'All', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Active', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Completed', exact: true })).toBeVisible();
});

test('adds multiple todos', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Walk the dog');

  await expect(todoItems(page)).toHaveCount(2);
  await expect(page.getByText('2 items left')).toBeVisible();
});

test('does not add an empty todo', async ({ page }) => {
  await newTodoInput(page).press('Enter');

  await expect(todoItems(page)).toHaveCount(0);
  await expect(page.locator('.footer')).toBeHidden();
});

test('completes and reactivates a todo', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  const checkbox = todoItem(page, 'Buy groceries').getByRole('checkbox');

  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(page.getByText('0 items left')).toBeVisible();

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  await expect(page.getByText('1 item left')).toBeVisible();
});

test('filters todos by status', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Walk the dog');
  await todoItem(page, 'Buy groceries').getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Active', exact: true }).click();
  await expect(todoItem(page, 'Walk the dog')).toBeVisible();
  await expect(todoItem(page, 'Buy groceries')).toBeHidden();

  await page.getByRole('link', { name: 'Completed', exact: true }).click();
  await expect(todoItem(page, 'Buy groceries')).toBeVisible();
  await expect(todoItem(page, 'Walk the dog')).toBeHidden();

  await page.getByRole('link', { name: 'All', exact: true }).click();
  await expect(todoItems(page)).toHaveCount(2);
});

test('edits a todo', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await todoItem(page, 'Buy groceries').getByText('Buy groceries', { exact: true }).dblclick();

  const editInput = todoItem(page, 'Buy groceries').locator('input.edit');
  await expect(editInput).toHaveValue('Buy groceries');
  await editInput.fill('Buy fresh groceries');
  await editInput.press('Enter');

  await expect(todoItem(page, 'Buy fresh groceries')).toBeVisible();
  await expect(page.getByText('Buy groceries', { exact: true })).toHaveCount(0);
});

test('cancels editing a todo with Escape', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await todoItem(page, 'Buy groceries').getByText('Buy groceries', { exact: true }).dblclick();

  const editInput = todoItem(page, 'Buy groceries').locator('input.edit');
  await editInput.fill('Buy fresh groceries');
  await editInput.press('Escape');

  await expect(todoItem(page, 'Buy groceries')).toBeVisible();
  await expect(page.getByText('Buy fresh groceries', { exact: true })).toHaveCount(0);
});

test('deletes a single todo', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Walk the dog');
  const itemToDelete = todoItem(page, 'Buy groceries');

  await itemToDelete.hover();
  await itemToDelete.locator('button.destroy').click();

  await expect(todoItem(page, 'Buy groceries')).toHaveCount(0);
  await expect(todoItem(page, 'Walk the dog')).toBeVisible();
  await expect(page.getByText('1 item left')).toBeVisible();
});

test('toggles all todos', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Walk the dog');

  const toggleAll = page.getByLabel('Mark all as complete');
  await toggleAll.check();
  await expect(todoItems(page).getByRole('checkbox')).toHaveCount(2);
  await expect(todoItems(page).getByRole('checkbox').nth(0)).toBeChecked();
  await expect(todoItems(page).getByRole('checkbox').nth(1)).toBeChecked();
  await expect(page.getByText('0 items left')).toBeVisible();

  await toggleAll.uncheck();
  await expect(todoItems(page).getByRole('checkbox').nth(0)).not.toBeChecked();
  await expect(todoItems(page).getByRole('checkbox').nth(1)).not.toBeChecked();
  await expect(page.getByText('2 items left')).toBeVisible();
});

test('clears completed todos', async ({ page }) => {
  await addTodo(page, 'Buy groceries');
  await addTodo(page, 'Walk the dog');
  await todoItem(page, 'Buy groceries').getByRole('checkbox').check();

  await page.getByRole('button', { name: 'Clear completed' }).click();

  await expect(todoItem(page, 'Buy groceries')).toHaveCount(0);
  await expect(todoItem(page, 'Walk the dog')).toBeVisible();
  await expect(page.getByText('1 item left')).toBeVisible();
});
