import filter from 'leo-profanity'

filter.loadDictionary('en')
export default {
  check: text => filter.check(text),
  clean: text => filter.clean(text),
}
