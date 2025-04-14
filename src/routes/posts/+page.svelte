<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostEntry } from '$lib/content/posts';
	export let data: { posts: PostEntry[] };
</script>

<svelte:head>
	<title>Posts</title>
	<meta name="description" content="All posts posts" />
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold">Posts</h1>

	{#if data.posts.length}
		<div class="grid gap-6 md:grid-cols-2">
			{#each data.posts as post (post.slug)}
				<a
					href={`/posts/${post.slug}`}
					class="hover:border-accent block rounded-lg border p-5 shadow"
				>
					<h2 class="text-xl font-semibold">{post.metadata.title}</h2>
					<p class="text-subtext0 text-sm">{post.metadata.description}</p>
					{#if post.metadata.published_at}
						<p class="text-overlay0 mt-2 text-xs">{formatDate(post.metadata.published_at)}</p>
					{:else}
						<p class="text-overlay0 mt-2 text-xs">Draft</p>
					{/if}
				</a>
			{/each}
		</div>
	{:else}
		<p>No posts yet.</p>
	{/if}
</div>
