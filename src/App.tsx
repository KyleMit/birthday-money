import { useEffect, useState } from "react";


function App() {

  const [rounds, setRounds] = useState<IActivityData[]>([])
  const sortedRounds = rounds.sort((a,b) => b.round - a.round)
  const latestRound = sortedRounds?.[0]
  const latestRoundNumber = latestRound?.round || 1
  const latestRoundTotal = latestRound?.total || 0

  const refreshRounds = async () => {
    const resp = await fetch("/api/get")
    const data = await resp.json();
    setRounds(data)
  }

  useEffect(()=> {
    refreshRounds()
  }, [] ) // fire once

  const makeSafeChoice = () => makeRoundChoice("safe")
  const makeRiskyChoice = () => makeRoundChoice("risky")

  const makeRoundChoice = async (choice: string) => {
    const resp = await fetch(`/api/choose?choice=${choice}`)
    const data = await resp.json();
    setRounds(data)
  }

  return (
    <div className="App">
      <main>
        <h1 id="title">Birthday Money</h1>
        <h2>Round: {latestRoundNumber} / 22</h2>
        <form action="">
          <button onClick={makeSafeChoice}>$5</button>
          <button onClick={makeRiskyChoice}>??</button>
        </form>
        <h2>Total: ${latestRoundTotal}</h2>
        {Boolean(sortedRounds.length) && <table>
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
        </table>}
      </main>
    </div>
  );
}

export default App;


export interface IActivityData {
  choice: string; // safe | risk
  total: number;
  round: number;
}
