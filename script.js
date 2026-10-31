
/* =====================================
   AURA — SMART WELLNESS ENGINE
===================================== */

const $ = id => document.getElementById(id);

let weightUnit = "kg";
let heightUnit = "cm";

const weightInput = $("weight");
const heightInput = $("height");
const feetInput = $("feet");
const inchesInput = $("inches");

const weightSlider = $("weight-slider");
const heightSlider = $("height-slider");

// Convert height into centimetres
function getHeightCm() {
    if (heightUnit === "cm") {
        return Number(heightInput.value);
    }

    return (
        (Number(feetInput.value) * 12) +
        Number(inchesInput.value)
    ) * 2.54;
}

// Convert weight into kilograms
function getWeightKg() {
    const weight = Number(weightInput.value);

    return weightUnit === "kg"
        ? weight
        : weight / 2.20462;
}

// Update weight slider
function updateWeight() {
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

// Update height slider
function updateHeight() {
    const height = getHeightCm();

    heightSlider.value = Math.min(
        250,
        Math.max(50, height || 170)
    );

    $("height-min").textContent = "50 cm";
    $("height-max").textContent = "250 cm";
}

// Hide previous results when measurements change
function hideResult() {
    $("result").classList.add("hidden");
    $("error").textContent = "";
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

        const cm = getHeightCm();

        heightUnit = nextUnit;

        $("cm-input").classList.toggle("hidden", nextUnit !== "cm");
        $("ft-input").classList.toggle("hidden", nextUnit !== "ft");

        if (nextUnit === "ft") {
            const totalInches = cm / 2.54;

            feetInput.value = Math.floor(totalInches / 12);
            inchesInput.value = Math.round(totalInches % 12);

            if (Number(inchesInput.value) === 12) {
                feetInput.value = Number(feetInput.value) + 1;
                inchesInput.value = 0;
            }
        } else {
            heightInput.value = cm.toFixed(1);
        }

        document.querySelectorAll(".height-unit").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        updateHeight();
        hideResult();
    });
});

// Synchronise weight input and slider
weightInput.addEventListener("input", () => {
    weightSlider.value = weightInput.value;
    hideResult();
});

weightSlider.addEventListener("input", () => {
    weightInput.value = weightSlider.value;
    hideResult();
});

// Synchronise height input and slider
heightInput.addEventListener("input", () => {
    updateHeight();
    hideResult();
});

feetInput.addEventListener("input", () => {
    updateHeight();
    hideResult();
});

inchesInput.addEventListener("input", () => {
    updateHeight();
    hideResult();
});

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

    hideResult();
});

// Animated BMI number
function animateNumber(element, target) {
    const duration = 1000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);

        // Smooth ease-out animation
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

    const rawWeight = Number(weightInput.value);
    const heightCm = getHeightCm();

    if (
        !weightInput.value.trim() ||
        (heightUnit === "cm" && !heightInput.value.trim()) ||
        (heightUnit === "ft" &&
         (!feetInput.value.trim() || !inchesInput.value.trim()))
    ) {
        $("error").textContent =
            "Please complete both measurement fields.";
        return;
    }

    if (
        !Number.isFinite(rawWeight) ||
        !Number.isFinite(heightCm) ||
        rawWeight <= 0 ||
        heightCm <= 0
    ) {
        $("error").textContent =
            "Please enter valid positive measurements.";
        return;
    }

    const weightKg = getWeightKg();

    if (
        weightKg > 500 ||
        heightCm < 50 ||
        heightCm > 250 ||
        (heightUnit === "ft" &&
         (Number(feetInput.value) > 8 ||
          Number(feetInput.value) < 1 ||
          Number(inchesInput.value) > 11 ||
          Number(inchesInput.value) < 0))
    ) {
        $("error").textContent =
            "Please check your measurements and try again.";
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    if (!Number.isFinite(bmi)) {
        $("error").textContent =
            "Unable to calculate. Please check your values.";
        return;
    }

    // Display result
    $("result-title").textContent = "Your BMI calculation is ready";
    $("result-message").textContent =
        "Your BMI is one measurement of body size. It does not tell the whole story about your health.";

    $("result").classList.remove("hidden");

    animateNumber($("bmi-value"), bmi);

    $("result").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// Calculate button
$("calculate").addEventListener("click", calculateBMI);

// Press Enter to calculate
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

// Reset everything
$("reset").addEventListener("click", () => {
    weightUnit = "kg";
    heightUnit = "cm";

    weightInput.value = 65;
    heightInput.value = 170;

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

    $("cm-input").classList.remove("hidden");
    $("ft-input").classList.add("hidden");

    $("result").classList.add("hidden");
    $("error").textContent = "";

    updateWeight();
    updateHeight();
});

// Initial setup
updateWeight();
updateHeight();

console.log("✦ AURA Wellness Engine initialized successfully.");
