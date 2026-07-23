<template>
	<div class="card">
		<h1>VacTrak</h1>
		<p class="muted">
			Job vacancy tracker with Telegram notifications and multi-user “my vacancies”.
		</p>
		<p>
			<NuxtLink v-if="isLoggedIn" class="btn btn-primary" to="/vacancies">
				Open my vacancies
			</NuxtLink>
			<NuxtLink v-else class="btn btn-primary" to="/login">Log in with Telegram</NuxtLink>
		</p>
	</div>
</template>

<script setup lang="ts">
const { isLoggedIn } = useAuth();
</script>
