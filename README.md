This is a quick and dirty JS parser that does a couple of things:
1. Allows the user to specify a whitelist of "functionalities"
  1. This list determines what a user *must* include in their input
1. Allows the user to specify a blacklist of "functionalities"
  1. This list determines what a user *can not* include in their input
1. Allows the user to input some code and be analyzed based on the blacklist and whitelist definitions

This parser uses Acorn under the hood
  - Acorn supports back to IE5
  - Smaller size footprint at 3MB on disk
    - This is important when loading in-browser
  - Active community / Support (Last updated within 10 days)
