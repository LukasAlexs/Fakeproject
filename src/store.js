import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_FILE = new URL('../data/tasks.json', import.meta.url);

export async function readTasks() {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeTasks(tasks) {
  const filePath = fileURLToPath(DATA_FILE);
  await writeFile(`${filePath}.tmp`, JSON.stringify(tasks, null, 2));
  await writeFile(filePath, JSON.stringify(tasks, null, 2));
}
