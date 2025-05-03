# Personal Finance

A finance and spending tracker for an individual to use.

## Getting Started

Instructions are provided to run the project development server for working on changes, but also to create builds for a static web server with Docker.

### Development Server

In the root of the project simply run the install and start commands on your favourite terminal.

```bash
npm install
npm start
```

### Creating Builds with Docker

To create a docker config for a "production" deployment, run the docker compose file in the project root as shown.

The variable "NODE_ENV" must be set to one of the following:

- development
- staging
- production

```bash
NODE_ENV=development docker-compose up -d
```

## Available Scripts

script | description | value
-|-|-
start | Launches the development server. | `node scripts/start.js`
build:development | Creates a build for a "development" testing environment | `cross-env NODE_ENV=\"development\" node scripts/build.js`
build:staging | Creates a build for a "staging" testing environment | `cross-env NODE_ENV=\"staging\" node scripts/build.js`
build:production | Creates a build for a "production" live environment | `cross-env NODE_ENV=\"production\" node scripts/build.js`
build | Alias for the production build script | `npm run build:production`
test | Runs a single-pass of the testing suite. | `node scripts/test.js --verbose`
test:coverage | Runs the test-runner in coverage and watch mode. | `node scripts/test.js --verbose --coverage`
test:watch | Runs the test-runner in watch mode with verbose output. | `node scripts/test.js --verbose --watch`
docs | Generates documentation using JSDoc. | `jsdoc -c jsdoc.conf.json -R README.md -r`
lint | Runs the linter suite in review mode. | `eslint . --config .eslintrc.json`
lint:fix | Runs the linter suite and fixes common problems. | `eslint . --config .eslintrc.json --fix`
postinstall | Installs Husky after project installation | `husky install`
prepare | Runs the Husky config | `husky`

## Contribution Guide

### Commit style

This project generally uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) commit tag style.

The available tags are as follows:

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- chore: Changes which doesn't change source code or tests e.g. changes to the build process, auxiliary tools, libraries
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- revert: Revert something
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

### Linting & code style

This project makes use of linting to enforce a consistent code style and catch simple errors.

Any code checked-in must conform to these standards.

UK standard english is required for developer-facing text. See Internationalisation bellow for a guide on user-facing text.

Markdown files must conform to the [markdownlint-cli2 engine](https://github.com/DavidAnson/markdownlint-cli2) standard, though please note that this is not auto-enforced.

#### VSCode users

To aid the development experience, it is recommended to install the following extensions:

- Code Spell Check (Street Side Software) set to en-GB.
- ESLint
- JSDoc syntax highlighting.
- Prettier
- markdownlint (David Anson)

ESLint can be set to format on save, or by using the built-in function "ESLint: Fix all auto-fixable problems", accessible by typing `ctrl + shift + p` or equivalent.

### Internationalisation

#### Intl

This project makes heavy use of the [JS utility Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) to provide localised numbers, currencies, and language customisations.

The following rules must be followed:

- Where a currency or user-viewable value is used, the hook `useLocalisedNumber` must be used.
  - currencyLocaliser: Takes a value and currency, injects the currently selected language, and displays a localised monetary value.
  - numberLocaliser: Takes a number value, injects the currently selected language, and displays a readable format.
- Where financial data is displayed, the currency value should be driven by the transaction row.
- Locales are driven by the package [locale-codes](https://www.npmjs.com/package/locale-codes)

#### I18Next

The localisation / translation package i18next, and companion react-i18next, are used to provide dedicated translations.

Where text is presented to the user, it must be driven from the translation file, typically using the `useTranslation` hook, or the `<Trans />` component for complex interpolations.

The guidelines outlined bellow are influenced by project-specific implementation ideas and [i18n best practices](https://www.i18next.com/principles/best-practices).

Translation files can be found in `/public/{language-code}`.

The following guide must be used when deciding where to place translations:

- Generally speaking, the more general or area / entity specific a piece of text is, should guide where it is placed.
  - Page titles should go under `pageTitles`.
  - Content for modals should go under `modalMessages`.
  - Button labels and titles should be placed in `buttons` unless it is hyper specific to one location.
  - The main data structure entities group messages and content that may appear in diffirent places, but are connected by relating to the same entity:
    - Budget
    - Category
    - Card / Account
    - Transaction
- Literal vs complex sentences.
  - Where the key / value are the same (i.e. the key looks almost the same as the value), *the key must mirror the value in english*. For example:
    - ✅ `"Start date": "Start date"`: Literal key. Exact values are used.
    - ❌ `"description": "Description"`: Literal key. Value differs in capitalisation.
    - ✅ `"cannotBeUndone": "This action cannot be undone."`: Non-literal key. Key is developer-readable but differs from text value.
  - If a value is a very simple, reusable, literal string (e.g. "Options", "Description") the value should be placed in `literals`.

## License

This project is [MIT licensed](./LICENSE).
