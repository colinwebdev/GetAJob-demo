import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNextId, deleteById } from '../global/globalService'

const initialState = {
    skillsList: [],
    skill: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}
//  Create new skill
export const createSkill = createAsyncThunk(
    'skills/create',
    async (skillData, thunkAPI) => {
        try {
            let storeSkills = localStorage.getItem('skills')
            let allSkills = storeSkills ? JSON.parse(storeSkills) : []
            let skill = {
                ...skillData,
                id: getNextId(allSkills),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            localStorage.setItem(
                'skills',
                JSON.stringify([...allSkills, skill])
            )
            return skill
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

//  Get Skills
export const getSkills = createAsyncThunk(
    'skills/getAll',
    async (_, thunkAPI) => {
        try {
            let storeSkills = JSON.parse(localStorage.getItem('skills'))
            let allListings = JSON.parse(localStorage.getItem('listings'))
            let allSkills = []
            storeSkills.forEach((item)=>{
                let listings = allListings.filter((listing)=>{
                    return +item.id === +listing.id
                })
                allSkills.push({
                    ...item,
                    count: listings.length
                })
            })
            return allSkills ? allSkills : []
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

//  Delete Skill
export const deleteSkill = createAsyncThunk(
    'skills/delete',
    async (skillId, thunkAPI) => {
        try {
            let storeSkills = JSON.parse(localStorage.getItem('skills'))
            
            let skills = deleteById(storeSkills, skillId)
            
            localStorage.setItem('skills', JSON.stringify(skills))
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

//  search Skills
export const searchSkills = createAsyncThunk(
    'skills/search',
    async ({ field, text }, thunkAPI) => {
        try {
            
            if (text) {
                let storeSkills = JSON.parse(localStorage.getItem('skills'))
                return storeSkills.filter((item)=>{
                    return item[field].includes(text)
                })

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

export const checkSkills = createAsyncThunk(
    'skills/find',
    async ({field, text}, thunkAPI) => {
        try {
            if (text) {
                let storeSkills = JSON.parse(localStorage.getItem('skills'))
                if (!storeSkills) return []
                let filtered = storeSkills.filter((item)=>{
                    return item[field].toLowerCase() === text.toLowerCase()
                })
                return filtered
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

//  Get Skill
export const getSkill = createAsyncThunk(
    'skills/get',
    async (skillId, thunkAPI) => {
        try {
            let storeSkills = JSON.parse(localStorage.getItem('skills'))
            let skill = storeSkills.filter((item)=>{
                return item.id === +skillId
            })[0]
            if (skill) return skill
            return
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

// Update skill
export const updateSkill = createAsyncThunk(
    'skills/update',
    async ({ skillId, skillData }, thunkAPI) => {
        try {
            let storeSkills = JSON.parse(localStorage.getItem('skills'))
            let i = storeSkills.findIndex((obj)=>{
                return obj.id === +skillId
            })
            storeSkills[i] = {
                ...skillData,
                updatedAt: Date.now()
            }
            localStorage.setItem('skills', JSON.stringify(storeSkills))
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

export const skillSlice = createSlice({
    name: 'skill',
    initialState,
    reducers: {
        reset: (state) => initialState,
        clearSkills: (state) => ({
            ...state,
            skillsList: [],
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSkill.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createSkill.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getSkills.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getSkills.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.skillsList = action.payload
            })
            .addCase(getSkills.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getSkill.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getSkill.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.skill = action.payload
            })
            .addCase(getSkill.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(searchSkills.pending, (state) => {
                state.isLoading = true
            })
            .addCase(searchSkills.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.skillsList = action.payload
            })
            .addCase(searchSkills.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export let { reset } = skillSlice.actions
export default skillSlice.reducer
