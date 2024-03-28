import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deleteById, getNextId } from '../global/globalService'

const initialState = {
    listings: [],
    listingsCount: 0,
    listing: {},
    dashboard: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

function getWeekStart() {
    let todayDate = new Date()
    let today = todayDate.setHours(0, 0, 0, 0)
    let wkDay = todayDate.getDay()
    let subtract = today - wkDay * 24 * 60 * 60 * 1000
    return new Date(subtract)
}

function getSevenDays() {
    let todayDate = new Date()
    let today = todayDate.setHours(0, 0, 0, 0)
    let addTime = today + 7 * 24 * 60 * 60 * 1000
    return new Date(addTime)
}

function sortArrByCount(arr, dir = 'asc') {
    if (!arr) return
    if (dir === 'asc') {
        return arr.sort((a, b) => a.count - b.count)
    } else {
        return arr.sort((a, b) => b.count - a.count)
    }
}

function sortArrByDate(arr, dateField, dir = 'asc') {
    if (!arr) return
    if (dir === 'asc') {
        return arr.sort((a, b) => a[dateField] - b[dateField])
    } else {
        return arr.sort((a, b) => b[dateField] - a[dateField])
    }
}

function limitArr(arr, limit) {
    if (!arr) return
    return arr.length > limit ? arr.slice(0, limit) : arr
}

function populateCompany(companyID) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    let getCompany = companies.filter((item) => {
        return item.id === +companyID
    })

    return getCompany[0]
}

//  Create new listing
export const createListing = createAsyncThunk(
    'listings/create',
    async (listingData, thunkAPI) => {
        try {
            let storeListings = localStorage.getItem('listings')
            let allListings = storeListings ? JSON.parse(storeListings) : []
            let listing = {
                ...listingData,
                id: getNextId(allListings),
                isApplied: false,
                isClosed: false,
                isArchived: false,
                response: '',
                notes: {},
                responseDate: '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            delete listing['']
            let storeData = JSON.stringify([...allListings, listing])
            localStorage.setItem('listings', storeData)
            return listing
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

export const getDashboard = createAsyncThunk(
    'listings/dash',
    async (_, thunkAPI) => {
        try {
            let wkStart = getWeekStart()
            let wkEnd = getSevenDays()
            let today = new Date()
            today = today.setHours(0, 0, 0, 0)
            let storeListings = localStorage.getItem('listings')
            let listings = storeListings ? JSON.parse(storeListings) : []

            let appliedWeek = listings.filter((item) => {
                return item.isApplied && item.dateApplied > wkStart
            })
            let appliedTotal = listings.filter((item) => {
                return item.isApplied
            })
            let pending = listings.filter((item) => {
                return item.isApplied && item.response === ''
            })
            let review = listings.filter((item) => {
                return !item.isApplied && !item.isClosed && !item.isArchived
            })
            let open = listings.filter((item) => {
                return !item.isClosed
            })
            let closing = listings.filter((item) => {
                return item.closingDate > today && item.closingDate < wkEnd
            })

            let getAllSkills = localStorage.getItem('skills')
            let skills = getAllSkills ? JSON.parse(getAllSkills) : []
            let skillsArr = []

            for (let skill of skills) {
                let hasSkill = listings.filter((item) => {
                    return item.skills.includes(skill.id)
                })
                if (hasSkill.length > 0) {
                    skillsArr.push({
                        title: skill.name,
                        id: skill.id,
                        count: hasSkill.length,
                    })
                }
            }
            let sortedSkills = sortArrByCount(skillsArr, 'desc')

            return {
                appliedWeek: appliedWeek.length,
                appliedTotal: appliedTotal.length,
                pending: pending.length,
                review: review.length,
                closingList: limitArr(closing, 10),
                openList: limitArr(open, 10),
                appliedList: limitArr(appliedTotal, 10),
                skills: limitArr(sortedSkills, 10),
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

//  Update listing
export const updateListing = createAsyncThunk(
    'listings/update',
    async ({ listingId, listingData }, thunkAPI) => {
        try {
            let storeListings = JSON.parse(localStorage.getItem('listings'))
            let i = storeListings.findIndex((obj) => {
                return obj.id === +listingId
            })

            storeListings[i] = {
                ...listingData,
                updatedAt: Date.now(),
            }

            localStorage.setItem('listings', JSON.stringify(storeListings))
            return {
                ...storeListings[i],
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

//  Get Listings
export const getListings = createAsyncThunk(
    'listings/getAll',
    async (_, thunkAPI) => {
        try {
            let storeListings = localStorage.getItem('listings')
            storeListings = storeListings ? JSON.parse(storeListings) : []
            let listings = []
            storeListings.forEach((item) => {
                listings.push({
                    ...item,
                    company: populateCompany(item.companyID),
                })
            })
            return listings
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

//  Filter Listings
export const filterListings = createAsyncThunk(
    'listings/filter',
    async (filterType, thunkAPI) => {
        try {
            let storeListings = localStorage.getItem('listings')
            let allListings = storeListings ? JSON.parse(storeListings) : []
            let wkStart = getWeekStart()
            let listings

            switch (filterType) {
                case 'appliedWeek':
                    listings = allListings.filter((item) => {
                        return item.isApplied && item.dateApplied > wkStart
                    })
                    break
                case 'applied':
                    listings = allListings.filter((item) => {
                        return item.isApplied
                    })
                    break
                case 'pending':
                    listings = allListings.filter((item) => {
                        return (
                            item.isApplied &&
                            item.response === '' &&
                            !item.isArchived
                        )
                    })
                    break
                case 'review':
                    listings = allListings.filter((item) => {
                        return (
                            !item.isApplied &&
                            !item.isClosed &&
                            !item.isArchived
                        )
                    })
                    break
                case 'open':
                    listings = allListings.filter((item) => {
                        return !item.isClosed && !item.isArchived
                    })
                    break
                case 'archived':
                    listings = allListings.filter((item) => {
                        return item.isArchived
                    })
                    break
                case 'closed':
                    listings = allListings.filter((item) => {
                        return item.isClosed
                    })
                    break
                default:
                    listings = allListings
                    break
            }

            for (let i = 0; i < listings.length; i++) {
                listings[i] = {
                    ...listings[i],
                    company: populateCompany(+listings[i].companyID)
                }
            }
            return listings
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

export const skillListings = createAsyncThunk(
    'listings/skills',
    async (skillId, thunkAPI) => {
        try {
            let storeListings = JSON.parse(localStorage.getItem('listings'))
            let findListings = storeListings.filter((item) => {
                return item.skills.includes(+skillId)
            })
            let listings = []
            findListings.forEach((item) => {
                listings.push({
                    ...item,
                    company: populateCompany(item.companyID),
                })
            })
            return listings
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

//  Get Listing
export const getListing = createAsyncThunk(
    'listings/get',
    async (listingId, thunkAPI) => {
        try {
            let storeListings = JSON.parse(localStorage.getItem('listings'))
            let storeListing = storeListings.filter((item) => {
                return item.id === +listingId
            })[0]
            let storeSkills = JSON.parse(localStorage.getItem('skills'))
            let fixSkills = []

            let skillsList = []
            storeListing.skills.forEach((i) => {
                if (!fixSkills.includes(i)) {
                    fixSkills.push(i)
                    let skillItem = storeSkills.filter((item) => {
                        return item.id === i
                    })
                    if (skillItem.length > 0) {
                        skillsList.push(skillItem[0])
                    }
                }
            })
            let listing = {
                ...storeListing,
                company: populateCompany(storeListing.companyID),
                skillsList: skillsList,
                skills: fixSkills,
            }

            return listing
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

//  Delete Listing
export const deleteListing = createAsyncThunk(
    'listings/delete',
    async (listingId, thunkAPI) => {
        try {
            let allListings = JSON.parse(localStorage.getItem('listings'))
            let i = allListings.findIndex((obj) => {
                return obj.id === +listingId
            })
            let newListings = deleteById(allListings, i)
            localStorage.setItem('listings', JSON.stringify(newListings))
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

export const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createListing.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createListing.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createListing.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getListings.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getListings.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.listings = action.payload
            })
            .addCase(getListings.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getListing.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getListing.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.listing = action.payload
            })
            .addCase(getListing.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getDashboard.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.dashboard = action.payload
            })
            .addCase(filterListings.pending, (state) => {
                state.isLoading = true
            })
            .addCase(filterListings.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.listings = action.payload
            })
            .addCase(filterListings.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(skillListings.pending, (state) => {
                state.isLoading = true
            })
            .addCase(skillListings.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.listings = action.payload
            })
            .addCase(skillListings.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export let { reset } = listingSlice.actions
export default listingSlice.reducer
