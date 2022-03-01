import { useEffect, useState } from "react";

const MAX_ROUNDS = 22;

function App() {
  const [rounds, setRounds] = useState<IActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const sortedRounds = rounds.sort((a,b) => b.round - a.round)
  const latestRound = sortedRounds?.[0]
  const latestRoundNumber = latestRound?.round || 1
  const latestRoundTotal = latestRound?.total || 0

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

  const gameFinished = sortedRounds.length > MAX_ROUNDS
  // const hasRecords = sortedRounds.length > 0

  return (
    <div className="App">
      <main>
        <h1 id="title">Birthday Money 🎂💸</h1>

        {!isLoading && (
          <>
          {!gameFinished && (
            <>
              <h2>Choose Wisely ({latestRoundNumber} / 22)</h2>
              <div>
                <button className="button" onClick={makeSafeChoice}>$5</button>
                <button className="button" onClick={makeRiskyChoice}>??</button>
              </div>
            </>
          )}
          <h2 className="total">
            {!gameFinished && Boolean(latestRound?.delta) && (
              <div className={"delta " + (latestRound?.delta >= 0 ? "winner" : "loser") } >
                    {latestRound?.delta >= 0 ? " +" : "" }
                    {latestRound?.delta}
              </div>
            )}
            {!gameFinished ? "Total:" : "You Won"}
            <span className={latestRoundTotal >= 0 ? "winner" : "loser" } >{" $"}{latestRoundTotal}</span>

          </h2>

          </>
        )}

        {/* {hasRecords && (
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Delta</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedRounds.map(round => <tr>
                <td>{round.round}</td>
                <td>{round.choice}</td>
                <td>{round.total}</td>
              </tr>)}
            </tbody>
          </table>
        )} */}
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
