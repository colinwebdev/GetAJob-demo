import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNextId, deleteById } from '../global/globalService'

const initialState = {
    companies: [],
    company: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

//  Create new company
export const createCompany = createAsyncThunk(
    'companies/create',
    async (companyData, thunkAPI) => {
        try {
            let storeCompanies = localStorage.getItem('companies')
            let allCompanies = storeCompanies ? JSON.parse(storeCompanies) : []
            let company = {
                ...companyData,
                id: getNextId(allCompanies),
                isValid: true,
                notes:
                    companyData.notes === ''
                        ? {}
                        : {
                              [Date.now()]: companyData.notes,
                          },

                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            let storeData = JSON.stringify([...allCompanies, company])
            localStorage.setItem('companies', storeData)
            return 'Success'
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

//  Get Companies
export const getCompanies = createAsyncThunk(
    'companies/getAll',
    async (_, thunkAPI) => {
        try {
            let storeCompanies = JSON.parse(localStorage.getItem('companies'))
            return storeCompanies ? storeCompanies : []
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

//  search Companies
export const searchCompanies = createAsyncThunk(
    'companies/search',
    async ({ field, text }, thunkAPI) => {
        try {
            if (text) {
                let storeCompanies = JSON.parse(
                    localStorage.getItem('companies')
                )
                let companies = storeCompanies.filter((item) => {
                    return item[field].includes(text)
                })
                return companies
            } else {
                return null
            }
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

//  Get Company
export const getCompany = createAsyncThunk(
    'companies/get',
    async (companyId, thunkAPI) => {
        try {
            let storeCompanies = JSON.parse(localStorage.getItem('companies'))

            let storeCompany = storeCompanies.filter((item) => {
                return item.id === +companyId
            })
            let company = {
                ...storeCompany[0],
                listings: [],
            }

            return company
        } catch (error) {
            
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Update company
export const updateCompany = createAsyncThunk(
    'companies/update',
    async ({ companyId, companyData }, thunkAPI) => {
        
        try {
            let storeCompanies = JSON.parse(localStorage.getItem('companies'))

            let i = storeCompanies.findIndex((obj) => {
                return obj.id === +companyId
            })
            storeCompanies[i] = {
                ...companyData,
            }
            localStorage.setItem('companies', JSON.stringify(storeCompanies))
            return 'success'
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

//  Delete Company
export const deleteCompany = createAsyncThunk(
    'companies/delete',
    async (companyId, thunkAPI) => {
        try {
            let storeCompanies = JSON.parse(localStorage.getItem('companies'))

            let newCompanies = deleteById(storeCompanies, companyId)
            localStorage.setItem('companies', JSON.stringify(newCompanies))
            return 'success'
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        reset: (state) => initialState,
        clearCompanies: (state) => ({
            ...state,
            companies: [],
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCompany.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createCompany.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getCompanies.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.companies = action.payload
            })
            .addCase(getCompanies.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getCompany.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCompany.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.company = action.payload
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteCompany.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.company = []
            })
            .addCase(deleteCompany.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(searchCompanies.pending, (state) => {
                state.isLoading = true
            })
            .addCase(searchCompanies.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.companies = action.payload
            })
            .addCase(searchCompanies.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export let { reset, clearCompanies } = companySlice.actions
export default companySlice.reducer
