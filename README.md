# Target Skills

Target Skills helps people turn hands-on work experience into useful career stories.

## MVP features

- Create, edit, and delete stories
- Guided Situation / Action / Result story prompts
- Optional skill tagging
- Story detail view with suggested skills and a resume-ready bullet
- Copy a generated resume bullet to the clipboard
- Empty-state and validation feedback
- Local-device persistence using browser storage

Stories are intentionally stored locally in the browser. Clearing browser data or changing devices can remove access to them, so a future release should add export/import before introducing account sync.

## Development

```bash
npm install
npm run dev
```

Run the available checks with:

```bash
npm run lint
npm run build
```
