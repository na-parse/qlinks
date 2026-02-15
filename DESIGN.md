# qlinks

`qlinks` will be a website designed to replicate the use-case and interface of
the Safari mobile web browser's _Favorites_ view, allowing the user to 
pre-define a set of shortcut URLs with an associated label and icon to be used
as a quickstart/home page for quick access to frequently used websites.

The site will be optimized for use and display on an iPhone 14 Pro in mobile
view mode.

## The Problem

Safari sucks, but other mobile browsers lack this feature.  The idea is to 
create a personal website that works like an analogue of the Favorites quick
start view in Safari for use on the Firefox or other mobile web browser.

The `https://qlinks.unit03.net` website can then be pointed to as the target
for "New Tab" / home page in the configuration.

## Design Ideas

- Easy to update/edit shortcuts

A method should be available to edit/update the available shortcuts.  One idea
would be to host a json data file somewhere else and the website can load it.
For the initial deployment, or for simplicity sake, the sites can be defined
statically in the project, but we will eventually want to be able to update
the list without recompiling/publishing the project.

- Tech/stack is open

The idea is a small, quick website that mirrors the interface shown in the
REFERENCE_IMAGE.png file.

## Initial weblinks:

- arstechnica - https://arstechnica.com/
- gnews - https://news.google.com/
- ytube - https://www.youtube.com/feed/subscriptions
- reicc - https://rei.capitalone.com/
- amazon - https://www.amazon.com
- warzone - https://www.twz.com
- ebay - https://www.ebay.com/mys/overview
- nprhowl - https://www.youtube.com/watch?v=Qkq5CFGOBH4

### Thumbnails

We need some way for thumbnails to be shown in a decent quality, as per the reference
image.  When testing in Firefox, the equivalent "shortcuts" feature used the old 
16x16 FAVICO format images scaled up, and it looked horrible.
