import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import "./App.css";

function App() {
  const FLIGHTS = gql`
    query {
      flights {
        id
        name
      }
    }
  `;
  const TICKETS = gql`
    query tickets($flightID: ID!) {
      tickets(flightID: $flightID) {
        id
        name
        price
      }
    }
  `;

  const NEW_FLIGHT = gql`
    mutation newFlight($name: String!) {
      newFlight(name: $name) {
        id
        name
      }
    }
  `;

  const NEW_TICKET = gql`
    mutation newTicket($name: String! $price: String! $flightID: ID!) {
      newTicket(name: $name price: $price flightID: $flightID) {
        id
        name
        price
      }
    }
  `;



  const [flightID, setFlightID] = useState("");
  const { data, error } = useQuery(FLIGHTS);
  const { data: ticketsData } = useQuery(TICKETS, {
    variables: { flightID },
  });

  const [ newFlight ] = useMutation(NEW_FLIGHT, {
    update: (cache, data) => {
    }
  });

  const [ newTicket ] = useMutation(NEW_TICKET, {
    update: (cache, data) => {
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const { select_flight, ticket_name, ticket_price } = e.target.elements
    newTicket({
      variables: {
        name: ticket_name.value,
        price: ticket_price.value,
        flightID: select_flight.value
      }
    })
  }

  const handleSubmitFlight = (e) => {
    e.preventDefault()

    const { new_flight } = e.target.elements
    newFlight({
      variables: {
        name: new_flight.value
      }
    })
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <select name="select_flight">
          <option hidden={true}>
            Choose
          </option>
          {data &&
            data.flights.map((e, i) => (
              <option key={i} value={e.id}>
                {e.name}
              </option>
            ))}
        </select>
        <input
          name="ticket_name"
          type="text"
          placeholder="region"
          autoComplete="off"
        />
         <input
          name="ticket_price"
          type="text"
          placeholder="price"
          autoComplete="off"
        />
        <button type="submit">send</button>
      </form>


      <form onSubmit={handleSubmitFlight}>
              <input type="text" name="new_flight"placeholder="write new flight..." />
              <button type="submit">send</button>
      </form>

      <div>
        {error && <>flightError</>}

        {data &&
          data.flights.map((e, i) => (
            <h3 onClick={() => setFlightID(e.id)} key={i}>
              {e.name}
            </h3>
          ))}

        <ul>
          {ticketsData &&
            ticketsData.tickets.map((e, i) => (
              <li key={i}>
                <h4>{e.name}</h4>
                <p>{e.price}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
