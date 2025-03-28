<script lang="ts">
	import ServiceStatus from '../misc/ServiceStatus.svelte';
	export let value;

	const year = new Date().getFullYear();
</script>


<footer class="flex items-center justify-between h-16 m-auto mb-5 p-5 bg-crust rounded-lg mx-5">
	<div class="">
		&copy; {year} Jason Cameron
	</div>

	<ServiceStatus/>

	<div>
		Views: {value}
	</div>
</footer>
