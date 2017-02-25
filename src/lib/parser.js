const acorn = require('acorn')
const walk = require('acorn/dist/walk')

function markAsVisited (tracker, node) {
  tracker[node.type] = true
}

/*
  Required - (String) input: text input to analyze
  Required - (Array) list: array of functionalities to test the input against
  Optional - (Boolean) inclusive: test the input against the list for inclusivity? Default: true

  Output - (Object) Object of the functinoalities and if they passed the given check
*/
export function passesList (input, list, inclusive = true) {
  if (!list.length) return true // Nothing to match against
  let parsed
  const visitSetup = {}
  const visitedTracker = {}
  list.forEach((func) => {
    visitedTracker[func] = false
    visitSetup[func] = markAsVisited.bind(null, visitedTracker)
  })

  parsed = acorn.parse(input)
  walk.simple(parsed, visitSetup)
  return Object.keys(visitedTracker).map((key) => visitedTracker[key]).indexOf(!inclusive) < 0
}

/*
  Required - (String) input: text input to analyze
  Required - (TBD) structure: expected structure of inputs

  Output - (Boolean) Whether or not the input passes the given structure
*/
export function passesStructure (input, structure) {
  if (!structure) return true
  return false
}
