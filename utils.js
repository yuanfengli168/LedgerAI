// utils controls all listeners from listeners.js
var addInputButtonDiv = document.querySelector('.add-button-div');
var addInputButton = dom.addInput;
var form = dom.form;
var inputs = dom.inputs;
var removeButtons = dom.removeButtons;

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
                <span>Start Date</span>
                <input type="date" name="startDate" placeholder="Date" style="display: inline-block;">
                <span>End Date</span>
                <input type="date" name="endDate" placeholder="Date" style="display: inline-block;">

                <p>Description</p>
                <input type="text" name="description" placeholder="Description">
                <input type="number" name="spending" placeholder="Total Spending">
                <input type="number" name="income" placeholder="Total Income">

                
            </div>
            <div class="excel-inputs" >
                <input type="text" name="description" placeholder="Description">
                <input type="file" name="excel-file" accept=".xlsx, .xls">
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