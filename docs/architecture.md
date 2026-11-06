# EasyTrack – MVC Architecture

## 1. Model

The Model manages the application's data and business logic. It handles expense records, budget information, and data persistence using LocalStorage.

## 2. Views

The Views are responsible for displaying the application's interface and presenting information to users.

EasyTrack uses separate View classes for its different interface components:

- ExpenseFormView
- ExpenseListView
- SummaryView
- CategoryView
- BudgetView

Each View extends the base View class.

## 3. Controller

The Controller connects the Model and Views. It handles user actions, calls the appropriate Model functions, and updates the displayed information.

## 4. How MVC Works in EasyTrack

1. The user performs an action in the interface.
2. The View detects the action.
3. The Controller receives and processes the event.
4. The Controller calls the appropriate Model function.
5. The Model updates the application data.
6. The Controller requests the View to render the updated information.