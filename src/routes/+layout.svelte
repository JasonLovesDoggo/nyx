<script lang="ts">
	import "../app.css";
	import Header from "../components/layout/Header.svelte";
	import Footer from "../components/layout/Footer.svelte";
	export let data;


</script>



<div class="flex min-h-screen flex-col bg-base text-text">
	<Header />
	<main class="flex-1">
		<slot />
	</main>
	<Footer value={data.footerData.value} />
</div>