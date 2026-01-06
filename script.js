/**
 * Master Mind Public School - Main JavaScript
 * Handles Three.js animations, mobile menu, and UI interactions.
 */

// Three.js WebGL Hero Animation
let scene, camera, renderer, particles, particleGeometry, particleMaterial, linesInfo;
let mouseX = 0;
let mouseY = 0;

function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance

    // Performance Optimization for Mobile
    const isMobile = window.innerWidth < 768;

    // Particle System with Connections (Constellation Effect)
    initParticles(isMobile);

    // Geometric Shapes
    createFloatingShapes(isMobile);

    // Mouse Interaction
    document.addEventListener('mousemove', onDocumentMouseMove);

    // Animation Loop
    animateThreeJS();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Mobile Menu
    initMobileMenu();
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                navLinks.forEach(link => link.style.animation = '');
            });
        });
    }
}

function initParticles(isMobile) {
    const particleCount = isMobile ? 80 : 200;
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Store velocity and original position for animation
    const velocities = [];

    const colorPalette = [
        new THREE.Color(0xfbbf24), // yellow
        new THREE.Color(0x38bdf8), // sky blue
        new THREE.Color(0x22c55e), // green
        new THREE.Color(0xffffff), // white
    ];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.userData = { velocities: velocities };

    particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lines for connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const lineGeometry = new THREE.BufferGeometry();
    linesInfo = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesInfo);
}

function createFloatingShapes(isMobile) {
    const geometries = [
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.5, 0)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.3 }),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.3 }),
        new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true, opacity: 0.3 })
    ];

    const count = isMobile ? 3 : 6;
    for (let i = 0; i < count; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 12;
        mesh.position.y = (Math.random() - 0.5) * 12;
        mesh.position.z = (Math.random() - 0.5) * 5;

        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            floatOffset: Math.random() * 100,
            originalY: mesh.position.y
        };

        scene.add(mesh);
    }
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    const positions = particleGeometry.attributes.position.array;
    const velocities = particleGeometry.userData.velocities;

    // Update Particles
    for (let i = 0; i < positions.length / 3; i++) {
        // Move particles
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Bounce off bounds
        if (positions[i * 3] > 10 || positions[i * 3] < -10) velocities[i].x *= -1;
        if (positions[i * 3 + 1] > 10 || positions[i * 3 + 1] < -10) velocities[i].y *= -1;
        if (positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) velocities[i].z *= -1;

        // Mouse interaction (repel)
        // Simple logic: push away slightly based on mouseX/mouseY influence on camera
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Create connections (Constellations)
    updateConnections(positions);

    // Rotate and Float Shapes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;

            // Floating motion
            child.position.y = child.userData.originalY + Math.sin(Date.now() * 0.001 + child.userData.floatOffset) * 0.5;

            // Mouse interaction (gentle tilt)
            child.rotation.x += mouseY * 0.05;
            child.rotation.y += mouseX * 0.05;
        }
    });

    // Camera Movement
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function updateConnections(positions) {
    const linePositions = [];
    const connectDistance = 3.5;

    for (let i = 0; i < positions.length / 3; i++) {
        for (let j = i + 1; j < positions.length / 3; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectDistance) {
                linePositions.push(
                    positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                    positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                );
            }
        }
    }

    linesInfo.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesInfo.material.opacity = 0.15; // Reset opacity
}

function onWindowResize() {
    const canvas = document.getElementById('hero-canvas');
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}

// UI Interactions & Animations

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
});

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSubmit(e) {
    // e.preventDefault(); // Allow form to submit to mailto
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = 'Sent!';
    btn.style.background = 'var(--green)';

    setTimeout(() => {
        alert('Thank you for your interest! We will contact you soon.');
        e.target.reset();
        btn.innerText = originalText;
        btn.style.background = '';
    }, 500);
}

// Enhanced Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0)';
        }
    });
}, observerOptions);

// Initialize elements with initial styles for animation
document.querySelectorAll('.program-card, .feature-item, .gallery-item').forEach((el, index) => {
    // Set initial state via JS to ensure graceful degradation if JS fails
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)'; // Reduced distance for smoother effect
    el.style.transition = `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s`; // Smoother bezier
    observer.observe(el);
});

// Enhanced 3D Tilt Effect
document.querySelectorAll('.program-card, .feature-item, .gallery-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Smoother rotation calculation
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out'; // Smooth return
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out'; // Quick response on enter
    });
});
