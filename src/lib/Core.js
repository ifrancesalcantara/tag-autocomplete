// I would store javascript object-related functions in a generic file like this.
// For example, comparing that two arrays of strings (or IDs)

function findIndexOfFirstUnmatchingCharacterBetweenStrings ({ string1, string2 }) {
  return string1.split('').findIndex((char, index) => {
    return string2.split('')[index] !== char
  })
}

function findChangedWordOnInput ({ newValue, oldValue }) {
  let changedCharacterIndex = oldValue ? findIndexOfFirstUnmatchingCharacterBetweenStrings({ string1: newValue, string2: oldValue }) : 0
  const breakwordCharacters = [' ', '\n']
  if (!!changedCharacterIndex && breakwordCharacters.includes(newValue.split('')[changedCharacterIndex])) {
    changedCharacterIndex--
  }
  const newValueCharacterData = newValue.split('').map((character, index) => ({ character, index }))
  const changedWordStartingSpace = newValueCharacterData.filter(({ index, character }) => index <= changedCharacterIndex && breakwordCharacters.includes(character)).pop()
  const changedWordEndingSpace = newValueCharacterData.filter(({ index, character }) => index >= changedCharacterIndex && breakwordCharacters.includes(character)).pop()
  const changedWordStartingIndex = changedWordStartingSpace ? changedWordStartingSpace.index + 1 : 0
  const changedWordEndingIndex = changedWordEndingSpace ? changedWordEndingSpace.index - 1 : newValue.split('').length
  return newValue.split('').filter((char, i) => i >= changedWordStartingIndex && i <= changedWordEndingIndex).join('')
}


export {
  findChangedWordOnInput,
  findIndexOfFirstUnmatchingCharacterBetweenStrings
}