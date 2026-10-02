<script lang="ts">
	import './demo.css';
	import { actions, replay } from './cache-model';

	let step = $state(0);
	const snapshot = $derived(replay(step));
	const label = $derived(step === 0 ? 'No connections yet' : actions[step - 1].label);
	const memberships = $derived(
		snapshot.shared.reduce((count, connection) => count + connection.topics.length, 0)
	);
</script>

<figure
	class="sse-demo not-prose"
	aria-label="Shared cache compared with connection-owned subscriptions"
>
	<figcaption class="demo-heading">Everyone is user zero</figcaption>
	<p class="hint">
		Each fan is authorized for one topic: their own letter. Step through connections and
		disconnects.
	</p>
	<div class="controls">
		<button type="button" disabled={step === 0} onclick={() => (step -= 1)}>Back</button>
		<button type="button" disabled={step === actions.length} onclick={() => (step += 1)}
			>Next step</button
		>
		<button type="button" disabled={step === 0} onclick={() => (step = 0)}>Reset</button>
		<span class="step">{step} / {actions.length}</span>
	</div>
	<p class="event" aria-live="polite">{label}</p>
	<div class="comparison">
		<div class="version">
			<h4>Shared cache</h4>
			<div class="cache">cache[0] = [{snapshot.cache.join(', ')}]</div>
			<div class="subscribers">
				{#each snapshot.shared as connection (connection.fan)}
					<div class="subscriber">
						<span>Fan {connection.fan}</span><span class="pills">
							{#each connection.topics as topic (topic)}<span
									class="pill"
									class:inherited={topic !== connection.fan}
									>{topic}<span class="sr-only"
										>{topic !== connection.fan ? ' (inherited)' : ' (authorized)'}</span
									></span
								>{/each}
						</span>
					</div>
				{:else}<p class="empty">No live subscriptions</p>{/each}
			</div>
		</div>
		<div class="version">
			<h4>After the fix</h4>
			<div class="cache">Own API response only</div>
			<div class="subscribers">
				{#each snapshot.isolated as connection (connection.fan)}
					<div class="subscriber">
						<span>Fan {connection.fan}</span><span class="pill"
							>{connection.fan}<span class="sr-only"> (authorized)</span></span
						>
					</div>
				{:else}<p class="empty">No live subscriptions</p>{/each}
			</div>
		</div>
	</div>
	<p class="status" aria-live="polite">
		{memberships} memberships before · {snapshot.isolated.length} after. Dashed topics came from someone
		else.
	</p>
</figure>

<style>
	.step {
		margin-left: auto;
		color: var(--color-subtext0);
		font-variant-numeric: tabular-nums;
	}
	.event {
		margin: 1rem 0;
		font-weight: 600;
	}
	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}
	.version {
		min-width: 0;
		border: 1px solid var(--color-surface1);
		border-radius: 0.375rem;
		overflow: hidden;
	}
	h4 {
		margin: 0;
		padding: 0.65rem 0.75rem 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.cache {
		padding: 0.25rem 0.75rem 0.75rem;
		border-bottom: 1px solid var(--color-surface1);
		color: var(--color-subtext0);
		font: 0.75rem / 1.5 monospace;
	}
	.subscribers {
		min-height: 9rem;
		padding: 0.75rem;
	}
	.subscriber {
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: center;
		min-height: 2.5rem;
	}
	.pills {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.empty {
		margin: 0;
		color: var(--color-subtext0);
		font-size: 0.8rem;
	}
	@media (max-width: 400px) {
		.comparison {
			grid-template-columns: 1fr;
		}
		.subscribers {
			min-height: 4rem;
		}
	}
</style>
