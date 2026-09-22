const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
	const res = await fetch(`${BASE_URL}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.message ?? "Request failed");
	}

	if (res.status === 204) return null;

	return res.json();
}

export function get(path) {
	return request(path);
}

export function post(path, body) {
	return request(path, {
		method: "POST",
		...(body !== undefined && { body: JSON.stringify(body) }),
	});
}

export function put(path, body) {
	return request(path, {
		method: "PUT",
		...(body !== undefined && { body: JSON.stringify(body) }),
	});
}

export function del(path) {
	return request(path, { method: "DELETE" });
}