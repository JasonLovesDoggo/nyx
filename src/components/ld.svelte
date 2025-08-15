<script lang="ts">
	import Site from '$lib/config/common';

	const person = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${Site.url}/#jasoncameron`,
		name: 'Jason Cameron',
		url: Site.url,
		alternateName: 'jsn.cam',
		jobTitle: 'Software Engineer',
		homeLocation: {
			'@type': 'Place',
			name: 'Toronto, Canada'
		},
		sameAs: [Site.out.github, Site.out.linkedin, Site.out.bluesky, Site.out.instagram],
		knowsAbout: [
			'AI security',
			'backend systems',
			'AWS',
			'anti-bot defenses',
			'Golang',
			'Python',
			'DevOps'
		]
	};

	const ldJson = `<script type="application/ld+json">${JSON.stringify(person)}<` + `/script>`;
</script>

<svelte:head>
	<!-- svelte-ignore svelte/no-at-html-tags -->
	{@html ldJson}
</svelte:head>
