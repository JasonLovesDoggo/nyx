/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

export interface GitHubRepo {
	owner: string;
	name: string;
	description: string;
	stars: number;
	contributors: Contributor[];
}

export interface Contributor {
	avatar_url: string;
	username: string;
}

export interface CardOptions {
	repo?: GitHubRepo;
	websiteUrl?: string;
}
export type CardType = 'github' | 'website';

export interface GithubUser {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
	contributions: number;
}
