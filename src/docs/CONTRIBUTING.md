---
title: How to contribute
group: Documents
category: Guides
---

# How to contribute

## Open an issue or join a discussion

If you find a bug, search the issues if this bug or a similar or related one has already been opened.
In case there is already in issue reporting this bug feel free to add
any information related to it that hasn't been mentioned yet.

### Opening a bug report

1) Confirm that the bug is still present in the latest version of the package.
2) When creating the issue choose an appropriate descriptive subject line. "XYZ doesn't work" is not an appropriate subject line.
3) Provide as much information as possible that you think might be related
4) If possible provide a story for Storybook that illustrates the issue

### Start a feature discussion

If you'd like to request a feature to be implemented, consider first starting a discussion instead of opening an issue right away.
This is also helpful if you would like to contribute and implement a feature yourself.

### Open a pull request

Before opening a pull request to fix a bug or implement a feature make sure there is not already a PR open addressing this.
If not, feel free to open a PR to address a bug or implement a feature, or refactor code, adds tests etc.

## Developing a feature or fix a bug

If there is a bug you'd like to fix, or a feature you want to implement,
or you'd like to refactor something please do so. Any help is appreciated and
starting a development environment should be quick.

### Start a development environment

The `tabletools` has [Storybook](https://storybook.js.org/docs) setup and ready to use for development.
It is only meant for development, testing features in a PR and to verify examples in the documentation work.

To start storybook and start development:

1) Clone the repository
2) Install dependencies with `npm install`
3) Run Storybook via `npm run storybook`
4) (If not automatically) Open the browser and go to http://localhost:6006/

## Improve documentation

Improving or extending documentation is also always welcome.
The HTML documentation is generated using [TypeDoc](https://typedoc.org/)

To preview your documentation changes you can run

```
$ npm run docs
// or to watch changes
$ npm run docs -- --watch
```

This will build the documentation and copy it into the `docs` directory.
You can open the index.html file in the `docs` directory to browse.

For convenience you can also run `serve`:

```
$ cd ./docs
$ npx serve
```

This will start a small webserver and the docs should be available under http://localhost:3000/

## Note on AI generated contributions

We do not accept AI generated contributions. Some AI assistance is allowed.
However, if we suspect contributions, like issues, pull requests or
any other content, have primarily been AI generated we will not accept it,
and remove it, when necessary.

