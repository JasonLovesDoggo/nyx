<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import { scale } from 'svelte/transition';
	import type { PostEntry } from '$lib/content/posts';
	import { backOut } from 'svelte/easing';

	export let data: { posts: PostEntry[] };
</script>

<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-text mb-8 text-3xl font-bold tracking-tight">Posts</h1>

	{#if data.posts.length}
		<div class="space-y-5">
			{#each data.posts as post, index (post.slug)}
				<a
					href={`/posts/${post.slug}`}
					class="
  group focus-visible:ring-accent after:bg-accent relative block
  py-3 no-underline after:absolute
  after:bottom-0 after:left-1/2 after:h-px
  after:w-0 after:-translate-x-1/2
  after:transition-[width]
  after:duration-400 after:ease-out
  after:content-[''] hover:after:w-full
  focus-visible:ring-2
"
					in:scale|global={{
						delay: 250 * index + 100,
						duration: 750,
						easing: backOut
					}}
				>
					<div class="flex items-baseline justify-between gap-4">
						<h2
							class="text-text group-hover:text-accent text-lg font-medium transition-colors duration-200 ease-in-out"
						>
							{post.metadata.title}
						</h2>

						{#if post.metadata.published_at}
							<p class="text-subtext0 flex-shrink-0 text-xs">
								{formatDate(post.metadata.published_at)}
							</p>
						{:else}
							<p class="text-subtext0 flex-shrink-0 text-xs italic">Draft</p>
						{/if}
					</div>

					<p class="text-subtext1 mt-1 text-sm">
						{post.metadata.description}
					</p>
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-subtext0">No posts yet.</p>
	{/if}
</div>
