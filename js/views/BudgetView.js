
import View from "../View.js";

export default class BudgetView extends View {
    constructor() {
        super("#budget-container");
        this.bindEvents();
    }

    renderBudget(model) {
        const budget = model.getBudget();
        const spent = model.getTotalExpenses();
        const remaining = model.getRemainingBudget();

        const percentage = budget > 0
            ? (spent / budget) * 100
            : 0;

        const progress = Math.min(percentage, 100);
        const exceeded = budget > 0 && remaining < 0;

        this.render(`
            <div class="budget-layout">

                <form id="budget-form" class="budget-form">

                    <label for="available-money">
                        Available Money (₱)
                    </label>

                    <input
                        type="number"
                        id="available-money"
                        min="0"
                        max="100000000"
                        step="0.01"
                        placeholder="Enter your available money"
                        value="${budget || ""}"
                    >

                    <div class="budget-slider-heading">
                        <label for="budget-slider">
                            Quick Adjustment
                        </label>

                        <span>₱50 increments</span>
                    </div>

                    <input
                        type="range"
                        id="budget-slider"
                        min="0"
                        max="100000"
                        step="50"
                        value="${Math.min(budget, 100000)}"
                    >

                    <div class="slider-labels">
                        <span>₱0</span>
                        <span>₱100,000</span>
                    </div>

                    <div class="budget-actions">

                        <button type="submit" class="primary-button">
                            Save Budget
                        </button>

                        <button
                            type="button"
                            id="clear-budget"
                            class="cancel-button">
                            Clear Budget
                        </button>

                    </div>

                    <span id="budget-error" class="form-error"></span>

                </form>

                <div class="budget-stats">

                    <h3>Budget Summary ♡</h3>

                    <div class="budget-stat-row">
                        <span>Available Budget</span>
                        <strong>${this.currency(budget)}</strong>
                    </div>

                    <div class="budget-stat-row">
                        <span>Total Spent</span>
                        <strong>${this.currency(spent)}</strong>
                    </div>

                    <div class="budget-stat-row">
                        <span>Remaining Balance</span>

                        <strong style="color:${exceeded ? "#C14F69" : "var(--primary-dark)"}">
                            ${this.currency(remaining)}
                        </strong>
                    </div>

                    <div class="progress-track">
                        <div
                            class="progress-fill"
                            style="
                                width:${progress}%;
                                background:${exceeded ? "#C14F69" : "var(--primary)"};
                            ">
                        </div>
                    </div>

                    <p class="budget-warning ${exceeded ? "danger" : ""}">
                        ${budget === 0
                            ? "No budget set. Enter your available money to start."
                            : exceeded
                                ? "Warning! You have exceeded your available budget."
                                : `${percentage.toFixed(1)}% of your budget has been spent.`
                        }
                    </p>

                </div>

            </div>
        `);

        this.bindSliderEvents();
    }

    bindEvents() {

        // SAVE BUDGET
        this.on("submit", "#budget-form", event => {
            event.preventDefault();

            const input = this.container.querySelector("#available-money");
            const error = this.container.querySelector("#budget-error");

            const amount = input.value.trim();
            const value = Number(amount);

            error.textContent = "";

            if (
                amount === "" ||
                !Number.isFinite(value) ||
                value < 0 ||
                value > 100000000
            ) {
                error.textContent = "Please enter a valid budget amount.";
                input.focus();
                return;
            }

            this.container.dispatchEvent(
                new CustomEvent("budget:update", {
                    detail: { amount: value }
                })
            );
        });

        // CLEAR BUDGET
        this.on("click", "#clear-budget", () => {
            this.container.dispatchEvent(
                new CustomEvent("budget:clear")
            );
        });
    }

    // SLIDER AND CUSTOM INPUT
    bindSliderEvents() {
        const slider = this.container.querySelector("#budget-slider");
        const input = this.container.querySelector("#available-money");

        // Slider changes the custom amount
        slider.addEventListener("input", () => {
            input.value = slider.value;
        });

        // Custom amount also adjusts the slider
        input.addEventListener("input", () => {
            const value = Number(input.value);

            if (input.value.trim() !== "" && Number.isFinite(value)) {
                slider.value = Math.max(0, Math.min(value, 100000));
            }
        });
    }

    currency(amount) {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
        }).format(amount);
    }
}
