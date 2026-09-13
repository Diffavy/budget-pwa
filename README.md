# A Budget App - Cairn

A full-stack personal finance application built with **React**, **styled-components**, and **Supabase**. The app allows users to authenticate securely, log income and expenses across customizable categories, view real-time balance totals with dynamic multi-currency support, and manage user profile details.

## 🚀 Features

* **User Authentication:** Email and password sign-up/login powered by Supabase Auth with real-time session tracking.
* **Transaction Ledger:**
  * Categorize transactions by type (**Income** vs **Expense**), flow type (**Daily**, **Subscription**, **One-off**), and category.
  * Edit and delete transactions in place via an accessible modal dialog.
  * Real-time calculation of total balance.
  * Optimistic UI updates for immediate feedback when adding or modifying records.
* **Dynamic Currency System:** Choose between **GBP (£)**, **USD ($)**, and **EUR (€)** in your profile settings to dynamically update currency symbols across the ledger.
* **User Profile Management:** Edit username, full name, email, phone number, and bank details with immediate persistence to Supabase.
* **Component Architecture:** Modular React structure utilizing styled-components for isolated styling and theme management.


## 🛠️ Tech Stack

* **Frontend:** React (Vite), JavaScript (ES6+), styled-components
* **Backend / Database:** Supabase (PostgreSQL, Row Level Security, Authentication)
* **Build Tool:** Vite

## 📂 Project Structure

```text
src/
├── components/
│   └── UI.js                # Shared themes, design tokens, and base button styles
├── App.jsx                  # Main application container, view routing, and auth check
├── Auth.jsx                 # Login & Sign-up forms
├── Ledger.jsx               # Transaction list, modal editor, and balance calculation
├── Profile.jsx              # Profile settings and currency selector
├── TransactionForm.jsx      # Income/Expense submission form
├── supabaseClient.js        # Supabase client configuration
└── main.jsx                 # Application entry point
```

## ℹ️ How to use

## ⚠️ Limitations

