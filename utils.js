// 渲染 review-table 区域
function renderReviewTable(result) {
    var reviewTableDiv = document.querySelector('.review-table');
    if (!reviewTableDiv) return;
    reviewTableDiv.classList.remove('hidden');
    reviewTableDiv.innerHTML = '';

    // 顶部 h2
    var h2 = document.createElement('h2');
    h2.textContent = 'Review - tables';
    reviewTableDiv.appendChild(h2);

    // 1. Excels 区域
    if (result.files && result.files.length > 0) {
        var excelsH3 = document.createElement('h3');
        excelsH3.textContent = 'Excels';
        reviewTableDiv.appendChild(excelsH3);
        result.files.forEach(function(file, idx) {
            if (file.table && file.table.length > 0) {
                var section = document.createElement('div');
                section.className = 'review-section';
                // 用 file_descriptions[i] 作为 h4
                var desc = (result.file_descriptions && result.file_descriptions[idx]) ? result.file_descriptions[idx] : `Excel ${idx+1}`;
                section.innerHTML = `<h4>${desc}</h4>`;
                section.appendChild(createReviewTable(file.header, file.table, 'excel', idx));
                reviewTableDiv.appendChild(section);
                // 分隔
                var divider = document.createElement('div');
                divider.className = 'section-divider';
                reviewTableDiv.appendChild(divider);
            }
        });
    }
    // 2. Manual Inputs 区域
    if (result.manual_entries && result.manual_entries.length > 0) {
        var manualH3 = document.createElement('h3');
        manualH3.textContent = 'Manual Inputs';
        reviewTableDiv.appendChild(manualH3);
        result.manual_entries.forEach(function(entry, idx) {
            // ...existing code for manual entry table rendering...
            var match = entry.match(/^Manual Entry (\d+):[\r\n]+Description: (.*)[\r\n]+Total Spending: ([^\s]*) ?(\w+)?[\r\n]+Total Income: ([^\s]*) ?(\w+)?/);
            var entryNum = idx + 1;
            var desc = '', spending = '', spendingCurrency = 'sgd', income = '', incomeCurrency = 'sgd';
            if (match) {
                desc = match[2] || '';
                spending = match[3] || '0';
                spendingCurrency = match[4] || 'sgd';
                income = match[5] || '0';
                incomeCurrency = match[6] || 'sgd';
            } else {
                var lines = entry.split(/\r?\n/);
                desc = (lines[1] || '').replace('Description:','').trim();
                var spendingParts = (lines[2] || '').replace('Total Spending:','').trim().split(' ');
                spending = spendingParts[0] || '0';
                spendingCurrency = spendingParts[1] || 'sgd';
                var incomeParts = (lines[3] || '').replace('Total Income:','').trim().split(' ');
                income = incomeParts[0] || '0';
                incomeCurrency = incomeParts[1] || 'sgd';
            }
            var section = document.createElement('div');
            section.className = 'review-section';
            section.innerHTML = `<h4>Manual Entry ${entryNum}</h4>`;
            // 构造表格
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var trh = document.createElement('tr');
            ['Description','Total Spending','Spending Currency','Total Income','Income Currency','Actions'].forEach(function(h){
                var th = document.createElement('th'); th.textContent = h; trh.appendChild(th);
            });
            thead.appendChild(trh); table.appendChild(thead);
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            // Description
            var tdDesc = document.createElement('td');
            var inputDesc = document.createElement('input');
            inputDesc.value = desc;
            tdDesc.appendChild(inputDesc);
            tr.appendChild(tdDesc);
            // Spending
            var tdSpend = document.createElement('td');
            var inputSpend = document.createElement('input');
            inputSpend.value = spending;
            tdSpend.appendChild(inputSpend);
            tr.appendChild(tdSpend);
            // Spending Currency
            var tdSpendCur = document.createElement('td');
            var selectSpendCur = document.createElement('select');
            ['sgd','usd','rmb'].forEach(function(opt){
                var option = document.createElement('option');
                option.value = opt; option.textContent = opt.toUpperCase();
                if (spendingCurrency === opt) option.selected = true;
                selectSpendCur.appendChild(option);
            });
            tdSpendCur.appendChild(selectSpendCur);
            tr.appendChild(tdSpendCur);
            // Income
            var tdIncome = document.createElement('td');
            var inputIncome = document.createElement('input');
            inputIncome.value = income;
            tdIncome.appendChild(inputIncome);
            tr.appendChild(tdIncome);
            // Income Currency
            var tdIncomeCur = document.createElement('td');
            var selectIncomeCur = document.createElement('select');
            ['sgd','usd','rmb'].forEach(function(opt){
                var option = document.createElement('option');
                option.value = opt; option.textContent = opt.toUpperCase();
                if (incomeCurrency === opt) option.selected = true;
                selectIncomeCur.appendChild(option);
            });
            tdIncomeCur.appendChild(selectIncomeCur);
            tr.appendChild(tdIncomeCur);
            // Actions 按钮
            var tdAction = document.createElement('td');
            var btn = document.createElement('button');
            btn.className = 'action-btn delete-btn';
            btn.textContent = '删除';
            var deleted = false;
            btn.addEventListener('click', function() {
                deleted = !deleted;
                if (deleted) {
                    tr.classList.add('deleted');
                    btn.className = 'action-btn restore-btn';
                    btn.textContent = '恢复';
                    Array.from(tr.querySelectorAll('input,select')).forEach(i => i.disabled = true);
                } else {
                    tr.classList.remove('deleted');
                    btn.className = 'action-btn delete-btn';
                    btn.textContent = '删除';
                    Array.from(tr.querySelectorAll('input,select')).forEach(i => i.disabled = false);
                }
            });
            tdAction.appendChild(btn);
            tr.appendChild(tdAction);
            tbody.appendChild(tr); table.appendChild(tbody);
            section.appendChild(table);
            reviewTableDiv.appendChild(section);
        });
    }

    // Render confirm-submit button at the end of reviewTableDiv
    var existingConfirmDiv = reviewTableDiv.querySelector('.confirm-submit-div');
    if (existingConfirmDiv) {
        existingConfirmDiv.style.display = 'block';
        reviewTableDiv.appendChild(existingConfirmDiv);
    } else {
        var confirmDiv = document.createElement('div');
        confirmDiv.className = 'confirm-submit-div';
        confirmDiv.style.textAlign = 'center';
        confirmDiv.style.margin = '24px 0';
        confirmDiv.style.display = 'block';
        var btn = document.createElement('button');
        btn.id = 'confirmSubmitBtn';
        btn.className = 'action-btn';
        btn.style.fontSize = '1.1em';
        btn.style.padding = '8px 32px';
        btn.textContent = 'Confirm and Submit!';
        confirmDiv.appendChild(btn);
        reviewTableDiv.appendChild(confirmDiv);
        // Attach handler if not already
        btn.addEventListener('click', handleConfirmSubmit);
    }
}

// Collect reviewed data from review tables (Excels and Manual Inputs)
function collectReviewedData() {
    var excels = [];
    var reviewSections = document.querySelectorAll('.review-section');
    reviewSections.forEach(function(section) {
        var h4 = section.querySelector('h4');
        if (!h4) return;
        var title = h4.textContent;
        var table = section.querySelector('table');
        var headers = [];
        var rows = [];
        if (!table) return;
        var thead = table.querySelector('thead tr');
        if (thead) {
            headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent).filter(h => h !== 'Actions');
        }
        var tbody = table.querySelector('tbody');
        if (tbody) {
            Array.from(tbody.querySelectorAll('tr')).forEach(function(tr) {
                var row = {};
                var tds = tr.querySelectorAll('td');
                for (var i = 0; i < headers.length; i++) {
                    var input = tds[i].querySelector('input,select');
                    row[headers[i]] = input ? input.value : '';
                }
                row._deleted = tr.classList.contains('deleted');
                rows.push(row);
            });
        }
        // Heuristic: if table has Transaction Date etc, treat as Excel
        if (headers.includes('Transaction Date')) {
            // Try to get currency from title or section
            var desc = title;
            excels.push({ description: desc, headers, rows });
        }
    });
    // Manual Inputs
    var manual_entries = [];
    reviewSections.forEach(function(section) {
        var h4 = section.querySelector('h4');
        if (!h4) return;
        var title = h4.textContent;
        var table = section.querySelector('table');
        var headers = [];
        if (!table) return;
        var thead = table.querySelector('thead tr');
        if (thead) {
            headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent).filter(h => h !== 'Actions');
        }
        if (headers.includes('Description') && headers.includes('Total Spending')) {
            var tr = table.querySelector('tbody tr');
            if (tr) {
                var tds = tr.querySelectorAll('td');
                manual_entries.push({
                    description: tds[0].querySelector('input').value,
                    spending: tds[1].querySelector('input').value,
                    spending_currency: tds[2].querySelector('select').value,
                    income: tds[3].querySelector('input').value,
                    income_currency: tds[4].querySelector('select').value,
                    _deleted: tr.classList.contains('deleted')
                });
            }
        }
    });
    // Date range
    var start = document.getElementById('startDate')?.value || '';
    var end = document.getElementById('endDate')?.value || '';
    return { excels, manual_entries, date_range: { start, end } };
}

// Confirm and Submit handler
function handleConfirmSubmit(event) {
    event.preventDefault();
    var btn = document.getElementById('confirmSubmitBtn');
    var reviewedData = collectReviewedData();
    // debug log by printing reviewedData to console
    console.log('Reviewed Data to Submit:', reviewedData);


    // Show modal spinner
    dom.modal.classList.remove('hidden');
    dom.modal.classList.add('shown');
    dom.modalSpinner.classList.remove('hidden');
    dom.modalSpinner.classList.add('shown');
    // Use global API function to submit reviewed data
    submitReviewedData(reviewedData)
        .then(data => {
            dom.modalSpinner.classList.add('hidden');
            dom.modalSpinner.classList.remove('shown');
            dom.summaryDetails.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 24px; height: 24px; border: 2px solid green; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="color: green; font-size: 16px;">&#10003;</span>
                    </div>
                    <h2>Review Data Submitted!</h2>
                </div>
            `;
            // Collapse review-table section
            var reviewTableDiv = document.querySelector('.review-table');
            if (reviewTableDiv) {
                reviewTableDiv.classList.add('collapsed');
            }

            // we would like to render the data's content in the class="AI-chat-section hidden" section
            var aiChatSection = dom.aiChatSection
            if (aiChatSection) {
                aiChatSection.classList.remove('hidden');
                aiChatSection.innerHTML = `
                    <h2>AI Chat Summary</h2>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                    <pre>${data.ai_answer || 'No answer from AI.'}</pre>
                `;
            }
        })
        .catch(error => {
            dom.modalSpinner.classList.add('hidden');
            dom.modalSpinner.classList.remove('shown');
            dom.summaryDetails.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 24px; height: 24px; border: 2px solid red; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="color: red; font-size: 16px;">&#10005;</span>
                    </div>
                    <h2>Submission Error</h2>
                </div>
                <p>${error.message || 'Please try again later.'}</p>
            `;
        });
}

// Attach handler to confirm button and review-table expand
window.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('confirmSubmitBtn');
    if (btn) btn.addEventListener('click', handleConfirmSubmit);

    // Add expand/collapse listener to review-table
    var reviewTableDiv = document.querySelector('.review-table');
    if (reviewTableDiv) {
        reviewTableDiv.addEventListener('click', function(event) {
            // Only expand if collapsed and click is on the header (h2)
            if (reviewTableDiv.classList.contains('collapsed')) {
                if (event.target.tagName === 'H2') {
                    reviewTableDiv.classList.remove('collapsed');
                }
            }
        });
    }
});

dom.reviewTable.addEventListener('click', function(event) {
    // Only expand if collapsed and click is on the header (h2)
    if (dom.reviewTable.classList.contains('collapsed')) {
        dom.reviewTable.classList.remove('collapsed');
        dom.reviewTable.classList.add('expanded');
    } else if (dom.reviewTable.classList.contains('expanded')) {
        dom.reviewTable.classList.remove('expanded');
        dom.reviewTable.classList.add('collapsed');
    }
});

// 创建可编辑表格
function createReviewTable(header, tableData, type, sectionIdx) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    header.forEach(function(h) {
        var th = document.createElement('th');
        th.textContent = h;
        tr.appendChild(th);
    });
    tr.appendChild(document.createElement('th')).textContent = 'Actions';
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    tableData.forEach(function(row, rowIdx) {
        var tr = document.createElement('tr');
        header.forEach(function(h) {
            var td = document.createElement('td');
            var input = document.createElement('input');
            input.value = row[h] == null ? '' : row[h];
            input.disabled = !!row._deleted;
            input.addEventListener('input', function() {
                row[h] = input.value;
            });
            td.appendChild(input);
            tr.appendChild(td);
        });
        // Actions
        var tdAction = document.createElement('td');
        var btn = document.createElement('button');
        btn.className = 'action-btn ' + (row._deleted ? 'restore-btn' : 'delete-btn');
        btn.textContent = row._deleted ? '恢复' : '删除';
        btn.addEventListener('click', function() {
            row._deleted = !row._deleted;
            if (row._deleted) {
                tr.classList.add('deleted');
                btn.className = 'action-btn restore-btn';
                btn.textContent = '恢复';
                Array.from(tr.querySelectorAll('input')).forEach(i => i.disabled = true);
            } else {
                tr.classList.remove('deleted');
                btn.className = 'action-btn delete-btn';
                btn.textContent = '删除';
                Array.from(tr.querySelectorAll('input')).forEach(i => i.disabled = false);
            }
        });
        tdAction.appendChild(btn);
        tr.appendChild(tdAction);
        if (row._deleted) tr.classList.add('deleted');
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}
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
    if (!validateInputs()) {
        return;
    }

    dom.modal.classList.remove('hidden');
    dom.modal.classList.add('shown');

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
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // using method from api.js to send formData to backend and receive converted JSON
    convert(formData).then(result => {
        console.log(result.status);
        console.log('Conversion Result:', result);
        dom.modalSpinner.classList.add('hidden');
        dom.modalSpinner.classList.remove('shown');
        dom.summaryDetails.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; border: 2px solid green; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: green; font-size: 16px;">&#10003;</span>
                </div>
                <h2>Data Received & Processed!</h2>
            </div>
        `;
        // features 区域加 collapsed
        var featuresDiv = document.querySelector('.features');
        if (featuresDiv) {
            featuresDiv.classList.remove('expanded');
            featuresDiv.classList.add('collapsed');
        }
        // 渲染 review-table 区域
        renderReviewTable(result);
    }).catch(error => {
        console.error('Error during conversion:', error);
        dom.modalSpinner.classList.add('hidden');
        dom.modalSpinner.classList.remove('shown');
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
});

// features 区域点击切换 collapsed/expanded
var featuresDiv = document.querySelector('.features');
if (featuresDiv) {
    featuresDiv.addEventListener('click', function (event) {
        // 避免点击表单等子元素时也触发（只允许点击 features 区域空白或标题时切换）
        if (event.target === featuresDiv || event.target.classList.contains('display-section')) {
            if (featuresDiv.classList.contains('collapsed')) {
                featuresDiv.classList.remove('collapsed');
                featuresDiv.classList.add('expanded');
            } else if (featuresDiv.classList.contains('expanded')) {
                featuresDiv.classList.remove('expanded');
                featuresDiv.classList.add('collapsed');
            }
        }
    });
}

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