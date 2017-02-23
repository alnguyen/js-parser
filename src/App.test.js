import {
  default as App,
  defaultState
} from './App'
import {
  FUNCTIONALITIES,
  INSTRUCTIONS
} from './constants'
import React from 'react'
import ReactDOM from 'react-dom'
import { mount, shallow } from 'enzyme'

describe('App', () => {
  describe('::State', () => {
    let app
    beforeEach(() => {
      app = shallow(<App />)
    })

    it('loads default state on render', () => {
      expect(app.state()).toEqual(defaultState)
    })
  })

  describe('::Rendering', () => {
    let app
    beforeEach(() => {
      app = shallow(<App />)
    })

    it('renders the instructions on load', () => {
      const instructions = app.find('.App-instructions')
      expect(instructions.length).toBe(1)
      expect(instructions.text()).toEqual(INSTRUCTIONS)
    })

    it('renders the functionality options', () => {
      const functionalitiesList = app.find('.functionality--list')
      const functionalitiesItems = functionalitiesList.find('.functionality--item')
      expect(functionalitiesList.length).toBe(1)
      expect(functionalitiesItems.length).toBe(3)
      const texts = functionalitiesItems.map((item) => item.text())
      Object.keys(FUNCTIONALITIES).forEach((item) => {
        expect(texts).toContain(FUNCTIONALITIES[item].text)
      })
    })

    it('renders an empty textarea on load', () => {
      const textArea = app.find('textarea')
      expect(textArea.length).toBe(1)
      expect(textArea.node.props.value).toEqual('') // TODO: Figure this out
    })
  })

  describe('::Actions', () => {
    let app
    beforeEach(() => {
      app = mount(<App />)
    })
    it('updates state on input change', () => {
      const textArea = app.find('textarea')
      const value = 'let a = 3;'
      textArea.simulate('change', {target: {value}})
      expect(app.state().userInput).toEqual(value)
    })
  })
})
