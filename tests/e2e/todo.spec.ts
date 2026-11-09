import { expect, test } from '@playwright/test';
import { TodoPage } from '../../src/pages/TodoPage';

test.describe('Todo list management', () => {
  test('adds three todos, completes the second, and filters by status', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Prepare report');
    await todoPage.addTodo('Send invoice');
    await todoPage.addTodo('Book meeting room');
    await todoPage.checkTodoCount(3);

    await todoPage.completeTodo('Send invoice');
    await todoPage.verifyRemainingCount(2);

    await todoPage.filterTodos('Active');
    await expect(page.getByText('Prepare report', { exact: true })).toBeVisible();
    await expect(page.getByText('Send invoice', { exact: true })).toBeHidden();
    await expect(page.getByText('Book meeting room', { exact: true })).toBeVisible();
    await todoPage.checkTodoCount(2);
    await todoPage.verifyRemainingCount(2);

    await todoPage.filterTodos('Completed');
    await expect(page.getByText('Prepare report', { exact: true })).toBeHidden();
    await expect(page.getByText('Send invoice', { exact: true })).toBeVisible();
    await expect(page.getByText('Book meeting room', { exact: true })).toBeHidden();
    await todoPage.checkTodoCount(1);
    await todoPage.verifyRemainingCount(2);
  });
});
