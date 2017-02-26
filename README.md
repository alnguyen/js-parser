This is a quick and dirty JS parser that does a couple of things:
1. Allows the user to specify a whitelist of "functionalities"
  1. This list determines what a user *must* include in their input
1. Allows the user to specify a blacklist of "functionalities"
  1. This list determines what a user *can not* include in their input
1. Allows the user to input some code and be analyzed based on the blacklist and whitelist definitions

#### Info

This parser uses Acorn under the hood

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
|_______________________________________________________|

#### Todo

**Implementation**

1. 100% coverage on parser
1. Have App be a container
  1. Move the parser form into it's own component
  1. Have prop types inform the parser form
  1. Store state in App container and pass into prop types for parser form
1. Error handling
  1. So we don't have to use try/catch blocks

**UI**

1. On blacklist/whitelist/none selection, initiate validation
1. Ability to use functionalities multiple times
1. Better UI for functionalities selection
1. Form field for specifying structure expectation
1. Code editor instead of textarea
