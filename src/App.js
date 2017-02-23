import React, { Component } from 'react';
import {
  FUNCTIONALITIES,
  INSTRUCTIONS
} from './constants'
import './App.css';

export const defaultState = {
  blacklist: [],
  userInput: '',
  whitelist: [],
  status: 'passing'
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  handleInputChange = (evt) => {
    const userInput = evt.target.value
    this.setState({userInput})
  }

  handleOptionChange = (evt) => {
    const { name, value } = evt.target
    const { blacklist, whitelist } = this.state
    let newBList = blacklist.slice(0)
    let newWList = whitelist.slice(0)
    let bIdx
    let wIdx
    switch(value) {
      case 'none':
        bIdx = blacklist.indexOf(name)
        wIdx = whitelist.indexOf(name)
        if (bIdx !== -1) newBList.splice(bIdx, 1)
        if (wIdx !== -1) newWList.splice(wIdx, 1)
        this.setState({blacklist: newBList, whitelist: newWList})
        break
      case 'blacklist':
        newBList.push(name)
        wIdx = whitelist.indexOf(name)
        if (wIdx !== -1) newWList.splice(wIdx, 1)
        this.setState({blacklist: newBList, whitelist: newWList})
        break
      case 'whitelist':
        newWList.push(name)
        bIdx = blacklist.indexOf(name)
        if (bIdx !== -1) newBList.splice(bIdx, 1)
        this.setState({blacklist: newBList, whitelist: newWList})
        break
    }
  }

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

  renderFunctionalityList () {
    const functionalities = Object.keys(FUNCTIONALITIES)
    const renderFunctionality = functionalities.map((func, idx) => {
      const option = FUNCTIONALITIES[func]
      return (
        <li key={option.value} className='functionality--item'>
          <span className='functionality--item__text'>{`${option.text}`}</span>
          <input
            className='functionality--item__opt'
            checked={this.isSelected(option.value, 'whitelist')}
            type='radio'
            name={option.value}
            value='whitelist'
            onChange={this.handleOptionChange} /> Whitelist
          <input
            className='functionality--item__opt'
            checked={this.isSelected(option.value, 'blacklist')}
            type='radio'
            name={option.value}
            value='blacklist'
            onChange={this.handleOptionChange} /> Blacklist
          <input
            className='functionality--item__opt'
            checked={this.isSelected(option.value, 'none')}
            type='radio'
            name={option.value}
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
    const { status } = this.state
    const classNames = `status ${status}`
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
