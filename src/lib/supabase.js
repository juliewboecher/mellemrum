const EVENTS_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_APIKEY;

function assertSupabaseConfig() {
  if (!EVENTS_URL || !SUPABASE_KEY) {
    throw new Error(
      "Supabase URL or API key is missing. Check your .env file.",
    );
  }
}

function eventsUrl() {
  assertSupabaseConfig();
  return new URL(EVENTS_URL);
}

async function request(url, options = {}) {
  assertSupabaseConfig();

  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function listEvents() {
  const url = eventsUrl();
  url.searchParams.set("order", "id.desc");

  const data = await request(url);
  return Array.isArray(data) ? data : [];
}

export async function getEvent(id) {
  const url = eventsUrl();
  url.searchParams.set("id", `eq.${id}`);

  const data = await request(url);
  return Array.isArray(data) ? (data[0] ?? null) : null;
}

export function createEvent(event) {
  return request(eventsUrl(), {
    method: "EVENT",
    body: JSON.stringify(event),
  });
}

export function updateEvent(id, event) {
  const url = eventsUrl();
  url.searchParams.set("id", `eq.${id}`);

  return request(url, {
    method: "PATCH",
    body: JSON.stringify(event),
  });
}

export function deleteEvent(id) {
  const url = eventsUrl();
  url.searchParams.set("id", `eq.${id}`);

  return request(url, { method: "DELETE" });
}
