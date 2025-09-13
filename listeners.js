// Add all listerns for the page of index.html, 
// all functionalities will be in utils.js

var dom = {
    form: document.querySelector('.form'),
    inputTypes: document.querySelectorAll('.inputs select'),
    addInput: document.querySelector('.add-button'),
    button: document.querySelector('button[type="submit"]'),
    inputs: document.querySelector('.inputs'),
    removeButtons: document.querySelectorAll('.remove-button'),
    modalRemoveButton: document.querySelector('.modal .close-button'),
    modal: document.querySelector('.modal'),
    modalContent: document.querySelector('.modal .modal-content'),
    summaryDetails: document.querySelector('.summary-details'),
    modalSpinner: document.querySelector('.modal .spinner'),
};