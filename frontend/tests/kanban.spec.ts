import { test, expect } from '@playwright/test';

test('Kanban CRUD flow', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/Mission Control/);
  await page.screenshot({ path: 'debug-start.png' });

  // Create task
  await page.click('[data-testid="add-task"]');
  await page.screenshot({ path: 'debug-modal.png' });
  await page.fill('[data-testid="task-title"]', 'Test Task');
  await page.fill('[data-testid="task-description"]', 'Test description');
  await page.click('[data-testid="submit-task"]');
  await page.screenshot({ path: 'debug-after-submit.png' });

  // Wait for task to appear in To Do
  await expect(page.locator('[data-testid="column-todo"]').getByText('Test Task')).toBeVisible();

  // Get the task
  const taskLocator = page.locator('[data-testid^="task-"]').filter({ hasText: 'Test Task' });
  await expect(taskLocator).toBeVisible();

  // Drag to In Progress
  await taskLocator.dragTo(page.locator('[data-testid="column-inprogress"]'));
  await expect(page.locator('[data-testid="column-inprogress"]').getByText('Test Task')).toBeVisible();

  // Drag to Done
  await taskLocator.dragTo(page.locator('[data-testid="column-done"]'));
  await expect(page.locator('[data-testid="column-done"]').getByText('Test Task')).toBeVisible();

  // Delete task
  const deleteButton = taskLocator.locator('[data-testid^="delete-task-"]');
  await deleteButton.click();

  // Verify task is gone
  await expect(page.getByText('Test Task')).not.toBeVisible();

  // Screenshot
  await page.screenshot({ path: 'kanban-test.png' });
});