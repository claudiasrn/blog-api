const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
	const token = localStorage.getItem("token");

	const res = await fetch(`${BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		},
		...options,
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));

		const message =
			data.errors?.map((e) => e.msg).join(", ") ??
			data.message ??
			"Request failed";

		const error = new Error(message);
		error.status = res.status;
		error.errors = data.errors;
		throw error;
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
