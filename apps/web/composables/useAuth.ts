import type { AuthLoginResponseDto, AuthUserDto } from '@vactrak/shared';

const TOKEN_COOKIE = 'vactrak_token';

export function useAuth() {
	const token = useCookie<string | null>(TOKEN_COOKIE, {
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7,
		watch: true,
	});

	const user = useState<AuthUserDto | null>('auth-user', () => null);

	const isLoggedIn = computed(() => Boolean(token.value));

	function setSession(login: AuthLoginResponseDto) {
		token.value = login.accessToken;
		user.value = login.user;
	}

	function logout() {
		token.value = null;
		user.value = null;
		navigateTo('/login');
	}

	async function fetchMe() {
		if (!token.value) {
			user.value = null;
			return null;
		}
		const { apiFetch } = useApi();
		try {
			const me = await apiFetch<AuthUserDto>('/api/auth/me');
			user.value = me;
			return me;
		} catch {
			token.value = null;
			user.value = null;
			return null;
		}
	}

	return {
		token,
		user,
		isLoggedIn,
		setSession,
		logout,
		fetchMe,
	};
}
