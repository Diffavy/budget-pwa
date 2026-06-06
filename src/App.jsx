import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import styled, { css } from "styled-components";
import Auth from "./Auth";

const baseButtonStyle = css`
  all: unset;
  cursor: pointer;
  font-size: 2rem;
  padding: 15px;
  border-radius: 10px;
  margin: 10px;
`;

const IncomeButton = styled.button`
  ${baseButtonStyle}
  color: ${(props) => (props.$active ? "white" : "black")};
  background-color: ${(props) => (props.$active ? "green" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
`;

const ExpenseButton = styled.button`
  ${baseButtonStyle}
  color: ${(props) => (props.$active ? "white" : "black")};
  background-color: ${(props) => (props.$active ? "red" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
`;

const FlowTypeButton = styled.button`
  ${baseButtonStyle}
  display: inline-block;
  background-color: ${(props) => (props.$active ? "white" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: black;
`;

const CategoryButton = styled.button`
  ${baseButtonStyle}
  background-color: ${(props) => (props.$active ? "wheat" : "grey")};
  color: black;
  font-weight: ${(props) => (props.$active ? "normal" : "lighter")};
`;

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
    const { data, error } = await supabase // inserting an amount value to table
      .from("transactions")
      .insert([
        {
          user_id: session?.user?.id, // associate the entry with the current user's ID
          amount: parseFloat(amount),
          type: type,
          flow_type: flowType,
          category: category || (type === "income" ? "income" : "general"), // If category is empty and type is not "income", implies expense, so set category to "general"
        },
      ])
      .select(); // return the inserted row

    if (error) {
      console.log(error);
    } else if (data && data.length > 0) {
      alert("Sent to database!");
      const addedTransaction = data[0]; // Get the inserted transaction
      setTransactions((prev) => [addedTransaction, ...prev]); // Update state with the new transaction, no lag as we don't rerun useEffect script and update immediately
      setAmount("");
    }
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
          <IncomeButton
            type="button"
            $active={type === "income"}
            onClick={() => {
              setType("income");
              setFlowType(""); // Reset flow type when switching to income
              setCategory(""); // Reset category when switching to income
            }}
          >
            Income
          </IncomeButton>
          <ExpenseButton
            type="button"
            $active={type === "expense"}
            onClick={() => {
              setType("expense");
              setFlowType(flowTypes[0]); // Set default flow type to "daily" when switching to expense
              setCategory(""); // Reset category when switching to expense
            }}
          >
            Expense
          </ExpenseButton>
        </div>
        <div className="flowTypeSelector">
          {type === "expense" &&
            flowTypes.map((ft) => (
              <FlowTypeButton
                $active={flowType === ft}
                key={ft}
                type="button"
                onClick={() => {
                  setFlowType(ft);
                  setCategory(""); // Reset category when switching flow type
                }}
              >
                {ft}
              </FlowTypeButton>
            ))}
        </div>
        <div className="categoriesSelector">
          {currentCategory &&
            currentCategory.map((c) => (
              <CategoryButton
                $active={category === c}
                key={c}
                type="button"
                onClick={() => setCategory(c)}
              >
                {c}
              </CategoryButton>
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
