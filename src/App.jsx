import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";
import styled, { css } from "styled-components";
import Auth from "./Auth";
import Ledger from "./Ledger";
import Profile from "./Profile";
import Transactions from "./TransactionForm";
import { THEME, baseButtonStyle } from "./components/UI";

const PageWrapper = styled.div`
  background-color: ${THEME.colors.background};
  width: 100%;
  min-height: 100vh;
  height: auto;
  position: relative;
  box-sizing: border-box;
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

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("ledger"); // for toggling between profile and ledger pages
  const [profile, setProfile] = useState(null); // for holding profile data of a user
  const [transactions, setTransactions] = useState([]); //to hold exisiting transactions for a given user

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error when logging out: ", error.message);
    } else {
      alert("Logged out!");
      console.log("Logged out successfully");
    }
  };

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
          <Profile
            session={session}
            profile={profile}
            setProfile={setProfile}
          />
        ) : (
          <>
            <Ledger
              profile={profile}
              transactions={transactions}
              setTransactions={setTransactions}
            />
            <Transactions setTransactions={setTransactions} session={session} />
          </>
        )}
      </PageWrapper>
    </>
  );
}

export default App;
