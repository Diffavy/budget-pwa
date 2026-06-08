import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import styled, { css } from "styled-components";
import Auth from "./Auth";

const baseButtonStyle = css`
  all: unset;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  margin: 0px;
`;

const LedgerWrapper = styled.div`
  width: 100vw;
  text-align: center;
  background-color: rgb(221, 221, 221);
`;

const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px rgb(198, 197, 197);
  padding: 10px;
  color: rgb(50, 50, 50);
`;

const RowHeader = styled.h2`
  color: rgb(50, 50, 50);
  font-weight: 600;
`;

const TransactionAmount = styled.span`
  font-size: 1.2rem;
  font-weight: 400;
  color: ${(props) => (props.$type === "income" ? "green" : "red")};
`;
const TransactionForm = styled.form`
  width: 100vw;
  text-align: center;
  background-color: rgb(221, 221, 221);
`;
const IncomeExpenseWrapper = styled.div`
  text-align: center;
  margin-bottom: 10px;
  margin-top: 20px;
`;
const IncomeButton = styled.button`
  ${baseButtonStyle}
  border-radius: 5px 0 0 5px;
  color: ${(props) => (props.$active ? "white" : "black")};
  background-color: ${(props) => (props.$active ? "green" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
`;

const ExpenseButton = styled.button`
  ${baseButtonStyle}
  border-radius: 0 5px 5px 0;
  color: ${(props) => (props.$active ? "white" : "black")};
  background-color: ${(props) => (props.$active ? "red" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
`;

const FlowTypeWrapper = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const FlowTypeButton = styled.button`
  ${baseButtonStyle}
  display: inline-block;
  background-color: ${(props) => (props.$active ? "white" : "grey")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: black;

  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }

  &:last-of-type {
    border-radius: 0 5px 5px 0;
  }
`;

const CategoryWrapper = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const CategoryButton = styled.button`
  ${baseButtonStyle}
  background-color: ${(props) => (props.$active ? "wheat" : "grey")};
  color: black;
  font-weight: ${(props) => (props.$active ? "normal" : "lighter")};

  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }

  &:last-of-type {
    border-radius: 0 5px 5px 0;
  }
`;

const AmountInput = styled.input`
  all: unset;
  display: block;
  text-align: center;
  font-size: 1.2rem;
  padding: 10px;
  margin: 15px auto;
  border-radius: 5px;
  background-color: rgb(198, 197, 197);
  color: rgb(50, 50, 50);
  border: solid 1px rgb(88, 88, 88);
`;

const SubmitButton = styled.button`
  ${baseButtonStyle}
  font-size: 1.2rem;
  padding: 7px;
  border-radius: 5px;
  background-color: rgb(54, 54, 54);
  border: solid 1px rgb(221, 221, 221);
  color: rgb(221, 221, 221);

  &:hover {
    background-color: rgb(88, 88, 88);
    transform: scale(1.05);
  }

  &:active {
    background-color: rgb(111, 110, 110);
    transform: scale(0.95);
  }
`;

const capitalizeWord = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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
      <LedgerWrapper>
        {transactions.length !== 0 &&
          transactions.map((t) =>
            t.type === "income" ? (
              <TransactionRow key={t.id}>
                <RowHeader>Income</RowHeader>
                <TransactionAmount $type={t.type}>
                  {t.amount.toFixed(2)}
                </TransactionAmount>
              </TransactionRow>
            ) : (
              <TransactionRow key={t.id}>
                <RowHeader>Expense</RowHeader>
                <RowHeader>{capitalizeWord(t.flow_type)}</RowHeader>
                {t.category ? (
                  <RowHeader>{capitalizeWord(t.category)}</RowHeader>
                ) : null}
                <TransactionAmount $type={t.type}>
                  {t.amount.toFixed(2)}
                </TransactionAmount>
              </TransactionRow>
            ),
          )}
      </LedgerWrapper>

      <TransactionForm onSubmit={handleSubmit}>
        <IncomeExpenseWrapper>
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
        </IncomeExpenseWrapper>
        <FlowTypeWrapper>
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
        </FlowTypeWrapper>
        <CategoryWrapper>
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
        </CategoryWrapper>
        <AmountInput
          type="text"
          value={amount}
          placeholder="Enter a number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </TransactionForm>
    </>
  );
}

export default App;
