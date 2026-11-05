
import View from "../View.js";

export default class SummaryView extends View {
    constructor() {
        super("#summary-container");
    }

    renderSummary(model) {
        const total = model.getTotalExpenses();
        const count = model.getTransactionCount();
        const average = model.getAverageExpense();
        const remaining = model.getRemainingBudget();

        const cards = [
            {
                icon: "♡",
                label: "Available Budget",
                value: this.currency(model.getBudget())
            },
            {
                icon: "↗",
                label: "Total Expenses",
                value: this.currency(total)
            },
            {
                icon: "♧",
                label: "Remaining Balance",
                value: this.currency(remaining),
                warning: remaining < 0
            },
            {
                icon: "▤",
                label: "Transactions",
                value: count
            }
        ];

        this.render(cards.map(card => `
            <div class="summary-card">
                <div class="summary-icon">${card.icon}</div>
                <p>${card.label}</p>

                <h3 style="${card.warning ? "color:var(--danger)" : ""}">
                    ${card.value}
                </h3>
            </div>
        `).join(""));
    }

    currency(amount) {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
        }).format(amount);
    }
}
