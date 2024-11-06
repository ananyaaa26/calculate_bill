// Function to find item details from items array
const findItem = (itemId, items) => {
    return items.find(item => item.id === itemId);
};

// Function to find category details from categories array
const findCategory = (categoryId, categories) => {
    return categories.find(category => category.id === categoryId);
};

// Task 1: Basic bill structure with item names
function generateBasicBillStructure(bill, items) {
    return {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = findItem(billItem.id, items);
            return {
                id: billItem.id,
                name: item ? item.itemName : 'Unknown Item',
                quantity: billItem.quantity
            };
        })
    };
}

// Task 2: Detailed bill structure with calculations
function generateDetailedBillStructure(bill, items, categories) {
    let totalBillAmount = 0;
    
    const detailedBill = {
        id: bill.id,
        billNumber: bill.billNumber,
        opentime: bill.opentime,
        customerName: bill.customerName,
        billItems: bill.billItems.map(billItem => {
            const item = findItem(billItem.id, items);
            if (!item) return null;
            
            const category = findCategory(item.category.categoryId, categories);
            
            // Calculate base amount
            let amount = item.rate * billItem.quantity;
            
            // Apply discount if present
            if (billItem.discount) {
                const discountAmount = billItem.discount.isInPercent === 'Y' 
                    ? (amount * billItem.discount.rate / 100)
                    : billItem.discount.rate;
                amount -= discountAmount;
            }
            
            // Apply taxes
            let taxAmount = 0;
            if (item.taxes) {
                taxAmount = item.taxes.reduce((acc, tax) => {
                    const taxValue = tax.isInPercent === 'Y'
                        ? (amount * tax.rate / 100)
                        : tax.rate;
                    return acc + taxValue;
                }, 0);
                amount += taxAmount;
            }
            
            totalBillAmount += amount;
            
            return {
                id: billItem.id,
                name: item.itemName,
                quantity: billItem.quantity,
                discount: billItem.discount,
                taxes: item.taxes,
                amount: Number(amount.toFixed(2)),
                superCategoryName: category?.superCategory?.superCategoryName || '',
                categoryName: category?.categoryName || ''
            };
        }).filter(item => item !== null),
        "Total Amount": Number(totalBillAmount.toFixed(2))
    };
    
    return detailedBill;
}

export { generateBasicBillStructure, generateDetailedBillStructure };