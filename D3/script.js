// Initialize Simplex Noise
const noise = new SimplexNoise();

// Noise offset for each bubble for animation
let noiseOffsets = [0, 0.5, 1];

// Parameters for bubbles
let bubbles = initializeBubbles();

// Function to initialize bubbles
function initializeBubbles() {
    return [
        createBubble([50, 150, 250], noiseOffsets[0], "bubbleGradient1"),
        createBubble([255, 105, 180], noiseOffsets[1], "bubbleGradient2"),
        createBubble([250, 250, 100], noiseOffsets[2], "bubbleGradient3")
        
    ];
}

// Create a single bubble object
function createBubble(color, noiseOffset, gradientId) {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radiusBase: 200,
        noiseScale: 0.2,
        detail: 128,
        color,
        noiseOffset,
        gradientId,
        visible: true,
        path: null,
        speed: 1
    };
}

// Function to generate points for a bubble using symmetrical noise
function generateBubblePath(cx, cy, baseRadius, detail, noiseScale, noiseOffset) {
    let path = "";
    const angleStep = (Math.PI * 2) / detail;

    for (let i = 0; i <= detail; i++) {
        const angle = i * angleStep;
        const noiseVal = noise.noise2D(Math.cos(angle) + noiseOffset, Math.sin(angle) + noiseOffset);
        const noisyRadius = baseRadius + noiseVal * noiseScale * baseRadius;
        const x = cx + Math.cos(angle) * noisyRadius;
        const y = cy + Math.sin(angle) * noisyRadius;
        path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }

    return path + " Z"; // Close the path
}

// Function to create and append bubble gradients
function createBubbleGradients(container) {
    bubbles.forEach((bubble) => {
        const gradient = container.append("defs")
            .append("radialGradient")
            .attr("id", bubble.gradientId)
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");

        gradient.append("stop")
            .attr("offset", "40%")
            .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`)
            .attr("stop-opacity", 0);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`)
            .attr("stop-opacity", 0.4);
    });
}

// Create the bubble container and set up gradients and paths
function setupBubbles() {
    const bubbleContainer = d3.select("#bubble")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    createBubbleGradients(bubbleContainer);

    bubbles.forEach((bubble) => {
        bubble.path = bubbleContainer.append("path")
            .attr("fill", `url(#${bubble.gradientId})`)
            .attr("stroke", "none");
    });
}

// Function to dynamically create controls based on bubbles array
function createControls() {
    const controlsContainer = document.getElementById("controls");
    controlsContainer.innerHTML = ""; // Clear existing controls

    bubbles.forEach((bubble, index) => {
        const bubbleControl = document.createElement("div");
        bubbleControl.classList.add("control");
        bubbleControl.innerHTML = `
            <input type="checkbox" id="bubble${index + 1}-visible" ${bubble.visible ? 'checked' : ''}>
            <h3 id="bubble${index + 1}-title">Bubble ${index + 1}</h3>
            <label for="bubble${index + 1}-color">Color:</label>
            <input type="color" id="bubble${index + 1}-color" value="${rgbToHex(bubble.color)}">
            <label for="bubble${index + 1}-detail">Detail:</label>
            <input type="number" id="bubble${index + 1}-detail" min="10" max="200" value="${bubble.detail}">
            <label for="bubble${index + 1}-noise">Noise Scale:</label>
            <input type="range" id="bubble${index + 1}-noise" min="0" max="0.5" step="0.05" value="${bubble.noiseScale}">
        `;
        controlsContainer.appendChild(bubbleControl);

        // Attach event listeners
        attachControlListeners(bubble, index);
    });
}

// Attach event listeners for bubble controls
function attachControlListeners(bubble, index) {
    document.getElementById(`bubble${index + 1}-color`).addEventListener("input", (e) => {
        bubble.color = hexToRgb(e.target.value);
        updateBubbleGradient(bubble);
    });

    document.getElementById(`bubble${index + 1}-detail`).addEventListener("change", (e) => {
        bubble.detail = parseInt(e.target.value, 10);
    });

    document.getElementById(`bubble${index + 1}-noise`).addEventListener("input", (e) => {
        bubble.noiseScale = parseFloat(e.target.value);
    });

    document.getElementById(`bubble${index + 1}-visible`).addEventListener("change", (e) => {
        bubble.visible = e.target.checked;
    });
}

// Update bubble gradient dynamically
function updateBubbleGradient(bubble) {
    const gradient = d3.select(`#${bubble.gradientId}`);
    gradient.select("stop:nth-child(1)")
        .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`);
    gradient.select("stop:nth-child(2)")
        .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`);
}

// Convert RGB array to hex
function rgbToHex(color) {
    return `#${color.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Convert hex to RGB array
function hexToRgb(hex) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

// Define the animation loop
function animate() {
    bubbles.forEach((bubble) => {
        if (bubble.visible) {
            const dynamicPath = generateBubblePath(bubble.x, bubble.y, bubble.radiusBase, bubble.detail, bubble.noiseScale, bubble.noiseOffset);
            bubble.path.attr("d", dynamicPath);
            bubble.noiseOffset += bubble.speed * 0.01; // Apply speed to noise offset change
        } else {
            bubble.path.attr("d", ""); // Hide if not visible
        }
    });

    requestAnimationFrame(animate);
}

// Initialize everything
function initialize() {
    setupBubbles();
    createControls();
    animate();
}

// Start the app
initialize();