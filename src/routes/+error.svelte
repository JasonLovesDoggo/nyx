<!--
  - Copyright (c) 2025. Jason Cameron
  - All Rights Reserved
  -->

<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	// Configuration constants - easier to maintain
	const CONFIG = {
		REDIRECT_TIME: 20,
		TYPING_SPEED: { min: 50, max: 100 },
		CURSOR_BLINK_RATE: 500,
		SCAN_UPDATE_RATE: 100,
		TRACE_UPDATE_RATE: 300
	};

	// Terminal content for each mode
	const TERMINAL_CONTENT = {
		matrix: {
			title: '> scanning...',
			errorMsg: "No match found for '{pathname}'",
			helpText: 'Try another query or escape to the mainframe.'
		},
		glitchy: [
			'> boot ./page404.sh',
			'Loading system...',
			'Initializing kernel modules...',
			'ERROR: Kernel Panic – Page Not Found',
			'FATAL: Memory corruption detected',
			'',
			'>> SYSTEM HALTED <<'
		],
		command: [
			'> cd /requested-page',
			'bash: cd: /requested-page: No such file or directory',
			'> ls -la /requested-page',
			"ls: cannot access '/requested-page': No such file or directory",
			'> find / -name "*requested-page*" 2>/dev/null',
			'(no results found)'
		]
	};

	// State variables
	let errorCode = page.status;
	let errorMessage = page.error?.message || 'Page not found';
	let redirectCounter = CONFIG.REDIRECT_TIME;
	let scanProgress = 0;
	let terminalLines = [];
	let currentTerminalLine = '';
	let showCursor = true;
	let terminalMode = Math.floor(Math.random() * 3);
	let traceRouteOutput = [];
	let traceRouteComplete = false;

	// Cleanup intervals
	let intervals = [];

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

		return hosts.map((host, i) => {
			const latency = Math.floor(Math.random() * 50) + 10;
			const isLastHop = i === hosts.length - 1;

			return {
				hop: i + 1,
				host,
				ip: isLastHop
					? '404.404.404.404'
					: `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
				time: isLastHop ? '* * *' : `${latency} ms`,
				color: isLastHop ? 'text-red' : i < 3 ? 'text-green' : i < 6 ? 'text-yellow' : 'text-maroon'
			};
		});
	}

	const traceRouteData = generateTraceRoute();

	// Utility functions
	function addInterval(intervalId) {
		intervals.push(intervalId);
		return intervalId;
	}

	function clearAllIntervals() {
		intervals.forEach(clearInterval);
		intervals = [];
	}

	function typeText(text, callback) {
		let i = 0;
		const typingSpeed =
			CONFIG.TYPING_SPEED.min + Math.random() * (CONFIG.TYPING_SPEED.max - CONFIG.TYPING_SPEED.min);

		const typing = addInterval(
			setInterval(() => {
				if (i < text.length) {
					currentTerminalLine += text.charAt(i);
					i++;
				} else {
					clearInterval(typing);
					terminalLines = [...terminalLines, currentTerminalLine];
					currentTerminalLine = '';
					if (callback) callback();
				}
			}, typingSpeed)
		);
	}

	function processTerminalLines(lines, delay = 500) {
		let currentLine = 0;

		function processNextLine() {
			if (currentLine < lines.length) {
				typeText(lines[currentLine], () => {
					setTimeout(processNextLine, delay);
					currentLine++;
				});
			}
		}

		processNextLine();
	}

	// Mode-specific initialization
	function initializeMode() {
		switch (terminalMode) {
			case 0: {
				// Matrix Scanner
				const scannerInterval = addInterval(
					setInterval(() => {
						if (scanProgress < 100) {
							scanProgress += Math.random() * 5;
							if (scanProgress > 100) scanProgress = 100;
						} else {
							clearInterval(scannerInterval);
							traceRouteComplete = true;
						}
					}, CONFIG.SCAN_UPDATE_RATE)
				);
				break;
			}

			case 1: // Glitchy Terminal
				processTerminalLines(TERMINAL_CONTENT.glitchy, 400);
				break;

			case 2: // Command Not Found
				processTerminalLines(TERMINAL_CONTENT.command, 800);
				break;
		}
	}

	function startRedirectCountdown() {
		const countdownInterval = addInterval(
			setInterval(() => {
				if (redirectCounter > 0) {
					redirectCounter--;
				} else {
					clearInterval(countdownInterval);
					window.location.href = '/';
				}
			}, 1000)
		);
	}

	function startCursorBlink() {
		addInterval(
			setInterval(() => {
				showCursor = !showCursor;
			}, CONFIG.CURSOR_BLINK_RATE)
		);
	}

	function startTraceRoute() {
		const traceInterval = addInterval(
			setInterval(() => {
				if (traceRouteOutput.length < traceRouteData.length) {
					traceRouteOutput = [...traceRouteOutput, traceRouteData[traceRouteOutput.length]];
					if (traceRouteOutput.length === traceRouteData.length) {
						traceRouteComplete = true;
						clearInterval(traceInterval);
					}
				}
			}, CONFIG.TRACE_UPDATE_RATE)
		);
	}

	onMount(() => {
		startCursorBlink();
		initializeMode();
		startRedirectCountdown();
		startTraceRoute();

		// Cleanup on component destroy
		return clearAllIntervals;
	});
</script>

<svelte:head>
	<title>Error {errorCode} | System Error</title>
</svelte:head>

<div class="relative z-10 container mx-auto px-4 py-16">
	<div
		class="border-overlay0 bg-base/80 mx-auto max-w-3xl rounded-lg border p-6 shadow-lg backdrop-blur-md"
	>
		<div class="mb-6 flex items-center">
			<div class="text-accent mr-4 font-mono text-6xl font-bold">{errorCode}</div>
			<div class="border-overlay0 border-l-2 pl-4">
				<h1 class="text-text font-mono text-2xl font-bold">Page Not Found</h1>
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
				<div class="border-overlay0 bg-crust/80 overflow-hidden rounded border p-4">
					<div class="text-text mb-2">{TERMINAL_CONTENT.matrix.title}</div>

					<div class="bg-surface0 mb-4 h-2 w-full rounded-full">
						<div
							class="bg-accent h-full rounded-full transition-all duration-300"
							style="width: {scanProgress}%"
						></div>
					</div>

					<!-- Fixed height container to prevent cursor shift -->
					<div class="min-h-[3rem]">
						{#if traceRouteComplete}
							<div class="text-red mt-2">
								{TERMINAL_CONTENT.matrix.errorMsg.replace('{pathname}', page.url.pathname)}
							</div>
							<div class="text-accent mt-2">{TERMINAL_CONTENT.matrix.helpText}</div>
						{/if}
					</div>
				</div>
			{:else if terminalMode === 1}
				<!-- Glitchy Terminal Boot -->
				<div class="border-overlay0 bg-crust/80 overflow-hidden rounded border p-4">
					<!-- Fixed height container to prevent cursor shift -->
					<div class="min-h-[12rem]">
						{#each terminalLines as line (line)}
							<div
								class="
								{line.includes('Error') || line.includes('FATAL')
									? 'text-red'
									: line.includes('SYSTEM')
										? 'text-accent animate-pulse font-bold'
										: 'text-text'}"
							>
								{line}
							</div>
						{/each}
						<div class="text-text inline">
							<span>{currentTerminalLine}</span><span class="inline-block w-2"
								>{#if showCursor}_
								{:else}&nbsp;{/if}</span
							>
						</div>
					</div>
				</div>
			{:else}
				<!-- Command Not Found -->
				<div class="border-overlay0 bg-crust/80 overflow-hidden rounded border p-4">
					<!-- Fixed height container to prevent cursor shift -->
					<div class="min-h-[10rem]">
						{#each terminalLines as line (line)}
							<div
								class={line.includes('bash:') || line.includes('ls:') ? 'text-red' : 'text-text'}
							>
								{line}
							</div>
						{/each}
						<div class="text-text inline">
							<span>{currentTerminalLine}</span><span class="inline-block w-2"
								>{#if showCursor}_
								{:else}&nbsp;{/if}</span
							>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Traceroute output (only for matrix mode) -->
		{#if terminalMode === 0 && traceRouteOutput.length > 0}
			<div class="mb-6 font-mono text-xs">
				<div class="border-overlay0 bg-crust/80 overflow-hidden rounded border p-4">
					<div class="text-text mb-2">traceroute to {page.url.pathname}:</div>
					{#each traceRouteOutput as trace (trace.hop)}
						<div class={trace.color}>
							{trace.hop}. {trace.host} ({trace.ip}) {trace.time}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/"
				class="border-accent bg-accent/20 text-accent hover:bg-accent/30 rounded-md border px-6 py-2 text-center transition-all duration-300"
			>
				Return to Home
			</a>
			<button
				onclick={() => history.back()}
				class="border-overlay0 bg-surface0/50 text-text hover:bg-surface0 rounded-md border px-6 py-2 transition-all duration-300"
			>
				Go Back
			</button>
		</div>
	</div>
</div>
