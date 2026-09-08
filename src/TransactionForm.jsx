import { useState } from "react";
import styled from "styled-components";
import { supabase } from "./supabaseClient";
import { THEME, baseButtonStyle } from "./components/UI";

const TransactionForm = styled.form`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;
const IncomeExpenseWrapper = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const IncomeButton = styled.button`
  ${baseButtonStyle}
  border-radius: 5px 0 0 5px;
  color: ${(props) => (props.$active ? "white" : THEME.colors.text)};
  background-color: ${(props) =>
    props.$active ? "green" : THEME.colors.buttonBackground};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    background-color: ${THEME.colors.buttonHover};
    transform: scale(1.05);
  }
`;

const ExpenseButton = styled.button`
  ${baseButtonStyle}
  border-radius: 0 5px 5px 0;
  color: ${(props) => (props.$active ? "white" : `${THEME.colors.text}`)};
  background-color: ${(props) =>
    props.$active ? "red" : THEME.colors.buttonBackground};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    background-color: ${THEME.colors.buttonHover};
    transform: scale(1.05);
  }
`;

const FlowTypeWrapper = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const FlowTypeButton = styled.button`
  ${baseButtonStyle}
  display: inline-block;
  background-color: ${(props) =>
    props.$active ? "white" : THEME.colors.buttonBackground};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${THEME.colors.text};

  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }

  &:last-of-type {
    border-radius: 0 5px 5px 0;
  }

  &:hover {
    background-color: ${THEME.colors.buttonHover};
    transform: scale(1.05);
  }
`;

const CategoryWrapper = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const CategoryButton = styled.button`
  ${baseButtonStyle}
  background-color: ${(props) =>
    props.$active ? "wheat" : THEME.colors.buttonBackground};
  color: ${THEME.colors.text};
  font-weight: ${(props) => (props.$active ? "normal" : "lighter")};

  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }

  &:last-of-type {
    border-radius: 0 5px 5px 0;
  }

  &:hover {
    background-color: ${THEME.colors.buttonHover};
    transform: scale(1.05);
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
  background-color: ${THEME.colors.buttonBackground};
  color: ${THEME.colors.text};
  font-weight: 550;
  border: solid 1px rgb(106, 106, 106);

  /* Hides spin buttons in Firefox */
  appearance: textfield;
  -moz-appearance: textfield;

  /* Hides spin buttons in Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    background-color: ${THEME.colors.buttonHover};
    border: solid 1px ${THEME.colors.buttonFocus};
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(1);
  }
`;

const SubmitButton = styled.button`
  ${baseButtonStyle}
  font-size: 1rem;
  padding: 5px;
  border-radius: 4px;
  background-color: ${THEME.colors.text};
  border: solid 1px rgb(40, 40, 40);
  color: ${THEME.colors.buttonBackground};

  &:hover {
    background-color: ${THEME.colors.buttonFocus};
    transform: scale(1.05);
  }

  &:active {
    background-color: rgb(111, 110, 110);
    transform: scale(0.95);
  }
`;

function Transactions({ setTransactions, session }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [flowType, setFlowType] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: transactionData, error: transactionError } = await supabase // inserting an amount value to table
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

    if (transactionError) {
      console.log(transactionError);
    } else if (transactionData && transactionData.length > 0) {
      alert("Sent to database!");
      const addedTransaction = transactionData[0]; // get the inserted transaction
      setTransactions((prev) => [addedTransaction, ...prev]); // update state with the new transaction, no lag as we don't rerun useEffect script and update immediately

      // reset states
      setAmount("");
      setType("");
      setFlowType("");
      setCategory("");
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
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        placeholder="Enter a number"
        onChange={(e) => setAmount(e.target.value)}
      />
      <SubmitButton type="submit">Submit</SubmitButton>
    </TransactionForm>
  );
}

export default Transactions;
