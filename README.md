# A Budget App - Cairn

A full-stack personal finance application built with **React**, **styled-components**, and **Supabase**. The app allows users to authenticate securely, log income and expenses across customizable categories, view real-time balance totals with dynamic multi-currency support, and manage user profile details.

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

## ℹ️ How to run

TO run this locally, download all files within the repo. Places the files in it's own directory. Open command prompt, and navigate to the directory you created for the files. Then run the command `npm install` to install all the dependencies required for this project. Following that, run the command `npm run dev` to deploy rour local host and the link will be made available on the command prompt.

To use this program online, follow this [link](https://budget-pwa-cyan.vercel.app/).

## ⚠️ Limitations and design decisions

Currently, there is no direct link to the persons bank account due to potential security risks, therefore all transactions muse be input manually. This is an intentional decision until we can confirm all sensitive information is encrypted. There is no ability to customize categories, this is a pending change due to the current UX structure of the app.
