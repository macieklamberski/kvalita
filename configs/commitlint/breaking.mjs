// The conventionalcommits parser turns both a `!` before the colon and a `BREAKING CHANGE:` or
// `BREAKING-CHANGE:` footer into a note, and semantic-release releases a major for any note.
const noBreakingChange = (parsed) => {
  // biome-ignore lint/style/noProcessEnv: The escape is set per commit, outside the config.
  if (process.env.KVALITA_ALLOW_BREAKING === '1' || parsed.notes.length === 0) {
    return [true]
  }

  return [false, 'breaking changes need KVALITA_ALLOW_BREAKING=1 set for the commit']
}

export default {
  plugins: [{ rules: { 'kvalita/no-breaking-change': noBreakingChange } }],
  rules: {
    'kvalita/no-breaking-change': [2, 'always'],
  },
}
