<!--
  - Copyright (c) 2025. Jason Cameron
  - All Rights Reserved
  -->

<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let errorCode = page.status;
	let errorMessage = page.error?.message || 'Page not found';
	let redirectCounter = 10;
	let scanProgress = 0;
	let terminalLines = [];
	let currentTerminalLine = '';
	let showCursor = true;
	let terminalMode = Math.floor(Math.random() * 3); // 0: Matrix Scanner, 1: Glitchy Terminal, 2: Command Not Found

	// For the Matrix-style scanner
	let scannerInterval;

	// For the glitchy terminal
	let glitchyLines = [
		'> boot ./page404.sh',
		'Loading...',
		'Loading...',
		'Error: Kernel Panic – Page Not Found',
		'',
		'>> SYSTEM HALTED <<'
	];

	// For command not found
	let commandLines = [
		'> cd /requested-page',
		'bash: cd: /requested-page: No such file or directory'
	];

	// Generate fake traceroute data
	function generateTraceRoute() {
		const hosts = [
			'gateway.local',
			'edge-router-01.isp.net',
			'core-switch-03.isp.net',
			'backbone-east.provider.net',
			'trans-atlantic-link.provider.net',
			'eu-exchange-01.provider.net',
			'cdn-edge-05.provider.net',
			'load-balancer-02.cloud.provider',
			'web-cluster-east.cloud.provider',
			'404-dimension.void'
		];

		const traceData = [];

		for (let i = 0; i < hosts.length; i++) {
			const latency = Math.floor(Math.random() * 50) + 10;

			// For the last hop (404 dimension), we'll show a timeout
			if (i === hosts.length - 1) {
				traceData.push({
					hop: i + 1,
					host: hosts[i],
					ip: '404.404.404.404',
					time: '* * *',
					color: 'text-maroon'
				});
			} else {
				traceData.push({
					hop: i + 1,
					host: hosts[i],
					ip: `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
					time: `${latency} ms`,
					color: i < 3 ? 'text-green' : i < 6 ? 'text-yellow' : 'text-maroon'
				});
			}
		}

		return traceData;
	}

	// Generate traceroute data
	const traceRouteData = generateTraceRoute();
	let traceRouteOutput = [];
	let traceRouteComplete = false;

	// Typing effect for terminal
	function typeText(text, callback) {
		let i = 0;
		const typing = setInterval(
			() => {
				if (i < text.length) {
					currentTerminalLine += text.charAt(i);
					i++;
				} else {
					clearInterval(typing);
					terminalLines = [...terminalLines, currentTerminalLine];
					currentTerminalLine = '';
					if (callback) callback();
				}
			},
			50 + Math.random() * 50
		); // Random typing speed for more realistic effect
	}

	// Glitch effect
	function glitchText() {
		let currentLine = 0;

		function processNextLine() {
			if (currentLine < glitchyLines.length) {
				typeText(glitchyLines[currentLine], () => {
					setTimeout(processNextLine, 500);
					currentLine++;
				});
			}
		}

		processNextLine();
	}

	// Command not found effect
	function commandNotFound() {
		let currentLine = 0;

		function processNextLine() {
			if (currentLine < commandLines.length) {
				typeText(commandLines[currentLine], () => {
					setTimeout(processNextLine, 800);
					currentLine++;
				});
			}
		}

		processNextLine();
	}

	// Matrix scanner effect
	function startScanner() {
		scannerInterval = setInterval(() => {
			if (scanProgress < 100) {
				scanProgress += Math.random() * 5;
				if (scanProgress > 100) scanProgress = 100;
			} else {
				clearInterval(scannerInterval);
				traceRouteComplete = true;
			}
		}, 100);
	}

	// Redirect countdown
	function startRedirectCountdown() {
		const countdownInterval = setInterval(() => {
			if (redirectCounter > 0) {
				redirectCounter--;
			} else {
				clearInterval(countdownInterval);
				window.location.href = '/';
			}
		}, 1000);
	}

	onMount(() => {
		// Start cursor blinking
		setInterval(() => {
			showCursor = !showCursor;
		}, 500);

		// Start the appropriate terminal effect
		if (terminalMode === 0) {
			startScanner();
		} else if (terminalMode === 1) {
			glitchText();
		} else {
			commandNotFound();
		}

		// Start the redirect countdown
		startRedirectCountdown();

		// Animate the traceroute output
		const traceInterval = setInterval(() => {
			if (traceRouteOutput.length < traceRouteData.length) {
				traceRouteOutput = [...traceRouteOutput, traceRouteData[traceRouteOutput.length]];
				if (traceRouteOutput.length === traceRouteData.length) {
					traceRouteComplete = true;
					clearInterval(traceInterval);
				}
			}
		}, 300);
	});
</script>

<svelte:head>
	<title>Error {errorCode} | System Error</title>
</svelte:head>

<div class="relative z-10 container mx-auto px-4 py-16">
	<div
		class="bg-base/80 border-overlay0 mx-auto max-w-3xl rounded-lg border p-6 shadow-lg backdrop-blur-md"
	>
		<div class="mb-6 flex items-center">
			<div class="text-accent mr-4 font-mono text-6xl font-bold">{errorCode}</div>
			<div class="border-overlay0 border-l-2 pl-4">
				<h1 class="text-text font-mono text-2xl font-bold">ERROR</h1>
				<p class="text-subtext0">{errorMessage}</p>
			</div>
		</div>

		<!-- Redirect countdown -->
		<div class="text-accent mb-4 animate-pulse text-center font-mono text-sm">
			> Redirecting in {redirectCounter}...
		</div>

		<!-- Terminal output based on mode -->
		<div class="mb-6 font-mono text-sm">
			{#if terminalMode === 0}
				<!-- Matrix-style Scanner -->
				<div class="bg-crust/80 border-overlay0 overflow-hidden rounded border p-4">
					<div class="text-text mb-2">> scanning...</div>

					<div class="bg-surface0 mb-4 h-2 w-full rounded-full">
						<div class="bg-accent h-full rounded-full" style="width: {scanProgress}%"></div>
					</div>

					{#if traceRouteComplete}
						<div class="text-maroon mt-2">
							No match found for '{page.url.pathname}'
						</div>
						<div class="text-accent mt-2">Try another query or escape to the mainframe.</div>
					{/if}
				</div>
			{:else if terminalMode === 1}
				<!-- Glitchy Terminal Boot -->
				<div class="bg-crust/80 border-overlay0 overflow-hidden rounded border p-4">
					{#each terminalLines as line}
						<div
							class={line.includes('Error')
								? 'text-maroon'
								: line.includes('SYSTEM')
									? 'text-accent font-bold'
									: 'text-text'}
						>
							{line}
						</div>
					{/each}
					<div class="text-text">
						{currentTerminalLine}{#if showCursor}<span class="animate-pulse">_</span>{/if}
					</div>
				</div>
			{:else}
				<!-- Command Not Found -->
				<div class="bg-crust/80 border-overlay0 overflow-hidden rounded border p-4">
					{#each terminalLines as line}
						<div class={line.includes('bash:') ? 'text-maroon' : 'text-text'}>
							{line}
						</div>
					{/each}
					<div class="text-text">
						{currentTerminalLine}{#if showCursor}<span class="animate-pulse">_</span>{/if}
					</div>
				</div>
			{/if}
		</div>

		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/"
				class="bg-accent/20 hover:bg-accent/30 text-accent border-accent rounded-md border px-6 py-2 text-center transition-all duration-300"
			>
				Return to Home
			</a>
			<button
				onclick={(e) => history.back()}
				class="bg-surface0/50 hover:bg-surface0 text-text border-overlay0 rounded-md border px-6 py-2 transition-all duration-300"
			>
				Go Back
			</button>
		</div>
	</div>
</div>
