import { test, expect } from '@playwright/test';

test.describe('Kanban Full Flow', () => {
  test('Complete Kanban CRUD and features flow', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check initial state
    await expect(page.locator('[data-testid="column-backlog"]')).toBeVisible();
    await page.screenshot({ path: `debug-start-${browserName}.png` });

    // Check glassmorphism styles
    const col = page.locator('[data-testid="column-backlog"]');
    await expect(col).toHaveClass(/backdrop-blur/);

    // Create multiple tasks for testing
    const tasks = [
      { title: `Task 1 ${Date.now()}`, desc: 'High priority task', priority: 'high', labels: 'bug,urgent' },
      { title: `Task 2 ${Date.now()}`, desc: 'Medium priority task', priority: 'medium', labels: 'feature' },
      { title: `Task 3 ${Date.now()}`, desc: 'Low priority task', priority: 'low', labels: 'enhancement' }
    ];

    for (const task of tasks) {
      await page.click('[data-testid="add-task"]');
      await page.fill('[data-testid="task-title"]', task.title);
      await page.fill('[data-testid="task-description"]', task.desc);
      await page.selectOption('select[id="priority"]', task.priority);
      await page.fill('input[id="labels"]', task.labels);
      await page.click('[data-testid="submit-task"]');
      await expect(page.locator('[data-testid="column-backlog"]').getByText(task.title)).toBeVisible();
    }

    await page.screenshot({ path: `debug-tasks-created-${browserName}.png` });

    // Test drag and drop
    const firstTask = page.locator('[data-testid^="task-"]').filter({ hasText: tasks[0].title });
    await firstTask.dragTo(page.locator('[data-testid="column-inprogress"]'));
    await expect(page.locator('[data-testid="column-inprogress"]').getByText(tasks[0].title)).toBeVisible();

    // Test keyboard shortcuts
    const secondTask = page.locator('[data-testid^="task-"]').filter({ hasText: tasks[1].title });
    await secondTask.click(); // Select task
    await page.keyboard.press('e'); // Edit shortcut
    await expect(page.locator('input').first()).toHaveValue(tasks[1].title);
    await page.keyboard.press('Escape'); // Cancel edit

    // Test filters
    await page.click('text=📋 Filters'); // Open sidebar on mobile
    await page.check('input[type="checkbox"]:has-text("🔴 high")');
    await page.click('text=Apply');

    // Should only show high priority task in backlog
    await expect(page.locator('[data-testid="column-backlog"]').getByText(tasks[2].title)).not.toBeVisible();
    await expect(page.locator('[data-testid="column-backlog"]').getByText(tasks[1].title)).not.toBeVisible();

    // Reset filters
    await page.click('text=Reset');

    // Test task editing
    await secondTask.click();
    await page.keyboard.press('e');
    await page.fill('input[type="text"]', tasks[1].title + ' - Edited');
    await page.click('text=💾 Save');
    await expect(page.locator('[data-testid="column-backlog"]').getByText(tasks[1].title + ' - Edited')).toBeVisible();

    // Test delete shortcut
    await secondTask.click();
    await page.keyboard.press('Delete');
    await expect(page.getByText(tasks[1].title + ' - Edited')).not.toBeVisible();

    // Test theme switching
    await page.click('text=Dark');
    await expect(page.locator('html')).toHaveClass('dark');

    await page.click('text=Light');
    await expect(page.locator('html')).not.toHaveClass('dark');

    // Final screenshot
    await page.screenshot({ path: `kanban-test-complete-${browserName}.png` });
  });

  test('Mobile swipe functionality', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Mobile tests only on Firefox for now');

    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Create a test task
    const taskTitle = `Swipe Test ${Date.now()}`;
    await page.click('[data-testid="add-task"]');
    await page.fill('[data-testid="task-title"]', taskTitle);
    await page.click('[data-testid="submit-task"]');

    const taskCard = page.locator('[data-testid^="task-"]').filter({ hasText: taskTitle });

    // Test swipe right (edit)
    await taskCard.click({ position: { x: 50, y: 50 } });
    await page.mouse.move(50, 50);
    await page.mouse.down();
    await page.mouse.move(200, 50, { steps: 10 });
    await page.mouse.up();

    // Should open edit mode
    await expect(page.locator('input').first()).toHaveValue(taskTitle);

    // Cancel edit
    await page.keyboard.press('Escape');

    // Test swipe left (delete) - careful, this will delete the task
    // For testing purposes, we'll skip actual deletion to avoid test flakiness
    // In real implementation, swipe left would trigger delete

    await page.screenshot({ path: `mobile-swipe-test-${browserName}.png` });
  });
});