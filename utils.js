// utils controls all listeners from listeners.js
var addInputButtonDiv = document.querySelector('.add-button-div');
var addInputButton = dom.addInput;
var form = dom.form;
var inputs = dom.inputs;
var removeButtons = dom.removeButtons;

// 自动设置本月第一天和最后一天为默认值
window.addEventListener('DOMContentLoaded', function() {
    var startDateInput = document.getElementById('startDate');
    var endDateInput = document.getElementById('endDate');
    var now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    function formatDateLocal(date) {
        let yyyy = date.getFullYear();
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    startDateInput.value = formatDateLocal(firstDay);
    endDateInput.value = formatDateLocal(lastDay);
});


addInputButton.addEventListener('click', function (event) {
    event.preventDefault();
    var newInputItem = document.createElement('div');
    newInputItem.classList.add('input-item');
    newInputItem.innerHTML = `
        <select name="type">
            <option value="excel">Upload Excel</option>
            <option value="manual">Manual Inputs</option>
        </select>
        <div class="input-variants" >
            <div class="manual-inputs" style="display: none;">
                <p>Description</p>
                <input type="text" name="description" placeholder="Description">
                <input type="number" name="spending" placeholder="Total Spending">
                <select name="spending-currency">
                    <option value="sgd">SGD</option>
                    <option value="usd">USD</option>
                    <option value="rmb">RMB</option>
                </select>
                <input type="number" name="income" placeholder="Total Income">
                <select name="income-currency">
                    <option value="sgd">SGD</option>
                    <option value="usd">USD</option>
                    <option value="rmb">RMB</option>
                </select>
                <!-- add an check box indicating that spending and income currecies are not synced -->
                <label>
                    <input type="checkbox" name="currency-sync" checked>
                    Keep Spending and Income Currencies in Sync
                </label>
                
            </div>
            <div class="excel-inputs" >
                <input type="text" name="description" placeholder="Description">
                <input type="file" name="excel-file" accept=".xlsx, .xls, .csv">
                <span>Currency:</span>
                <select name="file-currency">    
                    <option value="sgd">SGD</option>
                    <option value="usd">USD</option>
                    <option value="rmb">RMB</option>
                </select>
            </div>
        </div>
        <div class="remove-button-div">
            <button class="remove-button" type="button">Remove</button>
        </div>
    `;


    inputs.appendChild(newInputItem);
});


// Use event delegation for remove buttons
inputs.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-button')) {
        const inputItem = event.target.closest('.input-item');
        if (inputItem) {
            inputItem.remove();
        }
    }
});


// Use event delegation for select change
inputs.addEventListener('change', function (event) {
    if (event.target.matches('select[name="type"]')) {
        var select = event.target;
        var inputVariants = select.closest('.input-item').querySelector('.input-variants');
        var manualInputs = inputVariants.querySelector('.manual-inputs');
        var excelInputs = inputVariants.querySelector('.excel-inputs');

        if (select.value === 'manual') {
            manualInputs.style.display = 'block';
            excelInputs.style.display = 'none';
        } else {
            manualInputs.style.display = 'none';
            excelInputs.style.display = 'block';
        }
    }
});

// checker function to validate all inputs before submission
function validateInputs() {
    var inputItems = inputs.querySelectorAll('.input-item');
    if (inputItems.length === 0) {
        alert('Please add at least one input item.');
        return false;
    }

    for (var i = 0; i < inputItems.length; i++) {
        var item = inputItems[i];
        var type = item.querySelector('select[name="type"]').value;

        if (type === 'excel') {
            var fileInput = item.querySelector('input[type="file"]');
            if (fileInput.files.length === 0) {
                alert(`Please select a file for Excel input ${i + 1}.`);
                return false;
            }
        } else if (type === 'manual') {
            var spendingInput = item.querySelector('input[name="spending"]');
            var incomeInput = item.querySelector('input[name="income"]');
            if (spendingInput.value === '' && incomeInput.value === '') {
                alert(`Please enter at least one of Spending or Income for Manual input ${i + 1}.`);
                return false;
            }
            if (spendingInput.value !== '' && isNaN(spendingInput.value)) {
                alert(`Please enter a valid number for Spending in Manual input ${i + 1}.`);
                return false;
            }
            if (incomeInput.value !== '' && isNaN(incomeInput.value)) {
                alert(`Please enter a valid number for Income in Manual input ${i + 1}.`);
                return false;
            }
        }
    }

    // Validate overall date range if provided
    var startDateInput = form.querySelector('input[name="startDate"]').value;
    var endDateInput = form.querySelector('input[name="endDate"]').value;

    if (startDateInput.length === 0 || (startDateInput && isNaN(Date.parse(startDateInput)))) {
        alert('Please enter a valid Start Date.');
        return false;
    }
    if (endDateInput.length === 0 || (endDateInput && isNaN(Date.parse(endDateInput)))) {
        alert('Please enter a valid End Date.');
        return false;
    }
    if (startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput)) {
        alert('Start Date cannot be later than End Date.');
        return false;
    }

    return true;
}   


// Form submission handler
form.addEventListener('submit', function (event) {
    event.preventDefault();
    // call a checker function to validate all inputs
    if (!validateInputs()) {
        return;
    }

    // Show the modal
    dom.modal.classList.remove('hidden');
    dom.modal.classList.add('shown');

    // Prepare FormData to send to backend  
    var formData = new FormData();

    var inputItems = inputs.querySelectorAll('.input-item');
    inputItems.forEach(function (item, index) {
        var type = item.querySelector('select[name="type"]').value;
        if (type === 'excel') {
            var fileInput = item.querySelector('input[type="file"]');
            var descriptionInput = item.querySelector('.excel-inputs input[name="description"]');
            if (fileInput.files.length > 0) {
                formData.append('files', fileInput.files[0]);
                var fileCurrency = item.querySelector('select[name="file-currency"]').value;
                formData.append('texts', `File ${index + 1}, Currency: ${fileCurrency}, description: ${descriptionInput.value ||'no description'}`);           
             }
        } else if (type === 'manual') {
            var description = item.querySelector('.manual-inputs input[name="description"]').value;
            var spending = item.querySelector('.manual-inputs input[name="spending"]').value;
            var spendingCurrency = item.querySelector('.manual-inputs select[name="spending-currency"]').value;
            var income = item.querySelector('.manual-inputs input[name="income"]').value;
            var incomeCurrency = item.querySelector('.manual-inputs select[name="income-currency"]').value;

            var manualText = `Manual Entry ${index + 1}:\n` +
                `Description: ${description}\n` +
                `Total Spending: ${spending} ${spendingCurrency}\n` +
                `Total Income: ${income} ${incomeCurrency}\n`;

            formData.append('texts', manualText);
        }
    });

    var startDateInput = form.querySelector('input[name="startDate"]').value;
    var endDateInput = form.querySelector('input[name="endDate"]').value;
    if (startDateInput) formData.append('texts', `Overall Start Date: ${startDateInput}`);
    if (endDateInput) formData.append('texts', `Overall End Date: ${endDateInput}`);

    // Now formData contains all files and texts, ready to be sent to backend
    console.log('Form Data Prepared for Submission:');

    // For demonstration, log the FormData entries
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
    // using method from api.js to send formData to backend and receive converted JSON
    convert(formData).then(result => {
        console.log(result.status);

        console.log('Conversion Result:', result);
        // hide the spinner
        dom.modalSpinner.classList.add('hidden');
        dom.modalSpinner.classList.remove('shown');
        // display the success message in the modal content, similar style as error but with green check icon
        dom.summaryDetails.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; border: 2px solid green; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: green; font-size: 16px;">&#10003;</span>
                </div>
                <h2>Data Received & Processed!</h2>
            </div>
        `;

    }).catch(error => {
        console.error('Error during conversion:', error);
        // hide the spinner
        dom.modalSpinner.classList.add('hidden');
        dom.modalSpinner.classList.remove('shown');
        // display the error in the modal content, similar style as success but with red cross icon
        dom.summaryDetails.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; border: 2px solid red; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: red; font-size: 16px;">&#10005;</span>
                </div>
                <h2>Error</h2>
            </div>
            <p>${error.message}! Please try again later.</p>
        `;
    });
});// api.js - 前端与后端交互的基础封装

// add event listener to close the modal when clicking the close button
dom.modalRemoveButton.addEventListener('click', function () {
    dom.modal.classList.remove('shown');
    dom.modal.classList.add('hidden');
    // reset the modal content to initial state
    dom.summaryDetails.innerHTML = "";
    // put the <div class="spinner"></div> to shown
    dom.modalSpinner.classList.remove('hidden');
    dom.modalSpinner.classList.add('shown');
});

// add event listener to close the modal when clicking outside the modal content
dom.modal.addEventListener('click', function (event) {
    if (event.target === dom.modal) {
        dom.modal.classList.remove('shown');
        dom.modal.classList.add('hidden');
        // reset the modal content to initial state
        dom.summaryDetails.innerHTML = "";
        // put the <div class="spinner"></div> to shown
        dom.modalSpinner.classList.remove('hidden');
        dom.modalSpinner.classList.add('shown');
    }
})


// add an event listener to keep the spending currency and income currency in the same input-item in sync
inputs.addEventListener('change', function (event) {
    if (event.target.matches('select[name="spending-currency"]') && event.target.closest('.input-item').querySelector('input[name="currency-sync"]').checked) {
        var spendingCurrency = event.target.value;
        var incomeCurrencySelect = event.target.closest('.input-item').querySelector('select[name="income-currency"]');
        if (incomeCurrencySelect.value !== spendingCurrency) {
            incomeCurrencySelect.value = spendingCurrency;
        }
    } else if (event.target.matches('select[name="income-currency"]') && event.target.closest('.input-item').querySelector('input[name="currency-sync"]').checked) {
        var incomeCurrency = event.target.value;
        var spendingCurrencySelect = event.target.closest('.input-item').querySelector('select[name="spending-currency"]');
        if (spendingCurrencySelect.value !== incomeCurrency) {
            spendingCurrencySelect.value = incomeCurrency;
        }
    }
});