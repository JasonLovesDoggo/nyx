<!-- src/routes/+page.svelte -->
<script lang="ts">
	import LinkWithIcon from '$components/LinkWithIcon.svelte';
	import { Accent, accentColorNames } from '$lib/stores/theme'; // For Color Selector
	import {
		IconBrandGithub, IconBrandLinkedin, IconFileCv, IconMail, IconArrowRight,
		IconBuildingFactory2, IconBriefcase, IconSchool, IconCode,
		IconExternalLink, IconCalendarEvent, IconColorSwatch, IconArticle,
		IconActivity, IconListCheck
	} from '@tabler/icons-svelte';

	// --- State for Name Hover ---
	let isNameHovered = $state(false);


	// --- Data (Replace placeholders) ---
	const organizations = [
		{ name: 'Hack Club', href: 'https://hackclub.com', icon: IconBuildingFactory2, external: true },
		{ name: 'JAMHacks Lead', href: '[Link?]', icon: IconBuildingFactory2, external: true }
	];
	const workExperience = [
		{ company: 'Shopify', role: 'Incoming SWE Intern', href: 'https://shopify.com', icon: IconBriefcase, external: true }
		// { company: 'Sunnybrook', role: 'ML Research', href:'[Link]', icon: IconBriefcase, external: true },
		// { company: 'UWaterloo', role: 'Research', href:'[Link]', icon: IconBriefcase, external: true },
	];
	const featuredProjects = [
		{
			title: 'Anti-Scraper Development',
			description: 'Engineered systems to identify, analyze, and block malicious web scraping bots.',
			icon: IconBrandLinkedin,
			href: '/projects/anti-scraping', // Internal link example
			external: false
		},
		{
			title: 'CVE Discovery & Reporting',
			description: 'Contributed to web security by discovering and reporting vulnerabilities.',
			icon: IconBrandLinkedin,
			href: '[Link to CVE details]', // External link example
			external: true
		},
		{
			title: 'Deep Learning Framework (C++)',
			description: 'Built a foundational deep learning framework from the ground up using C++.',
			icon: IconCode,
			href: '/projects/dl-framework',
			external: false
		},
		{
			title: 'AI Agent for 3D Models (UofTHacks Winner)',
			description: 'Created an award-winning AI agent converting text/images to 3D-printable models.',
			icon: IconCode,
			href: '/projects/ai-3d-agent',
			external: false
		}
	];
	const latestPosts = [ // Fetch these dynamically later
		{ title: 'Understanding Web Scraper Tactics', href: '/blog/scraper-tactics' },
		{ title: 'My First CVE Discovery Journey', href: '/blog/first-cve' }
	];
	const codingStats = { language: 'Python', hours: '1,200+' }; // Example WakaTime data - Fetch dynamically
	const latestCommits = [ // Fetch these dynamically later
		{ repo: 'jasonlovesdoggo/nyx', message: 'feat: Implement actual bento grid', href: '...', sha: 'abc1234' } ,
		{ repo: 'some-other/project', message: 'fix: Address issue #5', href: '...', sha: 'def5678' }
	];
	const socialLinks = [
		{ href: "https://github.com/jasonlovesdoggo", text: "GitHub", icon: IconBrandGithub, external: true },
		{ href: "https://www.linkedin.com/in/jsoncameron/", text: "LinkedIn", icon: IconBrandLinkedin, external: true },
		{ href: "/resume.pdf", text: "Resume", icon: IconFileCv, external: true }, // External for file handling
	];
	const calLink = "https://cal.com/jasoncameron/meet";

</script>

<svelte:head>
	<title>Jason Cameron - Student & Engineer</title>
	<meta name="description" content="Jason Cameron's personal site. High school student passionate about backend, DevOps, cybersecurity, anti-bot systems, and leading tech initiatives."/>
	<meta name="robots" content="noai, noimageai" />
</svelte:head>

<div class="mx-auto max-w-4xl space-y-10 px-4 py-8 md:space-y-14 md:py-12">

	<!-- Section 1: Hero / Introduction - Less Dense -->
	<section class="space-y-5">
		<h1 class="text-3xl font-bold md:text-4xl">
			Hi! I'm
			<span
				class="group relative inline-block text-accent  font-bold transition-opacity duration-200 "
				onmouseenter={() => isNameHovered = true}
				onmouseleave={() => isNameHovered = false}
				onfocus={() => isNameHovered = true}
				onblur={() => isNameHovered = false}
				tabindex="0"
				role="button"
				aria-label="Jason Cameron - Hover or focus to see a fun fact"
			>
				<span class:hidden={!isNameHovered}>JSON</span>
				<span class:hidden={isNameHovered}>Jason</span>
			</span>
		</h1>
		<p class="text-lg text-subtext0 leading-relaxed max-w-prose">
			A high school student building and securing web infrastructure. I focus on
			<strong class="font-medium text-text">backend systems</strong>, <strong class="font-medium text-text">DevOps</strong>, and <strong class="font-medium text-text">cybersecurity</strong>, especially crafting defenses against automated threats. I enjoy leading initiatives and tackling complex technical challenges.
		</p>
		<!-- Links below text -->
		<div class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
			{#each socialLinks as link (link.href)}
				<LinkWithIcon
					href={link.href}
					text={link.text}
					icon={link.icon}
					external={link.external}
					class="text-sm"
				/>
			{/each}
			<a href="/about" class="group inline-flex items-center gap-1 text-sm text-subtext1 transition-colors duration-200 hover:text-accent">
				<span>More about me</span>
				<IconArrowRight size={16} class="transition-transform duration-200 group-hover:translate-x-0.5" />
			</a>
		</div>
	</section>

	<!-- Section 2: Bento Grid Container -->
	<section class="rounded-lg border border-surface0 bg-mantle p-4 md:p-5">
		<h2 class="sr-only">Dashboard / Highlights</h2>
		<!-- Define the grid structure (e.g., 3 columns) -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

			<!-- Box 1: Featured Projects (Spans more columns/rows) -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50 sm:col-span-2 lg:row-span-2">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconListCheck size={18} class="text-accent" />
					Featured Projects
				</h3>
				<div class="space-y-3">
					{#each featuredProjects as item (item.title)}
						{@const Icon = item.icon}
						<a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} class="group block rounded-md border border-surface1 bg-mantle p-2.5 transition-colors hover:border-surface2 hover:bg-surface0">
							<div class="flex items-start gap-2.5">
								<Icon size={18} class="text-accent mt-0.5 flex-shrink-0" />
								<div class="flex-1">
									<h4 class="font-medium text-text group-hover:text-accent text-sm leading-tight">
										{item.title}
										{#if item.external}
											<IconExternalLink size={12} class="ml-1 inline-block text-subtext1 group-hover:text-accent" />
										{/if}
									</h4>
									<p class="mt-0.5 text-xs text-subtext0">{item.description}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
				<a href="/projects" class="group mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline">
					<span>All projects</span>
					<IconArrowRight size={14} class="transition-transform duration-200 group-hover:translate-x-0.5" />
				</a>
			</div>

			<!-- Box 2: Color Selector -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50">
				<h3 class="mb-3 flex items-center gap-2 font-semibold text-text">
					<IconColorSwatch size={18} class="text-accent" />
					Theme Accent
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each accentColorNames as colorName (colorName)}
						{@const isSelected = $Accent === colorName}
						<button
							aria-label={`Select ${colorName} accent color`}
							title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
							onclick={() => ($Accent = colorName)}
							style:background-color={`var(--color-${colorName})`}
							class={`h-5 w-5 rounded-full transition-all duration-150 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-base ring-accent' : 'hover:scale-110'}`}
						>
							<span class="sr-only">{colorName}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Box 3: Latest Blog Posts -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconArticle size={18} class="text-accent" />
					Latest Posts
				</h3>
				{#if latestPosts.length > 0}
					<ul class="space-y-1.5 text-xs">
						{#each latestPosts as post (post.href)}
							<li><a href={post.href} class="text-text hover:underline line-clamp-1">{post.title}</a></li>
						{/each}
					</ul>
				{:else}
					<p class="text-subtext1 text-xs italic">No posts yet.</p>
				{/if}
				<a href="/blog" class="group mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline">
					<span>All posts</span>
					<IconArrowRight size={14} class="transition-transform duration-200 group-hover:translate-x-0.5" />
				</a>
			</div>

			<!-- Box 4: Coding Stats -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconCode size={18} class="text-accent" />
					Coding Activity
				</h3>
				<p class="text-subtext0 text-xs">Primary: <span class="text-text font-medium">{codingStats.language}</span></p>
				<p class="text-subtext0 text-xs">Hours: <span class="text-text font-medium">{codingStats.hours}</span> <span class="text-overlay0">(WakaTime)</span></p>
				<a href="[Link to WakaTime/GitHub Stats]" target="_blank" rel="noopener noreferrer" class="group mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline">
					<span>View stats</span>
					<IconExternalLink size={12} class="inline-block" />
				</a>
			</div>

			<!-- Box 5: Latest Commits -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconActivity size={18} class="text-accent" />
					Recent Commits
				</h3>
				{#if latestCommits.length > 0}
					<ul class="space-y-1 text-xs">
						{#each latestCommits as commit (commit.sha)}
							<li>
								<a href={commit.href} target="_blank" rel="noopener noreferrer" class="block truncate text-subtext0 hover:text-accent">
									<span class="text-text font-medium">{commit.repo.split('/')[1]}:</span> {commit.message}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-subtext1 text-xs italic">No recent public commits.</p>
				{/if}
				<a href="https://github.com/jasonlovesdoggo" target="_blank" rel="noopener noreferrer" class="group mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline">
					<span>View GitHub</span>
					<IconExternalLink size={12} class="inline-block" />
				</a>
			</div>

			<!-- Box 6: Roles / Affiliations (Moved inside grid) -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconBriefcase size={18} class="text-accent" />
					Roles & Affiliations
				</h3>
				<div class="space-y-1.5 text-xs">
					<div class="flex items-center gap-1.5 text-subtext0">
						<IconSchool size={16} class="text-sky flex-shrink-0" />
						<span>Student @ High School</span>
					</div>
					{#if workExperience.length > 0}
						{#each workExperience as exp (exp.company)}
							{@const ExpIcon = exp.icon}
							<div class="flex items-center gap-1.5 text-subtext0">
								<ExpIcon size={16} class="text-green flex-shrink-0" />
								<span title={exp.role + ' @ ' + exp.company}>{exp.company} ({exp.role.includes('Incoming') ? 'Incoming' : 'Past'})</span>
							</div>
						{/each}
					{/if}
					{#if organizations.length > 0}
						{#each organizations as org (org.name)}
							{@const OrgIcon = org.icon}
							<div class="flex items-center gap-1.5 text-subtext0">
								<OrgIcon size={16} class="text-mauve flex-shrink-0" />
								<a href={org.href} target="_blank" rel="noopener noreferrer" class="hover:text-accent hover:underline">Leading @ {org.name}</a>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Box 7: Book a Call / Contact -->
			<div class="rounded-lg bg-base p-3 shadow-sm ring-1 ring-surface1/50 lg:col-span-1">
				<h3 class="mb-3 flex items-center gap-2 text-base font-semibold text-text">
					<IconCalendarEvent size={18} class="text-accent" />
					Let's Connect
				</h3>
				<p class="text-xs text-subtext0 mb-3">Interested in collaborating or discussing tech? Feel free to book a time.</p>
				<a href={calLink} target="_blank" rel="noopener noreferrer" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-base shadow-sm transition-colors hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-base">
					Book a Call (Cal.com)
				</a>
			</div>

		</div>
	</section>

</div>