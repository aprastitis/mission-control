import { test, expect } from '@playwright/test';

test('Kanban CRUD flow', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=Backlog')).toBeVisible();
  await page.screenshot({ path: 'debug-start.png' });

  // Check column styles
  const col = page.locator('[data-testid="column-backlog"]');
  await expect(col).toHaveClass(/shadow-2xl/);
  const badge = page.locator('[data-testid="add-task"]');
  await expect(badge).toBeVisible();

  // Create task
  const taskTitle = `Test Task ${Date.now()}`;
  await page.click('[data-testid="add-task"]');
  await page.screenshot({ path: 'debug-modal.png' });
  await page.fill('[data-testid="task-title"]', taskTitle);
  await page.fill('[data-testid="task-description"]', 'Test description');
  await page.click('[data-testid="submit-task"]');
  await page.screenshot({ path: 'debug-after-submit.png' });

  // Wait for task to appear in Backlog
  await expect(page.locator('[data-testid="column-backlog"]').getByText(taskTitle)).toBeVisible();

  // Get the task
  const taskLocator = page.locator('[data-testid^="task-"]').filter({ hasText: taskTitle });
  await expect(taskLocator).toBeVisible();

  // Drag to In Progress
  await taskLocator.dragTo(page.locator('[data-testid="column-inprogress"]'));
  await expect(page.locator('[data-testid="column-inprogress"]').getByText(taskTitle)).toBeVisible();

  // Drag to Need Approval
  await taskLocator.dragTo(page.locator('[data-testid="column-needapproval"]'));
  await expect(page.locator('[data-testid="column-needapproval"]').getByText(taskTitle)).toBeVisible();

  // Drag to Done
  await taskLocator.dragTo(page.locator('[data-testid="column-done"]'));
  await expect(page.locator('[data-testid="column-done"]').getByText(taskTitle)).toBeVisible();

  // Delete task
  const deleteButton = taskLocator.locator('[data-testid^="delete-task-"]');
  await deleteButton.click();

  // Verify task is gone
  await expect(page.getByText(taskTitle)).not.toBeVisible();

  // Screenshot
  await page.screenshot({ path: 'kanban-test.png' });
});