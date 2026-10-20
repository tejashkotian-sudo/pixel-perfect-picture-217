<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Curriculum and conversation content is static TypeScript in `src/lib/curriculum.ts`; only user progress lives in the database — keeps content versioned with code.
- Progress stats (streak, accuracy, badges, recommendations) are computed client-side from raw rows via pure functions in `src/lib/progress.ts`, covered by `src/test/progress.test.ts` — never store derived stats.
- User data is read/written with the browser client under RLS (owner-only policies); signed-in pages live under `src/routes/_authenticated/`.
