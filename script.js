const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle to grey

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.getElementsByClassName.backgroundColor = color;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random()* (max-min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0,9);
}

function getRandomLowerCase() {
    // ascii value 0f a:97 & z:122
    return String.fromCharCode(getRandomInteger(97,123));
}

function getRandomUpperCase() {
    // ascii value of A:65 & Z:90
    return String.fromCharCode(getRandomInteger(65,91));
}

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function getRandomSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols[randNum];
}

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("0ff0");
    } else {
        setIndicator("#f00");
    }
}

// clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(error) {
        copyMsg.innerText = "failed";
    }

    // to make copy message visible
    copyMsg.classList.add("active")

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
};

// shuffling password when generate button is clicked
function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// event listeners
inputSlider.addEventListener('input', (event) => {
    passwordLength = event.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    //when password is non-empty
    if(passwordDisplay.value) copyContent();
});


// checkboxes
// this function counts the number of checkboxes checked
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++;
    })

    // corner case, when password length is less than included checkboxes
    if(passwordLength < checkCount) 
        passwordLength = checkCount;
        handleSlider();
}
// this function is invoked when a check box is checked or unchecked
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})



generateBtn.addEventListener('click', () => {
    // when none of the checkboxes are selected
    if(checkCount <= 0) return ;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Creating Password");
    // remove old password before finding new password
    password = "";

    // find new password
    // put things that are mentioned by checkboxes

    let array = [];
    if(upperCaseCheck.checked) {
        array.push(getRandomUpperCase);
    }

    if(lowercaseCheck.checked) {
        array.push(getRandomLowerCase);
    }

    if(numbersCheck.checked) {
        array.push(generateRandomNumber);
    }

    if(symbolsCheck.checked) {
        array.push(getRandomSymbol);
    }

    //compulsary addition
    for(let i = 0; i < array.length; i++) {
        password += array[i]();
    }
    console.log("Compulsory addition done.")

    // remaining addition
    for(let i = 0; i < passwordLength - array.length; i++) {
        let randomIndex = getRandomInteger(0, array.length);
        password += array[randomIndex]();
    }
    console.log("Remaining addition done.");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done.")

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done.");

    // calculate strength
    calculateStrength();
});