import express from 'express'
import authMiddleware from './middleware/authMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import path,{dirname} from 'path'
import {fileURLToPath} from 'url'
import cookieParser from 'cookie-parser';
import multer from 'multer'

const app = express()
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(cookieParser())

app.use('/auth',authRoutes)
app.use('/api/expense',authMiddleware,expenseRoutes)
app.use('/api/upload',upload.single('avatar'),authMiddleware,uploadRoutes)

app.use(express.static(path.join(__dirname, '../../client/vite-project/dist')))


app.get('/expenses', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/home/expenses', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/home/addexpense', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/vite-project/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})