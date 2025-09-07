<script lang="ts">
	export interface CommitLanguage {
		size: number;
		name: string;
		color: string;
	}

	let {
		languages = [],
		totalAdditions = 0,
		totalDeletions = 0
	}: {
		languages: CommitLanguage[];
		totalAdditions: number;
		totalDeletions: number;
	} = $props();

	const total = $derived(languages.reduce((acc, l) => acc + l.size, 0));
	const top = $derived([...languages].sort((a, b) => b.size - a.size).slice(0, 4));
</script>

<div class="space-y-3">
	<div class="flex items-center gap-4 text-xs">
		<span class="text-green bg-surface0 border-surface1 rounded border px-2 py-0.5">
			+{totalAdditions}
		</span>
		<span class="text-red bg-surface0 border-surface1 rounded border px-2 py-0.5">
			-{totalDeletions}
		</span>
	</div>

	<div class="bg-surface2 h-2 w-full overflow-hidden rounded">
		{#if total > 0}
			<div class="flex h-full w-full">
				{#each languages as lang (lang.name)}
					<div
						class="h-full"
						style={`width: ${(lang.size / total) * 100}%; background-color: ${lang.color};`}
						title={`${lang.name}: ${Math.round((lang.size / total) * 100)}%`}
					></div>
				{/each}
			</div>
		{:else}
			<div class="bg-surface1 h-full w-full"></div>
		{/if}
	</div>

	<ul class="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
		{#each top as lang (lang.name)}
			<li class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded" style={`background-color: ${lang.color};`}
				></span>
				<span class="text-subtext0">{lang.name}</span>
				<span class="text-surface1">·</span>
				<span class="text-subtext1">{Math.round((lang.size / total) * 100)}%</span>
			</li>
		{/each}
	</ul>
</div>
