
import View from "../View.js";

export default class ExpenseFormView extends View {
    constructor() {
        super("#expense-form-container");

        this.editingId = null;

        this.renderForm();
        this.bindEvents();
    }

    renderForm(expense = null) {
        this.editingId = expense ? expense.id : null;

        this.render(`
            <form id="expense-form" class="expense-form" novalidate>

                <div class="form-group">
                    <label for="expense-name">Expense Name</label>

                    <input
                        type="text"
                        id="expense-name"
                        placeholder="e.g. Lunch"
                        maxlength="60"
                        required
                        value="${expense ? this.escapeHTML(expense.name) : ""}"
                    >

                    <span class="form-error" id="name-error"></span>
                </div>

                <div class="form-group">
                    <label for="expense-amount">Amount (₱)</label>

                    <input
                        type="number"
                        id="expense-amount"
                        placeholder="e.g. 150"
                        min="0.01"
                        max="100000000"
                        step="0.01"
                        required
                        value="${expense ? expense.amount : ""}"
                    >

                    <span class="form-error" id="amount-error"></span>
                </div>

                <div class="form-group">
                    <label for="expense-category">Category</label>

                    <select id="expense-category" required>
                        <option value="">Select category</option>
                        ${this.createOptions(expense?.category || "")}
                    </select>

                    <span class="form-error" id="category-error"></span>
                </div>

                <div class="form-group">
                    <label for="expense-date">Date</label>

                    <input
                        type="date"
                        id="expense-date"
                        required
                        value="${expense ? expense.date : new Date().toLocaleDateString("en-CA")}"
                    >

                    <span class="form-error" id="date-error"></span>
                </div>

                <div class="form-actions">

                    <button type="submit" class="primary-button">
                        ${expense ? "Update Expense" : "Add Expense"}
                    </button>

                    ${expense ? `
                        <button type="button" id="cancel-edit"
                            class="cancel-button">
                            Cancel
                        </button>
                    ` : ""}

                </div>

            </form>
        `);
    }

    createOptions(selected) {
        const categories = [
            "Food",
            "Transportation",
            "School",
            "Shopping",
            "Bills",
            "Entertainment",
            "Others"
        ];

        return categories.map(category => `
            <option value="${category}"
                ${selected === category ? "selected" : ""}>
                ${category}
            </option>
        `).join("");
    }

    escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    bindEvents() {
        this.on("submit", "#expense-form", event => {
            event.preventDefault();

            const data = this.getFormData();

            if (!this.validate(data)) return;

            this.container.dispatchEvent(
                new CustomEvent(
                    this.editingId ? "expense:update" : "expense:add",
                    {
                        detail: {
                            id: this.editingId,
                            expense: data
                        }
                    }
                )
            );
        });

        this.on("click", "#cancel-edit", () => {
            this.resetForm();
        });
    }

    getFormData() {
        return {
            name: this.container.querySelector("#expense-name").value.trim(),
            amount: this.container.querySelector("#expense-amount").value,
            category: this.container.querySelector("#expense-category").value,
            date: this.container.querySelector("#expense-date").value
        };
    }

    validate(data) {
        const errors = {
            "name-error": "",
            "amount-error": "",
            "category-error": "",
            "date-error": ""
        };

        let valid = true;

        const setError = (id, message) => {
            errors[id] = message;
            valid = false;
        };

        if (!data.name) {
            setError("name-error", "Expense name is required.");
        }

        const amount = Number(data.amount);

        if (
            data.amount.trim() === "" ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > 100000000
        ) {
            setError("amount-error", "Enter a valid amount greater than zero.");
        }

        const categories = [
            "Food", "Transportation", "School",
            "Shopping", "Bills", "Entertainment", "Others"
        ];

        if (!categories.includes(data.category)) {
            setError("category-error", "Please select a category.");
        }

        const selectedDate = new Date(`${data.date}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
            !data.date ||
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate > today
        ) {
            setError("date-error", "Enter a valid date that is not in the future.");
        }

        Object.entries(errors).forEach(([id, message]) => {
            this.container.querySelector(`#${id}`).textContent = message;
        });

        return valid;
    }

    editExpense(expense) {
        this.renderForm(expense);

        document.querySelector("#add-expense").scrollIntoView({
            behavior: "smooth"
        });
    }

    resetForm() {
        this.renderForm();
    }
}