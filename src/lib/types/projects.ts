// Re-using or defining the ProjectMetadata type
export interface ProjectMetadata {
	title: string;
	description: string;
	date: string; // Consider using Date type if you parse it
	published: boolean;
	featured?: boolean;
	tags?: string[];
	// Add other fields like project URL, image, etc. if needed
	// projectUrl?: string;
	// imageUrl?: string;
}

// Represents a project entry for listing pages
export interface ProjectEntry {
	slug: string;
	metadata: ProjectMetadata;
}

// Represents the full data for a single project page
export interface ProjectPageData extends ProjectEntry {
	content: ConstructorOfATypedSvelteComponent; // The compiled Svelte component from mdsvex
}

export type WithMetadata = {
	metadata: Record<string, unknown>;
};
