let cardholder = document.getElementById('cardholder')
let cardNumber = document.getElementById('cardNumber')
let expiry = document.getElementById('expiry')
let cvv = document.getElementById('cvv')
let placeOrder = document.getElementById('placeOrder')

const BORDER = cardholder.style.border

function validateCardholder() {
    let success = cardholder.value.match(/^[A-Z]{2,100} [A-Z]{2,100}$/)
    cardholder.style.border = success ? BORDER : '2px solid red'
    return success
}

function validateCardNumber() {
    let success = cardNumber.value.match(/^\d{4} \d{4} \d{4} \d{4}$/)
    cardNumber.style.border = success ? BORDER : '2px solid red'
    return success
}

function validateExpiry() {
    let success = expiry.value.match(/^\d{2}\/\d{2}$/)
    expiry.style.border = success ? BORDER : '2px solid red'
    return success
}

function validateCVV() {
    let success = cvv.value.match(/^\d{3}$/)
    cvv.style.border = success ? BORDER : '2px solid red'
    return success
}

let ccNumberInput = document.querySelector('.card__number')
let ccNumberPattern = /^\d{0,16}$/g
let ccNumberSeparator = " "
let ccNumberInputOldValue
let ccNumberInputOldCursor

let ccExpiryInput = document.querySelector('.expiry')
let ccExpiryPattern = /^\d{0,4}$/g
let ccExpirySeparator = "/"
let ccExpiryInputOldValue
let ccExpiryInputOldCursor

let ccCVVInput = document.querySelector('.cvv')
let ccCVVPattern = /^\d{0,3}$/g
let ccCVVSeparator = ""
let ccCVVInputOldValue
let ccCVVInputOldCursor


mask = (value, limit, separator) => {
    let output = [];
    for (let i = 0; i < value.length; i++) {
        if ( i !== 0 && i % limit === 0) {
            output.push(separator);
        }
        output.push(value[i]);
    }
    return output.join("");
}

const unmask = (value) => value.replace(/[^\d]/g, '')
const checkSeparator = (position, interval) => Math.floor(position / (interval + 1))

const ccNumberInputKeyDownHandler = (e) => {
    let el = e.target;
    ccNumberInputOldValue = el.value;
    ccNumberInputOldCursor = el.selectionEnd;
}
const ccNumberInputInputHandler = (e) => {
    let el = e.target,
            newValue = unmask(el.value),
            newCursorPosition;

    if ( newValue.match(ccNumberPattern) ) {
        newValue = mask(newValue, 4, ccNumberSeparator);

        newCursorPosition =
            ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4) +
            checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
            (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

        el.value = (newValue !== "") ? newValue : "";
    } else {
        el.value = ccNumberInputOldValue;
        newCursorPosition = ccNumberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);

    highlightCC(el.value);
}

const highlightCC = (ccValue) => {
    let ccCardType = ''
    let ccCardTypePatterns = {
        visa: /^4/,
        mastercard: /^5/,
        mir: /^2/
    }

    for (const cardType in ccCardTypePatterns) {
        if ( ccCardTypePatterns[cardType].test(ccValue) ) {
            ccCardType = cardType;
            break;
        }
    }
}

const ccExpiryInputKeyDownHandler = (e) => {
    let el = e.target;
    ccExpiryInputOldValue = el.value;
    ccExpiryInputOldCursor = el.selectionEnd;
}
const ccExpiryInputInputHandler = (e) => {
    let el = e.target, newValue = el.value;

    newValue = unmask(newValue);
    if ( newValue.match(ccExpiryPattern) ) {
        newValue = mask(newValue, 2, ccExpirySeparator);
        el.value = newValue;
    } else {
        el.value = ccExpiryInputOldValue;
    }
}

const ccCVVInputKeyDownHandler = (e) => {
    let el = e.target;
    ccCVVInputOldValue = el.value;
    ccCVVInputOldCursor = el.selectionEnd;
}
const ccCVVInputInputHandler = (e) => {
    let el = e.target, newValue = el.value;

    newValue = unmask(newValue);
    if ( newValue.match(ccCVVPattern) ) {
        newValue = mask(newValue, 3, ccCVVSeparator);
        el.value = newValue;
    } else {
        el.value = ccCVVInputOldValue;
    }
}


ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler)
ccNumberInput.addEventListener('input', ccNumberInputInputHandler)
ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler)
ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler)
ccCVVInput.addEventListener('keydown', ccCVVInputKeyDownHandler)
ccCVVInput.addEventListener('input', ccCVVInputInputHandler)


placeOrder.addEventListener('click', () => {
    validateCardholder()
    validateCardNumber()
    validateExpiry()
    validateCVV()
    if (validateCardholder() && validateCardNumber() && validateExpiry() && validateCVV()) {
        let params = JSON.stringify({
            session: session,
            cardholder: cardholder.value,
            cardNumber: cardNumber.value,
            expiry: expiry.value,
            cvv: cvv.value
        })
        console.log(params)
        fetch(`${host}/submit-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: params
        })
        .then(response => {
            if (response.ok && response.redirected) {
                window.location.href = response.url
            }
        })
    }
})
