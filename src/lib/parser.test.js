import { passesList } from './parser'
const acorn = require('acorn')

describe('parser', () => {
  const input = `
    let a
    for(var i=5; i<10; ++i) {
      let b = []
      if (i===7) {
        b.push(i)
      }
    }`
  describe('whitelisting', () => {
    it('returns true for empty list', () => {
      expect(passesList(input, [])).toEqual(true)
    })

    it('returns true if criteria is met', () => {
      expect(passesList(input, ['ForStatement'])).toEqual(true)
    })

    it('returns true if multiple criteria is met', () => {
      expect(passesList(input, ['ForStatement', 'IfStatement'])).toEqual(true)
    })

    it('returns false if it does not meet criteria', () => {
      expect(passesList(input, ['FunctionDeclaration'])).toEqual(false)
    })

    it('returns errors with bad input', () => {
      expect(passesList(input, ['ForStatement', 'FunctionDeclaration'])).toEqual(false)
    })

    it('throws if there is an error', () => {
      const badInput = `
        let a
        for (
      `
      expect(passesList.bind(null, badInput, ['VariableDeclaration'])).toThrow()
    })
  })

  describe('blacklisting', () => {

  })
})
