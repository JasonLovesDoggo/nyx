export function formatDate(dateString: string, options?: { yearMonthOnly?: boolean }) {
	try {
		const formatOptions: Intl.DateTimeFormatOptions = options?.yearMonthOnly
			? { year: 'numeric', month: 'long' }
			: { year: 'numeric', month: 'long', day: 'numeric' };

		return new Date(dateString).toLocaleDateString('en-US', formatOptions);
	} catch {
		return dateString;
	}
}
