export function useApi() {
	const config = useRuntimeConfig();
	const { token } = useAuth();

	const baseURL = config.public.apiBase as string;

	async function apiFetch<T>(
		path: string,
		opts: {
			method?: string;
			body?: unknown;
			query?: Record<string, string | number | undefined>;
		} = {},
	): Promise<T> {
		const headers: Record<string, string> = {
			Accept: 'application/json',
		};
		if (token.value) {
			headers.Authorization = `Bearer ${token.value}`;
		}
		if (opts.body !== undefined) {
			headers['Content-Type'] = 'application/json';
		}

		return await $fetch<T>(path, {
			baseURL,
			method: (opts.method || 'GET') as 'GET' | 'POST' | 'PATCH' | 'DELETE',
			body: opts.body as BodyInit | Record<string, unknown> | null | undefined,
			query: opts.query,
			headers,
		});
	}

	return { apiFetch, baseURL };
}
