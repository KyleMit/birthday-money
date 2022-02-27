let amountEl = document.getElementById("amount")
let titleEl = document.getElementById("title")
let messageEl = document.getElementById("message")

document.querySelector(".add-1").addEventListener("click", (e) => {
  amountEl.value = 1 + Number(amountEl.value)
  e.preventDefault()
  updateGuess()
})

document.querySelector(".add-10").addEventListener("click", (e) => {
  amountEl.value = 10 + Number(amountEl.value)
  e.preventDefault()
  updateGuess()
})

document.querySelector(".add-100").addEventListener("click", (e) => {
  amountEl.value = 100 + Number(amountEl.value)
  e.preventDefault()
  updateGuess()
})

async function updateGuess() {
  let url = `/api/guess?amount=${amountEl.value}`
  let resp = await fetch(url)
  let result = await resp.json()

  if (!result.isValid) {
    document.body.classList.add("loser")
    titleEl.innerText = "Loser 😢"
    messageEl.innerText = `Greedy Greedy - The Limit Was ${result.limit}`
    disableButtons()
  }
}

document.getElementById("claim").addEventListener("click", claimReward)

async function claimReward(e) {
  e.preventDefault()

  let url = `/api/claim?amount=${amountEl.value}`
  let resp = await fetch(url)
  let result = await resp.json()

  if (result.isValid) {
    document.body.classList.add("winner")
    titleEl.innerText = `Winner!! 🎉`
    messageEl.innerText = `Yay, you won $${amountEl.value}, but you could've won $${result.limit}`


    disableButtons()

  }
}

function disableButtons() {
  document.querySelectorAll("button").forEach((btn) => {
      btn.disabled = true
    })
}
