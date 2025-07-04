let chart = null;

async function getTransportEmission(vehicleModelId, distance) {
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
        method: "POST",
        headers: {
            "Authorization": "Bearer hXoFPrCH3hpdAPmec6FA", // Replace with your actual API key
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "vehicle",
            distance_unit: "km",
            distance_value: distance,
            vehicle_model_id: vehicleModelId
        })
    });

    const data = await response.json();
    return data.data.attributes.carbon_kg;
}

document.getElementById("carbon-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const distance = parseFloat(document.getElementById("distance").value) || 0;
    const electricity = parseFloat(document.getElementById("electricity").value) || 0;
    const diet = document.getElementById("diet").value;

    const electricityEmission = electricity * 0.92;
    const foodEmission = (diet === "nonveg") ? 6 : 2.5;

    const vehicleModelId = "5e07bce0-9c5b-4f58-8b06-374f7d3c35f8"; // Example: Toyota Prius

    let transportEmission = 0;
    try {
        transportEmission = await getTransportEmission(vehicleModelId, distance);
    } catch (error) {
        console.error("Error fetching transport emission:", error);
        alert("Could not fetch transport emission. Using default value.");
        transportEmission = distance * 0.192; // fallback
    }

    const totalEmission = transportEmission + electricityEmission + foodEmission;

    // Display results
    document.getElementById("result").innerHTML = `
        <p><strong>Total CO₂ Emission:</strong> ${totalEmission.toFixed(2)} kg/day</p>
        <ul>
            <li>Transport: ${transportEmission.toFixed(2)} kg</li>
            <li>Electricity: ${electricityEmission.toFixed(2)} kg</li>
            <li>Food: ${foodEmission.toFixed(2)} kg</li>
        </ul>
        <p>🌱 Tip: Reduce car usage, electricity, and meat to lower your footprint!</p>
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
