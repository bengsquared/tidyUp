![tidyUp Logo](/tidyUp.icns)

# tidyUp

by Manila File Company

## A simple app to tidy up your file system

tidy up is a basic app to look through your large folders and help you organize. It features a tinder-like UI, allowing you to swipe left and right on files to see which ones are really worth your time ;)

## building tidyUp

as builds become available, they will be hosted on the Manila website [here](https://www.manilafile.co/tidyUp)

If you'd like to DIY it, run these commands to:

1. clone the repo
1. enter the project directory
1. install dependencies using npm
1. build the react app
1. build/package the electron app

```
git clone (repolink)
cd tidyUp
npm i
npm run build
npm run package
```

and there you go!

## tidyUp is a work in progress

Feel free to fork, open bugs and PRs right here on github!

### Project Structure

from a development point of view, the project is laid out as follows:

```
.
+--_public (react root html file)
|  +--index.html
|
+--_server (electron node app code)
|  +--_lib (supporting functions for electron)
|  +--main.js (main electron process)
|
+--_src (folder for the react renderer process for development)
   +--_components (containing renderer react process components)
   +--_images
   +--_styles
   |
```

key libraries/frameworks used:

React (Create React App)
electron
electron-persist
electron-packager

osx-fileicon (in development, also by us)
