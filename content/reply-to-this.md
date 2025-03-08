---
title: GitGitGadget - how to reply to emails on the Git mailing list
---
You most likely found this page because you contributed patches to the Git mailing list via GitGitGadget, and a mail from the Git mailing list was mirrored to your Pull Request, and now you need to answer.

The easiest method (unless you are subscribed to the Git mailing list and saw the mail already) is to import the so-called "mbox" file. You can get that by following the "On the Git mailing list" link on the top of the mirrored mail and then downloading the "raw" version (you can do the same by appending `/raw` to the link).

This file now needs to be imported into your regular mail program.

## How to import an `mbox` file

### If your mail program stores mails in "maildir" format (Thunderbird, Mutt, Alpine, etc)

Simply copy the file to the `new` subfolder in your mailer's maildir folder.

### If you use webmail (GMail and friends)

You can use the command-line tool `curl` (provided that your version has IMAP support):

```sh
curl -g --user "<email>" --url "imaps://imap.gmail.com/INBOX" -T /path/to/raw.txt
```
