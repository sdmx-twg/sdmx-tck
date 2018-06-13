# Contributing

When contributing to this repository, please first discuss the change you wish to make via an `issue`,
`email`, or any other method with the owners of this repository before making a change.

## Code of conduct

Please follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for all your interactions with the project.

## Getting Started

* Make sure you have a [GitHub account](https://github.com/signup/free).
* Familiarize yourself with the [Successful GIT branching model](http://nvie.com/posts/a-successful-git-branching-model/)
* Familiarize yourself with [Semantic Versioning](https://semver.org/)
* Familiarize yourself with [Semantic Release](https://github.com/semantic-release/semantic-release)
* Submit a Github issue if one does not already exist.
  * Clearly describe the issue
  * If the issue is a bug, include steps to reproduce it
  * Make sure you enter the earliest version where the issue occurs
* Fork the repository on GitHub in order to ask a pull-request later

## Making Changes

* Always create a topic branch to do your work
  * There is usually a master and develop branch, create your topic branch off the develop branch.
  * To quickly create a topic branch based on develop, run `git checkout -b
    fix/my_contribution develop`. Please avoid working directly on the
    `master` or `develop` branches.
* Make commits of logical and atomic units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the proper format; we use the conventions found in [commitizen](https://github.com/commitizen/cz-cli) with the following types:
  * `feat`: new feature
  * `fix`: bug fix
  * `docs`: changes in the documentation only
  * `style`: changes that do not affect the meaning of code (white space, semi-colon, etc.)
  * `refactor`: code change that is not a feature or bug fix
  * `perf`: code change that improves performance
  * `test`: adding tests
  * `chore`: changing build process or associated tools and libraries (e.g.: to generate documentation)

  Message structure: * `type_of_change`**(**`area_of_change`**): **`short_imperative_statement`*
* Make sure you have added the necessary tests for your changes.
* Run _all_ the tests to assure nothing else was accidentally broken.

```
# examples
$ git commit -a -m "fix(interpreter): fixed bug XYZ in the XML parser"
$ git commit -a -m "feat(structmdmod): implemented structureset resource query"
$ git commit -a -m "feat(new-xml-parser): changed the XML parsing library

BREAKING CHANGE: new library does not construct identical JSON objects in memory"
```

In summary:

1. File an issue and Talk about the idea with one of the maintainers or TWG members.
1. Fork the repository
1. Make a branch for your change
1. Run `npm install`
1. Make your changes
1. Test your changes
1. Add your changes to the repository with `git add ...`
1. Run `npm run commit` (**Do not** use `git commit`). If prompted, follow the commitizen prompts
1. Push your changes with `git push`
1. Create the Pull Request
1. Request a review, get the pull request merged and happily celebrate after it is all done !

## Recommended minimal npm configuration

```
$ npm set init-author-email 'you@your.domain.eu'
$ npm set init-author-name 'Your name'
$ npm set init-author-url 'http://your.webSite.if.you.have.one.net'
$ npm set save-exact true
```

## Useful git configuration

This is just a record of our preferred way of working with git and must in no way be enforced onto contributors.

```
[push]
	default = simple
[color]
	branch = auto
  diff = auto
  status = auto
[color "branch"]
  current = red bold
  local = yellow
  remote = green
[color "diff"]
  meta = yellow bold
  frag = white dim
  old = red bold
  new = green bold
[color "status"]
  added = yellow
  changed = green
  untracked = cyan
[alias]
	a = add
	al = add -A
	bc = checkout -b
	bd = branch -d
	bl = branch --list
	c = commit -v
	co = checkout
	cob = checkout -b
	ca = commit -v -a
	cm = commit -m
	d = difftool
	f = fetch
	lg = log --graph --abbrev-commit --decorate --date=short --pretty=format:'%C(bold cyan)%h %ad %Creset-%C(bold yellow)%d%Creset %s %Cgreen(%cr) %C(bold green)<%an>%Creset'
	l = log --graph --abbrev-commit --decorate --date=short --numstat --pretty=format:'%C(bold cyan)%h %ad %Creset-%C(bold yellow)%d%Creset %s %Cgreen(%cr) %C(bold green)<%an>%Creset'
	m = merge --no-ff
	s = status
	st = status -b -s
[credential]
	helper = cache --timeout=7200
[core]
	autocrlf = false

```
