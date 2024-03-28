import { configureStore } from '@reduxjs/toolkit'
import listingsReducer from '../features/listings/listingSlice'
import companiesReducer from '../features/companies/companySlice'
import skillsReducer from '../features/skills/skillsSlice'
import notesReducer from '../features/notes/noteSlice'

export const store = configureStore({
    reducer: {
        listings: listingsReducer,
        companies: companiesReducer,
        skills: skillsReducer,
        notes: notesReducer,
    },
})
