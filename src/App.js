import {
  FAILING,
  FUNCTIONALITIES,
  INSTRUCTIONS,
  PASSING
} from './constants'
import {
  passesList,
  passesStructure
} from './lib/parser'
import React, { Component } from 'react';
import './App.css';

export const defaultState = {
  blacklist: [],
  passing: true,
  status: '',
  structureInput: '',
  structureMap: {},
  userInput: '',
  whitelist: []
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  evaluate = (userInput, opts = {}) => {
    const { blacklist, structureMap, whitelist } = this.state
    const useBList = opts.bList || blacklist
    const useWList = opts.wList || whitelist
    const structMap = opts.structureMap || structureMap
    const failures = passesList(userInput, useWList).concat(
      passesList(userInput, useBList, false),
      passesStructure(userInput, structMap))
    return failures
  }

  getStatus = (failures) => {
    let passing
    let status

    passing = failures.length ? FAILING : PASSING
    status = failures.length ? failures.join(', ') : PASSING
    return { passing, status }
  }

  // -- Handlers -- //
  handleInputChange = (evt) => {
    const userInput = evt.target.value
    let passing = this.state.status
    let status
    try {
      const failures = this.evaluate(userInput)
      const newStatus = this.getStatus(failures)
      passing = newStatus.passing
      status = newStatus.status
    } catch (err) {
      passing = FAILING
      status = 'Error'
    } finally {
      this.setState({userInput, passing, status})
    }
  }

  handleStructureChange = (evt) => {
    const { userInput } = this.state
    const structureInput = evt.target.value
    const structures = structureInput.split('\n')
    const structureMap = structures.reduce((acc, current) => {
      const split = current.split(',').map((func) => func.replace(' ', ''))
      const key = split[split.length-1]
      acc[key] = split
      return acc
    }, {})

    const failures = this.evaluate(userInput, {structureMap})
    const {passing, status} = this.getStatus(failures)

    this.setState({structureInput, structureMap, passing, status})
  }

  handleOptionChange = (evt) => {
    const { name, value } = evt.target
    const { blacklist, userInput, whitelist } = this.state
    let newBList = blacklist.slice(0)
    let newWList = whitelist.slice(0)
    let bIdx
    let wIdx
    const removeFromWhitelist = () => {
      wIdx = whitelist.indexOf(name)
      if (wIdx !== -1) newWList.splice(wIdx, 1)
    }
    const removeFromBlacklist = () => {
      bIdx = blacklist.indexOf(name)
      if (bIdx !== -1) newBList.splice(bIdx, 1)
    }
    switch(value) {
      case 'none':
        removeFromBlacklist()
        removeFromWhitelist()
        break
      case 'blacklist':
        newBList.push(name)
        removeFromWhitelist()
        break
      case 'whitelist':
        newWList.push(name)
        removeFromBlacklist()
        break
      // no default
    }
    const failures = this.evaluate(userInput, {bList: newBList, wList: newWList})
    const { passing, status } = this.getStatus(failures)
    this.setState({blacklist: newBList, whitelist: newWList, passing, status})
  }

  // -- Convenience -- //
  isSelected = (func, list) => {
    const { blacklist, whitelist } = this.state
    switch(list) {
      case 'whitelist':
        return whitelist.indexOf(func) !== -1
      case 'blacklist':
        return blacklist.indexOf(func) !== -1
      default:
        return whitelist.indexOf(func) === -1 && blacklist.indexOf(func) === -1
    }
  }

  // -- Renders -- //
  renderFunctionalityList () {
    const functionalities = Object.keys(FUNCTIONALITIES)
    const renderFunctionality = functionalities.map((func, idx) => {
      return (
        <li key={func} className='functionality--item'>
          <span className='functionality--item__text'>{`${func}`}</span>
          <input
            className='functionality--item__opt'
            checked={this.isSelected(func, 'whitelist')}
            type='radio'
            name={func}
            value='whitelist'
            onChange={this.handleOptionChange} /> Whitelist
          <input
            className='functionality--item__opt'
            checked={this.isSelected(func, 'blacklist')}
            type='radio'
            name={func}
            value='blacklist'
            onChange={this.handleOptionChange} /> Blacklist
          <input
            className='functionality--item__opt'
            checked={this.isSelected(func, 'none')}
            type='radio'
            name={func}
            value='none'
            onChange={this.handleOptionChange} /> None
        </li>
      )
    })
    return (
      <ul className='functionality--list'>
        {renderFunctionality}
      </ul>
    )
  }

  renderStructureInput () {
    const { handleStructureChange, state } = this
    const placeholder = `Enter structure expectations.\nNewline delimited per functionality.\nComma delimited per structure.`
    return (
      <textarea
        className='structure-input'
        onChange={handleStructureChange}
        placeholder={placeholder}
        value={state.structureInput}
      />
    )
  }

  renderTextArea () {
    const { handleInputChange, state } = this

    return (
      <textarea
        className='user-input'
        onChange={handleInputChange}
        placeholder={'Enter code here'}
        value={state.userInput}
      />
    )
  }

  renderResult () {
    const { passing, status } = this.state
    const classNames = `status ${passing}`
    return (
      <span className={classNames}>
        {status}
      </span>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Quick and Dirty JS Parser</h2>
        </div>
        <p className="App-instructions">
          {INSTRUCTIONS}
        </p>
        {this.renderFunctionalityList()}
        {this.renderStructureInput()}
        {this.renderTextArea()}
        {this.renderResult()}
      </div>
    );
  }
}

export default App;
