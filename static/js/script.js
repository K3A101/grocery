// Default SortableJSNo
import Sortable from '/node_modules/sortablejs/modular/sortable.esm.js';
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

    const listItems = document.querySelectorAll('.item');
    let count = document.querySelector('.amount');
    let itemCount = listItems.length;
    if (itemCount > 1) {
        count.textContent = itemCount.toString();
    } else {
        count.textContent = '0';
    }
    listItems.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            item.classList.toggle('checked');
        })
    })

    const toggleViewButton = document.querySelector('.js-toggle-view-button');
    toggleViewButton.addEventListener('click', (e) => {
        e.preventDefault();
        const listContainer = document.querySelector('.items');
        listContainer.classList.toggle('block');

        // Toggle the SVG icon
        const svgUse = toggleViewButton.querySelector('use');
        const currentHref = svgUse.getAttribute('href');

        if (currentHref.includes('list-view')) {
            svgUse.setAttribute('href', '/svg/general.svg#block-view');
        } else {
            svgUse.setAttribute('href', '/svg/general.svg#list-view');

        }
    })

    const container = document.querySelector('.items');

    let sortable = new Sortable(container,{
        animation: 150,
        ghostClass: 'blue-background-class'
    });

    // Delete item functionality
    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const itemId = button.getAttribute('data-id');
            const listItem = button.closest('.item');

            try {
                const response = await fetch(`/delete-item/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Remove the item from the DOM
                    listItem.remove();

                    // Update the count
                    const remainingItems = document.querySelectorAll('.item');
                    count.textContent = remainingItems.length > 0 ? remainingItems.length.toString() : '0';

                    console.log('Item deleted successfully');
                } else {
                    console.error('Failed to delete item');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        });
    });

    // Image preview functionality
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewContainer = document.querySelector('.image-preview-container');

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];

            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.style.display = 'block';
                };

                reader.readAsDataURL(file);
            } else {
                // Hide preview if no valid image is selected
                imagePreviewContainer.style.display = 'none';
                imagePreview.src = '#';
            }
        });
    }

})