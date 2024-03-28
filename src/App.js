import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Panel from './components/Panel'
import NewListing from './pages/NewListing'
import Listings from './pages/Listings'
import Companies from './pages/Companies'
import Skills from './pages/Skills'
import NewCompany from './pages/NewCompany'
import Company from './pages/Company'
import Listing from './pages/Listing'
import NotFound from './pages/NotFound'
import Notes from './pages/Notes'
import About from './pages/About'

function App() {
    return (
        <>
            <Router>
                <Panel />
                <Routes>
                    <Route exact path='/' element={<Dashboard />} />
                    <Route path='/listings' element={<Listings />} />
                    <Route
                        path='/listings/filter/:type'
                        element={<Listings />}
                    />
                    <Route path='/listing/:listingId' element={<Listing />} />
                    <Route
                        path='/listing/edit/:listingId'
                        element={<NewListing />}
                    />
                    <Route path='/newListing' element={<NewListing />} />
                    <Route path='/companies' element={<Companies />} />
                    <Route path='/company/:companyId' element={<Company />} />
                    <Route
                        path='/company/edit/:companyId'
                        element={<NewCompany />}
                    />
                    <Route path='/newCompany' element={<NewCompany />} />
                    <Route path='/skills' element={<Skills />} />
                    <Route path='/notes' element={<Notes />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/notFound' element={<NotFound />} />
                </Routes>
            </Router>
            <ToastContainer
                position='top-right'
                autoClose={false}
                hideProgressBar={true}
                transition={Slide}
                draggable
                draggablePercent={60}
            />
        </>
    )
}

export default App
