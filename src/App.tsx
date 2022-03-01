import { useEffect, useState } from "react";

const MAX_ROUNDS = 22;

function App() {
  const [rounds, setRounds] = useState<IActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const sortedRounds = rounds.sort((a,b) => b.round - a.round)
  const latestRound = sortedRounds?.[0]
  const latestRoundNumber = latestRound?.round || 0
  const latestRoundTotal = latestRound?.total || 0
  const curRound = latestRoundNumber + 1
  const gameFinished = curRound > MAX_ROUNDS
  const gameStarted = curRound > 1
  const gameUnderway = gameStarted && !gameFinished

  const deltaDisplay = (latestRound?.delta > 0 ? "+" : "") + latestRound?.delta

  const refreshRounds = async () => {
    const resp = await fetch("/api/get")
    const data = await resp.json();
    setRounds(data)
    setIsLoading(false)
  }

  useEffect(()=> {
    refreshRounds()
  }, [] ) // fire once

  const makeSafeChoice = () => makeRoundChoice("safe")
  const makeRiskyChoice = () => makeRoundChoice("risky")

  const makeRoundChoice = async (choice: string) => {
    const resp = await fetch(`/api/choose?choice=${choice}`)
    const data = await resp.json();
    console.log(data)
    setRounds(data)
  }


  return (
    <div className="App">
      <main>
        <h1 id="title">Birthday Money <span>🎂💸</span></h1>

        {!isLoading && (
          <>
          {!gameFinished && (
            <>
              <h2>Choose Wisely <span>({curRound}/22)</span></h2>
              <div>
                <button className="button" onClick={makeSafeChoice}>$5</button>
                <button className="button" onClick={makeRiskyChoice}>??</button>
              </div>
            </>
          )}
          <h2 className="total">
              <div className={"delta " + (latestRound?.delta >= 0 ? "winner" : "loser") } >
                {gameUnderway ? deltaDisplay : <>&nbsp;</>}
              </div>
            {!gameFinished ? "Total:" : "You Won"}
            <span className={latestRoundTotal >= 0 ? "winner" : "loser" } >{" $"}{latestRoundTotal}</span>

          </h2>

          </>
        )}


      </main>
    </div>
  );
}

export default App;


export interface IActivityData {
  choice: string; // safe | risk
  delta: number;
  total: number;
  round: number;
}
