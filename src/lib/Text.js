import { findIndexOfFirstUnmatchingCharacterBetweenStrings } from '@/lib/Core'

function sanitize (text) {
  return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getChangedWordOnInputData ({ newValue, oldValue }) {
  let changedCharacterIndex = oldValue ? findIndexOfFirstUnmatchingCharacterBetweenStrings({ string1: newValue, string2: oldValue }) : 0
  const breakwordCharacters = [' ', '\n']
  // When deleting last character of a word, subtract 1 to index
  if (!!changedCharacterIndex && breakwordCharacters.includes(newValue.split('')[changedCharacterIndex])) {
    changedCharacterIndex--
  }
  const newValueCharacterData = newValue.split('').map((character, index) => ({ character, index }))
  const changedWordStartingSpace = newValueCharacterData.filter(({ index, character }) => index <= changedCharacterIndex && breakwordCharacters.includes(character)).pop()
  const changedWordEndingSpace = newValueCharacterData.filter(({ index, character }) => index >= changedCharacterIndex && breakwordCharacters.includes(character)).shift()
  const changedWordStartingIndex = changedWordStartingSpace ? changedWordStartingSpace.index + 1 : 0
  const changedWordEndingIndex = changedWordEndingSpace ? changedWordEndingSpace.index - 1 : newValue.split('').length
  return {
    text: newValue.split('').filter((char, i) => i >= changedWordStartingIndex && i <= changedWordEndingIndex).join(''),
    startIndex: changedWordStartingIndex,
    endIndex: changedWordEndingIndex
  }
}

export {
  sanitize,
  getChangedWordOnInputData
}
