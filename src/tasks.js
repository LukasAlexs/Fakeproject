import { readTasks, writeTasks } from './store.js';

export async function listTasks({ status, q } = {}) {
  const tasks = await readTasks();
  let result = tasks;
  if (status) result = result.filter((task) => task.done === (status === 'done'));
  if (q) result = result.filter((task) => task.title.toLowerCase().includes(q));
  return result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getTask(id) {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === id);
}

export async function createTask(input) {
  const title = input.title?.trim();
  if (!title) throw Object.assign(new Error('title is required'), { status: 400 });
  if (input.dueDate && Number.isNaN(Date.parse(input.dueDate))) {
    throw Object.assign(new Error('dueDate must be a valid date'), { status: 400 });
  }

  const tasks = await readTasks();
  const task = {
    id: `t-${100 + tasks.length}`,
    title,
    done: false,
    dueDate: input.dueDate ?? new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

export async function updateTask(id, input) {
  const tasks = await readTasks();
  const task = tasks.find((item) => item.id === id);
  if (!task) return undefined;
  if (input.title !== undefined) task.title = input.title.trim();
  if (input.done !== undefined) task.done = Boolean(input.done);
  if (input.dueDate !== undefined) task.dueDate = input.dueDate;
  await writeTasks(tasks);
  return task;
}

export async function deleteTask(id) {
  const tasks = await readTasks();
  const remaining = tasks.filter((task) => task.id !== id);
  if (remaining.length === tasks.length) return false;
  await writeTasks(remaining);
  return true;
}
