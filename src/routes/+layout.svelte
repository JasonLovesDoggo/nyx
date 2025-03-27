<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/post">Settings</a>
</nav>

{@render children()}