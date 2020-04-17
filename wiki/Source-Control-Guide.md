# Source Control Guide

## Branching
Start the branch name with the related pbi number: `pbi-[pbi number]`. The rest of the name should be describe the related pbi. Example:

`pbi-678-enable-authentication`

## Committing

### Commit Messages for merges with `master`

Commit messages merged with `master` should:
- ...be written imperatively.
- ...have an capitalized first letter.
- ...not end on a period.
- ...be concise.
- ...describe the change.

### Never commit user specific files

Never commit editor configs or user secrets, since they are specific to users. Add them to `.gitignore` instead. 

## Pull Requests

### Merging with the `master` branch
Squash commits together into a single commit when merging with `master`. This creates a linear history. Since our web app only has one supported version, this is a Good Thing™. 

### Delete merged feature branches

After merging a feature branch with `master`, make sure to 1) delete your feature branch, or 2) make sure the feature branch has the exact same history as the `master` branch. 

This is because squashing creates a new commit for the target branch, that is not applied to the source branch.
