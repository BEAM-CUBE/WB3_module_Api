# 3DDashboard Utils

## Introduction

This package aims to facilitate widget development by mocking some 3DDashboard APIs & by adding a few 3DDashboard util methods so development & tests can be
achieved inside & outside the 3DDashboard indifferently.

## Installation

If you never installed one of the Widget Lab component, add our npm repository to your configuration:

```bash
npm config set @widget-lab:registry https://itgit.dsone.3ds.com/api/v4/packages/npm/
npm config set "//itgit.dsone.3ds.com/api/v4/packages/npm/:_authToken" "61qKzSxnrLqyeyBy1H-o"
```

Then

```bash
npm i @widget-lab/3ddashboard-utils
```

## Basic Usage

```javascript
import { widget } from "@widget-lab/3ddashboard-utils";

// now use widget in 3DDashboard context or in standalone
widget.addEvent("onLoad", () => {
    // do something
});
```

## Exposed Mocking & Utils

| Name               | Type     |
| ------------------ | -------- |
| widget             | Object   |
| requirejs          | Function |
| UWA                | Object   |
| isWidget           | Function |
| disableDefaultCSS  | Function |
| onVisibilityChange | Function |

## Mocked objects in standalone

### widget

```javascript
import { widget } from "@widget-lab/3ddashboard-utils";
```

#### Available APIs

`id` hardcoded to _"standalone"_

`data` empty object

`uwaURL` hardcoded to _"./"_

`uwaPath` hardcoded to _"./"_

`addEvent(eventName, callback)` when _eventName_ is _onLoad_, the callback is called when the event _DOMContentLoaded_ is fired on window object. For other
_eventName_, the callback is called as soon as it is registered.

`addPreference({name, ?defaultValue})` register a preference (preferences are stored in the browser local storage)

`getPreference(name)` return the preference with the given _name_

`setValue(preferenceName, value)` set the value for a given preference

`getValue(preferenceName)` return the value of a given preference

`setTitle(title)` set the document title

`setIcon(iconUrl)` add a _link_ node to the _head_ DOM element

`dispatchEvent(event)` does nothing

### requirejs

```javascript
import { requirejs } from "@widget-lab/3ddashboard-utils";
```

#### Available APIs

`DS/TagNavigatorProxy/TagNavigatorProxy`

```javascript
requirejs(["DS/TagNavigatorProxy/TagNavigatorProxy"], TagNavigatorProxy => {
    const taggerProxy = TagNavigatorProxy.createProxy();

    taggerProxy.activate(/* */); // does nothing,
    taggerProxy.addEvent(/* */); // does nothing
    taggerProxy.addSubjectsTags(/* */); // does nothing
    taggerProxy.configurePredicates(/* */); // does nothing
    taggerProxy.deactivate(); // does nothing
    taggerProxy.die(); // does nothing
    taggerProxy.focusOnSubjects(/* */); // does nothing
    taggerProxy.getCurrentFilter(); // return an empty object
    taggerProxy.setPredicates(/* */); // does nothing
    taggerProxy.setSubjectsTags(/* */); // does nothing
    taggerProxy.setTags(/* */); // does nothing
    taggerProxy.unfocus(); // does nothing
    taggerProxy.unsetTags(); // does nothing
});
```

`DS/PlatformAPI/PlatformAPI`

```javascript
requirejs(["DS/PlatformAPI/PlatformAPI"], PlatformAPI => {
    const user = PlatformAPI.getUser(); // return a hardcoded fake user with fake informations
    PlatformAPI.publish(/* */); // does nothing
    PlatformAPI.subscribe(/* */); // does nothing
});
```

### UWA

```javascript
import { UWA } from "@widget-lab/3ddashboard-utils";
```

#### Available API

`log(str)` print str in the console using console.log

## Utils for both 3DDashboard & Standalone

### disableDefaultCSS

disable / enable the default CSS inherited from 3DDashboard

```javascript
import { disableDefaultCSS } from "@widget-lab/3ddashboard-utils";

disableDefaultCSS(true);
```

### isWidget

indicate whether the widget is loaded in a 3DDashboard or externally

```javascript
import { isWidget } from "@widget-lab/3ddashboard-utils";

if (isWidget()) {
    // in 3DDashboard
} else {
    // standalone
}
```

### onVisibilityChange

allows to detect wether the widget is visible or not (browser & dashboard tabs have focus)

```javascript
import { onVisibilityChange } from "@widget-lab/3ddashboard-utils";

onVisibilityChange(visibility => {
    // widget (or fullpage) visibility has changed
});
```
