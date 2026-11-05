
export default class View {
    constructor(selector) {
        this.container = document.querySelector(selector);

        if (!this.container) {
            throw new Error(`Element not found: ${selector}`);
        }
    }

    render(content) {
        this.container.innerHTML = content;
    }

    on(event, selector, callback) {
        this.container.addEventListener(event, (e) => {
            const target = e.target.closest(selector);

            if (target && this.container.contains(target)) {
                callback(e, target);
            }
        });
    }
}
