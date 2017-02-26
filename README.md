Taskboard Project
=================

Requirements
------------

Read the [specification](specification.md). It's all there.

Steps
-----

In general, because this is a wep _application_ and not a web _site_, don't try to build it using semantic html,
and _then_ style it - do everything together, and `<div>`-s are OK.

### 1. Template

1. Create a template `index.html`
1. Add a link-rel to the bootstrap: `https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`
1. Create a js file and a css file of your own, and script-src and link-rel them from the HTML.

### 2. Banner

1. Using bootstrap, create a banner with the logo and the menu items needed. How? Goto the bootstrap
   site, search for a nav bar that fits how it should look like, copy/paste the code from the site, and retrofit
   it.

### 3. Lists

1. Because we need horizontal scrolling, bootstrap will be difficult to use.
1. So we don't use it for that!
1. Build lists, with the cards inside them, as in the screenshot. Note that they are currently empty, but we will
   fill them. Also note that we are creating static HTML with "sample" lists and cards, but once your css
   is ready, we will delete them all and rely on JavaScript code to generate them.

### 4. Banners and Footers In Lists

1. You need to create the div-s for the name of the list (at the stop of the list), and the
   "add card" footer at the bottom, as the last card.

