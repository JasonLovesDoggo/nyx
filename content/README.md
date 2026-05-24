# Writing content

Posts live in `content/posts/<slug>/+page.svx`. The folder name is the slug (URL).

## Frontmatter

Wrapped in `~~~` (TOML):

```
~~~
description = "One-line summary for SEO and the post list."
published_at = "2026-05-24"   # omit to keep it a draft (shows only in `pnpm dev`)
tags = ["obsidian", "macos"]

[title]
text = "Your Slow Obsidian Is iCloud's Fault"
config = "3 5c 6c 2.5 5ci 4c"
~~~
```

Required: `title.text` and `description`. Without `published_at` the post is a draft, visible locally but not in production.

## Title `config`

One token per title word, space-separated. Each token is:

`<size-in-rem><c=colored><i=italic>[#hex]`

- `5` → 5rem, default color
- `5c` → 5rem, accent color (auto-picked from the Catppuccin palette by hash)
- `5ci` → 5rem, accent color, italic (renders in serif)
- `5c[#FF9900]` → 5rem, explicit hex color
- `5c[text-red]` → 5rem, explicit Tailwind/Catppuccin color class

Tokens map positionally to words; extra letters are ignored, so vary sizes to create visual rhythm. See `src/components/SlabTitle.svelte` for the parser.

## Preview

```
pnpm dev
```

Drafts (no `published_at`) show up locally only.
