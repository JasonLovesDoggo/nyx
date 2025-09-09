<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Site from '$lib/config/common';

	let globalCount = $state(0);
	let personalCount = $state(0);
	let isLoading = $state(true);
	let sparkles = $state<Array<{ id: number; x: number; y: number }>>([]);
	let buttonScale = $state(1);
	let counterGlow = $state(false);

	const KEY = 'collective-waste';
	const STORAGE_KEY = 'waste-clicks';

	// Load personal count from localStorage
	onMount(() => {
		if (browser) {
			personalCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0');

			// Get initial count
			fetchCurrentCount();

			// Set up SSE stream
			setupStream();

			// Listen for storage changes (cross-tab sync)
			const handleStorageChange = (e: StorageEvent) => {
				if (e.key === STORAGE_KEY && e.newValue) {
					personalCount = parseInt(e.newValue);
				}
			};
			window.addEventListener('storage', handleStorageChange);

			return () => {
				window.removeEventListener('storage', handleStorageChange);
			};
		}
	});

	async function fetchCurrentCount() {
		try {
			const response = await fetch(`${Site.abacus.instance}/get/${Site.abacus.namespace}/${KEY}`);
			if (response.ok) {
				const data = await response.json();
				globalCount = data.value || 0;
			} else if (response.status === 404) {
				globalCount = 0;
			}
		} catch (error) {
			console.error('Failed to fetch count:', error);
		} finally {
			isLoading = false;
		}
	}

	function setupStream() {
		const eventSource = new EventSource(
			`${Site.abacus.instance}/stream/${Site.abacus.namespace}/${KEY}`
		);

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.value > globalCount) {
					globalCount = data.value;
					triggerStreamAnimation();
				}
			} catch (error) {
				console.error('Stream parse error:', error);
			}
		};

		eventSource.onerror = (error) => {
			console.error('Stream error:', error);
		};

		return () => {
			eventSource.close();
		};
	}

	function triggerStreamAnimation() {
		counterGlow = true;
		setTimeout(() => (counterGlow = false), 600);

		const id = Date.now();
		const x = Math.random() * 100;
		const y = Math.random() * 100;
		sparkles = [...sparkles, { id, x, y }];

		setTimeout(() => {
			sparkles = sparkles.filter((s) => s.id !== id);
		}, 2000);
	}

	async function handleClick() {
		buttonScale = 0.95;
		setTimeout(() => (buttonScale = 1), 150);

		// Optimistic update
		globalCount++;
		personalCount++;
		localStorage.setItem(STORAGE_KEY, personalCount.toString());

		try {
			await fetch(`${Site.abacus.instance}/hit/${Site.abacus.namespace}/${KEY}`);
		} catch (error) {
			console.error('Failed to register click:', error);
			globalCount--;
		}
	}

	function formatNumber(num: number): string {
		return num.toLocaleString();
	}
</script>

<div
	class="border-surface0 bg-base flex flex-col justify-between rounded-xl border p-4 shadow-lg lg:col-span-1"
>
	<div class="text-center">
		<h3 class="text-text mb-3 text-sm font-semibold">👆 The Button</h3>

		<div class="relative">
			{#if isLoading}
				<div class="text-text text-3xl font-bold opacity-50">---</div>
			{:else}
				<div
					class="text-text text-3xl font-bold transition-all duration-300 {counterGlow
						? 'text-accent scale-105'
						: ''}"
				>
					{formatNumber(globalCount)}
				</div>
			{/if}

			{#each sparkles as sparkle (sparkle.id)}
				<div
					class="animate-sparkle text-accent pointer-events-none absolute"
					style="left: {sparkle.x}%; top: {sparkle.y}%;"
				>
					+1
				</div>
			{/each}
		</div>

		<p class="text-subtext0 mt-1 mb-4 text-xs">clicks wasted globally</p>

		<button
			onclick={handleClick}
			disabled={isLoading}
			class="bg-surface0 hover:bg-surface1 active:bg-surface2 text-text rounded-lg px-4 py-2 font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
			style="transform: scale({buttonScale})"
		>
			WASTE A CLICK
		</button>

		{#if personalCount > 0}
			<p class="text-subtext1 mt-3 text-xs">
				you: {personalCount}
			</p>
		{/if}
	</div>
</div>

<style>
	@keyframes sparkle {
		0% {
			opacity: 0;
			transform: translateY(0) scale(0);
		}
		20% {
			opacity: 1;
			transform: translateY(-10px) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-40px) scale(0.5);
		}
	}

	:global(.animate-sparkle) {
		animation: sparkle 2s ease-out forwards;
	}
</style>
