/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

/** @type {import('tailwindcss').Config} */
export const theme = {
	extend: {
		typography: () => ({
			DEFAULT: {
				css: {
					'--tw-prose-body': 'var(--color-text)',
					'--tw-prose-headings': 'var(--color-accent)', // Set heading color
					'--tw-prose-lead': 'var(--color-subtext1)',
					'--tw-prose-links': 'var(--color-accent)', // Set link color
					'--tw-prose-bold': 'var(--color-text)',
					'--tw-prose-counters': 'var(--color-subtext0)',
					'--tw-prose-bullets': 'var(--color-surface1)',
					'--tw-prose-hr': 'var(--color-surface1)',
					'--tw-prose-quotes': 'var(--color-accent)',
					'--tw-prose-quote-borders': 'var(--color-surface1)',
					'--tw-prose-captions': 'var(--color-subtext0)',
					'--tw-prose-code': 'var(--color-accent)', // Example: Use pink for inline code
					'--tw-prose-pre-code': 'inherit', // Inherit from shiki for code blocks
					'--tw-prose-pre-bg': 'var(--color-mantle)', // Background for code blocks
					'--tw-prose-th-borders': 'var(--color-surface1)',
					'--tw-prose-td-borders': 'var(--color-surface0)'
				}
			}
		})
	}
};
