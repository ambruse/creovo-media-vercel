# Rollback and host alignment

Checkpoint: seo-baseline-2026-10-11 at f42539f. Implementation keeps every path, title, heading, service claim and visual unchanged. Only shared canonical origin changes from https://www.creovomedia.com to https://creovomedia.com to match existing hosting redirects; do not add an opposite redirect and create a loop.

Before deployment capture www/apex redirects; afterwards inspect homepage, services, Arabic, sitemap, robots and missing routes. Submit the apex sitemap in the verified GSC domain property once authorized. Monitor both host variants through consolidation. Keep existing www→apex redirects indefinitely unless hosting policy intentionally changes.

If the hosting destination changes or a regression occurs, revert the SEO code commit using git revert (never reset shared history), rebuild, redeploy, and align canonical/redirect direction together. Restoring www canonicals while www still redirects to apex reproduces the original conflict and is not a complete fix.
