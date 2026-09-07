import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "./supabaseClient";
import {
  THEME,
  EditButton,
  SaveEditButton,
  CancelEditButton,
} from "./components/UI";

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

const ProfileEditInput = styled.input`
  all: unset;
  font-size: 0.8rem;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  background-color: ${THEME.colors.buttonBackground};
`;

const BankInputWrapper = styled.div`
  all: unset;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const CurrencySelect = styled.select`
  all: unset;
  background-color: ${THEME.colors.buttonBackground};
  width: 220px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
`;

const CurrencyOption = styled.option`
  all: unset;
  text-align: center;
  color: ${THEME.colors.text};
`;
function Profile({ profile, setProfile, session }) {
  const [editingField, setEditingField] = useState(null); // for tracking which profile field is being edited
  const [editedValue, setEditedValue] = useState(""); // for holding the edited value of a profile field

  const handleProfileFieldEdit = async () => {
    if (!editingField) return;

    let updates = {};

    if (editingField === "bank") {
      updates = {
        account_number: editedValue.account_number,
        sort_code: editedValue.sort_code,
      };
    } else {
      updates = { [editingField]: editedValue };
    }
    setProfile((prev) => ({ ...prev, ...updates })); // Optimistic update

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session?.user?.id);

    if (error) {
      console.error(`Error updating ${editingField}:`, error.message);
    } else {
      setEditingField(null);
      setEditedValue("");
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

  return (
    <ProfileWrapper>
      <ProfileHeader>My Profile</ProfileHeader>
      <br></br>
      <ProfileRow>
        <ProfileLabel>Username:</ProfileLabel>
        <ProfileContent>
          {editingField === "username" ? (
            <>
              <ProfileEditInput
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
              />
              <SaveEditButton onClick={handleProfileFieldEdit}>
                ✔
              </SaveEditButton>
              <CancelEditButton onClick={() => setEditingField(null)}>
                ✖
              </CancelEditButton>
            </>
          ) : (
            <>
              {profile?.username || "Not specified"}
              <EditButton
                onClick={() => {
                  setEditingField("username");
                  setEditedValue(profile?.username || "");
                }}
              >
                ✎
              </EditButton>
            </>
          )}
        </ProfileContent>
      </ProfileRow>
      <br></br>
      <ProfileRow>
        <ProfileLabel>Name:</ProfileLabel>
        <ProfileContent>
          {editingField === "name" ? (
            <>
              <ProfileEditInput
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
              />
              <SaveEditButton onClick={handleProfileFieldEdit}>
                ✔
              </SaveEditButton>
              <CancelEditButton onClick={() => setEditingField(null)}>
                ✖
              </CancelEditButton>
            </>
          ) : (
            <>
              {profile?.name || "Not specified"}
              <EditButton
                onClick={() => {
                  setEditingField("name");
                  setEditedValue(profile?.name || "");
                }}
              >
                ✎
              </EditButton>
            </>
          )}
        </ProfileContent>
      </ProfileRow>
      <br></br>
      <ProfileRow>
        <ProfileLabel>Email:</ProfileLabel>
        <ProfileContent>
          {editingField === "email" ? (
            <>
              <ProfileEditInput
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
              />
              <SaveEditButton onClick={handleProfileFieldEdit}>
                ✔
              </SaveEditButton>
              <CancelEditButton onClick={() => setEditingField(null)}>
                ✖
              </CancelEditButton>
            </>
          ) : (
            <>
              {profile?.email || "Not specified"}
              <EditButton
                onClick={() => {
                  setEditingField("email");
                  setEditedValue(profile?.email || "");
                }}
              >
                ✎
              </EditButton>
            </>
          )}
        </ProfileContent>
      </ProfileRow>
      <br></br>
      <ProfileRow>
        <ProfileLabel>Phone Number:</ProfileLabel>
        <ProfileContent>
          {editingField === "phone" ? (
            <>
              <ProfileEditInput
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
              />
              <SaveEditButton onClick={handleProfileFieldEdit}>
                ✔
              </SaveEditButton>
              <CancelEditButton onClick={() => setEditingField(null)}>
                ✖
              </CancelEditButton>
            </>
          ) : (
            <>
              {profile?.phone || "Not specified"}
              <EditButton
                onClick={() => {
                  setEditingField("phone");
                  setEditedValue(profile?.phone || "");
                }}
              >
                ✎
              </EditButton>
            </>
          )}
        </ProfileContent>
      </ProfileRow>
      <br></br>
      <ProfileRow>
        <ProfileLabel>Bank Details:</ProfileLabel>
        <ProfileContent>
          {editingField === "bank" ? (
            <>
              <BankInputWrapper>
                <ProfileEditInput
                  type="text"
                  value={editedValue.account_number || ""}
                  onChange={(e) =>
                    setEditedValue((prev) => ({
                      ...prev,
                      account_number: e.target.value,
                    }))
                  }
                  placeholder="Account Number"
                />
                <ProfileEditInput
                  type="text"
                  value={editedValue.sort_code || ""}
                  onChange={(e) =>
                    setEditedValue((prev) => ({
                      ...prev,
                      sort_code: e.target.value,
                    }))
                  }
                  placeholder="Sort Code"
                />
              </BankInputWrapper>
              <SaveEditButton onClick={handleProfileFieldEdit}>
                ✔
              </SaveEditButton>
              <CancelEditButton onClick={() => setEditingField(null)}>
                ✖
              </CancelEditButton>
            </>
          ) : (
            <>
              <div>
                {profile?.account_number || "A/C not specified"}
                <br></br>
                {profile?.sort_code || "Sort Code not specified"}
              </div>
              <EditButton
                onClick={() => {
                  setEditingField("bank");
                  setEditedValue({
                    account_number: profile?.account_number ?? "",
                    sort_code: profile?.sort_code ?? "",
                  });
                }}
              >
                ✎
              </EditButton>
            </>
          )}
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
            <CurrencyOption value="UK">United Kingdom (GBP)</CurrencyOption>
            <CurrencyOption value="US">United States (USD)</CurrencyOption>
            <CurrencyOption value="EU">Eurozone (EUR)</CurrencyOption>
          </CurrencySelect>
        </ProfileContent>
      </ProfileRow>
    </ProfileWrapper>
  );
}
export default Profile;
