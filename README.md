# adventofcode (2019)

my adventofcode solutions and helper tool

`yarn install`  
`yarn go 2020 X` - get set up for a challenge  
`yarn watch` - start running code on save  
`yarn prettierwatch` - format solution code on save

how to use:

open 3-4 terminal windows

- leave one blank
- run `yarn watch` on one
- run `yarn watchPrettier` on one (unless your editor is set to format code with prettier)
- use the blank one to run `yarn go 2020 X` before the advent opens
- edit the code in a text editor
- on save, your code will run and results will be shown
- accidental infinite loops will be killed by re-saving the code
- code may run twice because of prettier
- your input will be loaded into `dayX.txt`, read it from the `input` variable (as a string, trimmed automatically) or from `lines`, pre-split by `\n`, or from dblines, pre-split by `\n\n` and then by `\n`
