// I would store javascript object-related functions in a generic file like this.
// For example, comparing two arrays have the same strings with no regard to order may be used across the application for ID containing arrays

function findIndexOfFirstUnmatchingCharacterBetweenStrings ({ string1, string2 }) {
  let i = string1.split('').findIndex((char, index) => {
    return string2.split('')[index] !== char
  })
  return i !== -1 ? i
    : string2.split('').findIndex((char, index) => {
      return string1.split('')[index] !== char
    })
}
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

function getCaretPosition ({ el }) {
  let pos
  if (document.selection && document.selection.createRange) {
    const range = document.selection.createRange()
    const bookmark = range.getBookmark()
    pos = bookmark.charCodeAt(2) - 2
  } else if (el.setSelectionRange) {
    pos = el.selectionStart
  } else {
    pos = window.getSelection().focusOffset
  }
  return pos
}

export {
  getCaretPosition,
  setCaretPosition,
  findIndexOfFirstUnmatchingCharacterBetweenStrings
}