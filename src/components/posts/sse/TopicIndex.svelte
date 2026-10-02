<script lang="ts">
	import './demo.css';

	const topics = ['A', 'B', 'C'];
	const connections = [
		{ id: 1, topics: ['A', 'B'] },
		{ id: 2, topics: ['A', 'C'] },
		{ id: 3, topics: ['B'] }
	];
	let topic = $state('A');
	const recipients = $derived(
		connections.filter((connection) => connection.topics.includes(topic))
	);
</script>

<figure class="sse-demo not-prose" aria-label="Interactive topic index">
	<figcaption class="demo-heading">Publish to a topic</figcaption>
	<p class="hint">Pick a topic. Highlighted connections receive the event.</p>
	<div class="controls" role="group" aria-label="Event topic">
		{#each topics as name (name)}
			<button type="button" aria-pressed={topic === name} onclick={() => (topic = name)}
				>Topic {name}</button
			>
		{/each}
	</div>
	<div class="routing">
		<div class="lookup">
			<span class="pill">topic {topic}</span><span aria-hidden="true">→</span><span>recipients</span
			>
		</div>
		<div class="connections">
			{#each connections as connection (connection.id)}
				<div class="connection" class:receives={connection.topics.includes(topic)}>
					<span>Connection {connection.id}</span>
					<span class="topics">{connection.topics.join(', ')}</span>
					<span class="delivery"
						>{connection.topics.includes(topic) ? 'receives event' : 'skipped'}</span
					>
				</div>
			{/each}
		</div>
	</div>
	<p class="status" aria-live="polite">
		Topic {topic} → {recipients.map((connection) => `connection ${connection.id}`).join(' + ')}
	</p>
</figure>

<style>
	.routing {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		align-items: center;
		margin-top: 1.25rem;
	}
	.lookup {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		flex-wrap: wrap;
	}
	.connections {
		display: grid;
		gap: 0.5rem;
	}
	.connection {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.1rem 0.75rem;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--color-surface1);
		border-radius: 0.375rem;
	}
	.connection.receives {
		border-color: var(--current-accent-color);
		background: color-mix(in srgb, var(--current-accent-color) 8%, transparent);
	}
	.topics {
		font-family: monospace;
		color: var(--color-subtext0);
	}
	.delivery {
		grid-column: 1 / -1;
		font-size: 0.75rem;
		color: var(--color-subtext0);
	}
	.receives .delivery {
		color: var(--current-accent-color);
	}
	@media (max-width: 480px) {
		.routing {
			grid-template-columns: 1fr;
		}
	}
</style>
