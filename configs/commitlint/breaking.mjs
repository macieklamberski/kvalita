// The conventionalcommits parser turns both a `!` before the colon and a `BREAKING CHANGE:` or
// `BREAKING-CHANGE:` footer into a note, and semantic-release releases a major for any note.
const noBreakingChange = (parsed) => {
  if (parsed.notes.length === 0) {
    return [true]
  }

  return [false, 'a breaking change releases a major: drop the ! or the BREAKING CHANGE footer']
}

export default {
  plugins: [{ rules: { 'kvalita/no-breaking-change': noBreakingChange } }],
  rules: {
    'kvalita/no-breaking-change': [2, 'always'],
  },
}
