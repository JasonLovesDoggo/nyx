<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Site from '$lib/config/common';
	import { IconInfoCircle } from '@tabler/icons-svelte';
	import { persistentWritable } from '$lib/stores/persistance';

	let globalCount = $state(0);
	let isLoading = $state(true);
	let sparkles = $state<Array<{ id: number; x: number; y: number }>>([]);
	let buttonScale = $state(1);
	let counterGlow = $state(false);
	let showInfo = $state(false);

	const KEY = 'collective-waste';

	// Use persistentWritable for personal count with cross-tab sync
	const personalCountStore = persistentWritable<number>('waste-clicks', {
		defaultValue: 0
	});

	let personalCount = $state(0);
	let eventSource: EventSource | null = null;

	// Subscribe to store changes
	$effect(() => {
		const unsubscribe = personalCountStore.subscribe((value) => {
			personalCount = value;
		});
		return unsubscribe;
	});

	onMount(() => {
		if (browser) {
			// Get initial count
			fetchCurrentCount();

			// Set up SSE stream
			eventSource = setupStream();

			// Listen for escape key to close info
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					showInfo = false;
				}
			};
			window.addEventListener('keydown', handleEscape);

			return () => {
				window.removeEventListener('keydown', handleEscape);
				if (eventSource) {
					eventSource.close();
				}
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
		const source = new EventSource(
			`${Site.abacus.instance}/stream/${Site.abacus.namespace}/${KEY}`
		);

		source.onmessage = (event) => {
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

		source.onerror = (error) => {
			console.error('Stream error:', error);
		};

		return source;
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

		// Update personal count through store
		personalCountStore.update((n) => n + 1);

		// Optimistic update for global count
		globalCount++;

		try {
			await fetch(`${Site.abacus.instance}/hit/${Site.abacus.namespace}/${KEY}`);
		} catch (error) {
			console.error('Failed to register click:', error);
			// Revert optimistic update
			globalCount--;
		}
	}

	function formatNumber(num: number): string {
		return num.toLocaleString();
	}
</script>

<div
	class="border-surface0 bg-base relative flex flex-col justify-between rounded-xl border p-4 shadow-lg lg:col-span-1"
>
	<div class="group absolute top-3 right-3">
		<button
			class="text-subtext1 hover:text-accent transition-colors"
			aria-label="What is this?"
			onclick={() => (showInfo = !showInfo)}
		>
			<IconInfoCircle size={16} />
		</button>

		<div
			class="bg-base/70 border-accent/20 text-subtext0 absolute top-6 right-0 z-10 w-[14rem] rounded-lg border p-3 text-xs shadow-xl backdrop-blur-md transition-all duration-200 {showInfo
				? 'visible opacity-100'
				: 'invisible opacity-0'} group-hover:visible group-hover:opacity-100"
		>
			A real-time global counter tracking every click from everyone visiting this site. Completely
			pointless, yet oddly satisfying.
		</div>
	</div>

	<div class="flex h-full flex-col items-center justify-center">
		<div class="text-accent mb-3 text-4xl font-bold">
			{#if isLoading}
				<span class="opacity-50">---</span>
			{:else}
				<div class="relative inline-block">
					<span class="transition-all duration-300 {counterGlow ? 'scale-110' : ''}">
						{formatNumber(globalCount)}
					</span>
					{#each sparkles as sparkle (sparkle.id)}
						<div
							class="animate-sparkle text-accent pointer-events-none absolute text-sm font-bold"
							style="left: {sparkle.x - 50}%; top: {sparkle.y - 50}%;"
						>
							+1
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<button
			onclick={handleClick}
			disabled={isLoading}
			class="bg-accent hover:bg-accent/90 active:bg-accent/80 rounded-xl px-6 py-3 text-base font-bold transition-all duration-150 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
			style="transform: scale({buttonScale})"
		>
			CLICK ME
		</button>

		<p class="text-subtext1 mt-6 text-xs">
			you've clicked {personalCount} time{personalCount === 1 ? '' : 's'}
		</p>
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
