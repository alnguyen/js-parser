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
      it('returns empty array for empty whitelist', () => {
        expect(passesList(input, [])).toEqual([])
      })

      it('returns empty array if whitelist item is in input', () => {
        expect(passesList(input, ['ForStatement'])).toEqual([])
      })

      it('returns empty array if multiple whitelist items is in input', () => {
        expect(passesList(input, ['ForStatement', 'IfStatement'])).toEqual([])
      })

      it('returns missing item if input is missing expected functionality', () => {
        const expectation = ['FunctionDeclaration']
        expect(passesList(input, expectation)).toEqual(expectation)
      })
    })

    describe('blacklisting', () => {
      it('returns empty array for empty blacklist', () => {
        expect(passesList(input, [], false)).toEqual([])
      })

      it('returns empty array if blacklist item is not in input', () => {
        expect(passesList(input, ['FunctionDeclaration'], false)).toEqual([])
      })

      it('returns failure reason if item is present', () => {
        const expectation = ['ForStatement']
        expect(passesList(input, expectation, false)).toEqual(expectation)
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
