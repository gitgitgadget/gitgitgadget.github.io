# How does GitGitGadget process user comments on PRs?

GitGitGadget is implemented as a GitHub App (with the very imaginative name ["GitGitGadget"](https://github.com/apps/gitgitgadget)), which means that a webhook is called on certain events, such as new PR comments on PRs (e.g. `issue_comment`).

In GitGitGadget's case, this webhook is implemented as an Azure Function: https://github.com/gitgitgadget/gitgitgadget/tree/master/azure-function

Apart from validating that the payload really originated from GitHub, the Azure Function performs a rudimentary check whether the comment (if it was triggered by a comment) contains a command that GitGitGadget should act on, and depending on that check triggers the Azure Pipeline [GitGitGadget PR Handler](https://dev.azure.com/gitgitgadget/git/_build?definitionId=3).

The `push` event (and also the `pull_request` event) is not actually handled by the Azure Function. It is handled via the Azure Pipeline being configured as "Pull request validation". That also allows it to be shown in the Checks tab of the PR.

You can see the difference on https://dev.azure.com/gitgitgadget/git/_build?definitionId=3: the `push`-triggered builds are labeled as "Pull request build", and the `issue_comment` ones as "Manual build" (because they are triggered using a Personal Access Token, also known as "PAT").

Depending how the Azure Pipeline was triggered, it calls [`misc-helper.ts`](https://github.com/gitgitgadget/gitgitgadget/blob/master/script/misc-helper.ts) with the `handle-pr-comment` or with the `handle-pr-push` parameter, respectively.

# Keeping https://github.com/gitgitgadget/git up to date

The repository gitgitgadget/git is kept up to date by two Azure Pipelines: [Synchronize gitster.git to GitGitGadget](https://dev.azure.com/gitgitgadget/git/_build?definitionId=8) and [Synchronize git.git to GitGitGadget](https://dev.azure.com/gitgitgadget/git/_build?definitionId=7).

## Why synchronize both git/git _and_ gitster/git?

### Background

The existence of the `git/git` -> `gitgitgadget/git` pipeline is probably obvious.

The `gitster/git` repository contains the individual branches for code contributions, and the first reason why the corresponding pipeline was added is that `pu` had test failures all the time without any actionable information: it has been always unclear _which_ of those patch series that made it into `pu` was responsible for the test failures. Now with the individual branches being mirrored into `gitgitgadget/git`, and obviously triggering [CI builds](https://dev.azure.com/gitgitgadget/git/_build?definitionId=4), it is a lot easier to find the culprits.

Of course, from time to time the `pu` failures are caused by unfortunate interactions of separate patch series' changes, in which case the CI builds of the individual branches may very well succeed but `pu` still causes failures, which is a very useful piece of information in and of itself.

A secondary benefit of mirroring the `gitster/git` branches is that PRs at `gitgitgadget/git` can target more fine-grained base commits. I use this a lot, e.g. in my six "built-in add -i/-p" patch series which build on top of each other.

While the pipeline that synchronizes with `gitster/git` is triggered by all updates to `refs/heads/*`, for technical reasons polling every 180 seconds, i.e. every three minutes, the pipeline that synchronizes with `git/git` is triggered immediately. 

### What do the pipelines do, exactly?

The pipeline that mirrors gitster/git into gitgitgadget/git (the pipeline names cannot contain slashes, that's why the `/` was replaced by a `.`) has two tasks:

1. Synchronize branch:
   ```bash
   case "$(Build.SourceBranch)" in
   refs/heads/*)
       refspec="+HEAD:$(Build.SourceBranch)"
       ;;
   refs/tags/*)
       refspec="$(Build.SourceBranch)"
       ;;
   *)
       echo "Cannot handle '$(Build.SourceBranch)'" >&2
       exit 1
       ;;
   esac

   git -c  http."https://github.com/gitgitgadget/git".extraheader="Authorization: Basic $(gitgitgadget.push.token.base64)" \
       push https://github.com/gitgitgadget/git "$refspec"
   ```
2. Synchronize tags (if necessary):
   ```bash
   die () {
       echo "$*" >&2
       exit 1
   }

   for d in git gitgitgadget
   do
       git ls-remote --tags https://github.com/$d/git | grep -v '\^{}$' | sort >tags.$d ||
       die "Could not enumerate tags in $d"
   done

   refspec="$(comm -23 tags.git tags.gitgitgadget | tr '\t' :)" ||
   die "Could figure out missing tags"

   if test -z "$refspec"
   then
       echo "##vso[task.complete result=Skipped]No tags to synchronize!"
   else
       git -c  http."https://github.com/gitgitgadget/git".extraheader="Authorization: Basic $(gitgitgadget.push.token.base64)" \
           push https://github.com/gitgitgadget/git $refspec
   fi
   ```

That second task is necessary because there is currently no way to trigger non-YAML Azure Pipelines from tag updates. Of course this means that new tags are only synchronized together with branch updates, but in practice that's okay because the Git maintainer always pushes out the tags with corresponding branches.

This task mirrors tags from the git/git repository, even if the pipeline purports to mirror `gitster/git` to `gitgitgadget/git`; This is a deliberate decision, to make sure that we only mirror the "official tags" from the authoritative repository.

The two pipelines are identical except for these aspects:
- The `gitster/git` repository contains substantially more branches. The only `git/git` branch that is missing from `gitster/git` is `todo`, which [we might parse at some stage to provided concise excerpts from the "What's cooking" mails](https://github.com/gitgitgadget/gitgitgadget/issues/152).
- For technical reasons, the `git/git` pipeline does not need to poll.

### Git GUI's branches

As GitGitGadget can also be used to contribute Git GUI patches and patch series, there is also the [Synchronize git-gui.git (branches only) to GitGitGadget](https://dev.azure.com/gitgitgadget/git/_build?definitionId=10) pipeline. It mirrors the branches of Pratyush Yadav's repository (i.e. the current Git GUI maintainer's authoritative repository) into the `git-gui/*` namespace on `gitgitgadget/git`.