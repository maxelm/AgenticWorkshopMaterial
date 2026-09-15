## Deployment (GitHub Pages)

This app is deployed as a static site to GitHub Pages at
https://maxelm.github.io/AgenticWorkshopMaterial/

To publish a new build after pushing changes to `main`:

```sh
npm run deploy
```

This builds the app (`vite build`, using the `/AgenticWorkshopMaterial/` base
path), generates a `404.html` fallback for client-side routing, and publishes
`dist/` to the `gh-pages` branch via the `gh-pages` package. No CI/CD is
configured — deploys are manual/on-demand.

Note: `OPENWEATHER_API_KEY` / `BERGET_API_KEY` are intentionally not set in
the production build (this is a static site with no backend, so any value
would be publicly visible in the bundle). Widgets that need them show a
"not configured" state in production.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
