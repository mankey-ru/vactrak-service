<template>
	<div class="card">
		<h1>Login</h1>
		<p class="muted">
			Sign in with the Telegram Login Widget. The backend verifies the payload and issues a
			JWT (stored in a cookie for SSR).
		</p>

		<div v-if="botUsername" class="widget-wrap">
			<!-- Telegram injects the button; callback is global for the widget script -->
			<div
				ref="widgetHost"
				class="telegram-login"
			/>
		</div>
		<p v-else class="muted">
			Set <code>NUXT_PUBLIC_TELEGRAM_BOT_USERNAME</code> to show the official widget. You can
			still paste a JWT for local API testing below.
		</p>

		<details class="dev">
			<summary>Dev: paste JWT</summary>
			<p class="muted">Useful before BotFather domain is configured.</p>
			<textarea v-model="manualToken" rows="3" placeholder="eyJhbGciOi..." />
			<button type="button" class="btn btn-primary" :disabled="!manualToken.trim()" @click="saveManual">
				Save token
			</button>
		</details>

		<p v-if="error" class="error">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
import type { AuthLoginResponseDto } from '@vactrak/shared';
import { API_PATHS } from '@vactrak/shared';

const config = useRuntimeConfig();
const botUsername = computed(() => (config.public.telegramBotUsername as string) || '');
const { setSession, token, isLoggedIn } = useAuth();
const { baseURL } = useApi();

const error = ref('');
const manualToken = ref('');
const widgetHost = ref<HTMLElement | null>(null);

if (import.meta.client && isLoggedIn.value) {
	await navigateTo('/vacancies');
}

function saveManual() {
	const value = manualToken.value.trim();
	if (!value) return;
	token.value = value;
	navigateTo('/vacancies');
}

type TgAuthPayload = {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
};

async function onTelegramAuth(user: TgAuthPayload) {
	error.value = '';
	try {
		const login = await $fetch<AuthLoginResponseDto>(API_PATHS.authTelegram, {
			baseURL,
			method: 'POST',
			body: user,
		});
		setSession(login);
		await navigateTo('/vacancies');
	} catch (e: unknown) {
		error.value = e instanceof Error ? e.message : 'Login failed';
	}
}

onMounted(() => {
	if (!import.meta.client || !botUsername.value || !widgetHost.value) return;

	// Widget calls window.onTelegramAuth
	(window as unknown as { onTelegramAuth: typeof onTelegramAuth }).onTelegramAuth =
		onTelegramAuth;

	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://telegram.org/js/telegram-widget.js?22';
	script.setAttribute('data-telegram-login', botUsername.value);
	script.setAttribute('data-size', 'large');
	script.setAttribute('data-radius', '8');
	script.setAttribute('data-request-access', 'write');
	script.setAttribute('data-onauth', 'onTelegramAuth(user)');
	widgetHost.value.appendChild(script);
});
</script>

<style scoped>
.widget-wrap {
	margin: 1.25rem 0;
	min-height: 40px;
}
.dev {
	margin-top: 1.5rem;
}
textarea {
	width: 100%;
	font-family: ui-monospace, monospace;
	font-size: 0.85rem;
	margin: 0.5rem 0;
	padding: 0.5rem;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
}
code {
	font-size: 0.9em;
}
</style>
