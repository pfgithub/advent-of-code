# adventofcode (2019)

my adventofcode solutions and helper tool

`yarn install`  
`yarn go dayX` - get set up for a challenge  
`yarn watch` - start running code on save  
`yarn prettierwatch` - format solution code on save

how to use:

open 3-4 terminal windows

- leave one blank
- run `yarn watch` on one
- run `yarn watchPrettier` on one (unless your editor is set to format code with prettier)
- use the blank one to run `yarn go dayX` before the advent opens
- edit the code in a text editor
- on save, your code will run and results will be shown
- accidental infinite loops will be killed by re-saving the code
- code may run twice because of prettier
- paste your input into `dayX.txt` when you are ready to use it and get it from the `input` variable (as a string)
