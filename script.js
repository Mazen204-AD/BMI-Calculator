// This file contains the JavaScript code for the BMI calculator.

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultElement = document.getElementById('result');

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultElement.innerHTML = "Please enter valid weight and height.";
        return;
    }

    const bmi = weight / (height * height);
    let category = '';

    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 24.9) {
        category = 'Normal weight';
    } else if (bmi < 29.9) {
        category = 'Overweight';
    } else {
        category = 'Obesity';
    }

    resultElement.innerHTML = `Your BMI is ${bmi.toFixed(2)}. Category: ${category}`;
}

document.getElementById('calculateButton').addEventListener('click', calculateBMI);