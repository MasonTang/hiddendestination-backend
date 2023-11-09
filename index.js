const express = require('express')
require('./src/db/mongoose')
const userRouter = require('./src/routers/user')
const cityRouter = require('./src/routers/city')
const blogRouter = require('./src/routers/blog')
const app = express()
const port = process.env.PORT
const cors = require('cors')

//enable app.cors
const corsOption={
  origin:"https://hiddendestination.netlify.app"
}

app.use(express.json())
app.use(cors(corsOption))
app.use(userRouter)
app.use(cityRouter)
app.use(blogRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})