import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ PUBLIC_COMMIT_SHA: { public: true, static: true } });
