# nQuery

nQuery is an easy to use vanilla javascript DOM manipulation library. Select elements, add event listeners, and even make ajax requests all with one convenient library.

## Todo App Built With nQuery

![](https://s3.us-east-2.amazonaws.com/cheers-the-app/nQuery.png)

Interactive todo list using functions exclusively available from the nQuery library. Append, remove, hide, show, and select DOM elements, make AJAX requests and more! Take a deep dive into the public API documentation below, or just have fun with the demo: [Live Demo](http://neilgewirtz.com/nQuery)

# API

### `html`
Returns or sets the HTML text of a selected element

### `empty`
Removes innerHTML from selected elements

### `clear`
Clears input field content

### `val`
Returns input provided by user in input field

### `append`
Add new DOM element to selected node in your document

### `attr`
Get or set attribute values of selected element

### `addClass`
Add new CSS class to node

### `removeClass`
Remove CSS class to node

### `toggleClass`
Toggle CSS class on and off for node

### `children`
Returns a list of all children elements of selected node

### `parent`
Returns a list of all parent elements of selected node

### `find`
Returns a list of all descendants matching the selector for the selected node

### `on`
Adds an event listener and callback function to the selected element

### `off`
Removes all, or one specific, event listener from the selected element

### `hide`
Hides element from view in browser

### `show`
Displays hidden element in browser

### `$n.ajax`
Sends an ajax request returning a javascript Promise.
