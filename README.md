# markdown-it-docutils [IN-DEVELOPMENT]

[![ci-badge]][ci-link]
[![npm-badge]][npm-link]

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin for implementing docutils style roles (inline extension point) and directives (block extension point).
The package also vendors a default CSS, with light/dark mode adaptive colors and overridable [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

See <https://executablebooks.github.io/markdown-it-docutils/> for a demonstration!

## Usage

As a Node module:

```javascript
import MarkdownIt from "markdown-it"
import docutilsPlugin from "markdown-it-docutils"

const text = MarkdownIt().use(docutilsPlugin).render("*a*")
```

In the browser:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example Page</title>
    <script src="https://cdn.jsdelivr.net/npm/markdown-it@12/dist/markdown-it.min.js"></script>
    <script src="https://unpkg.com/markdown-it-docutils"></script>
    <link
      rel="stylesheet"
      type="text/css"
      media="screen"
      href="https://unpkg.com/markdown-it-docutils/dist/css/style.min.css"
    />
  </head>
  <body>
    <div id="demo"></div>
    <script>
      const text = window
        .markdownit()
        .use(window.markdownitDocutils.default)
        .render("*a*")
      document.getElementById("demo").innerHTML = text
    </script>
  </body>
</html>
```

## Supported roles (inline extensions)

Roles are any token in the token, within an `inline` token's children with the `role` type:

- `Token.meta = { name }` should contain the name of the role
- `Token.content` should contain the content of the role

By default (see `parseRoles` option), roles are parsed according to the MyST syntax: `` {name}`content` ``.

All roles have a fallback renderer, but the the following are specifically handled:

- HTML:
  - `sub`: Subscript (alternatively `subscript`)
  - `sup`: Superscript (alternatively `superscript`)
  - `abbr`: Abbreviation (alternatively `abbreviation`)
- Referencing
  - `eq`: Reference labeled equations
  - `ref`: Reference any labeled or named block, showing title
  - `numref`: Numbered reference for any labeled or named block (use `Figure %s <my_label>`)
- Basic:
  - `raw`

## Supported directives (block extensions)

Directives are any token in the token stream with the `directive` type:

- `Token.info` should contain the name of the directive
- `Token.meta = { arg: "" }` should contain the argument (first line) of the directive
- `Token.content` should contain the body of the directive
- `Token.map` should be set

By default (see `replaceFences` option), all fences with a language delimited in braces will be converted to `directive` tokens, e.g.

````
```{name} argument
:option: value

content
```
````

All directives have a fallback renderer, but the the following are specifically handled:

- Admonitions:
  - `admonition`
  - `note`
  - `attention`
  - `caution`
  - `danger`
  - `error`
  - `important`
  - `hint`
  - `note`
  - `seealso`
  - `tip`
  - `warning`
- Image:
  - `image`
  - `figure`
- Code:
  - `code`
  - `code-block`
  - `code-cell`
- Tables:
  - `list-table`
- Other:
  - `math`

## CSS Styling

markdown-it-docutils distributes with a default `dist/css/style.min.css` styling, primarily adapted from the [furo sphinx theme](https://pradyunsg.me/furo).
The CSS makes extensive use of [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).
These can be overridden by the user and are used for stylizing nearly all elements of the documentation.

The colors are in light mode by default, switching to the dark mode when requested by the user’s browser (through `prefers-color-scheme: dark`). See the [`prefers-color-scheme` documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) for details.

As a consequence of this design, the dark mode inherits the variable definitions from the light mode, only overriding specific values to adapt the theme.
While the mechanism for switching between light/dark mode is not configurable, the exact CSS variable definitions used in this process can be configured with [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

## Design Notes

TODO improve this:

- Parsing all directives/roles to "generic" directive/role tokens first (with fallback renderer), then "run" the directives/roles
  - this separates the logic for parsing these syntaxes, from the logic for interpreting their content, i.e. the syntax for a directive/role can in theory be anything, as long as it can be converted to the necessary token

## Development

### Features

- TypeScript
- Code Formatting ([prettier])
- Code Linting ([eslint])
- Testing and coverage ([jest])
- Continuous Integration ([GitHub Actions])
- Bundled as both UMD and ESM ([rollup])
- Upload as [NPM] package and [unpkg] CDN
- Simple demonstration website ([GitHub Pages])

### Getting Started

1. Create a GitHub repository [from the template](https://docs.github.com/en/github-ae@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-repository-from-a-template).
2. Replace package details in the following files:
   - `package.json`
   - `LICENSE`
   - `README.md`
   - `rollup.config.js`
3. Install the `node_module` dependencies: `npm install` or `npm ci` (see [Install a project with a clean slate](https://docs.npmjs.com/cli/v7/commands/npm-ci)).
4. Run code formatting; `npm run format`, and linting: `npm run lint:fix`.
5. Run the unit tests; `npm test`, or with coverage; `npm test -- --coverage`.

Now you can start to adapt the code in `src/index.ts` for your plugin, starting with the [markdown-it development recommendations](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md).

Modify the test in `tests/fixtures.spec.ts`, to load your plugin, then the "fixtures" in `tests/fixtures`, to provide a set of potential Markdown inputs and expected HTML outputs.

On commits/PRs to the `main` branch, the GH actions will trigger, running the linting, unit tests, and build tests.
Additionally setup and uncomment the [codecov](https://about.codecov.io/) action in `.github/workflows/ci.yml`, to provide automated CI coverage.

Finally, you can update the version of your package, e.g.: `npm version patch -m "🚀 RELEASE: v%s"`, push to GitHub; `git push --follow-tags`, build; `npm run build`, and publish; `npm publish`.

Finally, you can adapt the HTML document in `docs/`, to load both markdown-it and the plugin (from [unpkg]), then render text from an input area.
This can be deployed by [GitHub Pages].

[ci-badge]: https://github.com/executablebooks/markdown-it-docutils/workflows/CI/badge.svg
[ci-link]: https://github.com/executablebooks/markdown-it-docutils/actions
[npm-badge]: https://img.shields.io/npm/v/markdown-it-docutils.svg
[npm-link]: https://www.npmjs.com/package/markdown-it-docutils
[github actions]: https://docs.github.com/en/actions
[github pages]: https://docs.github.com/en/pages
[prettier]: https://prettier.io/
[eslint]: https://eslint.org/
[jest]: https://facebook.github.io/jest/
[rollup]: https://rollupjs.org
[npm]: https://www.npmjs.com
[unpkg]: https://unpkg.com/
