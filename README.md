# express-mvc-init

`express-mvc-init` is a zero-dependency CLI scaffolder that generates a clean **MVC folder structure** for **Express.js** projects only. It creates a ready-to-run Express starter app, and it can also generate new resource files inside an existing scaffolded project.

## Features

- **JavaScript only** (CommonJS, `require` / `module.exports`)
- **Express only** in generated projects
- **Zero runtime dependencies** in the `express-mvc-init` package itself (Node built-ins only)
- Simple in-memory model example (no database)
- `gen <resource>` command for quick CRUD scaffolding

## Requirements

- Node.js **18+**

## Install / Usage

You can run it directly with `npx`:

```bash
# Create a new project in ./my-app
npx express-mvc-init my-app

# Scaffold into the current folder
npx express-mvc-init .

# Generate a resource inside an existing scaffolded project
npx express-mvc-init gen product
```

After scaffolding a project:

```bash
cd my-app
npm install
npm start
```

The app starts at `http://localhost:3000` by default, and the home route (`/`) renders `src/views/index.html` through the render helper.

## Commands and Flags

| Command / Flag | Description | Example |
|---|---|---|
| `npx express-mvc-init <project-name>` | Creates a new Express.js MVC project in `./<project-name>` | `npx express-mvc-init my-app` |
| `npx express-mvc-init .` | Scaffolds into the current folder | `npx express-mvc-init .` |
| `npx express-mvc-init gen <resource>` | Generates model, controller, route, and view files for a resource and registers the route | `npx express-mvc-init gen product` |
| `--dry-run` | Prints what would be created/updated without writing anything | `npx express-mvc-init my-app --dry-run` |
| `--force` | Allows writing into a non-empty folder, or overwriting existing files when generating | `npx express-mvc-init . --force` |
| `--help`, `-h` | Shows help | `npx express-mvc-init --help` |
| `--version`, `-v` | Shows the package version | `npx express-mvc-init --version` |

## Generated Project Structure

```text
<project-name>/
├── src/
│   ├── controllers/
│   │   └── home.controller.js
│   ├── models/
│   │   └── user.model.js          # Simple in-memory array-based model
│   ├── views/
│   │   ├── index.html
│   │   └── 404.html
│   ├── routes/
│   │   ├── index.js               # Combines all route files
│   │   └── home.routes.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── config/
│   │   └── index.js               # Reads PORT from process.env, default 3000
│   ├── utils/
│   │   └── render.js              # Reads HTML from views/ and replaces {{placeholders}}
│   └── app.js                     # Creates/configures Express app and exports it
├── server.js                      # Requires app.js and calls listen
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

## `gen <resource>` Output

Running `npx express-mvc-init gen product` inside a scaffolded project creates:

```text
src/models/product.model.js
src/controllers/product.controller.js
src/routes/product.routes.js
src/views/product.html
```

It also updates `src/routes/index.js` automatically by inserting the route import and `router.use(...)` line at the marked anchors:

```js
// [express-mvc-init:routes-import]
// [express-mvc-init:routes-use]
```

The generated controller includes basic CRUD handlers: `list`, `getById`, `create`, `update`, and `remove`.

## How It Works

1. **Argument parsing** – `bin/cli.js` reads `process.argv` and uses `src/args.js` to determine the command (`scaffold`, `gen`, `help`, `version`) and flags (`--dry-run`, `--force`).
2. **Templates** – `src/templates/` contains small JavaScript template functions that return the content for each generated file.
3. **Safe writing** – `src/writer.js` creates directories and writes files. It refuses to overwrite existing files silently, supports `--dry-run`, and only overwrites when `--force` is passed.
4. **Scaffolding** – `src/scaffold.js` validates the project name, resolves the target directory, and writes the full MVC project structure.
5. **Resource generation** – `src/generate.js` normalizes the resource name, creates the resource files, and registers the new route in `src/routes/index.js` using the anchor comments.

## Development

Run tests from the `express-mvc-init` package directory:

```bash
npm test
```

The tests use Node's built-in test runner (`node --test`).

## Publishing to npm Checklist

Before publishing, make sure the package name is available and you are logged in to npm.

1. **Check package contents** (see what will be published):
   ```bash
   npm pack --dry-run
   ```
2. **Run tests**:
   ```bash
   npm test
   ```
3. **Log in to npm** (if needed):
   ```bash
   npm login
   ```
4. **Publish**:
   ```bash
   npm publish
   ```

If you are publishing a scoped package or need public access, use the appropriate npm flags (for example `npm publish --access public`).

## License

MIT
