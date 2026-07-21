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

const NATIONS = {
  // for currency data
  UK: { label: "United Kingdom", currency: "GBP", symbol: "£" },
  US: { label: "United States", currency: "USD", symbol: "$" },
  EU: { label: "Eurozone", currency: "EUR", symbol: "€" },
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

const ProfileWrapper = styled.div`
  width: 100%;
  margin: 20px auto 0 auto;
  max-width: 450px;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;
const ProfileHeader = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  color: ${THEME.colors.text};
  font-weight: 600;
`;

const ProfileLabel = styled.h2`
  text-align: left;
  font-size: 1.2rem;
  color: ${THEME.colors.text};
  font-weight: 500;
  border-bottom: solid 1px ${THEME.colors.buttonHover};
`;

const ProfileContent = styled.p`
  text-align: right;
  font-size: 1.1rem;
  color: ${THEME.colors.text};
`;

const EditButton = styled.button`
  ${baseButtonStyle}
  font-size: 1rem;
  padding: 2px 5px;
  border-radius: 5px;
  color: ${THEME.colors.buttonFocus};
  font-weight: 550;
  margin-left: 10px;

  &:hover {
    transform: scale(1.1);
    color: ${THEME.colors.text};
`;
const CurrencySelect = styled.select`
  all: unset;
  display: fit-content;
  margin: 20px auto;
  width: 200px;
  height: 25px;
  border: solid 1px ${THEME.colors.buttonHover};
  color: ${THEME.colors.text};
  padding: 2px;
  font-size: 1rem;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
`;

const CurrencyOption = styled.option`
  all: unset;
  text-align: center;
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
  background-color: ${THEME.colors.buttonHover};
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

const BalanceDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 650;
  color: ${(props) =>
    props.$balance >= 0 ? THEME.colors.text : THEME.colors.expense};
  text-align: center;
  margin: 0;
  padding: 20px;

  &:hover {
    background-color: ${THEME.colors.buttonBackground};
    transform: scale(1.05);
    transition: all 0.1s ease-in-out;
    box-shadow: rgba(100, 100, 111, 0.4) 0px 7px 29px 0px;
  }
`;

const ProfileButton = styled.button`
  ${baseButtonStyle}
  position: absolute;
  font-size: 1rem;
  top: 10px;
  right: 10px;
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
const SignOutButton = styled.button`
  ${baseButtonStyle}
  position: absolute;
  font-size: 1rem;
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
  const [view, setView] = useState("ledger"); // for toggling between profile and ledger pages
  const [profile, setProfile] = useState(null); // for holding profile data of a user

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session?.user?.id); // pulls data only relevant to current user

      if (transactionError) {
        console.error(
          "Error occured whilst fetching transaction data",
          transactionError.message,
        );
      } else if (transactionData) {
        setTransactions(transactionData);
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (profileError) {
        console.error(
          "Error occurred whilst fetching profile data",
          profileError.message,
        );
      } else if (profileData) {
        setProfile(profileData);
      }
    };

    if (session?.user?.id) {
      fetchUserData();
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
    const { transactionData, transactionError } = await supabase // inserting an amount value to table
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
      const addedTransaction = transactionData[0]; // Get the inserted transaction
      setTransactions((prev) => [addedTransaction, ...prev]); // Update state with the new transaction, no lag as we don't rerun useEffect script and update immediately
      setAmount("");
    }
  };

  const handleDelete = async (id) => {
    const { transactionError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (transactionError) {
      console.error("Error deleting transaction: ", transactionError.message);
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

  const handleCountryChange = async (newCountryCode) => {
    setProfile((prev) => ({ ...prev, country_code: newCountryCode }));

    const { data, error } = await supabase
      .from("profiles")
      .update({ country_code: newCountryCode })
      .eq("id", session?.user?.id)
      .select();

    if (error) {
      console.error("Error when updating country code", error.message);
    } else {
      console.log(data, "updated successfully");
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

  const activeCountry = profile?.country_code || "UK";
  const currencySymbol = NATIONS[activeCountry]?.symbol;

  return (
    <>
      <PageWrapper>
        <SignOutButton onClick={handleLogout}>Log Out</SignOutButton>
        <ProfileButton
          onClick={() => setView(view === "ledger" ? "profile" : "ledger")}
        >
          {view === "ledger" ? "Go to Profile" : "Back to Ledger"}
        </ProfileButton>

        {view === "profile" ? (
          <ProfileWrapper>
            <ProfileHeader>My Profile</ProfileHeader>
            <br></br>
            <ProfileRow>
              <ProfileLabel>Username:</ProfileLabel>
              <ProfileContent>
                {profile?.username || "Not specified"}
                <EditButton>✎</EditButton>
              </ProfileContent>
            </ProfileRow>
            <br></br>
            <ProfileRow>
              <ProfileLabel>Name:</ProfileLabel>
              <ProfileContent>
                {profile?.name || "Not specified"}
                <EditButton>✎</EditButton>
              </ProfileContent>
            </ProfileRow>
            <br></br>
            <ProfileRow>
              <ProfileLabel>Email:</ProfileLabel>
              <ProfileContent>
                {profile?.email || "Not specified"}
                <EditButton>✎</EditButton>
              </ProfileContent>
            </ProfileRow>
            <br></br>
            <ProfileRow>
              <ProfileLabel>Bank Details:</ProfileLabel>
              <ProfileContent>
                {profile?.bank || "Not specified"}
                <EditButton>✎</EditButton>
              </ProfileContent>
            </ProfileRow>
            <br></br>
            <ProfileRow>
              <ProfileLabel>Current Country:</ProfileLabel>
              <ProfileContent>
                <CurrencySelect
                  value={profile?.country_code || "UK"}
                  onChange={(e) => {
                    handleCountryChange(e.target.value);
                  }}
                >
                  <CurrencyOption value="UK">
                    United Kingdom (GBP)
                  </CurrencyOption>
                  <CurrencyOption value="US">
                    United States (USD)
                  </CurrencyOption>
                  <CurrencyOption value="EU">Eurozone (EUR)</CurrencyOption>
                </CurrencySelect>
              </ProfileContent>
            </ProfileRow>
          </ProfileWrapper>
        ) : (
          <>
            <LedgerHeader>My Transactions :</LedgerHeader>
            <LedgerWrapper>
              {transactions.length === 0 && (
                <OtherText style={{ color: THEME.colors.buttonFocus }}>
                  No transactions found.
                </OtherText>
              )}
              {transactions.length !== 0 &&
                transactions.map((t) =>
                  t.type === "income" ? (
                    <TransactionRow key={t.id}>
                      <RowHeader>Income</RowHeader>
                      <hr></hr>
                      <hr></hr>
                      <TransactionAmount $type={t.type}>
                        {currencySymbol}
                        {(t.amount || 0).toFixed(2)}
                      </TransactionAmount>
                      <DeleteButton onClick={() => handleDelete(t.id)}>
                        Delete
                      </DeleteButton>
                    </TransactionRow>
                  ) : (
                    <TransactionRow key={t.id}>
                      <RowHeader>Expense</RowHeader>
                      <FlowTypeHeader>
                        {capitalizeWord(t.flow_type)}
                      </FlowTypeHeader>
                      {t.category ? (
                        <OtherText>{capitalizeWord(t.category)}</OtherText>
                      ) : null}
                      <TransactionAmount $type={t.type}>
                        {currencySymbol}
                        {(t.amount || 0).toFixed(2)}
                      </TransactionAmount>
                      <DeleteButton onClick={() => handleDelete(t.id)}>
                        Delete
                      </DeleteButton>
                    </TransactionRow>
                  ),
                )}
              <BalanceDisplay $balance={totalAmount}>
                Balance: {currencySymbol}
                {totalAmount.toFixed(2)}
              </BalanceDisplay>
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
        )}
      </PageWrapper>
    </>
  );
}

export default App;
