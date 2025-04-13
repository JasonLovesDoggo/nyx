export interface ProjectMetadata {
	title: string;
	description: string;
	date: string;
	published: boolean;
	featured?: boolean;
	tags?: string[];
	imageUrl?: string; // <-- Add image URL
	imageAlt?: string; // <-- Add alt text for image
	// projectUrl?: string; // Optional: Add if you have live demo/repo links specific to the project
	// githubUrl?: string;
}

export interface WithMetadata {
	metadata: ProjectMetadata;
}

export interface ProjectEntry {
	slug: string;
	metadata: ProjectMetadata;
}

export interface ProjectPageData extends ProjectEntry {
	content: ConstructorOfATypedSvelteComponent;
}
