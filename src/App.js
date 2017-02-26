import {
  FAILING,
  FUNCTIONALITIES,
  INSTRUCTIONS,
  PASSING
} from './constants'
import { passesList } from './lib/parser'
import React, { Component } from 'react';
import './App.css';

export const defaultState = {
  blacklist: [],
  passing: true,
  status: '',
  userInput: '',
  whitelist: []
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  evaluate = (userInput, bList, wList) => {
    const { blacklist, whitelist } = this.state
    const useBList = bList || blacklist
    const useWList = wList || whitelist
    const failures = passesList(userInput, useWList).concat(passesList(userInput, useBList, false))
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
    const failures = this.evaluate(userInput, newBList, newWList)
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

  renderTextArea () {
    const { handleInputChange, state } = this

    return (
      <textarea
        onChange={handleInputChange}
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
        {this.renderTextArea()}
        {this.renderResult()}
      </div>
    );
  }
}

export default App;
