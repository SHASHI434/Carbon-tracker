let chart = null;

document.getElementById("carbon-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const transport = document.getElementById("transport").value;
    const distance = parseFloat(document.getElementById("distance").value) || 0;
    const electricity = parseFloat(document.getElementById("electricity").value) || 0;
    const diet = document.getElementById("diet").value;

    // Emission factors (in kg CO2 per unit)
    const transportFactors = {
        car: 0.192,
        bus: 0.105,
        bike: 0.05
    };

    // Calculate emissions
    const transportEmission = distance * (transportFactors[transport] || 0);
    const electricityEmission = electricity * 0.92;
    const foodEmission = (diet === "nonveg") ? 6 : 2.5;

    const totalEmission = transportEmission + electricityEmission + foodEmission;

    // Display results
    document.getElementById("result").innerHTML = `
        <p><strong>Total CO₂ Emission:</strong> ${totalEmission.toFixed(2)} kg/day</p>
        <ul>
            <li>Transport: ${transportEmission.toFixed(2)} kg</li>
            <li>Electricity: ${electricityEmission.toFixed(2)} kg</li>
            <li>Food: ${foodEmission.toFixed(2)} kg</li>
        </ul>
        <p>🌱 Tip: Reduce car usage, save electricity, and eat more plant-based meals to lower your carbon footprint!</p>
    `;

    // Draw chart
    const ctx = document.getElementById('emissionChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Transport', 'Electricity', 'Food'],
            datasets: [{
                data: [transportEmission, electricityEmission, foodEmission],
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});

// Reset button functionality
document.getElementById("reset-button").addEventListener("click", function () {
    document.getElementById("carbon-form").reset();
    document.getElementById("result").innerHTML = "";
    if (chart) chart.destroy();
});

// Dark mode toggle
document.getElementById("darkToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark", this.checked);
});
