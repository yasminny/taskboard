Taskboard Project
=================

Requirements
------------

Read the [specification](specification.md). It's all there.

Steps
-----

### 1. Repository

1. Create a public repo named `taskboard` (no files needed)
1. `git clone` the new repo (will be empty)
1. Copy the files under `projects/taskboard` to your repo
1. Add, commit and push

### 2. Template

1. Create a template `index.html`
1. Install Bootstrap:  
  `npm i bootstrap -S`
1. Add it as link in your `<head>`:  
  `<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">`
1. Create a JS and CSS files of your own, and script-src and link-rel them from the HTML.

### 3. Nav Bar

1. Using Bootstrap, create a nav bar with the logo and the menu items needed. How?
  - Go to the [Bootstrap site](http://getbootstrap.com/components/)
  - Search for a nav bar that fits our needs (check what's available)
  - Copy/Paste the code from the site, and update it

### 4. Lists

1. Because we need horizontal scrolling, Bootstrap Grid will be difficult to use.  
  So we're not going to use it.
1. Build lists, with the cards inside them, as in the screenshot/videos.  
  For now, build it all as static HTML/CSS, we'll make it dynamic with JS later.
