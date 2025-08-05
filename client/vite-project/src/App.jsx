
import Login from './LoginPage'
import Register from './RegisterPage'
import Expenses from './ExpensesPage'
import AddExpense from './AddExpensePage'
import Friends from './FriendsPage'
import Groups from './GroupsPage'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import MainPage from './MainPage'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<MainPage/>}>
        <Route index element={<Navigate to="/home/expenses" />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="addexpense" element={<AddExpense/>} />
        <Route path="friends" element={<Friends />} />
        <Route path="groups" element={<Groups />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
