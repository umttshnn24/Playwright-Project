import { expect, type Locator, type Page } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc';

export type TodoFilter = 'All' | 'Active' | 'Completed';

export class TodoPage {
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly remainingCount: Locator;
  readonly filters: Record<TodoFilter, Locator>;

  constructor(readonly page: Page) {
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page
      .getByRole('list')
      .filter({ has: page.getByRole('checkbox', { name: 'Toggle Todo' }) })
      .getByRole('listitem');
    this.remainingCount = page.getByText(/^\d+ items? left$/);
    this.filters = {
      All: page.getByRole('link', { name: 'All', exact: true }),
      Active: page.getByRole('link', { name: 'Active', exact: true }),
      Completed: page.getByRole('link', { name: 'Completed', exact: true }),
    };
  }

  async goto(url: string = TODO_URL): Promise<void> {
    await this.page.goto(url);
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  async completeTodo(title: string): Promise<void> {
    const checkbox = this.todoItem(title).getByRole('checkbox');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  async filterTodos(filter: TodoFilter): Promise<void> {
    await this.filters[filter].click();
  }

  async verifyRemainingCount(count: number): Promise<void> {
    const expectedText = `${count} item${count === 1 ? '' : 's'} left`;
    await expect(this.remainingCount).toHaveText(expectedText);
  }

  async checkTodoCount(count: number): Promise<void> {
    await expect(this.todoItems).toHaveCount(count);
  }

  private todoItem(title: string): Locator {
    return this.todoItems.filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }
}
