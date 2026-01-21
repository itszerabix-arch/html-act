document.addEventListener('DOMContentLoaded', function() {
    console.log("Calculator loaded!");
    
    //Select by the specific classes .plus and .minus
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const quantities = document.querySelectorAll('.quantity');
    
    console.log(`Found ${plusButtons.length} plus buttons`);
    console.log(`Found ${minusButtons.length} minus buttons`);
    console.log(`Found ${quantities.length} quantity displays`);
    
    // Add click events to PLUS buttons
    plusButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Plus button ${index} clicked`);
            
            // Get the current quantity
            let current = parseInt(quantities[index].textContent);
            
            // Increase the quantity
            quantities[index].textContent = current + 1;
            
            console.log(`Quantity increased from ${current} to ${current + 1}`);
            
            // Update the cart status
            updateCartStatus();
        });
    });
    
    // Add click events to MINUS buttons
    minusButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Minus button ${index} clicked`);
            
            // Get the current quantity
            let current = parseInt(quantities[index].textContent);
            
            // Decrease the quantity if it's more than 0
            if (current > 0) {
                quantities[index].textContent = current - 1;
                console.log(`Quantity decreased from ${current} to ${current - 1}`);
            } else {
                console.log(`Quantity is already 0, can't decrease`);
            }
            
            // Update the cart status
            updateCartStatus();
        });
    });
    
    function updateCartStatus() {
        const emptyCart = document.getElementById('emptyCart');
        const summary = document.getElementById('summary');
        const hasItems = Array.from(quantities).some(q => parseInt(q.textContent) > 0);
        
        console.log(`Has items in cart: ${hasItems}`);
        
        if (hasItems) {
            emptyCart.style.display = 'none';
            summary.style.display = 'block';
            
            // Calculate and display the order totals
            calculateOrderTotal();
        } else {
            emptyCart.style.display = 'block';
            summary.style.display = 'none';
        }
    }
    
    function calculateOrderTotal() {
        const menuItems = document.querySelectorAll('.menu-item');
        let subtotal = 0;
        
        menuItems.forEach((item, index) => {
            const quantity = parseInt(quantities[index].textContent);
            const priceElement = item.querySelector('.item-price');
            const priceText = priceElement.textContent;
            // Remove the ¥ symbol and convert to number
            const price = parseInt(priceText.replace('¥', ''));
            
            if (quantity > 0) {
                subtotal += price * quantity;
            }
        });
        
        // Get tax rate (default to 8%)
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 8;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        
        // Update the display
        document.getElementById('subtotal').textContent = `¥${subtotal}`;
        document.getElementById('taxAmount').textContent = `¥${Math.round(taxAmount)}`;
        document.getElementById('total').textContent = `¥${Math.round(total)}`;
        document.getElementById('taxPercent').textContent = taxRate;
        
        console.log(`Subtotal: ¥${subtotal}, Tax: ¥${taxAmount}, Total: ¥${total}`);
    }
    
    // Add tax slider functionality
    const taxSlider = document.getElementById('taxRate');
    const taxValue = document.getElementById('taxValue');
    
    if (taxSlider) {
        taxSlider.addEventListener('input', function() {
            if (taxValue) {
                taxValue.textContent = `${this.value}%`;
            }
            calculateOrderTotal();
        });
    }
    
    // Update tax button
    const updateTaxButton = document.getElementById('updateTax');
    if (updateTaxButton) {
        updateTaxButton.addEventListener('click', function() {
            const taxInput = document.getElementById('taxRate');
            const taxPercent = document.getElementById('taxPercent');
            
            if (taxInput && taxPercent) {
                taxPercent.textContent = taxInput.value;
                calculateOrderTotal();
                
                // Visual feedback
                this.innerHTML = '<i class="fas fa-check"></i> UPDATED!';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> SET';
                }, 1000);
            }
        });
    }
    
    // Reset button
    const resetButton = document.getElementById('resetBtn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm("Are you sure you want to reset your order?")) {
                // Reset all quantities to 0
                quantities.forEach(q => {
                    q.textContent = '0';
                });
                
                // Reset tax to default
                const taxInput = document.getElementById('taxRate');
                if (taxInput) taxInput.value = '8';
                
                const taxValueDisplay = document.getElementById('taxValue');
                if (taxValueDisplay) taxValueDisplay.textContent = '8%';
                
                const taxPercent = document.getElementById('taxPercent');
                if (taxPercent) taxPercent.textContent = '8';
                
                // Update display
                updateCartStatus();
                
                console.log("Order reset!");
            }
        });
    }
    
    // Checkout button
    const checkoutButton = document.getElementById('checkoutBtn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const total = document.getElementById('total').textContent;
            alert(`Order Complete!\n\nTotal: ${total}\n\nThank you for your order!`);
            
            // Reset after checkout
            quantities.forEach(q => {
                q.textContent = '0';
            });
            updateCartStatus();
            
            console.log("Checkout completed!");
        });
    }
    
    // Initialize on page load
    updateCartStatus();
});