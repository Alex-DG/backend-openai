const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const openai = require('openai')
const port = process.env.PORT || 3001

/**
 * OpenAPI
 */
const { Configuration, OpenAIApi } = openai
const configuration = new Configuration({
  apiKey: process.env.VERCEL_OPEN_API_KEY,
})

const openaiApi = new OpenAIApi(configuration)

const generateImage = async () => {
  const result = await openaiApi.createImage({
    prompt: 'Mona Lisa',
    n: 1,
    size: '256x256',
  })

  return result.data.data
}

/**
 * Middlewares
 */
app.use(express.static('public'))
app.use(cors())

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.get('/api/bonjour/:json?', (req, res) => {
  const name = req.query.name || ''
  const message = `Bonjour 👋 ${name}`

  if (req.params.json) return res.json({ message })

  return res.send(message)
})

app.get('/api/bonjour/:text', async (req, res) => {
  const text = req.params.text
  const data = await generateImage(text)
  return res.json(data)
})

app.listen(port, () => {
  console.log('============================')

  console.log(`Server started ✨`)
  console.log(`local: http://localhost:${port}`)

  console.log('============================')
})

module.exports = app
