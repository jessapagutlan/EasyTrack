
# Expense Form Documentation

## Overview

The Expense Form allows users to record new expenses and modify existing expense information. It provides input fields where users can enter the details of their expenses.


## Input Validation

The Expense Form includes validation to ensure that users enter correct and complete information.

The validation checks include:
- Expense name must not be empty.
- Amount must be greater than zero.
- Amount must not exceed the allowed limit.
- A valid category must be selected.
- A valid date must be entered.
- Future dates are not allowed.

Invalid information is rejected and validation messages are displayed.


## Add and Edit Expense Functions

The Expense Form supports two main operations:

- Adding Expenses – Allows users to enter new expense information and submit it to the system.
- Editing Expenses – Allows users to modify the details of an existing expense.

The form uses an editing identifier to determine whether the user is adding a new expense or editing an existing one.


## Expense Form Test Cases

| Test Case | Expected Result |
|---|---|
| Valid Expense Input | The expense is successfully added. |
| Empty Expense Name | The system displays a validation message. |
| Invalid Expense Amount | The system rejects zero or negative amounts. |
| Edit Existing Expense | The selected expense information is updated. |
| Invalid Date | The system rejects future or invalid dates. |
