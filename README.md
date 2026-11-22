# express-mvc-init

A zero-dependency CLI scaffolder that generates a clean **MVC folder structure for Express.js projects**.

`express-mvc-init` creates a ready-to-run Express.js starter application with a structured MVC architecture. It also allows you to generate additional resources with model, controller, route, and view files inside an existing scaffolded project.

## Features

- **JavaScript only** – CommonJS (`require` / `module.exports`).
- **Express.js only** – Generated applications use Express.js.
- **Zero runtime dependencies** – The CLI itself uses only Node.js built-in modules.
- **MVC architecture** – Organized controllers, models, routes, views, middlewares, config, and utilities.
- **In-memory model example** – No database setup required.
- **Resource generation** – Generate CRUD resources using the `gen` command.
- **Safe file writing** – Prevents accidental overwriting of existing files.
- **Dry-run support** – Preview file operations before making changes.

## Requirements

- Node.js **18 or later**

## Getting Started

You can use `express-mvc-init` directly with `npx`, without installing it globally.

### Create a new project

```bash
npx express-mvc-init my-app
```

### Navigate into your project

```bash
cd my-app
```

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npm start
```

Your application will be available at:

**http://localhost:3000**

The default home route (`/`) renders `src/views/index.html` through the render helper.

## Usage

### 1. Create a new Express MVC project

```bash
npx express-mvc-init my-app
```

Creates a complete Express.js MVC project inside the `my-app` directory.

### 2. Scaffold into the current directory

```bash
npx express-mvc-init .
```

To allow scaffolding into a non-empty directory:

```bash
npx express-mvc-init . --force
```

### 3. Generate a new resource

Inside an existing scaffolded project, run:

```bash
npx express-mvc-init gen product
```

This generates the following files:

```text
src/
├── models/
│   └── product.model.js
├── controllers/
│   └── product.controller.js
├── routes/
│   └── product.routes.js
└── views/
    └── product.html
```

It also automatically registers the resource route inside:

```text
src/routes/index.js
```

The generated controller includes basic CRUD handlers:

- `list` – Retrieve all resources.
- `getById` – Retrieve a resource by ID.
- `create` – Create a new resource.
- `update` – Update an existing resource.
- `remove` – Delete a resource.

Route registration uses the following anchor comments:

```js
// [express-mvc-init:routes-import]
// [express-mvc-init:routes-use]
```

## Commands and Flags

| Command / Flag | Description |
|---|---|
| `npx express-mvc-init <project-name>` | Create a new Express MVC project. |
| `npx express-mvc-init .` | Scaffold into the current directory. |
| `npx express-mvc-init gen <resource>` | Generate a new CRUD resource. |
| `--dry-run` | Preview operations without writing files. |
| `--force` | Allow writing into non-empty directories or overwriting existing generated files. |
| `--help`, `-h` | Display CLI help. |
| `--version`, `-v` | Display the package version. |

### Examples

Preview project generation:

```bash
npx express-mvc-init my-app --dry-run
```

Generate a resource with dry-run:

```bash
npx express-mvc-init gen product --dry-run
```

Display help:

```bash
npx express-mvc-init --help
```

Display version:

```bash
npx express-mvc-init --version
```

## Generated Project Structure

A newly generated project follows this structure:

```text
my-app/
├── src/
│   ├── controllers/
│   │   └── home.controller.js
│   ├── models/
│   │   └── user.model.js
│   ├── views/
│   │   ├── index.html
│   │   └── 404.html
│   ├── routes/
│   │   ├── index.js
│   │   └── home.routes.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── config/
│   │   └── index.js
│   ├── utils/
│   │   └── render.js
│   └── app.js
├── server.js
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

### Architecture Details

| Directory / File | Responsibility |
|---|---|
| `controllers/` | Handles application request logic. |
| `models/` | Contains data models. |
| `views/` | Contains HTML templates. |
| `routes/` | Defines and combines application routes. |
| `middlewares/` | Contains middleware functions. |
| `config/` | Handles application configuration and PORT. |
| `utils/` | Contains reusable helper functions. |
| `app.js` | Creates and configures the Express application. |
| `server.js` | Starts the application server. |

## How It Works

The CLI is organized into the following components:

1. **Argument Parsing** – `bin/cli.js` reads command-line arguments and uses `src/args.js` to identify commands and flags.

2. **Templates** – `src/templates/` contains JavaScript template functions that generate the contents of project files.

3. **Safe Writing** – `src/writer.js` creates directories and writes files while supporting `--dry-run` and `--force`.

4. **Project Scaffolding** – `src/scaffold.js` validates project names, resolves target directories, and generates the MVC structure.

5. **Resource Generation** – `src/generate.js` normalizes resource names, creates resource files, and automatically registers routes using anchor comments.

## Development

Clone the repository:

```bash
git clone https://github.com/Himans40/express-mvc-init.git
```

Navigate into the project:

```bash
cd express-mvc-init
```

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

The project uses Node.js's built-in test runner:

```bash
node --test
```

## Testing Before Publishing

Before publishing a package, verify its contents:

```bash
npm pack --dry-run
```

This displays the files that will be included in the npm package.

You can also generate a local package tarball:

```bash
npm pack
```

## Publishing to npm

Before publishing:

1. Make sure the package name is available on npm.
2. Make sure you are logged into your npm account.
3. Run the test suite.
4. Verify the package contents.

```bash
npm login
npm whoami
npm test
npm pack --dry-run
```

Once everything is verified, publish:

```bash
npm publish
```

After publishing, developers can create Express MVC projects using:

```bash
npx express-mvc-init my-app
```

## Versioning

This package follows semantic versioning.

To update the version:

**Patch release:**

```bash
npm version patch
```

**Minor release:**

```bash
npm version minor
```

**Major release:**

```bash
npm version major
```

Publish the updated version:

```bash
npm publish
```

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Developed by [Himans40](https://github.com/Himans40).

**GitHub Repository:** https://github.com/Himans40/express-mvc-init
