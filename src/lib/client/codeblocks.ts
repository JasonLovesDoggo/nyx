const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;
let delegationBound = false;

function decodeBase64(payload: string): string | null {
	if (!payload) return null;
	try {
		if (typeof atob === 'function') {
			const binary = atob(payload);
			if (decoder) {
				const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
				return decoder.decode(bytes);
			}
			return binary;
		}
	} catch (error) {
		console.warn('Failed to decode code block payload', error);
	}
	return null;
}

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
		const payload = button.dataset.code ?? '';
		const decoded = decodeBase64(payload);
		if (!decoded) return;
		const success = await copy(decoded);
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
