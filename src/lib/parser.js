import { isEqual } from 'lodash/lang'
import { some } from 'lodash/collection'
const acorn = require('acorn')
const walk = require('acorn/dist/walk')

// -- Convenience -- //
function markAsVisited (tracker, node) {
  tracker[node.type] = true
}

function ancestorWalking (tracker, node, ancestors) {
  const types = ancestors.map((anc) => anc.type)
  tracker[node.type].push(types)
}

function nonStrictComparison (expected, ancestry) {
  if (expected.length > ancestry.length) return false

  let lastIndex = 0
  let passed = false
  loop1:
  for(var i = 0; i < expected.length; ++i) {
    loop2:
    for(var j = lastIndex; j < ancestry.length; ++j) {
      if (expected[i] === ancestry[j]) {
        lastIndex = j + 1
        if (i === expected.length - 1) passed = true
        break loop2
      }
      if (j === ancestry.length - 1) break loop1
    }
  }
  return passed
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

  // Sets up the callback methods for the walkers for specific functions
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
  Attempt at validating code structure loosely.
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
           - Example 3 w/ Input
              `function doSomething () {
                for(i=0; i < 5; ++i) {
                  if (i === 3) {
                    break
                  }
                }
              }``
           - Expectation: ['ForStatement', 'IfStatement']
           - Parser returns: ['Program', 'FunctionDeclaration', 'ForStatement', 'IfStatement', 'BreakStatement']
           - Pass

  Output - (Array) List of functionality that doesn't meet the expected criteria
*/
export function passesStructure (input, structure) {
  const struct = structure || {}
  const list = Object.keys(struct)
  if (!list.length) return []
  const parsed = acorn.parse(input)
  const ancestorTracker = {}
  const ancestorSetup = {}
  const failures = []
  list.forEach((func) => {
    ancestorTracker[func] = []
    ancestorSetup[func] = ancestorWalking.bind(null, ancestorTracker)
  })
  walk.ancestor(parsed, ancestorSetup)
  list.forEach((func) => {
    if (!some(ancestorTracker[func], nonStrictComparison.bind(null, struct[func]))) {
      failures.push(func)
    }
  })
  return failures
}

/*
  Attempt at validating code structure strictly.
  Required - (String) input: text input to analyze
  Required - (Object) structure: Functionality as key, value is array of ordering
           - Example
              `function doSomething () {
                for(i=0; i < 5; ++i) {
                  if (i === 3) {
                    break
                  }
                }
              }``
           - Expectation: ['ForStatement', 'IfStatement']
           - Parser returns: ['Program', 'FunctionDeclaration', 'ForStatement', 'IfStatement', 'BreakStatement']
           - Fails

  Output - (Array) List of functionality that doesn't meet the expected criteria
*/
export function passesStructureStrict (input, structure) {
  const struct = structure || {}
  const list = Object.keys(struct)
  if (!list.length) return []
  const parsed = acorn.parse(input)
  const ancestorTracker = {}
  const ancestorSetup = {}
  const failures = []
  list.forEach((func) => {
    ancestorTracker[func] = []
    ancestorSetup[func] = ancestorWalking.bind(null, ancestorTracker)
  })
  walk.ancestor(parsed, ancestorSetup)
  list.forEach((func) => {
    // Strict processing
    if (!some(ancestorTracker[func], isEqual.bind(null, struct[func]))) {
      failures.push(func)
    }
  })
  return failures
}
