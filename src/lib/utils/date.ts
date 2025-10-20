export function formatDate(
	dateString: string,
	options?: { yearMonthOnly?: boolean; shortMonth?: boolean }
) {
	try {
		const monthFormat = options?.shortMonth ? 'short' : 'long';
		const formatOptions: Intl.DateTimeFormatOptions = options?.yearMonthOnly
			? { year: 'numeric', month: monthFormat }
			: { year: 'numeric', month: monthFormat, day: '2-digit' };

		// Parse YYYY-MM-DD as local date to avoid timezone issues
		const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (match) {
			const [, year, month, day] = match;
			const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
			return date.toLocaleDateString('en-US', formatOptions);
		}

		return new Date(dateString).toLocaleDateString('en-US', formatOptions);
	} catch {
		return dateString;
	}
}
