
const EXPENSE_KEY = "easytrack_expenses";
const BUDGET_KEY = "easytrack_budget";

export default class ExpenseModel {
    constructor() {
        this.expenses = this.loadExpenses();
        this.budget = this.loadBudget();
    }

    loadExpenses() {
        try {
            const data = JSON.parse(
                localStorage.getItem(EXPENSE_KEY) || "[]"
            );

            if (!Array.isArray(data)) return [];

            return data.filter(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.amount)) &&
                Number(item.amount) > 0 &&
                typeof item.category === "string" &&
                typeof item.date === "string"
            ).map(item => ({
                ...item,
                amount: Number(item.amount)
            }));
        } catch {
            return [];
        }
    }

    loadBudget() {
        try {
            const value = Number(localStorage.getItem(BUDGET_KEY));

            return Number.isFinite(value) && value >= 0 ? value : 0;
        } catch {
            return 0;
        }
    }

    saveExpenses() {
        localStorage.setItem(
            EXPENSE_KEY,
            JSON.stringify(this.expenses)
        );
    }

    saveBudget() {
        localStorage.setItem(
            BUDGET_KEY,
            String(this.budget)
        );
    }

    getExpenses() {
        return [...this.expenses];
    }

    addExpense(data) {
        const expense = {
            id: crypto.randomUUID(),
            name: data.name,
            amount: Number(data.amount),
            category: data.category,
            date: data.date
        };

        this.expenses.push(expense);
        this.saveExpenses();

        return expense;
    }

    updateExpense(id, data) {
        const index = this.expenses.findIndex(
            item => item.id === id
        );

        if (index === -1) return false;

        this.expenses[index] = {
            ...this.expenses[index],
            name: data.name,
            amount: Number(data.amount),
            category: data.category,
            date: data.date
        };

        this.saveExpenses();

        return true;
    }

    deleteExpense(id) {
        const oldLength = this.expenses.length;

        this.expenses = this.expenses.filter(
            item => item.id !== id
        );

        if (oldLength === this.expenses.length) {
            return false;
        }

        this.saveExpenses();

        return true;
    }

    setBudget(amount) {
        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) {
            return false;
        }

        this.budget = value;
        this.saveBudget();

        return true;
    }

    getBudget() {
        return this.budget;
    }

    getTotalExpenses() {
        return this.expenses.reduce(
            (total, item) => total + item.amount,
            0
        );
    }

    getRemainingBudget() {
    if (this.budget === 0) {
        return 0;
    }

    return this.budget - this.getTotalExpenses();
    }

    getTransactionCount() {
        return this.expenses.length;
    }

    getAverageExpense() {
        const count = this.getTransactionCount();

        return count === 0
            ? 0
            : this.getTotalExpenses() / count;
    }

    getCategorySummary() {
        const summary = {};

        this.expenses.forEach(item => {
            summary[item.category] =
                (summary[item.category] || 0) + item.amount;
        });

        return summary;
    }
}
