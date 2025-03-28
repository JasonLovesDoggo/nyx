<script lang="ts">
	import ServiceStatus from '../misc/ServiceStatus.svelte';
	export let value;

	const year = new Date().getFullYear();

</script>


<footer class="flex items-center justify-center w-full h-16 border-t border-surface0">
	<div class="text-subtext0">
		&copy; {year} Jason Cameron
	</div>

	<ServiceStatus/>

	<div>
		Views: {value}
	</div>

</footer>
