---
title: GitGitGadget - contributing git.git patches via GitHub PRs
bigbanner: true
---
<div class="block">

Unlike most open source projects, Git itself does not accept code contributions via Pull Requests. Instead, patches are [submitted to the Git mailing list](https://git-scm.com/docs/SubmittingPatches) for review and will be applied manually by the Git maintainer.

Apart from lacking the convenience of a web interface, this process also puts considerable demands on the code contributions: the mails are expected to be plain text only (no HTML!), for example, and the diffs embedded in the mails must apply cleanly (no whitespace changes!), among other things.

A few tutorials out there try to help with this process (e.g. [Git for Windows' detailed instructions how to contribute patches to the Git project](https://github.com/git-for-windows/git/blob/master/CONTRIBUTING.md), or Git's [MyFirstContribution tutorial](https://git-scm.com/docs/MyFirstContribution)). GitGitGadget tries a different approach: allow contributing patches to the Git project itself by opening a Pull Request either at [https://github.com/gitgitgadget/git](https://github.com/gitgitgadget/git) or directly at [https://github.com/git/git](https://github.com/git/git) and let GitGitGadget prepare and send the corresponding mails.
</div>

## How can you use GitGitGadget? {#how-can-you-use-gitgitgadget}

<div class="block">

So you cloned [https://github.com/git/git](https://github.com/git/git) and implemented a bug fix or a new feature? And you already pushed it to your own fork? Good, now is the time to direct your web browser to [https://github.com/gitgitgadget/git](https://github.com/gitgitgadget/git) (or to [https://github.com/git/git](https://github.com/git/git) ) and to open a Pull Request. A few things to note about a GitGitGadget Pull Request:

- Please make sure to use a descriptive title and description; GitGitGadget will use these as the subject and body of the cover letter (check out the [MyFirstContribution](https://git-scm.com/docs/MyFirstContribution#cover-letter) tutorial if you are not familiar with this terminology).
- If your pull request consist of a single commit, leave the pull request description empty, as your commit message itself should be enough to explain the rationale for your changes.
- You can CC potential reviewers by adding a footer to the PR description with the following syntax:

  ```
  CC: Revi Ewer <revi.ewer@some.domain>, Ill Takalook <ill.takalook@other.domain>
  ```

You will also want to read [Git's contribution guidelines](https://git-scm.com/docs/SubmittingPatches) to make sure that your contributions are in the expected form, as well as the project's [coding guidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines). You might also want to read the [gitworkflows](https://git-scm.com/docs/gitworkflows) manual page to understand how your contributions will be integrated in Git's repository, as well as [this note from Git's maintainer](https://github.com/git/git/blob/todo/MaintNotes).

The first time you use GitGitGadget, you need to be added to the list of users with permission to use GitGitGadget (this is a <i>very</i> simple anti-spam measure). Using <a src="https://web.libera.chat/#git-devel">IRC</a> or <a src="https://github.com/gitgitgadget/git/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+%22%2Fallow%22">PRs</a> you can find a user already on this list and request them to add you to the list. To do so, they simply have to add a comment to that Pull Request that says <code>/allow</name></code>.

The Pull Request will trigger a few Checks, most importantly one that will build Git and run the test suite on the main platforms, to make sure that everything works as advertised.

Once you feel everything is ready to go, add a comment to that Pull Request saying `/preview`. This will send you a copy of the Pull Request to check. Once you are happy with the result, add a comment to that Pull Request saying `/submit`. This will trigger GitGitGadget (you can see the progress via the Check called "GitGitGadget PR Handler"): it will wrap your Pull Request into a nice bundle of mails in the format expected on the Git mailing list.

</div>

## What happens after GitGitGadget sent the mails? {#what-happens-after-gitgitgadget-sent-the-mails}

<div class="block">

The patches will be reviewed by volunteers (be gentle...) and you will most likely receive helpful comments. The Git developer community is globally distributed, so please wait a day or two for reviewer comments to trickle in before sending another iteration of your patch series (if needed).

In the case that a reviewer asks for changes, you should respond either acknowledging that you will make those changes or making an argument against the requested changes. If your patches need to be revised, please use `git rebase -i` to do that, then force-push, then update the description of the Pull Request by adding a summary of the changes you made, and then issue another `/submit`.

</div>

## Should I use GitGitGadget on GitGitGadget's Git fork or on Git's GitHub mirror? {#should-i-use-gitgitgadget-on-gitgitgadgets-git-fork-or-on-gits-github-mirror}

<div class="block feature-matrix">

GitGitGadget works on both GitGitGadget's Git fork ([https://github.com/gitgitgadget/git](https://github.com/gitgitgadget/git)) and Git's GitHub mirror ([https://github.com/git/git](https://github.com/git/git)). However, some functionality is only available when opening a PR on GitGitGadget's Git fork.

| Features | [gitgitgadget/git](https://github.com/gitgitgadget/git) | [git/git](https://github.com/git/git) |
| - | - | - |
| Mirrors emails answers as PR comments | ✓ | ✓
| Mirrors PR comments as emails to the list | ✗ | ✗
| Builds Git and runs the test suite on Linux, macOS, Windows and FreeBSD | ✓ | ✓
| Comments on the PR when a topic branch is created in the [maintainer's fork](https://github.com/gitster/git/branches) | ✓ | ✓
| Comments on the PR when the series is integrated into `seen`, `next`, `master` and `maint` | ✓ | ✓
| Adds a label to the PR when the series is integrated into `seen`, `next`, `master` and `maint` | ✓ | ✓
| PRs can target `seen`, `next`, `master` and `maint` | ✓ | ✓
| PRs can target any topic branch in the maintainer's fork, as well as [`git-gui/master`](https://github.com/j6t/git-gui) | ✓ | ✗
| Creates a direct link between the last commit of the series and the corresponding commit in the "most upstream" integration branch as a GitHub check | ✓ | ✗

</div>

## But... what _is_ GitGitGadget? {#but-what-is-gitgitgadget}

<div class="block">

GitGitGadget itself is a GitHub App that is backed by an Azure Function written in pure Javascript which in turn triggers an Azure Pipeline written in Typescript (which is really easy to understand and write for everybody who knows even just a little Javascript), maintained at [https://github.com/gitgitgadget/gitgitgadget](https://github.com/gitgitgadget/gitgitgadget).

</div>
