
import Login from './LoginPage'
import Register from './RegisterPage'
import Expenses from './ExpensesPage'
import AddExpense from './AddExpensePage'
import Landing from './LandingPage' 
import Friends from './FriendsPage'
import Groups from './GroupsPage'
import GroupDetails from './GroupDetailsPage'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import MainPage from './MainPage'
import HomePage from './HomePage'
import { AuthProvider } from './AuthContext';


function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<MainPage/>}>
            <Route index element={<HomePage/>} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="addexpense" element={<AddExpense/>} />
            <Route path="friends" element={<Friends />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:groupId" element={<GroupDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
