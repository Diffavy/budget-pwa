import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

function App() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [flowType, setFlowType] = useState("");
  const [category, setCategory] = useState("");
  const [session, setSession] = useState(null);
  const [transactions, setTransactions] = useState([]); //to hold exisiting transactions for a given user

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session?.user?.id); // pulls data only relevant to current user

      if (error) {
        console.error("Error occured whilst fetching data", error.message);
      } else if (data) {
        setTransactions(data);
      }
    };

    if (session?.user?.id) {
      fetchTransactions();
    }
  }, [session]);

  useEffect(() => {
    //detemines if there is an existing session, updates session to object with user data if
    //it exists on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    //checks in real time for changes in the auth process - watchdog
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // ensures no memory leals from the watchdog continuously running in the background
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase // inserting an amount value to table
      .from("transactions")
      .insert([
        {
          user_id: session?.user?.id, // associate the entry with the current user's ID
          amount: parseFloat(amount),
          type: type,
          flow_type: flowType,
          category: category || (type === "income" ? "income" : "general"), // If category is empty and type is not "income", implies expense, so set category to "general"
        },
      ]);

    if (error) {
      console.log(error);
    } else {
      alert("Sent to database!");
      setAmount("");
    }
  };

  const baseButtonStyle = {
    all: "unset",
    cursor: "pointer",
    fontSize: "2rem",
    padding: "15px",
    borderRadius: "10px",
    margin: "10px",
  };

  const flowTypes = ["daily", "subscription", "one-off"];

  const categories = {
    daily: ["food", "transportation", "entertainment"],
    subscription: ["netflix", "gym", "spotify"],
    "one-off": ["electronics", "furniture", "clothing"],
  };

  const currentCategory = flowType ? categories[flowType] : [];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <button
            type="button"
            onClick={() => {
              setType("income");
              setFlowType(""); // Reset flow type when switching to income
              setCategory(""); // Reset category when switching to income
            }}
            style={{
              ...baseButtonStyle,
              color: type === "income" ? "white" : "black",
              backgroundColor: type === "income" ? "green" : "grey",
              fontWeight: type === "income" ? "bold" : "normal",
            }}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => {
              setType("expense");
              setFlowType(flowTypes[0]); // Set default flow type to "daily" when switching to expense
              setCategory(""); // Reset category when switching to expense
            }}
            style={{
              ...baseButtonStyle,
              color: type === "expense" ? "white" : "black",
              backgroundColor: type === "expense" ? "red" : "grey",
              fontWeight: type === "expense" ? "bold" : "normal",
            }}
          >
            Expense
          </button>
        </div>
        <div className="flowTypeSelector">
          {type === "expense" &&
            flowTypes.map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => {
                  setFlowType(ft);
                  setCategory(""); // Reset category when switching flow type
                }}
                style={{
                  ...baseButtonStyle,
                  display: "inline-block",
                  backgroundColor: flowType === ft ? "white" : "grey",
                  fontWeight: flowType === ft ? "bold" : "normal",
                  color: "black",
                }}
              >
                {ft}
              </button>
            ))}
        </div>
        <div className="categoriesSelector">
          {currentCategory &&
            currentCategory.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                style={{
                  ...baseButtonStyle,
                  backgroundColor: category === c ? "wheat" : "grey",
                  color: "black",
                  fontWeight: category === c ? "normal" : "lighter",
                }}
              >
                {c}
              </button>
            ))}
        </div>
        <input
          type="text"
          value={amount}
          placeholder="Enter a number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
