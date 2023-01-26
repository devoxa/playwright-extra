import express from 'express'
import path from 'path'

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'static')))

app.get('/api/fast', (_, response) => {
  response.json({ foo: 'bar' })
})

app.get('/api/slow', (_, response) => {
  setTimeout(() => {
    response.json({ foo: 'bar' })
  }, 1000)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
