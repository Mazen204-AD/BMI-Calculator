
const $ = id => document.getElementById(id);

let weightUnit = "kg";
let heightUnit = "cm";

const weightInput = $("weight");
const heightInput = $("height");
const metresInput = $("metres");
const feetInput = $("feet");
const inchesInput = $("inches");
const ageInput = $("age");

const weightSlider = $("weight-slider");
const heightSlider = $("height-slider");

// Convert all height units into metres
function getHeightMetres() {
    if (heightUnit === "cm") {
        return Number(heightInput.value) / 100;
    }

    if (heightUnit === "m") {
        return Number(metresInput.value);
    }

    return (
        Number(feetInput.value) * 12 +
        Number(inchesInput.value)
    ) * 0.0254;
}

// Convert weight into kilograms
function getWeightKg() {
    const weight = Number(weightInput.value);

    return weightUnit === "kg"
        ? weight
        : weight / 2.20462;
}

// Hide previous result
function hideResult() {
    $("result").hidden = true;
    $("error").textContent = "";
}

// Update weight slider
function updateWeight() {
    const min = weightUnit === "kg" ? 1 : 2.2;
    const max = weightUnit === "kg" ? 200 : 440;

    weightSlider.min = min;
    weightSlider.max = max;

    weightSlider.value = Math.min(
        max,
        Math.max(min, Number(weightInput.value) || 65)
    );

    $("weight-unit").textContent = weightUnit;
    $("weight-min").textContent = `${min} ${weightUnit}`;
    $("weight-max").textContent = `${max} ${weightUnit}`;
}

// Update height slider
function updateHeight() {
    const heightCm = getHeightMetres() * 100;

    heightSlider.value = Math.min(
        250,
        Math.max(50, heightCm || 170)
    );
}

// Weight unit switching
document.querySelectorAll(".unit").forEach(button => {
    button.addEventListener("click", () => {
        const nextUnit = button.dataset.unit;

        if (nextUnit === weightUnit) return;

        let weight = Number(weightInput.value);

        if (weight > 0) {
            weight = weightUnit === "kg"
                ? weight * 2.20462
                : weight / 2.20462;

            weightInput.value = weight.toFixed(1);
        }

        weightUnit = nextUnit;

        document.querySelectorAll(".unit").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        updateWeight();
        hideResult();
    });
});

// Height unit switching
document.querySelectorAll(".height-unit").forEach(button => {
    button.addEventListener("click", () => {
        const nextUnit = button.dataset.unit;

        if (nextUnit === heightUnit) return;

        const heightM = getHeightMetres();

        heightUnit = nextUnit;

        $("cm-input").hidden = nextUnit !== "cm";
        $("metres-input").hidden = nextUnit !== "m";
        $("ft-input").hidden = nextUnit !== "ft";

        if (nextUnit === "cm") {
            heightInput.value = (heightM * 100).toFixed(1);
        }

        if (nextUnit === "m") {
            metresInput.value = heightM.toFixed(2);
        }

        if (nextUnit === "ft") {
            const totalInches = heightM / 0.0254;

            feetInput.value = Math.floor(totalInches / 12);
            inchesInput.value = Math.round(totalInches % 12);

            if (Number(inchesInput.value) === 12) {
                feetInput.value = Number(feetInput.value) + 1;
                inchesInput.value = 0;
            }
        }

        document.querySelectorAll(".height-unit").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        updateHeight();
        hideResult();
    });
});

// Weight input and slider
weightInput.addEventListener("input", () => {
    weightSlider.value = weightInput.value;
    hideResult();
});

weightSlider.addEventListener("input", () => {
    weightInput.value = weightSlider.value;
    hideResult();
});

// Height inputs
[heightInput, metresInput, feetInput, inchesInput].forEach(input => {
    input.addEventListener("input", () => {
        updateHeight();
        hideResult();
    });
});

// Age input
ageInput.addEventListener("input", hideResult);

// Height slider
heightSlider.addEventListener("input", () => {
    const cm = Number(heightSlider.value);

    if (heightUnit === "cm") {
        heightInput.value = cm.toFixed(1);
    } else if (heightUnit === "m") {
        metresInput.value = (cm / 100).toFixed(2);
    } else {
        const totalInches = cm / 2.54;

        feetInput.value = Math.floor(totalInches / 12);
        inchesInput.value = Math.round(totalInches % 12);

        if (Number(inchesInput.value) === 12) {
            feetInput.value = Number(feetInput.value) + 1;
            inchesInput.value = 0;
        }
    }

    hideResult();
});

// Animate BMI number
function animateNumber(element, target) {
    const duration = 1000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min(
            (now - start) / duration,
            1
        );

        const eased = 1 - Math.pow(1 - progress, 4);

        element.textContent = (target * eased).toFixed(1);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Calculate BMI
function calculateBMI() {
    $("error").textContent = "";

    const age = Number(ageInput.value);
    const rawWeight = Number(weightInput.value);
    const heightM = getHeightMetres();

    if (
        !ageInput.value.trim() ||
        !weightInput.value.trim() ||
        (heightUnit === "cm" && !heightInput.value.trim()) ||
        (heightUnit === "m" && !metresInput.value.trim()) ||
        (heightUnit === "ft" &&
            (!feetInput.value.trim() ||
             !inchesInput.value.trim()))
    ) {
        $("error").textContent =
            "Please complete all fields.";
        return;
    }

    if (
        !Number.isFinite(age) ||
        age < 1 || age > 120 ||
        !Number.isFinite(rawWeight) ||
        !Number.isFinite(heightM) ||
        rawWeight <= 0 ||
        heightM <= 0
    ) {
        $("error").textContent =
            "Please enter valid measurements and age.";
        return;
    }

    const weightKg = getWeightKg();

    if (
        weightKg > 500 ||
        heightM < 0.5 ||
        heightM > 2.5 ||
        (heightUnit === "ft" &&
            (Number(feetInput.value) < 1 ||
             Number(feetInput.value) > 8 ||
             Number(inchesInput.value) < 0 ||
             Number(inchesInput.value) > 11))
    ) {
        $("error").textContent =
            "Please check your measurements.";
        return;
    }

    // BMI formula: weight / height²
    const bmi = weightKg / (heightM * heightM);

    if (!Number.isFinite(bmi)) {
        $("error").textContent =
            "Unable to calculate. Please check your values.";
        return;
    }

    $("result-title").textContent = "Your BMI result";

    // Adult BMI categories: age 20+
    if (age >= 20) {
        let category;

        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 25) {
            category = "Healthy weight";
        } else if (bmi < 30) {
            category = "Overweight";
        } else {
            category = "Obesity";
        }

        $("result-message").textContent =
            `Adult BMI category: ${category}. These general adult categories are screening guidelines, not a diagnosis.`;
    } else {
        $("result-message").textContent =
            "For people under 20, BMI must be interpreted using age- and sex-specific growth charts. Adult BMI categories do not apply.";
    }

    $("result").hidden = false;

    animateNumber($("bmi-value"), bmi);

    $("result").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// Calculate button
$("calculate").addEventListener("click", calculateBMI);

// Enter key support
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

// Reset button
$("reset").addEventListener("click", () => {
    weightUnit = "kg";
    heightUnit = "cm";

    ageInput.value = "";
    weightInput.value = 65;
    heightInput.value = 170;
    metresInput.value = 1.70;
    feetInput.value = 5;
    inchesInput.value = 7;

    document.querySelectorAll(".unit").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.unit === "kg"
        );
    });

    document.querySelectorAll(".height-unit").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.unit === "cm"
        );
    });

    $("cm-input").hidden = false;
    $("metres-input").hidden = true;
    $("ft-input").hidden = true;

    $("result").hidden = true;
    $("error").textContent = "";

    updateWeight();
    updateHeight();
});

// Initial setup
$("result").hidden = true;
$("cm-input").hidden = false;
$("metres-input").hidden = true;
$("ft-input").hidden = true;

updateWeight();
updateHeight();

console.log("✦ AURA Wellness Engine initialized successfully.");
