# express-mvc-init

A zero-dependency CLI scaffolder that generates a clean MVC folder structure for Express.js projects.

## Features

- JavaScript only – CommonJS (`require` / `module.exports`)
- Express.js MVC architecture
- Zero runtime dependencies
- Organized controllers, models, routes, views, middlewares, config, and utilities
- In-memory model example
- CRUD resource generation using the `gen` command
- Safe file writing to prevent accidental overwriting
- Dry-run support to preview file operations
- Automatic route registration

## Requirements

- Node.js 18 or later

## Installation

```bash
npx express-mvc-init my-app
```

## Usage

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

### Scaffold into the current directory

```bash
npx express-mvc-init .
```

To scaffold into a non-empty directory:

```bash
npx express-mvc-init . --force
```

### Generate a new resource

```bash
npx express-mvc-init gen product
```

This generates:

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

It also automatically registers the resource route inside `src/routes/index.js`.

The generated controller includes basic CRUD handlers:

- `list` – Retrieve all resources
- `getById` – Retrieve a resource by ID
- `create` – Create a new resource
- `update` – Update an existing resource
- `remove` – Delete a resource

## Commands and Flags

| **Command / Flag** | **Description** |
|---|---|
| `npx express-mvc-init <project-name>` | Create a new Express MVC project |
| `npx express-mvc-init .` | Scaffold into the current directory |
| `npx express-mvc-init gen <resource>` | Generate a new CRUD resource |
| `--dry-run` | Preview operations without writing files |
| `--force` | Allow writing into non-empty directories or overwriting generated files |
| `--help`, `-h` | Display CLI help |
| `--version`, `-v` | Display package version |

## Examples

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

## Architecture Details

| **Directory / File** | **Responsibility** |
|---|---|
| `controllers/` | Handles application request logic |
| `models/` | Contains data models |
| `views/` | Contains HTML templates |
| `routes/` | Defines and combines application routes |
| `middlewares/` | Contains middleware functions |
| `config/` | Handles application configuration and PORT |
| `utils/` | Contains reusable helper functions |
| `app.js` | Creates and configures the Express application |
| `server.js` | Starts the application server |

## How It Works

1. **Argument Parsing** – `bin/cli.js` reads command-line arguments and uses `src/args.js` to identify commands and flags.
2. **Templates** – `src/templates/` contains JavaScript template functions that generate project files.
3. **Safe Writing** – `src/writer.js` creates directories and writes files while supporting `--dry-run` and `--force`.
4. **Project Scaffolding** – `src/scaffold.js` validates project names, resolves target directories, and generates the MVC structure.
5. **Resource Generation** – `src/generate.js` creates resource files and automatically registers routes using anchor comments.

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

## Testing Before Publishing

Verify package contents:

```bash
npm pack --dry-run
```

Run the test suite:

```bash
npm test
```

## License

MIT License

## Author

Developed by [Himans40](https://github.com/Himans40).

**GitHub Repository:** [express-mvc-init](https://github.com/Himans40/express-mvc-init)