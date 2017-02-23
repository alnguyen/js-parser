import React, { Component } from 'react';
import {
  FUNCTIONALITIES,
  INSTRUCTIONS
} from './constants'
import './App.css';

export const defaultState = {
  availableFunctionality: FUNCTIONALITIES,
  blacklist: [],
  userInput: '',
  whitelist: []
}

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
  }

  handleChange = (evt) => {
    const userInput = evt.target.value
    this.setState({userInput})
  }

  renderFunctionalityList () {
    const { availableFunctionality } = this.state
    const functionalities = Object.keys(availableFunctionality)
    const renderFunctionality = functionalities.map((func, idx) => {
      return (
        <li key={idx} className='functionality--item'>
          {`${availableFunctionality[func].text}`}
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
    const { handleChange, state } = this

    return (
      <textarea
        onChange={handleChange}
        value={state.userInput}
      />
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
      </div>
    );
  }
}

export default App;
