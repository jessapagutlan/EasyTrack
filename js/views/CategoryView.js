
import View from "../View.js";

export default class CategoryView extends View {
    constructor() {
        super("#category-container");
    }

    renderCategories(model) {
        const summary = model.getCategorySummary();
        const categories = Object.entries(summary);
        const total = model.getTotalExpenses();

        if (categories.length === 0) {
            this.render(`
                <div class="category-empty">
                    No category data available yet. Add an expense to get started!
                </div>
            `);

            return;
        }

        this.render(`
            <div class="category-list">

                ${categories.map(([category, amount]) => {
                    const percentage = total > 0
                        ? amount / total * 100
                        : 0;

                    return `
                        <div class="category-item">

                            <div class="category-info">
                                <strong>${this.escapeHTML(category)}</strong>

                                <span>
                                    ${this.currency(amount)}
                                    (${percentage.toFixed(1)}%)
                                </span>
                            </div>

                            <div class="progress-track">
                                <div
                                    class="progress-fill"
                                    style="width:${percentage}%">
                                </div>
                            </div>

                        </div>
                    `;
                }).join("")}

            </div>
        `);
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
}
