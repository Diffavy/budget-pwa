import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import styled, { css } from "styled-components";
import Auth from "./Auth";

const THEME = {
  colors: {
    background: "rgb(221, 221, 221)",
    text: "rgb(50, 50, 50)",
    buttonBackground: "rgb(189, 189, 189)",
    buttonFocus: "rgb(90, 90, 90)",
    buttonHover: "rgb(180, 180, 180)",
    income: "green",
    expense: "red",
  },
};

const baseButtonStyle = css`
  all: unset;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  margin: 0px;
`;

const baseTextStyle = css`
  color: ${THEME.colors.text};
  font-weight: 500;
  font-size: 1.1rem;
`;

const PageWrapper = styled.div`
  background-color: ${THEME.colors.background};
  width: 100%;
  min-height: 100vh;
  height: auto;
  position: relative;
  box-sizing: border-box;
`;

const LedgerHeader = styled.h1`
  text-align: center;
  display: inline-block;
  font-size: 1.5rem;
  margin: 20px 0 10px 0;
  color: ${THEME.colors.text};
  padding: 10px;
  border-bottom: solid 1px ${THEME.colors.text};
`;
const LedgerWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 20px auto 0 auto;
  text-align: center;
  padding: 0 20px;
  border-left: solid 1.5px ${THEME.colors.buttonHover};
  border-right: solid 1.5px ${THEME.colors.buttonHover};
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: solid 1px ${THEME.colors.buttonBackground};
  padding: 20px;
  margin: 0;
  color: ${THEME.colors.text};
  border-radius: 2px;

  &:hover {
    background-color: ${THEME.colors.buttonBackground};
    transform: scale(1.05);
    transition: all 0.1s ease-in-out;
    box-shadow: rgba(100, 100, 111, 0.4) 0px 7px 29px 0px;
  }
`;

const RowHeader = styled.h2`
  ${baseTextStyle}
  font-weight: 700;
  margin: 0;
`;

const FlowTypeHeader = styled.h3`
  ${baseTextStyle}
  margin: 0;
`;

const OtherText = styled.span`
  ${baseTextStyle}
`;
const TransactionAmount = styled.span`
  font-size: 1.2rem;
  font-weight: 400;
  color: ${(props) => (props.$type === "income" ? "green" : "red")};
`;

const DeleteButton = styled.button`
  ${baseButtonStyle}
  font-size: 1rem;
  padding: 2px 5px;
  border-radius: 5px;
  color: ${THEME.colors.buttonFocus};
  background-color: ${THEME.colors.buttonBackground};
  font-weight: 550;

  &:hover {
    transform: scale(1.05);
    color: ${THEME.colors.text};
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SignOutButton = styled.button`
  ${baseButtonStyle}
  position: absolute;
  font-size: 1rem;
  color: black;
  top: 10px;
  left: 10px;
  padding: 5px;
  border-radius: 5px;
  color: ${THEME.colors.text};
  background-color: ${THEME.colors.buttonBackground};
  font-weight: 550;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

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
    background-color: ${THEME.colors.buttonHover};
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

  const handleDelete = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting transaction: ", error.message);
    } else {
      alert("Transaction deleted!");
      setTransactions((prev) => prev.filter((t) => t.id !== id)); // Update state to remove the deleted transaction
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error when logging out: ", error.message);
    } else {
      alert("Logged out!");
      console.log("Logged out successfully");
    }
  };

  const flowTypes = ["daily", "subscription", "one-off"];

  const categories = {
    daily: ["food", "transportation", "entertainment"],
    subscription: ["netflix", "gym", "spotify"],
    "one-off": ["electronics", "furniture", "clothing"],
  };

  const currentCategory = flowType ? categories[flowType] : [];

  const totalAmount = transactions.reduce((total, t) => {
    return t.type === "income" ? total + t.amount : total - t.amount;
  }, 0);

  return (
    <>
      <PageWrapper>
        <SignOutButton onClick={handleLogout}>Log Out</SignOutButton>
        <LedgerHeader>My Transactions :</LedgerHeader>
        <LedgerWrapper>
          {transactions.length !== 0 &&
            transactions.map((t) =>
              t.type === "income" ? (
                <TransactionRow key={t.id}>
                  <RowHeader>Income</RowHeader>
                  <hr></hr>
                  <hr></hr>
                  <TransactionAmount $type={t.type}>
                    {(t.amount || 0).toFixed(2)}
                  </TransactionAmount>
                  <DeleteButton onClick={() => handleDelete(t.id)}>
                    Delete
                  </DeleteButton>
                </TransactionRow>
              ) : (
                <TransactionRow key={t.id}>
                  <RowHeader>Expense</RowHeader>
                  <FlowTypeHeader>{capitalizeWord(t.flow_type)}</FlowTypeHeader>
                  {t.category ? (
                    <OtherText>{capitalizeWord(t.category)}</OtherText>
                  ) : null}
                  <TransactionAmount $type={t.type}>
                    {(t.amount || 0).toFixed(2)}
                  </TransactionAmount>
                  <DeleteButton onClick={() => handleDelete(t.id)}>
                    Delete
                  </DeleteButton>
                </TransactionRow>
              ),
            )}
          <TransactionRow>
            <RowHeader>Total</RowHeader>
            <hr></hr>
            <hr></hr>
            <TransactionAmount $type="total">
              {totalAmount.toFixed(2)}
            </TransactionAmount>
            <DeleteButton>Delete</DeleteButton>
          </TransactionRow>
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
      </PageWrapper>
    </>
  );
}

export default App;
