    /* ===================================

   NIRNAYA PREMIUM DECISION WHEEL

   =================================== */

        

(function() {

    /* ===================================

       APPLICATION STATE

       Global state management for the wheel application

       =================================== */

    const state = {

        options: [],              // Array of decision options

        isSpinning: false,        // Wheel spinning status

        currentRotation: 0,       // Current wheel rotation angle

        isDarkMode: true,         // Theme mode

        canvasSize: 480,          // Canvas size

        winnerIndex: -1,          // Current winner index

        idleAnimation: null,      // Idle animation frame

        spinAnimation: null,       // Spin animation frame

        isIdle: true,             // Idle state flag

        wheelDesign: 'classic',   // Current wheel design

        rainbowHue: 0,           // Rainbow hue for animation

        galaxyStars: [],          // Star particles for galaxy design

        lastSegmentIndex: -1,     // Track last segment for tick animation

        winnerPulsePhase: 0,      // Phase for winner pulse animation

        starGlowPhase: 0,         // Phase for star glow animation

        galaxyParallaxOffset: 0    // Parallax offset for galaxy design

    };



    /* ===================================

       DOM ELEMENT REFERENCES

       Cached DOM elements for performance optimization

       =================================== */

    const elements = {

        preloader: document.getElementById('preloader'),

        progressFill: document.getElementById('progressFill'),

        preloaderPercent: document.getElementById('preloaderPercent'),

        themeToggle: document.getElementById('themeToggle'),

        wheelCanvas: document.getElementById('wheelCanvas'),

        optionInput: document.getElementById('optionInput'),

        addBtn: document.getElementById('addBtn'),

        optionsContainer: document.getElementById('optionsContainer'),

        helpText: document.getElementById('helpText'),

        spinBtn: document.getElementById('spinBtn'),

        clearBtn: document.getElementById('clearBtn'),

        resultModal: document.getElementById('resultModal'),

        winnerText: document.getElementById('winnerText'),

        spinAgainBtn: document.getElementById('spinAgainBtn'),

        editOptionsBtn: document.getElementById('editOptionsBtn'),

        designButtons: document.querySelectorAll('.design-btn')

    };



    const ctx = elements.wheelCanvas ? elements.wheelCanvas.getContext('2d') : null;

    

    if (!ctx) {

        console.error('Failed to initialize canvas context');

        return;

    }



    /* ===================================

       APPLICATION INITIALIZATION

       Setup and startup sequence for the application

       =================================== */

    function init() {

        setupCanvas();

        setupPreloader();

        loadFromStorage();

        setupEventListeners();

        initializeGalaxyStars(); // Initialize galaxy stars

        updateUI();

        startIdleAnimation();

    }



    /* ===================================

       CANVAS SETUP

       Configure canvas dimensions and responsive sizing

       =================================== */

    function setupCanvas() {

        const isMobile = window.innerWidth <= 768;

        state.canvasSize = isMobile ? 360 : 480;

        

        // Set canvas dimensions based on device type

        elements.wheelCanvas.width = state.canvasSize;

        elements.wheelCanvas.height = state.canvasSize;

        

        // Ensure perfect centering and responsive sizing with CSS

        elements.wheelCanvas.style.width = state.canvasSize + 'px';

        elements.wheelCanvas.style.height = state.canvasSize + 'px';

        elements.wheelCanvas.style.display = 'block';

        elements.wheelCanvas.style.margin = '0 auto';

        

        // Update CSS variable for responsive container sizing

        document.documentElement.style.setProperty('--wheel-size', state.canvasSize + 'px');

    }



    /* ===================================

       PREMIUM PRELOADER

       Animated loading screen with progress tracking

       =================================== */

    function setupPreloader() {

        const duration = 3000;

        const updateInterval = 30;

        const totalSteps = duration / updateInterval;

        let currentStep = 0;

        

        const interval = setInterval(() => {

            currentStep++;

            const progress = Math.min(100, (currentStep / totalSteps) * 100);

            

            elements.progressFill.style.width = `${progress}%`;

            elements.preloaderPercent.textContent = `${Math.floor(progress)}%`;

            

            if (currentStep >= totalSteps) {

                clearInterval(interval);

                elements.progressFill.style.width = '100%';

                elements.preloaderPercent.textContent = '100%';

                

                setTimeout(() => {

                    elements.preloader.classList.add('hidden');

                }, 500);

            }

        }, updateInterval);

    }



    /* ===================================

       THEME MANAGEMENT

       Dark/light mode switching with persistence

       =================================== */

    function toggleTheme() {

        state.isDarkMode = !state.isDarkMode;

        

        // Add smooth transition for theme switching

        document.body.style.transition = 'background 0.4s cubic-bezier(0.25, 1, 0.5, 1)';

        

        if (state.isDarkMode) {

            document.body.classList.remove('light-mode');

            elements.themeToggle.textContent = 'Light Mode';

        } else {

            document.body.classList.add('light-mode');

            elements.themeToggle.textContent = 'Dark Mode';

        }

        

        localStorage.setItem('nirnaya-theme', state.isDarkMode ? 'dark' : 'light');

        

        // Remove transition after theme animation completes

        setTimeout(() => {

            document.body.style.transition = '';

        }, 400);

        

        renderWheel(); // Re-render wheel with new colors

    }



    /* ===================================

       STORAGE MANAGEMENT

       LocalStorage persistence for options and settings

       =================================== */

    function saveToStorage() {

        localStorage.setItem('nirnaya-options', JSON.stringify(state.options));

        localStorage.setItem('nirnaya-theme', state.isDarkMode ? 'dark' : 'light');

        localStorage.setItem('nirnaya-wheel-design', state.wheelDesign);

    }



    function loadFromStorage() {

        const savedOptions = localStorage.getItem('nirnaya-options');

        if (savedOptions) {

            try {

                state.options = JSON.parse(savedOptions);

            } catch (e) {

                state.options = [];

            }

        }



        const savedTheme = localStorage.getItem('nirnaya-theme');

        if (savedTheme === 'light') {

            state.isDarkMode = false;

            document.body.classList.add('light-mode');

            elements.themeToggle.textContent = 'Dark Mode';

        }



        const savedWheelDesign = localStorage.getItem('nirnaya-wheel-design');

        if (savedWheelDesign) {

            state.wheelDesign = savedWheelDesign;

        }

    }



    /* ===================================

       UI UPDATES

       Interface synchronization and state reflection

       =================================== */

    function updateUI() {

        renderOptions();

        updateHelpText();

        updateSpinButton();

        updateDesignButtons();

        renderWheel();

    }



    function updateHelpText() {

        const helpText = elements.helpText;

        helpText.classList.remove('error');

        

        if (state.options.length === 0) {

            helpText.textContent = 'Add at least 2 options to spin the wheel';

        } else if (state.options.length === 1) {

            helpText.textContent = 'Add one more option to spin';

        } else if (state.options.length >= 12) {

            helpText.textContent = 'Maximum 12 options reached';

        } else {

            helpText.textContent = `${state.options.length} options ready`;

        }

    }



    function updateSpinButton() {

        elements.spinBtn.disabled = state.options.length < 2 || state.isSpinning;

    }



    function renderOptions() {

        elements.optionsContainer.innerHTML = '';

        

        state.options.forEach((option, index) => {

            const chip = document.createElement('div');

            chip.className = 'option-chip';

            chip.innerHTML = `

                ${option}

                <button class="remove-btn" data-index="${index}">×</button>

            `;

            

            // Stagger animation for each chip

            chip.style.animationDelay = `${index * 0.05}s`;

            

            elements.optionsContainer.appendChild(chip);

        });

    }



    /* ===================================

       WHEEL RENDERING ENGINE

       Core canvas rendering system for all wheel designs

       =================================== */

    function renderWheel() {

        if (!ctx || !elements.wheelCanvas) {

            console.error('Canvas context not available for rendering');

            return;

        }

        const centerX = state.canvasSize / 2;

        const centerY = state.canvasSize / 2;

        const radius = state.canvasSize / 2 - 20;

        // Clear canvas for fresh rendering

        ctx.clearRect(0, 0, state.canvasSize, state.canvasSize);

        // Get current wheel design for rendering

        const currentDesign = getCurrentWheelDesign();

        const isDarkWheel = (

            currentDesign === 'galaxy' ||

            currentDesign === 'star'

        );

        // Draw wheel background and segments

        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate((state.currentRotation * Math.PI) / 180);

        

        if (isDarkWheel) {

            ctx.fillStyle = '#000000';

            ctx.beginPath();

            ctx.arc(0, 0, radius, 0, 2 * Math.PI);

            ctx.fill();

        }

        

        if (state.options.length === 0) {

            // Empty state

            ctx.fillStyle = (isDarkWheel || state.isDarkMode)

                ? '#1A1A1A'

                : '#F5F5F5';

            drawWheelShape(ctx, currentDesign, radius, 0, 2 * Math.PI, true);

            ctx.fill();

            

            ctx.fillStyle = (isDarkWheel || state.isDarkMode)

                ? '#666666'

                : '#999999';

            ctx.font = 'bold 24px system-ui';

            ctx.textAlign = 'center';

            ctx.textBaseline = 'middle';

            ctx.fillText('ADD OPTIONS TO BEGIN', 0, 0);

        } else {

            // Draw segments based on design

            const segmentAngle = (2 * Math.PI) / state.options.length;

            const colors = getWheelColors(currentDesign);

            

            // Apply design-specific effects

            applyDesignEffects(ctx, currentDesign);

            

            state.options.forEach((option, index) => {

                const startAngle = index * segmentAngle;

                const endAngle = startAngle + segmentAngle;

                

                // Draw segment based on design

                drawSegment(ctx, currentDesign, index, startAngle, endAngle, radius, colors[index % colors.length], isDarkWheel);

                

                // Draw text (always upright)

                drawSegmentText(ctx, currentDesign, option, startAngle, endAngle, radius, index);

                

                // Highlight winner

                if (index === state.winnerIndex && !state.isSpinning) {

                    highlightWinner(ctx, currentDesign, startAngle, endAngle, radius);

                }

            });

        }

        

        // Add overlays based on design (draw before restoring context)

        if (currentDesign === 'cyber') {

            drawCyberGrid(ctx, radius);

        } else if (currentDesign === 'galaxy') {

            drawGalaxyStars(ctx, radius);

        } else if (currentDesign === 'star') {

            drawStarLinesOverlay(ctx, radius);

        }

        

        ctx.restore();

        

        // Draw center element based on design

        drawCenterElement(ctx, currentDesign, centerX, centerY, isDarkWheel);

    }



    /**

     * Gets the currently selected wheel design

     * @returns {string} The current design name

     */

    function getCurrentWheelDesign() {

        return state.wheelDesign;

    }



    /**

     * Draws the basic wheel shape based on design type

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     * @param {number} radius - Wheel radius

     * @param {number} startAngle - Starting angle in radians

     * @param {number} endAngle - Ending angle in radians

     * @param {boolean} fillOnly - Whether to only fill (no stroke)

     */

    function drawWheelShape(ctx, design, radius, startAngle, endAngle, fillOnly = false) {

        ctx.beginPath();

        

        switch (design) {

            case 'flower':

                drawFlowerShape(ctx, radius, startAngle, endAngle);

                break;

            case 'fan':

                drawFanShape(ctx, radius, startAngle, endAngle);

                break;

            case 'star':

                drawStarShape(ctx, radius, startAngle, endAngle);

                break;

            case 'galaxy':

                drawGalaxyShape(ctx, radius, startAngle, endAngle);

                break;

            default:

                // Classic circle

                ctx.moveTo(0, 0);

                ctx.arc(0, 0, radius, startAngle, endAngle);

                break;

        }

        

        if (!fillOnly) {

            ctx.closePath();

        }

    }



    function drawFlowerShape(ctx, radius, startAngle, endAngle) {

        const petalCount = 8;

        const petalDepth = radius * 0.3;

        const angleRange = endAngle - startAngle;

        const midAngle = startAngle + angleRange / 2;

        

        // Create petal shape

        const petalRadius = radius + petalDepth * Math.sin((midAngle * petalCount) / 2);

        

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        

        // Add petal curve

        const controlPoint1X = Math.cos(startAngle) * radius;

        const controlPoint1Y = Math.sin(startAngle) * radius;

        const controlPoint2X = Math.cos(endAngle) * radius;

        const controlPoint2Y = Math.sin(endAngle) * radius;

        const petalPointX = Math.cos(midAngle) * petalRadius;

        const petalPointY = Math.sin(midAngle) * petalRadius;

        

        ctx.quadraticCurveTo(petalPointX, petalPointY, controlPoint2X, controlPoint2Y);

    }



    function drawFanShape(ctx, radius, startAngle, endAngle) {

        const innerRadius = radius * 0.2;

        const bladeCurve = radius * 0.15;

        const midAngle = startAngle + (endAngle - startAngle) / 2;

        

        // Fan blade shape

        ctx.moveTo(0, 0);

        

        // Inner arc

        ctx.arc(0, 0, innerRadius, startAngle, endAngle);

        

        // Outer curved blade

        const outerStartX = Math.cos(endAngle) * radius;

        const outerStartY = Math.sin(endAngle) * radius;

        const outerEndX = Math.cos(startAngle) * radius;

        const outerEndY = Math.sin(startAngle) * radius;

        const bladeTipX = Math.cos(midAngle) * (radius + bladeCurve);

        const bladeTipY = Math.sin(midAngle) * (radius + bladeCurve);

        

        ctx.quadraticCurveTo(bladeTipX, bladeTipY, outerEndX, outerEndY);

    }



    function drawStarShape(ctx, radius, startAngle, endAngle) {

        const points = 12;

        const innerRadius = radius * 0.4;

        const angleStep = (2 * Math.PI) / points;

        

        // Find which star points this segment covers

        const segmentPoints = [];

        let currentAngle = startAngle;

        while (currentAngle < endAngle) {

            segmentPoints.push(currentAngle);

            currentAngle += angleStep;

        }

        

        ctx.moveTo(0, 0);

        

        if (segmentPoints.length > 0) {

            // Draw star points

            segmentPoints.forEach((angle, i) => {

                const isOuter = i % 2 === 0;

                const r = isOuter ? radius : innerRadius;

                const x = Math.cos(angle) * r;

                const y = Math.sin(angle) * r;

                

                if (i === 0) {

                    ctx.lineTo(x, y);

                } else {

                    ctx.lineTo(x, y);

                }

            });

            

            // Close the shape

            const lastAngle = segmentPoints[segmentPoints.length - 1];

            const isLastOuter = segmentPoints.length % 2 === 1;

            const lastRadius = isLastOuter ? radius : innerRadius;

            const lastX = Math.cos(lastAngle) * lastRadius;

            const lastY = Math.sin(lastAngle) * lastRadius;

            ctx.lineTo(lastX, lastY);

        }

        

        // Fill back to center

        ctx.lineTo(0, 0);

    }



    function drawGalaxyShape(ctx, radius, startAngle, endAngle) {

        // Draw orbital ring

        const orbitRadius = radius * 0.8;

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, orbitRadius, startAngle, endAngle);

    }



    /**

     * Draws a single wheel segment with design-specific styling

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     * @param {number} index - Segment index

     * @param {number} startAngle - Starting angle in radians

     * @param {number} endAngle - Ending angle in radians

     * @param {number} radius - Wheel radius

     * @param {string} color - Segment color

     * @param {boolean} isDarkWheel - Whether wheel has dark background

     */

    function drawSegment(ctx, design, index, startAngle, endAngle, radius, color, isDarkWheel) {

        ctx.save();

        

        switch (design) {

            case 'flower':

                drawFlowerSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'fan':

                drawFanSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'star':

                drawStarSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'galaxy':

                drawGalaxySegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'neon':

                drawNeonSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'cyber':

                drawCyberSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            case 'rainbow':

                drawRainbowSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel);

                break;

            default:

                drawClassicSegment(ctx, startAngle, endAngle, radius, color, isDarkWheel);

                break;

        }

        

        ctx.restore();

    }



    function drawClassicSegment(ctx, startAngle, endAngle, radius, color, isDarkWheel) {

        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Border

        ctx.strokeStyle = (isDarkWheel || state.isDarkMode) ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 0, 0, 0.2)';

        ctx.lineWidth = 2;

        ctx.stroke();

    }



    function drawFlowerSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        const petalCount = state.options.length; // Exactly match number of options

        

        // Add controlled randomness for natural variation

        const randomFactor = 0.85 + (Math.sin(index * 1.7) * 0.15); // Consistent per petal

        const petalDepth = radius * 0.35 * randomFactor; // Variable depth

        const petalWidth = (endAngle - startAngle) * 0.75; // Natural width

        const midAngle = startAngle + (endAngle - startAngle) / 2;

        

        // Create gradient for petal depth

        const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius + petalDepth);

        const baseColor = color;

        gradient.addColorStop(0, adjustColorBrightness(baseColor, 25)); // Lighter center

        gradient.addColorStop(0.7, baseColor); // Base color

        gradient.addColorStop(1, adjustColorBrightness(baseColor, -20)); // Darker tip

        

        ctx.fillStyle = gradient;

        ctx.beginPath();

        

        // Create organic petal shape using cubic bezier curves

        const innerRadius = radius * 0.12; // Small center opening

        const petalTipRadius = radius + petalDepth;

        

        // Start from inner edge

        const innerStartX = Math.cos(startAngle) * innerRadius;

        const innerStartY = Math.sin(startAngle) * innerRadius;

        ctx.moveTo(innerStartX, innerStartY);

        

        // Inner curve (petal base) - slightly rounded

        const innerEndX = Math.cos(endAngle) * innerRadius;

        const innerEndY = Math.sin(endAngle) * innerRadius;

        

        // Calculate petal tip with slight natural curve

        const tipOffset = Math.sin(index * 2.3) * 0.05; // Subtle tip variation

        const adjustedMidAngle = midAngle + tipOffset;

        const tipX = Math.cos(adjustedMidAngle) * petalTipRadius;

        const tipY = Math.sin(adjustedMidAngle) * petalTipRadius;

        

        // Cubic bezier control points for organic petal shape

        const angle1 = startAngle + petalWidth * 0.25;

        const angle2 = endAngle - petalWidth * 0.25;

        

        // First curve: inner to tip (left side of petal)

        const cp1X = Math.cos(angle1) * (radius * 0.5);

        const cp1Y = Math.sin(angle1) * (radius * 0.5);

        const cp2X = Math.cos(adjustedMidAngle - 0.1) * (radius * 0.85);

        const cp2Y = Math.sin(adjustedMidAngle - 0.1) * (radius * 0.85);

        

        // Second curve: tip to inner (right side of petal)

        const cp3X = Math.cos(adjustedMidAngle + 0.1) * (radius * 0.85);

        const cp3Y = Math.sin(adjustedMidAngle + 0.1) * (radius * 0.85);

        const cp4X = Math.cos(angle2) * (radius * 0.5);

        const cp4Y = Math.sin(angle2) * (radius * 0.5);

        

        // Draw petal with smooth cubic bezier curves

        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, tipX, tipY);

        ctx.bezierCurveTo(cp3X, cp3Y, cp4X, cp4Y, innerEndX, innerEndY);

        

        ctx.closePath();

        ctx.fill();

        

        // Add subtle inner shadow near petal base

        ctx.save();

        ctx.globalAlpha = 0.3;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

        ctx.beginPath();

        ctx.moveTo(innerStartX, innerStartY);

        ctx.bezierCurveTo(

            Math.cos(angle1) * (radius * 0.3),

            Math.sin(angle1) * (radius * 0.3),

            Math.cos(angle2) * (radius * 0.3),

            Math.sin(angle2) * (radius * 0.3),

            innerEndX, innerEndY

        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

        

        // Soft petal border with gradient

        ctx.save();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

        ctx.lineWidth = 1.5;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';

        ctx.shadowBlur = 2;

        ctx.stroke();

        ctx.restore();

    }



    function drawFanSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        // Increase spacing between blades for clarity

        const padding = (endAngle - startAngle) * 0.08; // 8% padding on each side

        const paddedStartAngle = startAngle + padding;

        const paddedEndAngle = endAngle - padding;

        

        const innerRadius = radius * 0.3; // Slightly larger hub for better separation

        const bladeCurve = radius * 0.15;

        const midAngle = paddedStartAngle + (paddedEndAngle - paddedStartAngle) / 2;

        

        ctx.fillStyle = color;

        ctx.beginPath();

        

        // Inner hub with improved spacing

        const innerStartX = Math.cos(paddedStartAngle) * innerRadius;

        const innerStartY = Math.sin(paddedStartAngle) * innerRadius;

        ctx.moveTo(innerStartX, innerStartY);

        

        // Inner arc with padding

        const innerEndX = Math.cos(paddedEndAngle) * innerRadius;

        const innerEndY = Math.sin(paddedEndAngle) * innerRadius;

        ctx.arc(0, 0, innerRadius, paddedStartAngle, paddedEndAngle);

        

        // Curved blade with more defined shape

        const outerEndX = Math.cos(paddedEndAngle) * radius;

        const outerEndY = Math.sin(paddedEndAngle) * radius;

        const outerStartX = Math.cos(paddedStartAngle) * radius;

        const outerStartY = Math.sin(paddedStartAngle) * radius;

        const bladeTipX = Math.cos(midAngle) * (radius + bladeCurve);

        const bladeTipY = Math.sin(midAngle) * (radius + bladeCurve);

        

        // Create smooth blade curve

        ctx.quadraticCurveTo(bladeTipX, bladeTipY, outerStartX, outerStartY);

        ctx.closePath();

        ctx.fill();

        

        // Enhanced fan blade border

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

        ctx.lineWidth = 2;

        ctx.stroke();

        

        // Add blade highlight for depth

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

        ctx.lineWidth = 1;

        const highlightStart = paddedStartAngle + (paddedEndAngle - paddedStartAngle) * 0.3;

        const highlightEnd = paddedStartAngle + (paddedEndAngle - paddedStartAngle) * 0.7;

        ctx.beginPath();

        ctx.arc(0, 0, radius * 0.7, highlightStart, highlightEnd);

        ctx.stroke();

    }



    function drawStarSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        // Minimal segment styling - very subtle

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Thin border for definition

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)'; // Very subtle gold border

        ctx.lineWidth = 0.5;

        ctx.stroke();

    }



    function drawGalaxySegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        const orbitRadius = radius * 0.8;

        const planetRadius = radius * 0.15;

        const midAngle = startAngle + (endAngle - startAngle) / 2;

        

        // Draw orbital ring

        ctx.strokeStyle = color;

        ctx.lineWidth = 3;

        ctx.globalAlpha = 0.3;

        ctx.beginPath();

        ctx.arc(0, 0, orbitRadius, startAngle, endAngle);

        ctx.stroke();

        ctx.globalAlpha = 1;

        

        // Draw planet

        const planetX = Math.cos(midAngle) * orbitRadius;

        const planetY = Math.sin(midAngle) * orbitRadius;

        

        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.arc(planetX, planetY, planetRadius, 0, 2 * Math.PI);

        ctx.fill();

        

        // Planet glow

        ctx.shadowColor = color;

        ctx.shadowBlur = 20;

        ctx.fill();

        ctx.shadowBlur = 0;

        

        // Ring for some planets

        if (index % 3 === 0) {

            ctx.strokeStyle = color;

            ctx.lineWidth = 2;

            ctx.globalAlpha = 0.6;

            ctx.beginPath();

            ctx.ellipse(planetX, planetY, planetRadius * 1.5, planetRadius * 0.5, 0, 0, 2 * Math.PI);

            ctx.stroke();

            ctx.globalAlpha = 1;

        }

    }



    function drawNeonSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        // Neon glow effect

        ctx.shadowColor = color;

        ctx.shadowBlur = 20;

        

        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Strong neon border

        ctx.strokeStyle = '#FFFFFF';

        ctx.lineWidth = 3;

        ctx.shadowColor = '#FFFFFF';

        ctx.shadowBlur = 10;

        ctx.stroke();

        

        ctx.shadowBlur = 0;

    }



    function drawCyberSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        // Cyber grid background

        ctx.fillStyle = '#0A0A0A';

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Clean digital segment with smooth edges

        ctx.fillStyle = color;

        ctx.strokeStyle = color;

        ctx.lineWidth = 2;

        

        // Create clean digital edge (no randomness)

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius * 0.85, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Add subtle glow to segment

        ctx.shadowColor = color;

        ctx.shadowBlur = 8;

        ctx.fill();

        ctx.shadowBlur = 0;

    }



    function drawRainbowSegment(ctx, index, startAngle, endAngle, radius, color, isDarkWheel) {

        // Calculate HSL color based on current hue and segment position

        const segmentCount = state.options.length;

        const hueStep = 360 / segmentCount;

        const segmentHue = (state.rainbowHue + (index * hueStep)) % 360;

        

        // Create smooth HSL gradient

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);

        gradient.addColorStop(0, `hsl(${segmentHue}, 85%, 65%)`); // Lighter center

        gradient.addColorStop(0.7, `hsl(${segmentHue}, 75%, 55%)`); // Base color

        gradient.addColorStop(1, `hsl(${segmentHue}, 65%, 45%)`); // Darker edge

        

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.arc(0, 0, radius, startAngle, endAngle);

        ctx.closePath();

        ctx.fill();

        

        // Rainbow border with slightly different hue for depth

        ctx.strokeStyle = `hsl(${segmentHue}, 80%, 40%)`;

        ctx.lineWidth = 2;

        ctx.stroke();

    }



    /**

     * Draws text label for a wheel segment with design-specific positioning

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     * @param {string} option - Text to display

     * @param {number} startAngle - Starting angle in radians

     * @param {number} endAngle - Ending angle in radians

     * @param {number} radius - Wheel radius

     * @param {number} index - Segment index

     */

    function drawSegmentText(ctx, design, option, startAngle, endAngle, radius, index) {

        ctx.save();

        

        const midAngle = startAngle + (endAngle - startAngle) / 2;

        

        // Dynamic font sizing based on option count for readability

        const optionCount = state.options.length;

        let baseFontSize = 16;

        if (optionCount > 8) baseFontSize = 14;

        if (optionCount > 10) baseFontSize = 12;

        

        let textX, textY, fontSize = `bold ${baseFontSize}px`;

        

        // Calculate optimal text position based on wheel design

        switch (design) {

            case 'flower':

                // Position text in the middle of the petal

                const petalRadius = radius * 0.6; // Middle of petal

                textX = Math.cos(midAngle) * petalRadius;

                textY = Math.sin(midAngle) * petalRadius;

                fontSize = `bold ${baseFontSize - 2}px`;

                break;

            case 'fan':

                // Calculate text position only on fan blades, not near center hub

                const bladeInnerRadius = radius * 0.45; // Start well away from hub

                const bladeOuterRadius = radius * 0.75; // Stay within blade area

                const bladeMidRadius = (bladeInnerRadius + bladeOuterRadius) / 2;

                

                // Position text in the middle portion of the blade

                textX = Math.cos(midAngle) * bladeMidRadius;

                textY = Math.sin(midAngle) * bladeMidRadius;

                fontSize = `bold ${baseFontSize - 2}px`;

                

                // Rotate text to align with blade direction

                ctx.save();

                ctx.translate(textX, textY);

                ctx.rotate(midAngle + Math.PI / 2); // Align text perpendicular to blade

                ctx.translate(-textX, -textY);

                break;

            case 'star':

                // Position text in the middle of star points

                const starRadius = radius * 0.55;

                textX = Math.cos(midAngle) * starRadius;

                textY = Math.sin(midAngle) * starRadius;

                fontSize = `bold ${baseFontSize - 4}px`;

                break;

            case 'galaxy':

                // Position text on the planet

                const orbitRadius = radius * 0.8;

                textX = Math.cos(midAngle) * orbitRadius;

                textY = Math.sin(midAngle) * orbitRadius;

                fontSize = `bold ${baseFontSize - 4}px`;

                break;

            case 'rainbow':

                textX = Math.cos(midAngle) * radius * 0.65;

                textY = Math.sin(midAngle) * radius * 0.65;

                break;

            case 'neon':

                textX = Math.cos(midAngle) * radius * 0.65;

                textY = Math.sin(midAngle) * radius * 0.65;

                break;

            case 'cyber':

                // Position text to avoid grid overlap - place between grid lines

                const cyberTextRadius = radius * 0.58; // Between grid circles

                textX = Math.cos(midAngle) * cyberTextRadius;

                textY = Math.sin(midAngle) * cyberTextRadius;

                fontSize = `bold ${baseFontSize - 3}px monospace`;

                break;

            default:

                // Classic and others

                textX = Math.cos(midAngle) * radius * 0.65;

                textY = Math.sin(midAngle) * radius * 0.65;

                break;

        }

        

        // Enhanced text styling for maximum readability across designs

        ctx.font = fontSize + ' system-ui';

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.lineJoin = 'round';

        

        // Strong text stroke for contrast on all backgrounds

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';

        ctx.lineWidth = Math.max(5, baseFontSize / 3); // Dynamic stroke width

        

        // Enhanced shadow for improved text visibility

        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';

        ctx.shadowBlur = 6;

        ctx.shadowOffsetX = 1;

        ctx.shadowOffsetY = 1;

        

        // Design-specific text color and shadow adjustments

        switch (design) {

            case 'neon':

                ctx.fillStyle = '#FFFFFF';

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';

                ctx.shadowColor = '#00FFFF';

                ctx.shadowBlur = 8;

                break;

            case 'cyber':

                ctx.fillStyle = '#FFFFFF';

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';

                ctx.shadowColor = '#00FFFF';

                ctx.shadowBlur = 6;

                break;

            case 'rainbow':

                ctx.fillStyle = '#FFFFFF';

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';

                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';

                ctx.shadowBlur = 6;

                break;

            case 'galaxy':

                ctx.fillStyle = '#FFFFFF';

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';

                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';

                ctx.shadowBlur = 8;

                break;

            default:

                ctx.fillStyle = '#FFFFFF';

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';

                break;

        }

        

        // Smart text truncation based on option count and design constraints

        let displayText = option;

        let maxLength = 12;

        if (optionCount > 8) maxLength = 10;

        if (optionCount > 10) maxLength = 8;

        

        if (design === 'galaxy') {

            maxLength = Math.min(maxLength, 8); // Shorter for planets

        } else if (design === 'star') {

            maxLength = Math.min(maxLength, 10); // Slightly shorter for star points

        } else if (design === 'flower' || design === 'fan') {

            maxLength = Math.min(maxLength, 11); // Medium for organic shapes

        }

        

        if (option.length > maxLength) {

            displayText = option.substring(0, maxLength) + '...';

        }

        

        // Draw text with enhanced stroke for maximum readability

        ctx.strokeText(displayText, textX, textY);

        ctx.fillText(displayText, textX, textY);

        

        // Restore context for fan design text rotation

        if (design === 'fan') {

            ctx.restore();

        }

        

        ctx.restore();

    }



    /**

     * Highlights the winning segment with pulsing animation

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     * @param {number} startAngle - Starting angle in radians

     * @param {number} endAngle - Ending angle in radians

     * @param {number} radius - Wheel radius

     */

    function highlightWinner(ctx, design, startAngle, endAngle, radius) {

        ctx.save();

        

        // Pulse animation for winner highlight effect

        state.winnerPulsePhase += 0.05;

        const pulseIntensity = 0.4 + Math.sin(state.winnerPulsePhase) * 0.15;

        ctx.fillStyle = `rgba(255, 215, 0, ${pulseIntensity})`;

        

        switch (design) {

            case 'galaxy':

                // Highlight planet with pulse

                const midAngle = startAngle + (endAngle - startAngle) / 2;

                const orbitRadius = radius * 0.8;

                const planetX = Math.cos(midAngle) * orbitRadius;

                const planetY = Math.sin(midAngle) * orbitRadius;

                const pulseRadius = radius * 0.2 * (1 + Math.sin(state.winnerPulsePhase) * 0.1);

                

                // Glow ring around planet

                ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';

                ctx.shadowBlur = 20 + Math.sin(state.winnerPulsePhase) * 10;

                

                ctx.beginPath();

                ctx.arc(planetX, planetY, pulseRadius, 0, 2 * Math.PI);

                ctx.fill();

                

                // Additional glow ring

                ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';

                ctx.lineWidth = 3;

                ctx.beginPath();

                ctx.arc(planetX, planetY, pulseRadius + 8, 0, 2 * Math.PI);

                ctx.stroke();

                break;

            default:

                // Highlight segment with pulse

                const pulseScale = 1 + Math.sin(state.winnerPulsePhase) * 0.02;

                

                ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';

                ctx.shadowBlur = 15 + Math.sin(state.winnerPulsePhase) * 8;

                

                drawWheelShape(ctx, design, radius * pulseScale, startAngle, endAngle);

                ctx.fill();

                

                // Glow ring

                ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';

                ctx.lineWidth = 2;

                drawWheelShape(ctx, design, radius * 1.05, startAngle, endAngle);

                ctx.stroke();

                break;

        }

        

        ctx.restore();

    }



    /**

     * Draws the center element based on wheel design

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     * @param {number} centerX - Center X coordinate

     * @param {number} centerY - Center Y coordinate

     * @param {boolean} isDarkWheel - Whether wheel has dark background

     */

    function drawCenterElement(ctx, design, centerX, centerY, isDarkWheel) {

        ctx.save();

        

        switch (design) {

            case 'flower':

                // Enhanced flower center with gradient and subtle pulse

                state.starGlowPhase += 0.03;

                const pulseScale = 1 + Math.sin(state.starGlowPhase) * 0.02;

                

                const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35 * pulseScale);

                centerGradient.addColorStop(0, '#FFEA80'); // Bright center

                centerGradient.addColorStop(0.6, '#FFD700'); // Gold middle

                centerGradient.addColorStop(1, '#FFA500'); // Orange outer

                

                ctx.fillStyle = centerGradient;

                ctx.beginPath();

                ctx.arc(centerX, centerY, 35 * pulseScale, 0, 2 * Math.PI);

                ctx.fill();

                

                // Add texture dots for pollen effect

                ctx.fillStyle = '#FF8C00';

                for (let i = 0; i < 8; i++) {

                    const angle = (Math.PI * 2 / 8) * i;

                    const dotX = centerX + Math.cos(angle) * 15 * pulseScale;

                    const dotY = centerY + Math.sin(angle) * 15 * pulseScale;

                    ctx.beginPath();

                    ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);

                    ctx.fill();

                }

                

                // Inner highlight with pulse

                ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(state.starGlowPhase) * 0.1})`;

                ctx.beginPath();

                ctx.arc(centerX - 8, centerY - 8, 8, 0, 2 * Math.PI);

                ctx.fill();

                break;

                

            case 'fan':

                // Fan hub

                ctx.fillStyle = '#34495E';

                ctx.beginPath();

                ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);

                ctx.fill();

                

                ctx.strokeStyle = '#2C3E50';

                ctx.lineWidth = 4;

                ctx.stroke();

                

                // Center bolt

                ctx.fillStyle = '#7F8C8D';

                ctx.beginPath();

                ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);

                ctx.fill();

                break;

                

            case 'galaxy':

                // Sun with pulse

                state.starGlowPhase += 0.02;

                const sunPulse = 1 + Math.sin(state.starGlowPhase) * 0.03;

                

                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30 * sunPulse);

                gradient.addColorStop(0, '#FFFF00');

                gradient.addColorStop(0.5, '#FFD700');

                gradient.addColorStop(1, '#FFA500');

                

                ctx.fillStyle = gradient;

                ctx.beginPath();

                ctx.arc(centerX, centerY, 30 * sunPulse, 0, 2 * Math.PI);

                ctx.fill();

                

                // Sun glow with pulse

                ctx.shadowColor = '#FFD700';

                ctx.shadowBlur = 30 + Math.sin(state.starGlowPhase) * 10;

                ctx.fill();

                ctx.shadowBlur = 0;

                break;

                

            case 'neon':

                // Neon center

                ctx.shadowColor = '#FF00FF';

                ctx.shadowBlur = 20;

                ctx.fillStyle = '#FF00FF';

                ctx.beginPath();

                ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);

                ctx.fill();

                

                ctx.shadowColor = '#00FFFF';

                ctx.fillStyle = '#00FFFF';

                ctx.beginPath();

                ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);

                ctx.fill();

                ctx.shadowBlur = 0;

                break;

                

            case 'cyber':

                // Cyber center

                ctx.fillStyle = '#00FFFF';

                ctx.strokeStyle = '#FF00FF';

                ctx.lineWidth = 3;

                

                // Hexagon shape

                const size = 25;

                ctx.beginPath();

                for (let i = 0; i < 6; i++) {

                    const angle = (Math.PI / 3) * i;

                    const x = centerX + size * Math.cos(angle);

                    const y = centerY + size * Math.sin(angle);

                    if (i === 0) ctx.moveTo(x, y);

                    else ctx.lineTo(x, y);

                }

                ctx.closePath();

                ctx.fill();

                ctx.stroke();

                break;

                

            case 'star':

                // Star center with subtle pulse

                state.starGlowPhase += 0.02;

                const starPulse = 1 + Math.sin(state.starGlowPhase) * 0.02;

                

                drawStar(ctx, centerX, centerY, 30 * starPulse, 15 * starPulse, 5);

                ctx.fillStyle = '#FFD700';

                ctx.fill();

                ctx.strokeStyle = '#FFA500';

                ctx.lineWidth = 3;

                ctx.stroke();

                

                // Add center highlight with pulse

                const highlightPulse = 0.7 + Math.sin(state.starGlowPhase) * 0.1;

                ctx.fillStyle = `rgba(255, 255, 255, ${highlightPulse})`;

                ctx.beginPath();

                ctx.arc(centerX, centerY, 8 * starPulse, 0, 2 * Math.PI);

                ctx.fill();

                break;

                

            default:

                // Classic center

                ctx.fillStyle = (isDarkWheel || state.isDarkMode) ? '#FFD700' : '#C9A227';

                ctx.beginPath();

                ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);

                ctx.fill();

                

                ctx.strokeStyle = (isDarkWheel || state.isDarkMode) ? '#B8860B' : '#8B6914';

                ctx.lineWidth = 3;

                ctx.stroke();

                break;

        }

        

        ctx.restore();

    }



    /**

     * Draws a star shape with specified parameters

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {number} cx - Center X coordinate

     * @param {number} cy - Center Y coordinate

     * @param {number} outerRadius - Outer radius of star points

     * @param {number} innerRadius - Inner radius between points

     * @param {number} points - Number of star points

     */

    function drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {

        ctx.beginPath();

        for (let i = 0; i < points * 2; i++) {

            const radius = i % 2 === 0 ? outerRadius : innerRadius;

            const angle = (Math.PI / points) * i - Math.PI / 2;

            const x = cx + radius * Math.cos(angle);

            const y = cy + radius * Math.sin(angle);

            if (i === 0) ctx.moveTo(x, y);

            else ctx.lineTo(x, y);

        }

        ctx.closePath();

    }



    /**

     * Applies design-specific visual effects to the context

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {string} design - Wheel design type

     */

    function applyDesignEffects(ctx, design) {

        switch (design) {

            case 'neon':

                ctx.shadowColor = '#00FFFF';

                ctx.shadowBlur = 15;

                break;

            case 'cyber':

                ctx.shadowColor = '#00FFFF';

                ctx.shadowBlur = 10;

                break;

            case 'galaxy':

                ctx.shadowColor = '#FFD700';

                ctx.shadowBlur = 20;

                break;

            default:

                ctx.shadowBlur = 0;

                break;

        }

    }



    /**

     * Returns color palette for the specified wheel design

     * @param {string} design - Wheel design type (default: 'classic')

     * @returns {string[]} Array of hex color codes

     */

    function getWheelColors(design = 'classic') {

        switch (design) {

            case 'neon':

                return ['#FF00FF', '#00FFFF', '#FF00AA', '#00AAFF', '#FF0066', '#0066FF', '#FF0033', '#0033FF'];

            case 'cyber':

                return ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FF0088', '#8800FF', '#00FF88', '#FF8800'];

            case 'flower':

                return ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FF69B4', '#DB7093', '#FF6347', '#FFA07A'];

            case 'fan':

                return ['#87CEEB', '#4682B4', '#5F9EA0', '#6495ED', '#1E90FF', '#00BFFF', '#87CEFA', '#B0C4DE'];

            case 'galaxy':

                return ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#FF6347', '#20B2AA', '#FF4500'];

            case 'star':

                return ['#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A'];

            case 'rainbow':

                return ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493'];

            default:

                return ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#6C5CE7', '#45B7D1', '#96CEB4', '#FECA57'];

        }

    }



    /**

     * Draws animated cyber grid overlay for cyber design

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {number} radius - Wheel radius

     */

    function drawCyberGrid(ctx, radius) {

        ctx.save();

        

        // Grid should be stationary and centered, don't apply wheel rotation

        // Draw concentric circles centered at wheel origin

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';

        ctx.lineWidth = 1;

        ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';

        ctx.shadowBlur = 2;

        

        // Draw concentric circles with increasing radius

        const circleCount = 6;

        for (let i = 1; i <= circleCount; i++) {

            const gridRadius = (radius / circleCount) * i;

            ctx.beginPath();

            ctx.arc(0, 0, gridRadius, 0, 2 * Math.PI);

            ctx.stroke();

        }

        

        // Draw radial lines emanating from center

        const radialCount = 12;

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.12)';

        for (let i = 0; i < radialCount; i++) {

            const angle = (2 * Math.PI / radialCount) * i - Math.PI / 2; // Start from top

            const x = Math.cos(angle) * radius;

            const y = Math.sin(angle) * radius;

            

            ctx.beginPath();

            ctx.moveTo(0, 0); // Start from center

            ctx.lineTo(x, y); // Extend to edge

            ctx.stroke();

        }

        

        // Animated scanning line for dynamic effect

        if (!state.isSpinning) {

            const scanAngle = (Date.now() / 50) % 360;

            const scanRad = (scanAngle * Math.PI) / 180 - Math.PI / 2;

            

            // Main scanning line with green glow effect

            ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';

            ctx.lineWidth = 2;

            ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';

            ctx.shadowBlur = 10;

            

            ctx.beginPath();

            ctx.moveTo(0, 0); // Start from center

            ctx.lineTo(Math.cos(scanRad) * radius, Math.sin(scanRad) * radius);

            ctx.stroke();

            

            // Trailing fade effect for scanning line

            for (let i = 1; i <= 3; i++) {

                const fadeAngle = scanRad - (i * 0.1);

                const opacity = 0.3 / i;

                

                ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;

                ctx.lineWidth = 1;

                ctx.shadowBlur = 5;

                

                ctx.beginPath();

                ctx.moveTo(0, 0); // Start from center

                ctx.lineTo(Math.cos(fadeAngle) * radius, Math.sin(fadeAngle) * radius);

                ctx.stroke();

            }

        }

        

        ctx.restore();

    }



    /**

     * Initializes star field for galaxy design with random positions

     * Creates parallax effect during wheel rotation

     */

    function initializeGalaxyStars() {

        state.galaxyStars = [];

        const starCount = 80; // Number of stars

        

        for (let i = 0; i < starCount; i++) {

            // Generate random star positions within wheel radius

            const angle = Math.random() * Math.PI * 2;

            const distance = Math.random() * 0.9; // Keep stars within 90% of wheel radius

            

            state.galaxyStars.push({

                x: Math.cos(angle) * distance,

                y: Math.sin(angle) * distance,

                size: Math.random() * 1.5 + 0.5, // Small stars (0.5-2px)

                opacity: Math.random() * 0.6 + 0.4, // Initial opacity (0.4-1.0)

                twinkleSpeed: Math.random() * 0.02 + 0.01, // Twinkle speed

                twinklePhase: Math.random() * Math.PI * 2 // Random phase offset

            });

        }

    }



    /**

     * Draws twinkling stars with parallax effect for galaxy design

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {number} radius - Wheel radius

     */

    function drawGalaxyStars(ctx, radius) {

        ctx.save();

        

        // Apply parallax offset during wheel spin

        const parallaxX = state.isSpinning ? Math.sin(state.galaxyParallaxOffset * 0.1) * 5 : 0;

        const parallaxY = state.isSpinning ? Math.cos(state.galaxyParallaxOffset * 0.1) * 5 : 0;

        

        state.galaxyStars.forEach(star => {

            // Calculate twinkling effect with individual phase offsets

            const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;

            const currentOpacity = star.opacity * twinkle;

            

            // Convert normalized coordinates to canvas coordinates with parallax effect

            const starX = (star.x * radius) + parallaxX;

            const starY = (star.y * radius) + parallaxY;

            

            // Draw star with enhanced glow effect

            ctx.save();

            ctx.globalAlpha = currentOpacity;

            

            // Enhanced white glow for star visibility

            ctx.fillStyle = 'rgba(255,255,255,0.9)';

            ctx.shadowColor = 'white';

            ctx.shadowBlur = 6;

            

            // Draw star

            ctx.beginPath();

            ctx.arc(starX, starY, star.size, 0, Math.PI * 2);

            ctx.fill();

            

            ctx.restore();

        });

        

        ctx.restore();

    }



    /**

     * Draws animated star lines overlay for star design

     * Creates dynamic radiating lines with breathing effect

     * @param {CanvasRenderingContext2D} ctx - Canvas context

     * @param {number} radius - Wheel radius

     */

    function drawStarLinesOverlay(ctx, radius) {

        ctx.save();

        

        // Apply inverse rotation to keep lines stationary while wheel rotates

        ctx.rotate(-(state.currentRotation * Math.PI) / 180);

        

        const time = Date.now() / 2000; // Moderate speed for visible animation

        

        // Calculate line count based on segment count

        const segmentCount = state.options.length || 8;

        const lineCount = segmentCount + 2; // One line per segment + 2 extra

        

        // Define varied line length pattern for visual interest

        const lengthPattern = [0.3, 0.6, 0.9]; // 30%, 60%, 90% of radius

        

        for (let i = 0; i < lineCount; i++) {

            // Calculate even spacing for lines based on segment count

            const baseAngle = (i * 2 * Math.PI / lineCount) - Math.PI / 2;

            

            // Add subtle rotation animation for organic movement

            const angleOffset = Math.sin(time * 0.5 + i * 0.2) * 0.05; // Small angle variation

            const angle = baseAngle + angleOffset;

            

            // Animate line length with sine wave variation

            const lengthIndex = i % lengthPattern.length;

            const baseLength = radius * lengthPattern[lengthIndex];

            const lengthVariation = Math.sin(time + i * 0.3) * 0.1; // ±10% length variation

            const lineLength = baseLength * (1 + lengthVariation);

            

            // Position lines outside center star boundary

            const startRadius = 35; // Just outside center star

            const startX = Math.cos(angle) * startRadius;

            const startY = Math.sin(angle) * startRadius;

            const endX = Math.cos(angle) * lineLength;

            const endY = Math.sin(angle) * lineLength;

            

            // Enhanced breathing animation with individual line timing

            state.starGlowPhase += 0.02;

            const breath = 0.4 + Math.sin(state.starGlowPhase + i * 0.4) * 0.25;

            

            // Animate line width for dynamic visual effect

            const lineWidth = 1.5 + Math.sin(time * 2 + i * 0.5) * 0.3;

            

            // Apply animated styling with breathing glow effect

            ctx.strokeStyle = `rgba(255, 215, 0, ${breath})`;

            ctx.lineWidth = lineWidth;

            ctx.shadowColor = `rgba(255, 215, 0, ${breath * 0.6})`;

            ctx.shadowBlur = 3 + Math.sin(time * 3 + i * 0.6) * 1; // Animated glow

            

            ctx.beginPath();

            ctx.moveTo(startX, startY);

            ctx.lineTo(endX, endY);

            ctx.stroke();

        }

        

        ctx.restore();

    }



    /**

     * Adjusts the brightness of a hex color by specified amount

     * @param {string} color - Hex color code (e.g., '#FF0000')

     * @param {number} amount - Brightness adjustment (-255 to 255)

     * @returns {string} Adjusted hex color code

     */

    function adjustColorBrightness(color, amount) {

        const num = parseInt(color.replace('#', ''), 16);

        const r = Math.max(0, Math.min(255, (num >> 16) + amount));

        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));

        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));

        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

    }



    

    /* ===================================

       IDLE ANIMATION

       Continuous animations when wheel is not spinning

       =================================== */

    function startIdleAnimation() {

        if (state.idleAnimation) {

            cancelAnimationFrame(state.idleAnimation);

        }

        

        function animate() {

            // Always update rainbow hue for smooth color cycling

            if (state.wheelDesign === 'rainbow') {

                state.rainbowHue = (state.rainbowHue + 0.5) % 360; // Smooth continuous hue shift

            }

            

            // Update winner pulse phase for continuous highlighting

            if (state.winnerIndex !== -1 && !state.isSpinning) {

                state.winnerPulsePhase += 0.05;

            }

            

            // Update star glow phase for pulsing center elements

            if (state.wheelDesign === 'star' || state.wheelDesign === 'flower' || state.wheelDesign === 'galaxy') {

                state.starGlowPhase += 0.02;

            }

            

            if (state.isIdle && !state.isSpinning && state.options.length > 0) {

                state.currentRotation += 0.5;

                renderWheel();

            } else if (state.wheelDesign === 'rainbow' || state.winnerIndex !== -1 || 

                       state.wheelDesign === 'star' || state.wheelDesign === 'flower' || state.wheelDesign === 'galaxy') {

                // Render wheel to display continuous animations

                renderWheel();

            }

            state.idleAnimation = requestAnimationFrame(animate);

        }

        

        animate();

    }



    /* ===================================

       OPTION MANAGEMENT

       Add, remove, and validate wheel options

       =================================== */

    function addOption() {

        const input = elements.optionInput.value.trim();

        

        if (!input) {

            showError('Please enter an option');

            return;

        }

        

        if (state.options.length >= 12) {

            showError('Maximum 12 options allowed');

            return;

        }

        

        if (state.options.includes(input)) {

            showError('This option already exists');

            return;

        }

        

        if (input.length > 20) {

            showError('Option must be 20 characters or less');

            return;

        }

        

        state.options.push(input);

        elements.optionInput.value = '';

        saveToStorage();

        updateUI();

    }



    function removeOption(index) {

        const chips = elements.optionsContainer.querySelectorAll('.option-chip');

        const chipToRemove = chips[index];

        

        if (chipToRemove) {

            chipToRemove.classList.add('removing');

            

            setTimeout(() => {

                state.options.splice(index, 1);

                saveToStorage();

                updateUI();

            }, 300);

        } else {

            state.options.splice(index, 1);

            saveToStorage();

            updateUI();

        }

    }



    function clearAllOptions() {

        if (state.options.length === 0) return;

        

        if (confirm('Are you sure you want to clear all options?')) {

            state.options = [];

            state.winnerIndex = -1;

            saveToStorage();

            updateUI();

        }

    }



    function showError(message) {

        const helpText = elements.helpText;

        helpText.textContent = message;

        helpText.classList.add('error');

        

        setTimeout(() => {

            helpText.classList.remove('error');

            updateHelpText();

        }, 3000);

    }



    /* ===================================

       SPIN FUNCTIONALITY

       Wheel spinning animation and winner calculation

       =================================== */

    function spin() {

        if (state.isSpinning || state.options.length < 2) return;

        

        state.isSpinning = true;

        state.isIdle = false;

        state.winnerIndex = -1;

        updateUI();

        

        // === SPIN MATH: PERFECT POINTER ALIGNMENT ===

        // 

        // GOAL: Make the pointer stop exactly in the center of a segment

        // 

        // COORDINATE SYSTEM:

        // - Canvas coordinate system: 0° at 3 o'clock, positive clockwise

        // - Pointer is at top (12 o'clock position = -90° in canvas coords)

        // - Text is rendered upright regardless of wheel rotation

        // 

        // CALCULATION:

        // 1. Each segment spans segmentAngle degrees

        // 2. Segment center is at: startAngle + (segmentAngle / 2)

        // 3. To center segment at pointer: rotate so segment center aligns with -90°

        // 4. Final rotation: -(segmentCenter) + (spins * 360)

        //

        // EXAMPLE: 3 options, segmentAngle = 120°

        // - Segment 0 center: 60° (from 0° + 120°/2)

        // - To align with pointer (-90°): rotate by -(60°) + 360°*spins

        // - Result: 300° + 360°*spins

        

        const totalOptions = state.options.length;

        const segmentAngle = 360 / totalOptions;

        

        // Use cryptographically secure random selection for fairness

        const randomArray = new Uint32Array(1);

        crypto.getRandomValues(randomArray);

        const selectedIndex = randomArray[0] % totalOptions;

        

        // Calculate exact rotation to center selected segment at pointer

        const segmentCenterAngle = (selectedIndex * segmentAngle) + (segmentAngle / 2);

        const spins = 5; // Number of full rotations for dramatic effect

        const targetRotation = (spins * 360) - segmentCenterAngle;

        

        // Execute spin animation with callback

        animateSpin(targetRotation, 4000, () => {

            // Verify winner based on final wheel position

            const actualWinnerIndex = calculateWinnerFromRotation();

            

            state.winnerIndex = actualWinnerIndex;

            state.isSpinning = false;

            state.isIdle = true;

            updateUI();

            showResult(state.options[actualWinnerIndex]);

            createConfetti();

        });

    }



    /**

     * Calculates which segment is under the pointer based on current rotation

     * Uses canvas coordinate system where pointer is at 270°

     * @returns {number} Index of the winning segment

     */

    function calculateWinnerFromRotation() {

        // Normalize rotation to 0-360 degree range

        const normalizedRotation = ((state.currentRotation % 360) + 360) % 360;

        // Pointer is at top (270° in canvas coordinates where 0° = right)

        // Find which segment is positioned at 270° (pointer location)

        const pointerAngle = 270;

        const adjustedAngle = (pointerAngle - normalizedRotation + 360) % 360;

        // Calculate angle spanned by each segment

        const segmentAngle = 360 / state.options.length;

        // Determine which segment falls under pointer position

        let winnerIndex = Math.floor(adjustedAngle / segmentAngle);

        // Ensure calculated index is within valid range

        winnerIndex = ((winnerIndex % state.options.length) + state.options.length) % state.options.length;

        return winnerIndex;

    }



    /**

     * Animates wheel spin with easing and physics

     * @param {number} targetRotation - Target rotation in degrees

     * @param {number} duration - Animation duration in milliseconds

     * @param {function} callback - Function to call on completion

     */

    function animateSpin(targetRotation, duration, callback) {

        const startRotation = state.currentRotation;

        const rotationChange = targetRotation - startRotation;

        const startTime = performance.now();

        const overshoot = 15; // Small overshoot in degrees

        const bounceDuration = 300; // Duration of bounce in ms

        

        // Add pointer vibration during spin for realism

        const pointer = document.querySelector('.pointer');

        if (pointer) pointer.classList.add('vibrating');

        

        function animate(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            

            // Apply premium cubic-bezier easing for realistic spin physics

            const easeProgress = cubicBezierEase(progress, 0.25, 1, 0.5, 1);

            

            state.currentRotation = startRotation + (rotationChange * easeProgress);

            

            // Track segment crossing for tick sound effect

            trackSegmentCrossing();

            

            // Update galaxy parallax offset during spin

            if (state.wheelDesign === 'galaxy') {

                state.galaxyParallaxOffset = (easeProgress * 10);

            }

            

            renderWheel();

            

            if (progress < 1) {

                state.spinAnimation = requestAnimationFrame(animate);

            } else {

                // Remove pointer vibration on spin completion

                if (pointer) pointer.classList.remove('vibrating');

                state.spinAnimation = null;

                

                // Apply overshoot and bounce for realistic physics

                animateBounce(targetRotation, overshoot, bounceDuration, callback);

            }

        }

        

        state.spinAnimation = requestAnimationFrame(animate);

    }

    

    /**

     * Simplified cubic-bezier easing function

     * Provides smooth acceleration and deceleration

     * @param {number} t - Time progress (0-1)

     * @returns {number} Eased progress value

     */

    function cubicBezierEase(t, x1, y1, x2, y2) {

        // Simplified cubic-bezier implementation

        return 1 - Math.pow(1 - t, 3);

    }

    

    /**

     * Animates bounce effect when wheel stops

     * Creates realistic settling physics

     * @param {number} targetRotation - Final rotation position

     * @param {number} overshoot - Overshoot amount in degrees

     * @param {number} duration - Bounce duration in milliseconds

     * @param {function} callback - Function to call on completion

     */

    function animateBounce(targetRotation, overshoot, duration, callback) {

        const startTime = performance.now();

        const startRotation = state.currentRotation;

        const bounceTarget = targetRotation + overshoot;

        

        function animate(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            

            // Apply bounce easing for realistic settling

            const easeProgress = 1 - Math.pow(1 - progress, 2);

            const bounceProgress = Math.sin(progress * Math.PI);

            state.currentRotation = startRotation + ((bounceTarget - startRotation) * bounceProgress);

            

            renderWheel();

            

            if (progress < 1) {

                requestAnimationFrame(animate);

            } else {

                state.currentRotation = targetRotation % 360;

                renderWheel();

                callback();

            }

        }

        

        requestAnimationFrame(animate);

    }

    

    /**

     * Tracks when pointer crosses segment boundaries during spin

     * Triggers tick animation for each segment crossing

     */

    function trackSegmentCrossing() {

        if (state.options.length === 0) return;

        

        const segmentAngle = 360 / state.options.length;

        const normalizedRotation = ((state.currentRotation % 360) + 360) % 360;

        const currentSegmentIndex = Math.floor(normalizedRotation / segmentAngle);

        

        if (currentSegmentIndex !== state.lastSegmentIndex) {

            state.lastSegmentIndex = currentSegmentIndex;

            

            // Trigger tick animation on segment crossing

            const pointer = document.querySelector('.pointer');

            if (pointer) {

                pointer.classList.remove('tick');

                void pointer.offsetWidth; // Trigger reflow

                pointer.classList.add('tick');

            }

        }

    }



    /* ===================================

       RESULT DISPLAY

       Winner announcement modal management

       =================================== */

    function showResult(winner) {

        elements.winnerText.textContent = winner;

        elements.resultModal.classList.add('show');

    }



    function hideResult() {

        elements.resultModal.classList.remove('show');

        state.winnerIndex = -1;

        renderWheel();

    }



    /* ===================================

       CONFETTI EFFECT

       Celebration particle animation system

       =================================== */

    function createConfetti() {

        const colors = ['#FFD700', '#C9A227', '#FFEA80', '#FF6B6B', '#4ECDC4'];

        const particleCount = 40;

        

        for (let i = 0; i < particleCount; i++) {

            setTimeout(() => {

                const particle = document.createElement('div');

                particle.className = 'confetti-particle';

                particle.style.left = Math.random() * 100 + '%';

                particle.style.background = colors[Math.floor(Math.random() * colors.length)];

                particle.style.animationDelay = Math.random() * 0.5 + 's';

                particle.style.animationDuration = (2 + Math.random()) + 's';

                document.body.appendChild(particle);

                

                setTimeout(() => particle.remove(), 3000);

            }, i * 50);

        }

    }



    /* ===================================

       DESIGN MANAGEMENT

       Wheel design switching and persistence

       =================================== */

    function changeWheelDesign(design) {

        if (state.isSpinning) {

            if (state.spinAnimation) {

                cancelAnimationFrame(state.spinAnimation);

                state.spinAnimation = null;

            }

            state.isSpinning = false;

        }

        

        if (!design || typeof design !== 'string') {

            return;

        }

        

        state.wheelDesign = design;

        saveToStorage();

        updateDesignButtons();

        renderWheel();

    }



    function updateDesignButtons() {

        if (!elements.designButtons) {

            console.error('Design buttons element not found');

            return;

        }

        

        elements.designButtons.forEach(btn => {

            btn.classList.remove('active');

            if (btn.dataset.design === state.wheelDesign) {

                btn.classList.add('active');

            }

        });

    }



    /* ===================================

       EVENT LISTENERS

       User interaction handlers and keyboard shortcuts

       =================================== */

    function setupEventListeners() {

        // Theme toggle

        elements.themeToggle.addEventListener('click', toggleTheme);

        

        // Design buttons

        elements.designButtons.forEach(btn => {

            btn.addEventListener('click', () => {

                if (btn.dataset.design) {

                    changeWheelDesign(btn.dataset.design);

                }

            });

        });

        

        // Option input with ripple effect on interaction

        elements.addBtn.addEventListener('click', (e) => {

            createRipple(e, elements.addBtn);

            addOption();

        });

        elements.optionInput.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {

                createRipple(e, elements.addBtn);

                addOption();

            }

        });

        

        // Options container event delegation for remove buttons

        elements.optionsContainer.addEventListener('click', (e) => {

            if (e.target.classList.contains('remove-btn')) {

                const index = parseInt(e.target.dataset.index);

                if (!isNaN(index)) removeOption(index);

            }

        });

        

        // Main action buttons with ripple effect

        elements.spinBtn.addEventListener('click', (e) => {

            createRipple(e, elements.spinBtn);

            spin();

        });

        elements.clearBtn.addEventListener('click', (e) => {

            createRipple(e, elements.clearBtn);

            clearAllOptions();

        });

        

        // Modal action buttons with ripple effect

        elements.spinAgainBtn.addEventListener('click', (e) => {

            createRipple(e, elements.spinAgainBtn);

            hideResult();

            setTimeout(spin, 400);

        });

        

        elements.editOptionsBtn.addEventListener('click', (e) => {

            createRipple(e, elements.editOptionsBtn);

            hideResult();

        });

        

        // Modal close on backdrop click

        elements.resultModal.addEventListener('click', (e) => {

            if (e.target === elements.resultModal) {

                hideResult();

            }

        });

        

        // Keyboard shortcut: ESC to close modal

        document.addEventListener('keydown', (e) => {

            if (e.key === 'Escape' && elements.resultModal.classList.contains('show')) {

                hideResult();

            }

        });

        

        // Window resize handler for responsive canvas

        window.addEventListener('resize', () => {

            setupCanvas();

            renderWheel();

        });

    }



    /* ===================================

       RIPPLE EFFECT HELPER

       Material Design ripple animation for buttons

       =================================== */

    function createRipple(event, button) {

        const ripple = document.createElement('span');

        ripple.classList.add('ripple');

        

        const rect = button.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        const x = event.clientX - rect.left - size / 2;

        const y = event.clientY - rect.top - size / 2;

        

        ripple.style.width = ripple.style.height = size + 'px';

        ripple.style.left = x + 'px';

        ripple.style.top = y + 'px';

        

        button.appendChild(ripple);

        

        setTimeout(() => ripple.remove(), 600);

    }

    

    /* ===================================

       START APPLICATION

       Initialize application when DOM is ready

       =================================== */

    // Initialize application when DOM is ready

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }

})();
