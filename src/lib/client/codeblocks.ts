let delegationBound = false;

async function copy(code: string): Promise<boolean> {
	if (!code) return false;
	try {
		if (navigator?.clipboard?.writeText) {
			await navigator.clipboard.writeText(code);
			return true;
		}
	} catch {
		// fall through to execCommand
	}
	const textarea = document.createElement('textarea');
	textarea.value = code;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';
	document.body.appendChild(textarea);
	textarea.select();
	try {
		const result = document.execCommand('copy');
		return result;
	} catch {
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
}

function bindDelegatedHandler() {
	if (delegationBound || typeof document === 'undefined') {
		return;
	}
	delegationBound = true;
	document.addEventListener('click', async (event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest<HTMLButtonElement>('.code-block__copy');
		if (!button) return;
		// Shiki already renders the complete source as text. Read only <code>
		// (not the figure's caption or controls) instead of shipping it twice.
		const code = button.closest('.code-block')?.querySelector('pre code')?.textContent;
		if (!code) return;
		const success = await copy(code);
		if (success) {
			button.dataset.copied = 'true';
			setTimeout(() => {
				button.removeAttribute('data-copied');
			}, 2000);
		}
	});
}

export function initCodeBlocks() {
	bindDelegatedHandler();
}
