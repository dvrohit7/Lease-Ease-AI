// src/api.js
const backend = "http://localhost:8091";
// change if needed

async function handle(res) {
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("Content-Type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// GET (sends cookies)
export async function apiGet(path, opts = {}) {
  const res = await fetch(`${backend}${path}`, {
    credentials: "include",      // 🔑 send session cookie
    ...opts,
  });
  return handle(res);
}

// POST JSON (sends cookies)
export async function apiPostJson(path, body = {}, opts = {}) {
  const res = await fetch(`${backend}${path}`, {
    method: "POST",
    credentials: "include",      // 🔑
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: JSON.stringify(body),
    ...opts,
  });
  return handle(res);
}

// POST multipart (sends cookies) — DO NOT set Content-Type manually
export async function apiPostMultipart(path, formData, opts = {}) {
  const res = await fetch(`${backend}${path}`, {
    method: "POST",
    credentials: "include",      // 🔑
    body: formData,
    ...opts,
  });
  return handle(res);
}

// Optional helpers if you need them in Owner/User dashboards:
export async function apiDelete(path, opts = {}) {
  const res = await fetch(`${backend}${path}`, {
    method: "DELETE",
    credentials: "include",      // 🔑
    ...opts,
  });
  return handle(res);
}

export async function apiPatch(path, body = null, opts = {}) {
  const res = await fetch(`${backend}${path}`, {
    method: "PATCH",
    credentials: "include",      // 🔑
    headers: body ? { "Content-Type": "application/json", ...(opts.headers || {}) } : (opts.headers || {}),
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });
  return handle(res);
}

export { backend };
