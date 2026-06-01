import { useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [flowType, setFlowType] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase // inserting an amount value to table
      .from("test_budget")
      .insert([
        {
          amount: parseFloat(amount),
          type: type,
          flow_type: flowType,
          category: category || type === "income" ? "income" : "general", // If category is empty and type is not "income", implies expense, so set category to "general"
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <button
            type="button"
            onClick={() => setType("income")}
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
            onClick={() => setType("expense")}
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
                onClick={() => setFlowType(ft)}
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
