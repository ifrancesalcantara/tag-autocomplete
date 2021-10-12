// I would store javascript object-related functions in a generic file like this.
// For example, comparing two arrays have the same strings with no regard to order may be used across the application for ID containing arrays

function setCaretPosition({ el, childNum, charNum }) {
  let sel
  el.focus()
  if (document.selection) {
    sel = document.selection.createRange()
    sel.moveStart('character', charNum)
    sel.select()
  }
  else {
    sel = window.getSelection()
    const element = typeof childNum === 'number' ? el.childNodes[childNum] : el
    sel.collapse(element, charNum)
  }
}

export {
  setCaretPosition
}