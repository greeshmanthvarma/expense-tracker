
import Login from './LoginPage'
import Register from './RegisterPage'
import Expenses from './ExpensesPage'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={ <Register />} />
      <Route path="/expenses" element={ <Expenses /> } />
    </Routes>
    </BrowserRouter>
  )
}

export default App
