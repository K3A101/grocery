document.addEventListener("DOMContentLoaded", () => {

    const stepQuantity = (button, delta) => {
        const input = button.closest('.input-number-group').querySelector('.js-item-qty');
        const val = parseInt(input.value, 10) || 0;
        input.value = Math.max(1, val + delta);
        input.dispatchEvent(new Event('change', {bubbles: true}));
    }

    document.querySelectorAll('.input-number-increment').forEach((el) => {
        el.addEventListener('click', () => {
            stepQuantity(el, 1);
        });
    });

    document.querySelectorAll('.input-number-decrement').forEach((el) => {
        el.addEventListener('click', () => {
            stepQuantity(el, -1);
        });
    });



})