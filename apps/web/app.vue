<template>
	<div class="app">
		<header class="header">
			<NuxtLink to="/" class="brand">VacTrak</NuxtLink>
			<nav class="nav">
				<NuxtLink to="/vacancies">My vacancies</NuxtLink>
				<NuxtLink v-if="!isLoggedIn" to="/login">Login</NuxtLink>
				<button v-else type="button" class="linkish" @click="logout">Log out</button>
			</nav>
		</header>
		<main class="main">
			<NuxtPage />
		</main>
	</div>
</template>

<script setup lang="ts">
const { isLoggedIn, logout } = useAuth();
</script>

<style>
:root {
	font-family: system-ui, Segoe UI, Roboto, sans-serif;
	color: #0f172a;
	background: #f8fafc;
	line-height: 1.5;
}
* {
	box-sizing: border-box;
}
body {
	margin: 0;
}
a {
	color: #2563eb;
	text-decoration: none;
}
a.router-link-active {
	font-weight: 600;
}
.app {
	min-height: 100vh;
}
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1.25rem;
	background: #fff;
	border-bottom: 1px solid #e2e8f0;
}
.brand {
	font-weight: 700;
	color: #0f172a;
}
.nav {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.main {
	max-width: 960px;
	margin: 0 auto;
	padding: 1.5rem 1.25rem;
}
.linkish {
	background: none;
	border: none;
	color: #2563eb;
	cursor: pointer;
	font: inherit;
	padding: 0;
}
.card {
	background: #fff;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	padding: 1.25rem;
}
.muted {
	color: #64748b;
}
.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.4rem 0.75rem;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
	background: #fff;
	cursor: pointer;
	font: inherit;
}
.btn-primary {
	background: #2563eb;
	border-color: #2563eb;
	color: #fff;
}
.btn:disabled {
	opacity: 0.55;
	cursor: not-allowed;
}
.error {
	color: #b91c1c;
	margin-top: 0.75rem;
}
table {
	width: 100%;
	border-collapse: collapse;
}
th,
td {
	text-align: left;
	padding: 0.6rem 0.4rem;
	border-bottom: 1px solid #e2e8f0;
	vertical-align: top;
}
th {
	font-size: 0.85rem;
	color: #64748b;
	font-weight: 600;
}
</style>
