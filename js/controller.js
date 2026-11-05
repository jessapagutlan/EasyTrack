
import ExpenseModel from "./model.js";

import ExpenseFormView from "./views/ExpenseFormView.js";
import ExpenseListView from "./views/ExpenseListView.js";
import SummaryView from "./views/SummaryView.js";
import CategoryView from "./views/CategoryView.js";
import BudgetView from "./views/BudgetView.js";

class ExpenseController {

    constructor() {
        this.model = new ExpenseModel();

        this.formView = new ExpenseFormView();
        this.listView = new ExpenseListView();
        this.summaryView = new SummaryView();
        this.categoryView = new CategoryView();
        this.budgetView = new BudgetView();

        this.bindEvents();
        this.initializeTheme();
        this.refreshViews();
        this.displayCurrentDate();
    }

    bindEvents() {

        // ADD EXPENSE
        this.formView.container.addEventListener(
            "expense:add",
            event => {
                this.model.addExpense(event.detail.expense);

                this.refreshViews();
                this.formView.resetForm();
            }
        );

        // UPDATE EXPENSE
        this.formView.container.addEventListener(
            "expense:update",
            event => {
                const { id, expense } = event.detail;

                const updated = this.model.updateExpense(id, expense);

                if (updated) {
                    this.refreshViews();
                    this.formView.resetForm();
                }
            }
        );

        // EDIT EXPENSE
        this.listView.container.addEventListener(
            "expense:edit",
            event => {
                const expense = this.model.getExpenses().find(
                    item => item.id === event.detail.id
                );

                if (expense) {
                    this.formView.editExpense(expense);
                }
            }
        );

        // DELETE EXPENSE
        this.listView.container.addEventListener(
            "expense:delete",
            event => {
                const deleted = this.model.deleteExpense(
                    event.detail.id
                );

                if (deleted) {
                    this.refreshViews();
                }
            }
        );

        // SEARCH AND FILTER
        this.listView.container.addEventListener(
            "expense:filter",
            () => {
                this.listView.renderExpenses(
                    this.model.getExpenses()
                );
            }
        );

        // UPDATE BUDGET
        this.budgetView.container.addEventListener(
            "budget:update",
            event => {
                const updated = this.model.setBudget(
                    event.detail.amount
                );

                if (updated) {
                    this.refreshViews();
                }
            }
        );

        // CLEAR BUDGET
        this.budgetView.container.addEventListener(
            "budget:clear",
            () => {
                const cleared = this.model.setBudget(0);

                if (cleared) {
                    this.refreshViews();
                }
            }
        );

        // DARK MODE
        document.querySelector("#theme-toggle")
            .addEventListener("click", () => {
                this.toggleTheme();
            });

        // SIDEBAR NAVIGATION
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                document.querySelectorAll(".nav-link").forEach(item => {
                    item.classList.remove("active");
                });

                link.classList.add("active");
            });
        });
    }

    // REFRESH ALL VIEWS
    refreshViews() {
        this.summaryView.renderSummary(this.model);

        this.listView.renderExpenses(
            this.model.getExpenses()
        );

        this.categoryView.renderCategories(this.model);

        this.budgetView.renderBudget(this.model);
    }

    // DARK MODE
    initializeTheme() {
        const savedTheme = localStorage.getItem("easytrack_theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }

        this.updateThemeButton();
    }

    toggleTheme() {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "easytrack_theme",
            isDark ? "dark" : "light"
        );

        this.updateThemeButton();
    }

    updateThemeButton() {
        const button = document.querySelector("#theme-toggle");

        const isDark = document.body.classList.contains("dark-mode");

        button.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
    }

    // CURRENT DATE
    displayCurrentDate() {
        const dateElement = document.querySelector("#current-date");

        dateElement.textContent = new Date().toLocaleDateString(
            "en-PH",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }
}

// START APPLICATION
document.addEventListener("DOMContentLoaded", () => {
    new ExpenseController();
});
