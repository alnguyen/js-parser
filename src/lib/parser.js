const acorn = require('acorn')
const walk = require('acorn/dist/walk')

function markAsVisited (tracker, node) {
  tracker[node.type] = true
}

function ancestorWalking (tracker, node, ancestors) {
  const types = ancestors.map((anc) => anc.type)
  tracker[node.type].push(types) // Copies ancestors
}

/*
  Attempts to validate given input against a list of required functionalities
  Required - (String) input: text input to analyze
  Required - (Array) list: array of functionalities to test the input against
  Optional - (Boolean) marker: test the input against the list for inclusivity? Default: true

  Output - (Array) list of functionalities that didn't pass the test
*/
export function passesList (input, list, marker = true) {
  if (!list.length) return [] // Nothing to match against
  const parsed = acorn.parse(input)
  const visitSetup = {}
  const visitedTracker = {}
  list.forEach((func) => {
    visitedTracker[func] = false
    visitSetup[func] = markAsVisited.bind(null, visitedTracker)
  })

  walk.simple(parsed, visitSetup)
  return Object.keys(visitedTracker).reduce((acc, current) => {
    if (visitedTracker[current] !== marker) acc.push(current)
    return acc
  }, [])
}

/*
  Attempt at validating code structure.
  Required - (String) input: text input to analyze
  Required - (Object) structure: Functionality as key, value is array of ordering
           - Example 1: IfStatement nested inside a ForStatement
           -  {
                'IfStatement': ['ForStatement', 'IfStatement']
              }
           - Example 2: IfStatement inside a ForStatement within a FunctionDeclaration
              {
                'IfStatement': ['FunctionDeclaration', 'ForStatement', 'IfStatement']
              }
  Optional - (Boolean) strict: if the structure needs to be strictly enforced. Default: false
           - Example - Input
              `function doSomething () {
                for(i=0; i < 5; ++i) {
                  if (i === 3) {
                    break
                  }
                }
              }``
           - Expectation: ['ForStatement', 'IfStatement']
           - Parser returns: ['Program', 'FunctionDeclaration', 'ForStatement', 'IfStatement', 'BreakStatement']
           - (Strict): Fail
           - (Non-strict): Pass

  Output - (String) Functionality that doesn't meet the criteria
*/
export function passesStructure (input, structure, strict = false) {
  const struct = structure || {}
  const list = Object.keys(struct)
  if (!list.length) return []
  const parsed = acorn.parse(input)
  const ancestorTracker = {}
  const ancestorSetup = {}
  list.forEach((func) => {
    ancestorTracker[func] = []
    ancestorSetup[func] = ancestorWalking.bind(null, ancestorTracker)
  })
  walk.ancestor(parsed, ancestorSetup)
  console.log({a: ancestorTracker['IfStatement']})
  return []
}
