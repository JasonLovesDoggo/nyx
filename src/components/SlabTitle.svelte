<script lang="ts">
	interface Props {
		title: string;
		slug: string;
		href?: string;
		config?: string;
		hash?: string;
	}

	let { title, slug, href, config, hash }: Props = $props();

	const words = title.split(' ');
	const safePath = slug.split('/').pop() || slug;
	const colorHash = hash || slug;

	// Parse config string like "4c 3i 5ci 2.5"
	// Format: <size in rem><c?><i?>
	// c = colored (accent), i = italic
	interface WordConfig {
		size: number;
		colored: boolean;
		italic: boolean;
		color?: string;
	}

	const wordConfigs: WordConfig[] = config
		? config
				.split(/\s+/)
				.filter(Boolean)
				.map((cfg) => {
					const colorMatch = cfg.match(/\[(#(?:[0-9a-fA-F]{3,8}))\]/);
					const cleanedCfg = colorMatch ? cfg.replace(colorMatch[0], '') : cfg;
					const sizeMatch = cleanedCfg.match(/^([\d.]+)/);
					const size = sizeMatch ? parseFloat(sizeMatch[1]) : 3;
					const colored = cleanedCfg.includes('c') || Boolean(colorMatch);
					const italic = cleanedCfg.includes('i');
					return {
						size,
						colored,
						italic,
						color: colorMatch?.[1]
					};
				})
		: words.map((_) => ({
				size: 3,
				colored: false,
				italic: false
			}));

	// Simple hash function
	function hashCode(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash);
	}

	// Track word counts for duplicate words
	const wordCounts = new Map<string, number>();

	function getViewTransitionName(word: string): string {
		const normalized = word.toLowerCase().replace(/[^a-z0-9\s-_]/g, '');
		const count = wordCounts.get(normalized) || 0;
		wordCounts.set(normalized, count + 1);
		return `_${safePath}__${normalized}${count > 0 ? '___' + count : ''}`;
	}

	// Accent colors (Catppuccin)
	const accentColors = [
		'text-rosewater',
		'text-flamingo',
		'text-pink',
		'text-mauve',
		'text-red',
		'text-maroon',
		'text-peach',
		'text-yellow',
		'text-green',
		'text-teal',
		'text-sky',
		'text-sapphire',
		'text-blue',
		'text-lavender'
	];

	// Grayscale colors (light grays)
	const grayscaleColors = ['text-text', 'text-subtext1', 'text-subtext0', 'text-overlay2'];

	function getColorClass(index: number, colored: boolean): string {
		const h = hashCode(colorHash + index);
		if (colored) {
			return accentColors[h % accentColors.length];
		} else {
			return grayscaleColors[h % grayscaleColors.length];
		}
	}
</script>

{#snippet slabWords()}
	{#each words as word, i}
		{@const vtName = getViewTransitionName(word)}
		{@const wordConfig = wordConfigs[i] ?? {
			size: 3,
			colored: false,
			italic: false,
			color: undefined
		}}
		{@const h = hashCode(colorHash + i)}
		{@const fontWeight = wordConfig.italic ? [300, 400, 500][h % 3] : 900}
		{@const colorClass = wordConfig.color ? '' : getColorClass(i, wordConfig.colored)}
		{@const inlineStyle = `view-transition-name: ${vtName}; font-size: ${wordConfig.size}rem; font-weight: ${fontWeight};${
			wordConfig.color ? ` color: ${wordConfig.color};` : ''
		}`}
		<span
			class={`leading-none uppercase ${colorClass}`}
			class:font-jetbrains-mono={!wordConfig.italic}
			class:font-serif={wordConfig.italic}
			class:italic={wordConfig.italic}
			style={inlineStyle}
		>
			{word}
		</span>
	{/each}
{/snippet}

{#if href}
	<a {href} class="mx-auto mb-6 block w-full max-w-4xl px-4 outline-none">
		<h2 class="mx-auto flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2">
			{@render slabWords()}
		</h2>
	</a>
{:else}
	<h1
		class="mx-auto mb-6 flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4"
	>
		{@render slabWords()}
	</h1>
{/if}
