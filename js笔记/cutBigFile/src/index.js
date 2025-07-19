import cutFile from './cutFile.js'

const inputFile = document.querySelector('input[type=file]')

inputFile.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  console.time('切片')
  const chunks = await cutFile(file)
  console.timeEnd('切片')
  console.log('>>>>> file: index.js ~ method:  <<<<<\n', chunks)
})

