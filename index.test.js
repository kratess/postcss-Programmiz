const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

/* Write tests here */

/*it('basic', async () => {
  await run(
    '$a: 10px 20px; .a { padding: $a }',
    '.a { padding: 10px 20px }',
    { }
  )
})*/

/*it('for', async () => {
  await run(
    '$a: 4; @for $i from 0 to 2 { .asd { color: $i $i $a; }; .test { font-size: $i; } } \n.test {}',
    '',
    { }
  )
})*/

it('list', async () => {
  await run(
    '$sizes: list(1px, 2px);\n@each $size in $sizes { .a { font-size: $size; audio: $size; } }',
    '',
    { }
  )
})