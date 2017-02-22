import {
  default as App,
  defaultState
} from './App'
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
