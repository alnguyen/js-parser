const acorn = require('acorn')
const walk = require('acorn/dist/walk')

function markAsVisited (tracker, node) {
  tracker[node.type] = true
}

/*
  Required - (String) input: text input to analyze
  Required - (Array) list: array of functionalities to test the input against
  Optional - (Boolean) marker: test the input against the list for inclusivity? Default: true

  Output - (Array) list of functionalities that didn't pass the test
*/
export function passesList (input, list, marker = true) {
  if (!list.length) return [] // Nothing to match against
  let parsed
  const visitSetup = {}
  const visitedTracker = {}
  list.forEach((func) => {
    visitedTracker[func] = false
    visitSetup[func] = markAsVisited.bind(null, visitedTracker)
  })

  parsed = acorn.parse(input)
  walk.simple(parsed, visitSetup)
  return Object.keys(visitedTracker).reduce((acc, current) => {
    if (visitedTracker[current] !== marker) acc.push(current)
    return acc
  }, [])
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
