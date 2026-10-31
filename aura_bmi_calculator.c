#include <stdio.h>

int main(void)
{
    int age;
    double weightKg, heightM, bmi;

    printf("=================================\\n");
    printf("       A U R A  BMI CALCULATOR\\n");
    printf("=================================\\n\\n");

    printf("Enter age in years: ");
    if (scanf("%d", &age) != 1 || age <= 0) {
        printf("Please enter a valid age.\\n");
        return 1;
    }

    printf("Enter weight in kilograms (kg): ");
    if (scanf("%lf", &weightKg) != 1 || weightKg <= 0) {
        printf("Please enter a valid weight.\\n");
        return 1;
    }

    printf("Enter height in metres (m): ");
    if (scanf("%lf", &heightM) != 1 || heightM <= 0) {
        printf("Please enter a valid height.\\n");
        return 1;
    }

    bmi = weightKg / (heightM * heightM);

    printf("\\n---------------------------------\\n");
    printf("Your BMI: %.1f\\n", bmi);

    if (age < 20) {
        printf("BMI category: Not classified using adult ranges.\\n");
        printf("For people under 20, BMI is interpreted using\\n");
        printf("age- and sex-specific growth charts.\\n");
    } else {
        printf("Adult BMI category: ");

        if (bmi < 18.5) {
            printf("Underweight\\n");
        } else if (bmi < 25.0) {
            printf("Healthy weight\\n");
        } else if (bmi < 30.0) {
            printf("Overweight\\n");
        } else {
            printf("Obesity\\n");
        }
    }

    printf("---------------------------------\\n");
    printf("Thank you for using AURA!\\n");

    return 0;
}
