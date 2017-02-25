import { passesList, passesStructure } from './parser'
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
  describe('#passesList', () => {

    it('throws if there is an error', () => {
      const badInput = `
      let a
      for (`
      expect(passesList.bind(null, badInput, ['VariableDeclaration'])).toThrow()
    })

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
    })

    describe('blacklisting', () => {
      it('returns true for empty list', () => {
        expect(passesList(input, [], false)).toEqual(true)
      })

      it('returns true if funcationlity is not in blacklist', () => {
        expect(passesList(input, ['FunctionDeclaration'], false)).toEqual(true)
      })

      it('returns false if functionality is blacklisted', () => {
        expect(passesList(input, ['ForStatement'], false)).toEqual(false)
      })
    })
  })

  describe('#passStructure', () => {
    it('returns true for no structure expectation', () => {
      expect(passesStructure(input, null)).toEqual(true)
    })

    it('returns false if structure is not met', () => {
      expect(passesStructure(input, {})).toEqual(false)
    })
  })
})
