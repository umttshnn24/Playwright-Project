# TodoMVC Basic Operations Test Plan

## Application

- URL: https://demo.playwright.dev/todomvc
- Framework: Playwright Test
- Scope: core todo creation, editing, completion, filtering, and deletion

## Preconditions and test data

- Open the TodoMVC page in a fresh browser context for each test.
- Start each test with an empty todo list. If browser storage is reused, clear the app's local storage before navigating.
- Use unique todo titles so list items can be located by their accessible text.
- Prefer role- and label-based locators; avoid depending on implementation-specific CSS classes except where a state has no accessible equivalent.

## Test cases

### 1. Show an empty list on first load

1. Navigate to the application.
2. Verify the “What needs to be done?” input is visible and usable.
3. Verify no todo rows or list footer are shown while the list is empty.

### 2. Add a todo with Enter

1. Enter a unique title in the new-todo input.
2. Press Enter.
3. Verify the todo appears as a list item with an unchecked completion control.
4. Verify the input is cleared.
5. Verify the footer shows “1 item left” and the All, Active, and Completed filters.

### 3. Add multiple todos

1. Add two distinct todo titles, pressing Enter after each.
2. Verify both titles appear once in the list.
3. Verify the remaining-item count is “2 items left”.

### 4. Do not add an empty todo

1. Leave the new-todo input empty and press Enter.
2. Verify no todo row is created and the list remains empty.

### 5. Complete and reactivate a todo

1. Add a todo.
2. Check its completion control.
3. Verify it is marked completed and the remaining-item count becomes “0 items left”.
4. Uncheck it.
5. Verify it is active again and the count returns to “1 item left”.

### 6. Filter todos by status

1. Add two todos and complete one.
2. Select Active; verify only the incomplete todo is shown.
3. Select Completed; verify only the completed todo is shown.
4. Select All; verify both todos are shown.

### 7. Edit a todo

1. Add a todo and double-click its title.
2. Verify an edit input appears containing the existing title.
3. Replace the title and press Enter.
4. Verify the updated title is shown and the old title is absent.

### 8. Cancel editing

1. Add a todo and enter edit mode by double-clicking its title.
2. Change the text and press Escape.
3. Verify the original title remains unchanged and edit mode closes.

### 9. Delete a single todo

1. Add two todos.
2. Reveal and activate the delete control for one todo.
3. Verify only that todo is removed and the other remains.
4. Verify the remaining-item count reflects the remaining active todo.

### 10. Toggle all todos

1. Add two active todos.
2. Activate the “Mark all as complete” control.
3. Verify both todos are completed and the remaining count is zero.
4. Activate the control again.
5. Verify both todos are active and the count returns to two.

### 11. Clear completed todos

1. Add two todos and complete one.
2. Activate “Clear completed”.
3. Verify the completed todo is removed while the active todo remains.
4. Verify the remaining count is one.

## Notes

- TodoMVC may reveal each row's delete control only on hover; hover the target row before locating or clicking that control.
- Run these cases in Chromium first. The same functional suite can subsequently be run against the configured Firefox and WebKit projects.
