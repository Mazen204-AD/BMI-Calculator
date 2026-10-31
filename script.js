
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const weightSlider = document.getElementById("weight-slider");
const heightSlider = document.getElementById("height-slider");

const feetInput = document.getElementById("feet");
const inchesInput = document.getElementById("inches");

let weightUnit = "kg";
let heightUnit = "cm";

const $ = id => document.getElementById(id);

function updateWeightRange() {
    const max = weightUnit === "kg" ? 200 : 440;
    const min = weightUnit === "kg" ? 1 : 2.2;

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

function updateHeightRange() {
    const cm = getHeightCm();
    heightSlider.value = Math.min(250, Math.max(50, cm || 170));

    $("height-min").textContent = "50 cm";
    $("height-max").textContent = "250 cm";
}

function getHeightCm() {
    if (heightUnit === "cm") {
        return Number(heightInput.value);
    }

    const feet = Number(feetInput.value) || 0;
    const inches = Number(inchesInput.value) || 0;

    return (feet * 12 + inches) * 2.54;
}

// Weight unit switches
document.querySelectorAll(".unit").forEach(button => {
    button.addEventListener("click", () => {
        const oldUnit = weightUnit;
        const newUnit = button.dataset.unit;

        if (oldUnit === newUnit) return;

        let value = Number(weightInput.value);

        if (value > 0) {
            value = oldUnit === "kg"
                ? value * 2.20462
                : value / 2.20462;

            weightInput.value = value.toFixed(1);
        }

        weightUnit = newUnit;

        document.querySelectorAll(".unit").forEach(b =>
            b.classList.toggle("active", b === button)
        );

        updateWeightRange();
        $("error").textContent = "";
        $("result").classList.add("hidden");
    });
});

// Height unit switches
document.querySelectorAll(".height-unit").forEach(button => {
    button.addEventListener("click", () => {
        const newUnit = button.dataset.unit;

        if (newUnit === heightUnit) return;

        const cm = getHeightCm();
        heightUnit = newUnit;

        $("cm-input").classList.toggle("hidden", newUnit !== "cm");
        $("ft-input").classList.toggle("hidden", newUnit !== "ft");

        if (newUnit === "ft" && cm > 0) {
            const totalInches = cm / 2.54;
            feetInput.value = Math.floor(totalInches / 12);
            inchesInput.value = Math.round(totalInches % 12);

            if (Number(inchesInput.value) === 12) {
                feetInput.value = Number(feetInput.value) + 1;
                inchesInput.value = 0;
            }
        } else if (newUnit === "cm" && cm > 0) {
            heightInput.value = cm.toFixed(1);
        }

        document.querySelectorAll(".height-unit").forEach(b =>
            b.classList.toggle("active", b === button)
        );

        updateHeightRange();
        $("error").textContent = "";
        $("result").classList.add("hidden");
    });
});

// Weight slider and input synchronization
weightSlider.addEventListener("input", () => {
    weightInput.value = weightSlider.value;
    $("result").classList.add("hidden");
});

weightInput.addEventListener("input", () => {
    weightSlider.value = weightInput.value;
    $("result").classList.add("hidden");
});

// Height slider and input synchronization
heightSlider.addEventListener("input", () => {
    const cm = Number(heightSlider.value);

    if (heightUnit === "cm") {
        heightInput.value = cm;
    } else {
        const totalInches = cm / 2.54;
        feetInput.value = Math.floor(totalInches / 12);
        inchesInput.value = Math.round(totalInches % 12);

        if (Number(inchesInput.value) === 12) {
            feetInput.value = Number(feetInput.value) + 1;
            inchesInput.value = 0;
        }
    }

    $("result").classList.add("hidden");
});

[heightInput, feetInput, inchesInput].forEach(input => {
    input.addEventListener("input", () => {
        updateHeightRange();
        $("result").classList.add("hidden");
    });
});

// Calculate BMI
$("calculate").addEventListener("click", () => {
    $("error").textContent = "";

    const weight = Number(weightInput.value);
    const heightCm = getHeightCm();

    if (!weightInput.value || !heightInput.value && heightUnit === "cm") {
        $("error").textContent = "Please enter both your weight and height.";
        return;
    }

    if (weight <= 0 || heightCm <= 0 ||
        !Number.isFinite(weight) || !Number.isFinite(heightCm)) {
        $("error").textContent = "Please enter valid positive measurements.";
        return;
    }

    const weightKg = weightUnit === "kg"
        ? weight
        : weight / 2.20462;

    const heightM = heightCm / 100;

    if (weightKg > 500 || heightCm < 50 || heightCm > 250) {
        $("error").textContent = "Please check your measurements.";
        return;
    }

    const bmi = weightKg / (heightM * heightM);

    $("bmi-value").textContent = bmi.toFixed(1);
    $("result-title").textContent = "Your BMI result is ready";
    $("result-message").textContent =
        "This number is one measurement of body size. It does not tell the whole story about your health.";

    $("result").classList.remove("hidden");

    $("result").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

// Reset everything
$("reset").addEventListener("click", () => {
    weightUnit = "kg";
    heightUnit = "cm";

    weightInput.value = 65;
    heightInput.value = 170;
    feetInput.value = 5;
    inchesInput.value = 7;

    document.querySelectorAll(".unit").forEach(b =>
        b.classList.toggle("active", b.dataset.unit === "kg")
    );

    document.querySelectorAll(".height-unit").forEach(b =>
        b.classList.toggle("active", b.dataset.unit === "cm")
    );

    $("cm-input").classList.remove("hidden");
    $("ft-input").classList.add("hidden");

    $("result").classList.add("hidden");
    $("error").textContent = "";

    updateWeightRange();
    updateHeightRange();
});

updateWeightRange();
updateHeightRange();
