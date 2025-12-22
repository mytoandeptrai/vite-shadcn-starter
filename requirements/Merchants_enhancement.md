# Enhance Merchant Form – Wallet Address Section (Add & Edit)
Context

The current Merchant form (used for both Add New Merchant and Edit Merchant) only contains:

First Name
Last Name
Email

We need to enhance the existing merchant form by adding a Wallet Addresses section below these fields.

This enhancement must support both Add and Edit flows, using the same logic and UI.

# Key Principles (Must Follow)

This is an upgrade, not a new feature or new screen

Add and Edit share the same form component

Wallet address logic must:

Support add / edit / remove

Use React Hook Form + useFieldArray

Reuse logic and patterns from wallet-address-container

Follow existing project structure and conventions

# UI Changes
1. Existing Fields (No Change)

Keep existing fields exactly the same:

First Name (required)

Last Name (required)

Email (required)

2. Wallet Addresses Section

Add a new section below the Email field:

Title:
Wallet Addresses

This section is rendered inline in the merchant form (no separate modal).

Wallet Address Item Structure

Each wallet address item uses the same fields as wallet-address-container:

Field	Required
Chain	Yes
Token	Yes
Label	Yes
Wallet Address	Yes

Field paths:

walletAddresses[index].chain
walletAddresses[index].token
walletAddresses[index].label
walletAddresses[index].address

Form Behavior
1. useFieldArray

Use:

useFieldArray({
  control,
  name: 'walletAddresses'
})

2. Add Flow

When opening Add Merchant:

Initialize with one empty wallet address item

User can:

Add more wallet addresses

Remove wallet addresses (except when only one remains, if required by UX)

3. Edit Flow (Important)

When opening Edit Merchant:

Pre-fill walletAddresses from existing merchant data

Each existing wallet address should be:

Editable (chain / token / label / address)

Removable

User can also add new wallet addresses in edit mode

👉 Edit flow behavior should be identical to Add, except data is pre-populated.

# Validation Rules

Validation applies to each wallet address item

All wallet address fields are required

Validation rules should be reused or aligned with wallet-address-container

The form must block submit if:

Any merchant field is invalid

Any wallet address item is invalid

Validation should use the same resolver approach already used in the merchant form (Zod).

Data Model
Form Values
interface MerchantFormValues {
  firstName: string;
  lastName: string;
  email: string;

  walletAddresses: {
    chain: string;
    token: string;
    label: string;
    address: string;
  }[];
}

Edit Mode Initialization Example
const defaultValues = {
  firstName: merchant.firstName,
  lastName: merchant.lastName,
  email: merchant.email,
  walletAddresses: merchant.walletAddresses ?? []
}


If walletAddresses is empty:

Initialize with one empty item

Submit Payload

Both Add and Edit submit payload must include wallet addresses:

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "walletAddresses": [
    {
      "chain": "BSC",
      "token": "USDT",
      "label": "Main wallet",
      "address": "0x123..."
    }
  ]
}

# Reuse & Structure (Critical for Cursor)

Reuse:

Wallet address fields

Validation rules

Constants (chains, tokens)

UI patterns

Source reference:

wallet-address-container

# Do NOT:

Create new wallet address modal

Duplicate wallet address logic

Refactor unrelated merchant code

Out of Scope

Backend changes

API contract changes

Blockchain address validation

Duplicate wallet address detection

Acceptance Criteria

Add Merchant works as before, with wallet addresses included

Edit Merchant:

Shows existing wallet addresses

Allows edit / add / remove

Validation works per wallet address item

Payload is correct for both Add and Edit

No regression in existing merchant flow

# Notes for Cursor

Follow existing folder and component structure

Keep changes minimal and scoped

Prefer reuse over rewriting

Treat Add and Edit as one unified form