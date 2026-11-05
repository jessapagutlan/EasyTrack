
import View from "../View.js";

export default class ExpenseListView extends View {
    constructor() {
        super("#expense-list-container");

        this.searchTerm = "";
        this.selectedCategory = "All";

        this.bindEvents();
    }

    renderExpenses(expenses) {
        const searchFocused =
            document.activeElement?.id === "expense-search";

        const searchInput = this.container.querySelector("#expense-search");

        const cursorPosition = searchFocused && searchInput
            ? searchInput.selectionStart
            : null;

        const filtered = expenses.filter(expense => {
            const matchesSearch = expense.name
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase());

            const matchesCategory =
                this.selectedCategory === "All" ||
                expense.category === this.selectedCategory;

            return matchesSearch && matchesCategory;
        });

        const sorted = [...filtered].sort(
            (a, b) => b.date.localeCompare(a.date)
        );

        this.render(`
            <div class="list-controls">

                <input
                    type="search"
                    id="expense-search"
                    class="search-input"
                    placeholder="Search expenses..."
                    value="${this.escapeHTML(this.searchTerm)}"
                >

                <select id="category-filter" class="filter-select">
                    ${this.createFilterOptions()}
                </select>

            </div>

            ${sorted.length === 0 ? `
                <div class="empty-message">
                    No matching expenses found. ♡
                </div>
            ` : `

                <div class="table-wrapper">
                    <table class="expense-table">

                        <thead>
                            <tr>
                                <th>Expense</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${sorted.map(expense => `
                                <tr>
                                    <td>${this.escapeHTML(expense.name)}</td>

                                    <td>
                                        <span class="category-badge">
                                            ${this.escapeHTML(expense.category)}
                                        </span>
                                    </td>

                                    <td>${this.formatDate(expense.date)}</td>

                                    <td class="amount">
                                        ${this.currency(expense.amount)}
                                    </td>

                                    <td>
                                        <div class="action-buttons">

                                            <button
                                                class="edit-button"
                                                data-id="${this.escapeHTML(expense.id)}">
                                                Edit
                                            </button>

                                            <button
                                                class="delete-button"
                                                data-id="${this.escapeHTML(expense.id)}">
                                                Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>

                    </table>
                </div>

            `}

            <p style="margin-top:15px;color:var(--muted);font-size:11px;">
                Showing ${sorted.length} of ${expenses.length} expenses
            </p>
        `);

        this.container.querySelector("#category-filter").value =
            this.selectedCategory;

        // Keep search field focused while typing
        if (searchFocused) {
            const search = this.container.querySelector("#expense-search");

            search.focus();
            search.setSelectionRange(cursorPosition, cursorPosition);
        }
    }

    createFilterOptions() {
        const categories = [
            "All",
            "Food",
            "Transportation",
            "School",
            "Shopping",
            "Bills",
            "Entertainment",
            "Others"
        ];

        return categories.map(category => `
            <option value="${category}">
                ${category === "All" ? "All Categories" : category}
            </option>
        `).join("");
    }

    bindEvents() {

        // SEARCH
        this.on("input", "#expense-search", (event, input) => {
            this.searchTerm = input.value;

            this.container.dispatchEvent(
                new CustomEvent("expense:filter")
            );
        });

        // FILTER
        this.on("change", "#category-filter", (event, select) => {
            this.selectedCategory = select.value;

            this.container.dispatchEvent(
                new CustomEvent("expense:filter")
            );
        });

        // EDIT
        this.on("click", ".edit-button", (event, button) => {
            this.container.dispatchEvent(
                new CustomEvent("expense:edit", {
                    detail: { id: button.dataset.id }
                })
            );
        });

        // DELETE - NO CONFIRMATION POPUP
        this.on("click", ".delete-button", (event, button) => {
            this.container.dispatchEvent(
                new CustomEvent("expense:delete", {
                    detail: { id: button.dataset.id }
                })
            );
        });
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

    currency(amount) {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
        }).format(amount);
    }

    formatDate(date) {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-PH",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    }
}
