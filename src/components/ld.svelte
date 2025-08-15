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
			'anti-bot defenses',
			'AI security',
			'backend systems',
			'AWS',
			'Golang',
			'Python',
			'DevOps',
			'RedditVideoMakerBot',
			'Anubis',
			'Hackathons Canada',
			'Caddy Defender'
		],
		memberOf: [
			{
				'@type': 'Organization',
				name: 'Hack Canada',
				url: 'https://hackcanada.org'
			},
			{
				'@type': 'Organization',
				name: 'StorageBox',
				url: 'https://storagebox.app'
			},
			{
				'@type': 'Organization',
				name: 'Stan Store',
				url: 'https://www.stan.store'
			},
			{
				'@type': 'Organization',
				name: 'Techaro',
				url: 'https://techaro.lol'
			}
		]
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const personJson = JSON.stringify(person);
</script>

<svelte:head>
	<script type="application/ld+json">
		<!-- prettier-ignore -->
		{@html personJson}
	</script>
</svelte:head>
