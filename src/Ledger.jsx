import React, { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import styled from "styled-components";
import {
  THEME,
  baseTextStyle,
  baseButtonStyle,
  SaveEditButton,
  CancelEditButton,
  EditButton,
} from "./components/UI";

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

const FlowTypeSelect = styled.select`
  all: unset;
  margin: 0 5px;
  width: 65px;
  height: 27px;
  border: solid 1px ${THEME.colors.buttonHover};
  color: ${THEME.colors.text};
  background-color: ${THEME.colors.buttonBackground};
  padding: 3px;
  font-size: 1rem;
  border-radius: 3px;
  text-align: center;
  font-weight: 500;
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto auto;
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

const DeleteButton = styled.button`
  ${baseButtonStyle}
  font-size: 1.1rem;
  padding: 2px 5px;
  border-radius: 5px;
  color: ${THEME.colors.buttonFocus};
  font-weight: 550;

  &:hover {
    transform: scale(1.2);
    color: ${THEME.colors.text};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TransactionInputEdit = styled.input`
  all: unset;
  border-radius: 3px;
  background-color: ${THEME.colors.buttonBackground};
  width: 100px;
  color: ${THEME.colors.text};
  padding: 5px;
  margin: 0 5px;
`;

const capitalizeWord = (s) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function ProjectModal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleOutsideClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} onClick={handleOutsideClick}>
      {children}
    </dialog>
  );
}

function Ledger({ profile, transactions, setTransactions }) {
  const [editingTransactionId, setEditingTransactionId] = useState(null); // for tracking which transaction is being edited
  const [editingTransactionData, setEditingTransactionData] = useState({
    amount: "",
    type: "",
    flow_type: "",
    category: "",
  }); // for holding the edited data of a transaction`

  const handleTransactionEdit = async (id) => {
    const updatedAmount = parseFloat(editingTransactionData.amount);

    setEditingTransactionId(id);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              amount: updatedAmount,
              type: editingTransactionData.type,
              flow_type: editingTransactionData.flow_type,
              category: editingTransactionData.category,
            }
          : t,
      ),
    ); // Optimistic update

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: updatedAmount,
        type: editingTransactionData.type,
        flow_type: editingTransactionData.flow_type,
        category: editingTransactionData.category,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating transaction:", error.message);
    } else {
      setEditingTransactionId(null);
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

  const totalAmount = transactions.reduce((total, t) => {
    const amount = parseFloat(t.amount) || 0; // Ensure amount is a number
    return t.type === "income" ? total + amount : total - amount;
  }, 0);

  const NATIONS = {
    // for currency data
    UK: { label: "United Kingdom", currency: "GBP", symbol: "£" },
    US: { label: "United States", currency: "USD", symbol: "$" },
    EU: { label: "Eurozone", currency: "EUR", symbol: "€" },
  };

  const activeCountry = profile?.country_code || "UK";
  const currencySymbol = NATIONS[activeCountry]?.symbol;

  return (
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
              <React.Fragment key={t.id}>
                <TransactionRow>
                  <RowHeader>Income</RowHeader>
                  <hr></hr>
                  <hr></hr>
                  <TransactionAmount $type={t.type}>
                    {currencySymbol}
                    {(t.amount || 0).toFixed(2)}
                  </TransactionAmount>
                  <EditButton
                    onClick={() => {
                      setEditingTransactionId(t.id);
                      setEditingTransactionData({
                        amount: t.amount ?? "",
                        type: t.type ?? "income",
                        flow_type: t.flow_type ?? "",
                        category: t.category ?? "",
                      });
                    }}
                  >
                    ✎
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(t.id)}>
                    🗑
                  </DeleteButton>
                </TransactionRow>
                <ProjectModal
                  isOpen={editingTransactionId === t.id}
                  onClose={() => {
                    setEditingTransactionId(null);
                  }}
                >
                  <FlowTypeSelect
                    value={editingTransactionData.type}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </FlowTypeSelect>
                  <TransactionInputEdit
                    type="text"
                    placeholder="flow type"
                    value={editingTransactionData.flow_type}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        flow_type: e.target.value,
                      }))
                    }
                  />
                  <TransactionInputEdit
                    type="text"
                    placeholder="category"
                    value={editingTransactionData.category}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                  <TransactionInputEdit
                    type="text"
                    placeholder="amount"
                    value={editingTransactionData.amount}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                  <SaveEditButton onClick={() => handleTransactionEdit(t.id)}>
                    ✔
                  </SaveEditButton>
                  <CancelEditButton
                    onClick={() => {
                      setEditingTransactionId(null);
                    }}
                  >
                    ✖
                  </CancelEditButton>
                </ProjectModal>
              </React.Fragment>
            ) : (
              <React.Fragment key={t.id}>
                <TransactionRow>
                  <RowHeader>Expense</RowHeader>
                  <FlowTypeHeader>{capitalizeWord(t.flow_type)}</FlowTypeHeader>
                  {t.category ? (
                    <OtherText>{capitalizeWord(t.category)}</OtherText>
                  ) : null}
                  <TransactionAmount $type={t.type}>
                    {currencySymbol}
                    {(t.amount || 0).toFixed(2)}
                  </TransactionAmount>
                  <EditButton
                    onClick={() => {
                      setEditingTransactionId(t.id);
                      setEditingTransactionData({
                        amount: t.amount ?? "",
                        type: t.type ?? "expense",
                        flow_type: t.flow_type ?? "",
                        category: t.category ?? "",
                      });
                    }}
                  >
                    ✎
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(t.id)}>
                    🗑
                  </DeleteButton>
                </TransactionRow>
                <ProjectModal
                  isOpen={editingTransactionId === t.id}
                  onClose={() => {
                    setEditingTransactionId(null);
                  }}
                >
                  <FlowTypeSelect
                    value={editingTransactionData.type}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </FlowTypeSelect>
                  <TransactionInputEdit
                    type="text"
                    placeholder="flow type"
                    value={editingTransactionData.flow_type}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        flow_type: e.target.value,
                      }))
                    }
                  />
                  <TransactionInputEdit
                    type="text"
                    placeholder="category"
                    value={editingTransactionData.category}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                  <TransactionInputEdit
                    type="text"
                    placeholder="amount"
                    value={editingTransactionData.amount}
                    onChange={(e) =>
                      setEditingTransactionData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                  <SaveEditButton onClick={() => handleTransactionEdit(t.id)}>
                    ✔
                  </SaveEditButton>
                  <CancelEditButton
                    onClick={() => {
                      setEditingTransactionId(null);
                    }}
                  >
                    ✖
                  </CancelEditButton>
                </ProjectModal>
              </React.Fragment>
            ),
          )}
        <BalanceDisplay $balance={totalAmount}>
          Balance: {currencySymbol}
          {totalAmount.toFixed(2)}
        </BalanceDisplay>
      </LedgerWrapper>
    </>
  );
}

export default Ledger;
