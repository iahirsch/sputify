// Get the bubble container element
const bubbleContainer = d3.select("#bubble")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

// Noise offset and scale for animation
let nX1 = 0, nY1 = 0;
let nX2 = 0.5, nY2 = 0.5;
let nX3 = 1, nY3 = 1;

// Parameters for easy adjustment for each bubble
let bubbles = [
    {
        x: window.innerWidth / 2, // Position X
        y: window.innerHeight / 2, // Position Y
        radiusBase: 100,  // Base radius of the bubble
        noiseScale: 0.08, // Adjust noise scale for desired movement
        detail: 128,      // Number of points around the bubble (higher = smoother)
        color: [50, 150, 250],  // Blue color (RGB format)
        noiseX: nX1,
        noiseY: nY1,
        gradientId: "bubbleGradient1"
    },
    {
        x: window.innerWidth / 2, // Position X
        y: window.innerHeight / 2, // Position Y
        radiusBase: 100,
        noiseScale: 0.08,
        detail: 128,
        color: [255, 105, 180],  // Pink color (RGB format)
        noiseX: nX2,
        noiseY: nY2,
        gradientId: "bubbleGradient2"
    },
    {
        x: window.innerWidth / 2, // Position X
        y: window.innerHeight / 2, // Position Y
        radiusBase: 100,
        noiseScale: 0.08,
        detail: 128,
        color: [250, 250, 100],  // Yellow color (RGB format)
        noiseX: nX3,
        noiseY: nY3,
        gradientId: "bubbleGradient3"
    }
];

// Simplex noise function for 2D noise
const noise = new SimplexNoise();
function simplex2d(x, y) {
    return noise.noise2D(x, y);
}

// Function to generate points for a dynamic bubble using noise
function generateBubblePath(cx, cy, baseRadius, detail, noiseScale, nX, nY) {
    let path = "";
    const angleStep = (Math.PI * 2) / detail;

    // Calculate noise for the first point (store for later)
    const firstNoiseX = simplex2d(0, nY);
    const firstNoiseY = simplex2d(0, nY);

    for (let i = 0; i <= detail; i++) {
        const angle = i * angleStep;

        // Use the stored noise values for the first and last points
        const noiseX = (i === 0 || i === detail) ? firstNoiseX : simplex2d(angle + nX, nY);
        const noiseY = (i === 0 || i === detail) ? firstNoiseY : simplex2d(angle, nY);

        const noisyRadius = baseRadius + noiseX * noiseScale * baseRadius;
        const x = cx + Math.cos(angle) * noisyRadius;
        const y = cy + Math.sin(angle) * noisyRadius + noiseY * noiseScale * baseRadius;

        if (i === 0) {
            path += `M ${x} ${y}`;
        } else {
            path += ` L ${x} ${y}`;
        }
    }

    path += " Z"; // Close the path to form a complete shape
    return path;
}

// Create gradients and paths for each bubble
bubbles.forEach((bubble) => {
    // Create gradient
    const gradient = bubbleContainer.append("defs")
        .append("radialGradient")
        .attr("id", bubble.gradientId)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");

    gradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`)
        .attr("stop-opacity", 0);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", `rgb(${bubble.color[0]}, ${bubble.color[1]}, ${bubble.color[2]})`)
        .attr("stop-opacity", 0.3);

    // Create the bubble path
    bubble.path = bubbleContainer.append("path")
        .attr("fill", `url(#${bubble.gradientId})`)
        .attr("stroke", "none");
});

// Define the animation loop
function animate() {
    bubbles.forEach((bubble) => {
        // Update the path using noise for dynamic shape
        const dynamicPath = generateBubblePath(bubble.x, bubble.y, bubble.radiusBase, bubble.detail, bubble.noiseScale, bubble.noiseX, bubble.noiseY);
        bubble.path.attr("d", dynamicPath);

        // Update noise offset for animation
        bubble.noiseY += 0.01;
    });

    requestAnimationFrame(animate);
}

// Start the animation
animate();