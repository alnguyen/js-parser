import {
  default as App,
  defaultState
} from '../App'
import {
  FAILING,
  FUNCTIONALITIES,
  INSTRUCTIONS,
  PASSING
} from '../constants'
import { mount, shallow } from 'enzyme'
import React from 'react'
import ReactDOM from 'react-dom'

describe('App', () => {
  describe('State', () => {
    let app
    beforeEach(() => {
      app = shallow(<App />)
    })

    it('loads default state on render', () => {
      expect(app.state()).toEqual(defaultState)
    })
  })

  describe('Rendering', () => {
    let app
    beforeEach(() => {
      app = shallow(<App />)
    })

    it('renders the instructions on load', () => {
      const instructions = app.find('.App-instructions')
      expect(instructions.length).toBe(1)
      expect(instructions.text()).toEqual(INSTRUCTIONS)
    })

    it('renders the functionality display text', () => {
      const functionalitiesList = app.find('.functionality--list')
      const functionalitiesItems = functionalitiesList.find('.functionality--item__text')
      expect(functionalitiesList.length).toBe(1)
      expect(functionalitiesItems.length).toBe(Object.keys(FUNCTIONALITIES).length)
      const texts = functionalitiesItems.map((item) => item.text())
      Object.keys(FUNCTIONALITIES).forEach((item) => {
        expect(texts).toContain(item)
      })
    })

    it('renders the functionality options', () => {
      const functionalitiesOptions = app.find('.functionality--item__opt')
      const optionKeys = Object.keys(FUNCTIONALITIES)
      const expectedOptions = optionKeys.length * 3 // whitelist/blacklist/none
      expect(functionalitiesOptions.length).toBe(expectedOptions)
    })

    it('renders an empty user-input on load', () => {
      const textArea = app.find('.user-input')
      expect(textArea.length).toBe(1)
      expect(textArea.node.props.value).toEqual('')
    })

    it('renders nothing for status on load', () => {
      const statusText = app.find('.status')
      expect(statusText.text()).toEqual('')
    })

    it('renders an empty structure input on load', () => {
      const textArea = app.find('.structure-input')
      expect(textArea.length).toBe(1)
      expect(textArea.node.props.value).toEqual('')
    })
  })

  describe('Actions', () => {
    let app
    beforeEach(() => {
      app = mount(<App />)
    })

    it('updates state on input change', () => {
      const textArea = app.find('.user-input')
      const value = 'let a = 3;'
      textArea.simulate('change', {target: {value}})
      expect(app.state().userInput).toEqual(value)
    })

    describe('status', () => {
      it('sets status to passing on success', () => {
        const textArea = app.find('.user-input')
        const value = 'let a = 3;'
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'VariableDeclaration' }})

        textArea.simulate('change', {target: {value}})
        expect(app.state().status).toEqual(PASSING)
      })

      it('sets status to error on error', () => {
        const textArea = app.find('.user-input')
        const value = `
          let a = 5
          for (
        `
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'ForStatement' }})
        textArea.simulate('change', {target: {value}})
        expect(app.state().status).toEqual('Error')
      })

      it('sets status to failure reason on failure', () => {
        const textArea = app.find('.user-input')
        const value = 'let a = 5;'
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'ForStatement' }})
        textArea.simulate('change', {target: {value}})
        expect(app.state().status).toEqual('ForStatement')
      })
    })

    describe('structure', () => {
      it('sets structureMap and structureInput state correctly', () => {
        const structureInput = app.find('.structure-input')
        const value = 'ForStatement, IfStatement'
        structureInput.simulate('change', {target: {value}})
        expect(app.state().structureMap).toEqual({IfStatement: ['ForStatement', 'IfStatement']})
        expect(app.state().structureInput).toEqual(value)
      })

      it('sets status to failure reason on failure', () => {
        const structureInput = app.find('.structure-input')
        const value = 'ForStatement, IfStatement'
        structureInput.simulate('change', {target: {value}})
        expect(app.state().passing).toEqual(FAILING)
        expect(app.state().status).toEqual('IfStatement')
      })

      it('sets status to passing reason on pass', () => {
        const structureInput = app.find('.structure-input')
        const userInput = app.find('.user-input')
        const value = 'ForStatement, IfStatement'
        const userValue = `for(var i=0;i<10;++i){
          if(i > 8) {
            console.log('hi')
          }
        }`
        structureInput.simulate('change', {target: {value}})
        userInput.simulate('change', {target: {value: userValue}})
        expect(app.state().passing).toEqual(PASSING)
        expect(app.state().status).toEqual(PASSING)
      })
    })

    describe('functionality lists', () => {
      it('adds item to whitelist', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(1)
        expect(app.state().whitelist[0]).toEqual('forLoop')
      })

      it('adds item to blacklist', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'blacklist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(0)
        expect(app.state().blacklist.length).toEqual(1)
        expect(app.state().blacklist[0]).toEqual('forLoop')
      })

      it('removes from whitelist and moves to blacklist', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(1)
        opt.simulate('change', { target: { value: 'blacklist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(0)
        expect(app.state().blacklist.length).toEqual(1)
      })

      it('removes from blacklist and moves to whitelist', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'blacklist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(0)
        expect(app.state().blacklist.length).toEqual(1)
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(1)
      })

      it('removes item from blacklist when selecting none', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'blacklist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(0)
        expect(app.state().blacklist.length).toEqual(1)
        opt.simulate('change', { target: { value: 'none', name: 'forLoop' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(0)
      })

      it('removes item from whitelist when selecting none', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(1)
        expect(app.state().blacklist.length).toEqual(0)
        opt.simulate('change', { target: { value: 'none', name: 'forLoop' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(0)
      })

      it('can add multiple selections to same list', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        expect(app.state().whitelist.length).toEqual(1)
        expect(app.state().blacklist.length).toEqual(0)
        opt.simulate('change', { target: { value: 'whitelist', name: 'ifStatement' }})
        expect(app.state().blacklist.length).toEqual(0)
        expect(app.state().whitelist.length).toEqual(2)
      })

      it('can add different selections to different lists', () => {
        const functionalityItem = app.find('.functionality--item').first()
        const opt = functionalityItem.find('.functionality--item__opt').first()
        opt.simulate('change', { target: { value: 'whitelist', name: 'forLoop' }})
        opt.simulate('change', { target: { value: 'blacklist', name: 'ifStatement' }})
        expect(app.state().blacklist.length).toEqual(1)
        expect(app.state().whitelist.length).toEqual(1)
      })
    })
  })
})
