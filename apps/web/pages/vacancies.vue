<template>
	<div>
		<div class="toolbar">
			<h1>My vacancies</h1>
			<div class="filters">
				<label>
					Status
					<select v-model="statusFilter">
						<option value="">All</option>
						<option value="new">new</option>
						<option value="archived">archived</option>
					</select>
				</label>
				<button type="button" class="btn" :disabled="pending" @click="refresh">
					Refresh
				</button>
			</div>
		</div>

		<p v-if="user" class="muted">
			Signed in as {{ user.firstName || user.username || user.telegramId }}
		</p>

		<p v-if="pending" class="muted">Loading…</p>
		<p v-else-if="error" class="error">{{ error }}</p>
		<p v-else-if="!rows?.length" class="muted">No vacancies yet. Userscript + API token will fill this list.</p>

		<div v-else class="card table-wrap">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Company</th>
						<th>Source</th>
						<th>Status</th>
						<th />
					</tr>
				</thead>
				<tbody>
					<tr v-for="v in rows" :key="v.id">
						<td>
							<a :href="vacancyHref(v)" target="_blank" rel="noopener">{{ v.title }}</a>
							<div v-if="v.search_key" class="muted small">{{ v.search_key }}</div>
						</td>
						<td>{{ v.company }}</td>
						<td>{{ v.source }}</td>
						<td><span class="badge">{{ v.status }}</span></td>
						<td>
							<button
								v-if="v.status === 'new'"
								type="button"
								class="btn"
								:disabled="updatingId === v.id"
								@click="setStatus(v.id, 'archived')"
							>
								Archive
							</button>
							<button
								v-else
								type="button"
								class="btn"
								:disabled="updatingId === v.id"
								@click="setStatus(v.id, 'new')"
							>
								Restore
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { VacancyDto, VacancyStatus } from '@vactrak/shared';
import { API_PATHS } from '@vactrak/shared';

definePageMeta({
	middleware: 'auth',
});

const { apiFetch } = useApi();
const { user, fetchMe } = useAuth();

const statusFilter = ref<'' | VacancyStatus>('');
const updatingId = ref<string | null>(null);
const error = ref('');

const {
	data: rows,
	pending,
	error: fetchError,
	refresh,
} = await useAsyncData(
	'my-vacancies',
	async () => {
		await fetchMe();
		return apiFetch<VacancyDto[]>(API_PATHS.vacancies, {
			query: {
				page: 1,
				pageSize: 50,
				status: statusFilter.value || undefined,
			},
		});
	},
	{ watch: [statusFilter] },
);

watchEffect(() => {
	if (fetchError.value) {
		error.value =
			(fetchError.value as { data?: { message?: string }; message?: string })?.data
				?.message ||
			fetchError.value.message ||
			'Failed to load vacancies';
	} else {
		error.value = '';
	}
});

function vacancyHref(v: VacancyDto): string {
	if (v.source === 'hh') return `https://hh.ru/vacancy/${v.id_ext}`;
	if (v.source === 'habr') return `https://career.habr.com/vacancies/${v.id_ext}`;
	return '#';
}

async function setStatus(id: string, status: VacancyStatus) {
	updatingId.value = id;
	error.value = '';
	try {
		await apiFetch(`${API_PATHS.vacancies}/${id}/status`, {
			method: 'PATCH',
			body: { status },
		});
		await refresh();
	} catch (e: unknown) {
		error.value = e instanceof Error ? e.message : 'Update failed';
	} finally {
		updatingId.value = null;
	}
}
</script>

<style scoped>
.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 0.5rem;
}
.filters {
	display: flex;
	gap: 0.75rem;
	align-items: end;
}
label {
	display: flex;
	flex-direction: column;
	font-size: 0.85rem;
	color: #64748b;
	gap: 0.25rem;
}
select {
	font: inherit;
	padding: 0.35rem 0.5rem;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
}
.badge {
	display: inline-block;
	padding: 0.15rem 0.45rem;
	border-radius: 999px;
	background: #e2e8f0;
	font-size: 0.8rem;
}
.small {
	font-size: 0.8rem;
}
.table-wrap {
	overflow-x: auto;
	padding: 0.5rem 1rem;
}
</style>
