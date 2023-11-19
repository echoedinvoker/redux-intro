import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false
}


const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload
      state.isLoading = false
    },
    withdraw(state, action) {
      state.balance -= action.payload
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: {
            amount,
            purpose
          }
        }
      },
      reducer(state, action) {
        if (state.loan > 0) return
        state.balance += action.payload.amount
        state.loan = action.payload.amount
        state.loanPurpose = action.payload.purpose
      }
    },
    payLoan(state, action) {
      state.balance -= state.loan
      state.loan = 0
      state.loanPurpose = ""
    },
    counvertingCurrency(state, action) {
      state.isLoading = true
    }
  }
})

export const { withdraw, requestLoan, payLoan, counvertingCurrency } = accountSlice.actions

export function deposit(amount, currency) {
  if (currency === 'USD') return { type: "account/deposit", payload: amount }

  return async function(dispatch, getState) {
    // API call
    dispatch({ type: "account/counvertingCurrency" })
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
    const { rates: { USD } } = await res.json()

    // dispatch action
    dispatch({ type: "account/deposit", payload: USD })
  }
}

export default accountSlice.reducer












































/*
export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false }
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload }
    case "account/requestLoan":
      if (state.loan > 0) return state
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose
      }
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan
      }
    case "account/counvertingCurrency":
      return { ...state, isLoading: true }
    default:
      return state
  }
}

export function deposit(amount, currency) {
  if (currency === 'USD') return { type: "account/deposit", payload: amount }

  return async function(dispatch, getState) {
    // API call
    dispatch({ type: "account/counvertingCurrency" })
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`)
    const { rates: { USD } } = await res.json()

    // dispatch action
    dispatch({ type: "account/deposit", payload: USD })
  }
}
export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount }
}
export function requestLoan(amount, purpose) {
  return { type: "account/requestLoan", payload: { amount: amount, purpose: purpose } }
}
export function payLoan() {
  return { type: "account/payLoan" }
}
*/
