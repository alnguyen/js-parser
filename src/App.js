import React, { Component } from 'react';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {userInput: ''}
  }

  handleChange = (evt) => {
    const userInput = evt.target.value
    this.setState({userInput})
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
        <p className="App-intro">
          Hello World
        </p>
        {this.renderTextArea()}
      </div>
    );
  }
}

export default App;
