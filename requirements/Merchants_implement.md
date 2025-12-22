Build Merchants List Page – Implementation Guide
Context

This feature is built on top of the existing codebase.
Please follow the existing project structure, coding style, and patterns used in other screens (e.g. wallet-address, balance, transactions).

The implementation should follow the structure:

containers/
components/
hooks/


containers: handle business logic, data fetching, state management

components: presentational UI components only

hooks: reusable custom hooks (data fetching, table logic, filters, etc.)

Mock APIs can be used for this feature.

Feature Overview

Build a Merchants List page with the following capabilities:

Display a list of merchant users

Support basic table features (pagination, sorting, filtering)

Allow activating / deactivating merchants

Allow creating a new merchant via dialog

UI style should be similar to the existing Wallet Address page.

Page Requirements
1. Page Title & Actions

Page title: Merchants

action button: Add New Merchant

Clicking Add New Merchant opens a dialog/modal

2. Merchants Table

Display a table listing merchant users.

Table Columns
Column	Description
ID	Merchant unique identifier
Name	Merchant full name
Created At	Merchant creation date
Balance	Merchant balance (mocked value)
Status	Active / Inactive
Actions	Activate / Deactivate merchant

Status action should toggle merchant status

No delete action is required

3. Filters & Query Params

The table should support the following filters via query params:

{
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  status: 'active' | 'inactive' | 'all';
}


Filters should sync with URL params

Default values should be applied if params are missing

Add New Merchant Dialog

Clicking Add New Merchant should open a dialog with a form.

Form Fields

First Name

Last Name

Email

Behavior

Validate required fields

On submit:

Call mock API

Close dialog

Refresh merchants list

Mock API Requirements

You can mock the following APIs:

GET    /api/merchants
POST   /api/merchants
PATCH  /api/merchants/:id/status


Mock data structure example:

{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  balance: number;
  status: 'active' | 'inactive';
}

Folder Structure Example ( follow the same as wallet-address)
merchants/
├── containers/
│   └── merchant-container.tsx
│   └── merchant-table-container.tsx
│   └── merchant-form-container.tsx
│   └── table-filter-container.tsx
├── components/
│   ├── merchant-table-ui.tsx
│   ├── merchant-form-ui.tsx
│   └── merchant-form-ui.tsx
├── hooks/
│   ├── use-merchant-container.ts
│   ├── use-table-filter.ts

Implementation Notes

Reuse existing table, dialog, button components from the project

Follow existing naming conventions

Keep components dumb (UI only)

All data fetching & mutation logic should live in containers or hooks

Use TypeScript strictly

Balance field can be mocked (no real calculation needed)

Non-Requirements (Out of Scope)

No real backend integration

No role/permission handling

No marketplace logic

No withdraw functionality

No KYC flow

Goal

The goal is to have a clean, consistent Merchants List page that:

Matches existing UI patterns

Is easy to extend later

Can be wired to real APIs in future phases