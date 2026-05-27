import { useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase // inserting an amount value to table
      .from("test_budget")
      .insert([{ amount: parseFloat(amount) }]);

    if (error) {
      console.log(error);
    } else {
      alert("Sent to database!");
      setAmount("");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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
