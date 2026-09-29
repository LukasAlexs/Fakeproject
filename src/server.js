import { createServer } from 'node:http';
import { createTask, deleteTask, getTask, listTasks, updateTask } from './tasks.js';

const PORT = Number(process.env.PORT ?? 3000);

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    if (req.method === 'GET' && path === '/health') return send(res, 200, { ok: true });
    if (req.method === 'GET' && path === '/tasks') {
      const tasks = await listTasks({ status: url.searchParams.get('status'), q: url.searchParams.get('q') });
      return send(res, 200, tasks);
    }

    const match = path.match(/^\/tasks\/([^/]+)$/);
    if (match && req.method === 'GET') {
      const task = await getTask(decodeURIComponent(match[1]));
      return task ? send(res, 200, task) : send(res, 404, { error: 'task not found' });
    }
    if (match && req.method === 'PATCH') {
      const task = await updateTask(decodeURIComponent(match[1]), await readBody(req));
      return task ? send(res, 200, task) : send(res, 404, { error: 'task not found' });
    }
    if (match && req.method === 'DELETE') {
      const deleted = await deleteTask(decodeURIComponent(match[1]));
      return deleted ? send(res, 204, {}) : send(res, 404, { error: 'task not found' });
    }
    if (req.method === 'POST' && path === '/tasks') {
      const task = await createTask(await readBody(req));
      return send(res, 201, task);
    }
    return send(res, 404, { error: 'route not found' });
  } catch (error) {
    return send(res, error.status ?? 500, { error: 'internal server error' });
  }
});

server.listen(PORT, () => console.log(`Trailmix API listening on ${PORT}`));
