// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
faders.forEach(el => observer.observe(el));

// Floating leaves + flowers
const leavesContainer = document.getElementById('leaves-container');
for(let i=0; i<15; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = (8 + Math.random() * 5) + 's';
    leaf.style.animationDelay = (Math.random() * 5) + 's';
    leavesContainer.appendChild(leaf);
}
for(let i=0; i<10; i++) {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = (8 + Math.random() * 5) + 's';
    flower.style.animationDelay = (Math.random() * 5) + 's';
    leavesContainer.appendChild(flower);
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Chart.js
let pieChart, barChart;
const pieCtx = document.getElementById('pieChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');

function getTransportEmission(mode, distance) {
    const factors = { car: 0.21, bus: 0.1, bike: 0, walk: 0 };
    return distance * factors[mode];
}
function getDietEmission(type) {
    const factors = { vegan: 2, vegetarian: 3, meat: 5 };
    return factors[type];
}

const form = document.getElementById('carbonForm');
const resultDiv = document.getElementById('result');
const tipsDiv = document.getElementById('tips');
form.addEventListener('submit', e => {
    e.preventDefault();
    const mode = form.transportMode.value;
    const distance = +form.distance.value;
    const diet = form.diet.value;
    const shopping = +form.shopping.value;
    const energy = +form.energy.value;

    const transportCO2 = getTransportEmission(mode, distance);
    const dietCO2 = getDietEmission(diet);
    const shoppingCO2 = shopping * 0.05;
    const energyCO2 = energy * 0.4;
    const total = transportCO2 + dietCO2 + shoppingCO2 + energyCO2;

    resultDiv.textContent = `Your estimated footprint: ${total.toFixed(2)} kg CO₂e.`;
    tipsDiv.innerHTML = `
        🚶‍♂️ Try walking or cycling more<br/>
        🥗 Try plant-based meals<br/>
        💡 Reduce electricity waste<br/>
        🛍️ Shop less & sustainably
    `;
    updateCharts([transportCO2, dietCO2, shoppingCO2, energyCO2]);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    form.reset();
    resultDiv.textContent = '';
    tipsDiv.innerHTML = '';
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();
});

function updateCharts(data) {
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Transport', 'Diet', 'Shopping', 'Energy'],
            datasets: [{
                data: data,
                backgroundColor: ['#ff8a65', '#4db6ac', '#ba68c8', '#81c784']
            }]
        },
        options: { animation: { animateScale: true } }
    });

    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Transport', 'Diet', 'Shopping', 'Energy'],
            datasets: [{
                label: 'kg CO₂e',
                data: data,
                backgroundColor: ['#ff8a65', '#4db6ac', '#ba68c8', '#81c784']
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            animation: { duration: 1000 }
        }
    });
}
