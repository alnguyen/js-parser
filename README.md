## Viewable Here: https://alnguyen.github.io/js-parser/

[![Greenkeeper badge](https://badges.greenkeeper.io/alnguyen/js-parser.svg)](https://greenkeeper.io/)

## Info

This is a quick and dirty JS parser that does a couple of things:
- Allows the user to specify a whitelist of "functionalities"
  - This list determines what a user *must* include in their input
  
- Allows the user to specify a blacklist of "functionalities"

  - This list determines what a user *can not* include in their input
  
- Allows the user to specify a rough structure of what the input code needs to follow

  - eg. "ForLoop, IfStatement" -> (An IfStatement inside a ForLoop)
  
- Allows the user to input some code and be analyzed based on the blacklist, whitelist, and rough structure defined


#### To Run
- `yarn install`
- `yarn start`
- `Navigate your browser to http://localhost:3000`
- `Play around!`

You can also run some tests: `yarn test`

#### This parser uses Acorn under the hood

Compared to Esprima:

| Criteria        | Acorn | Esprima | Commentary        |
|:---------------:|:-----:|:-------:|:-----------------:|
| Speed           |   -   |     -   | Similar           |
| Size            |  x    |         | 3MB vs 20MB+      |
| Community       |   x   |         | Acorn more active |
| Code Climate    |       |     x   | 1.0 vs 2.3        |
| Browser Support |   x   |         | Acorn -- IE5      |
| Documentation   |       |     x   |                   |
| License         |  x    |         | MIT vs BSD        |

## To Do

**Implementation**

1. 100% coverage on parser
1. Have App be a container
  1. Move the parser form into it's own component
  1. Have prop types inform the parser form
  1. Allow parser to have internal state to share the parsed input instead of re-parsing every eval

**UI**

1. Ability to use functionalities multiple times
1. Define failing status as structural or white/blacklisting failure
1. Ability to use the strict structure evaluation
1. Better UI for functionalities selection
  1. 3 Lists -- One for each state, can move functions between states
1. Code editor instead of textarea
