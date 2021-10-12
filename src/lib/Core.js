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

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range
  if (window.getSelection) {
    sel = window.getSelection()
    if (sel.rangeCount) {
      range = sel.getRangeAt(0)
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange()
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span")
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate()
      tempRange.moveToElementText(tempEl)
      tempRange.setEndPoint("EndToEnd", range)
      caretPos = tempRange.text.length
    }
  }
  return caretPos
}

function setCaretPosition({ el, offset }) {
  var range = document.createRange()
  var sel = window.getSelection()

  
  range.setStart(el, offset)
  range.collapse(true)
  
  sel.removeAllRanges()
  sel.addRange(range)
  // var range = el.createTextRange()
  // range.move('character', offset)
  // range.select()
}

export {
  getCaretPosition,
  setCaretPosition,
  findIndexOfFirstUnmatchingCharacterBetweenStrings
}