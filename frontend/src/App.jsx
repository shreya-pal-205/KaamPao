import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Signup from './components/auth/Signup.jsx'
import Home from './components/home/Home.jsx'
import Jobs from './components/job/Jobs.jsx'
import Browse from './components/job/Browse.jsx'
import Profile from './components/profile/Profile.jsx'
import JobDescription from './components/job/JobDescription.jsx'
import Companies from './components/admin/Companies.jsx'
import CompanyCreate from './components/admin/CompanyCreate.jsx'
import CompanySetup from './components/admin/CompanySetup.jsx'
import AdminJobs from './components/admin/AdminJobs.jsx'
import PostJob from './components/admin/PostJob.jsx'
import Applicants from './components/admin/Applicants.jsx'
import JobSuggestion from './components/extra/JobSuggestion.jsx'
import Motivation from './components/extra/Motivation.jsx'
import ContractReader from './components/extra/ContractReader.jsx'
import Earning from './components/extra/Earning.jsx'
import Resume from './components/extra/Resume.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'






const appRouter = createBrowserRouter([
  //Worker part...
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },{
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },{
    path: '/profile',
    element: <Profile />
  },

  //Recruiter part...
  {
    path: '/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },{
    path: '/admin/companies/create',
    element:<ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },{
    path: '/admin/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: '/admin/jobs',
    element:<ProtectedRoute><AdminJobs /></ProtectedRoute> 
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },{
    path: '/admin/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },



  //Extra...
  {
    path: '/jobsuggestion',
    element: <JobSuggestion />
  },
  {
    path: '/motivation',
    element: <Motivation />
  },
  {
    path: '/contractreader',
    element: <ContractReader />
  },
  {
    path: '/earning',
    element: <Earning />
  },
  {
    path: '/resume',
    element: <Resume />
  }
])


function App() {

  return (
    <>
      <RouterProvider router = {appRouter} />
    </>
  )
}

export default App
