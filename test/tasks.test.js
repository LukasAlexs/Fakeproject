import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, listTasks, updateTask } from '../src/tasks.js';

test('query search ignores case in both the title and query', async () => {
  const matches = await listTasks({ q: 'TRIP' });
  assert.ok(matches.some((task) => task.title === 'Review trip plan'));
});

test('created tasks get unique IDs', async () => {
  const first = await createTask({ title: 'Temporary task' });
  const second = await createTask({ title: 'Another temporary task' });
  assert.notEqual(first.id, second.id);
});

test('done only accepts a boolean', async () => {
  const task = await updateTask('t-100', { done: 'false' });
  assert.equal(task.done, false);
});
