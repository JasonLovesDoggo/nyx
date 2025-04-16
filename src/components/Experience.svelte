<script lang="ts">
	import { Popover } from 'bits-ui';
	import { experienceTimeline } from '$lib/config/pages.js';
	import { IconX, IconExternalLink } from '@tabler/icons-svelte';

	function isPast(item: (typeof experienceTimeline)[number]): boolean {
		return !!item.endDate;
	}
</script>

<section class="px-4 md:px-0">
	<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:justify-start">
		{#each experienceTimeline as item, i (item.company)}
			{@const past = isPast(item)}

			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<button
							{...props}
							class="focus-visible:ring-accent group focus-visible:ring-offset-base flex cursor-pointer items-center gap-2 rounded text-sm transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 {past
								? 'opacity-60 hover:opacity-80 focus-visible:opacity-100'
								: 'hover:opacity-80 focus-visible:opacity-100'}"
							aria-label={`View details for ${item.role} at ${item.company}`}
						>
							<img src={item.logoUrl} alt="" class="max-w-9 min-w-7 object-fill" />
							<span class="text-subtext1 group-hover:text-text group-focus-visible:text-text">
								<span class={past ? '' : 'text-text font-medium'}>{item.company}</span>
								{#if past}
									<span class="text-overlay0 text-xs"> (Past)</span>
								{/if}
							</span>
						</button>
					{/snippet}
				</Popover.Trigger>

				<Popover.Portal>
					<Popover.Content
						class="border-surface0 bg-mantle text-text shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-30 max-w-xs rounded-xl border p-4"
						sideOffset={8}
						side="top"
						align="center"
					>
						<div class="mb-3 flex items-start justify-between">
							<div class="flex items-center gap-3">
								<img
									src={item.logoUrl}
									alt=""
									class="bg-surface0 h-10 w-auto max-w-[4rem] flex-shrink-0 rounded-md object-contain p-1"
								/>
								<div>
									<h4 class="text-text group-hover:text-accent font-semibold transition-colors">
										{item.company}
									</h4>
									<p class="text-subtext0 text-sm">{item.role}</p>
								</div>
							</div>
							<Popover.Close
								class="text-subtext1 hover:text-accent -m-1 cursor-pointer rounded p-1 transition-colors"
								aria-label="Close details"
							>
								<IconX size={18} />
							</Popover.Close>
						</div>

						{#if item.details}
							<p class="text-subtext1 mb-3 text-sm">{item.details}</p>
						{/if}

						{#if item.endDate}
							<p class="text-overlay0 mb-3 text-xs">Ended: {item.endDate}</p>
						{/if}

						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent hover:text-accent/80 inline-flex items-center gap-1 text-sm transition-colors"
						>
							<span>Visit Website</span>
							<IconExternalLink size={16} stroke={1.5} />
						</a>

						<Popover.Arrow class="fill-surface0" width={12} height={6} />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>

			{#if i < experienceTimeline.length - 1}
				<span class="text-accent hidden md:inline">/</span>
			{/if}
		{/each}
	</div>
</section>
