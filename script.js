// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Feature cards observer
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));

    // Technology cards observer
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Members section observer
    const membersGrid = document.querySelector('.members-grid');
    const memberCards = document.querySelectorAll('.member-card');
    const membersTitle = document.querySelector('.members-title');
    let isExpanded = false;

    const membersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isExpanded) {
                isExpanded = true;
                membersGrid.style.opacity = '1';
                membersGrid.style.transform = 'translateY(0)';
                
                memberCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0 && isExpanded) {
                isExpanded = false;
                membersGrid.style.opacity = '0';
                membersGrid.style.transform = 'translateY(20px)';
                
                memberCards.forEach(card => {
                    card.classList.remove('visible');
                });
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '100px 0px -100px 0px'
    });

    membersObserver.observe(membersGrid);

    // Neural Network Animation
    const neuralNetwork = document.querySelector('.neural-network');
    if (neuralNetwork) {
        const layers = Array.from(neuralNetwork.querySelectorAll('.layer'));
        const neurons = neuralNetwork.querySelectorAll('.neuron');
        const connections = [];
        const connectionMap = new Map(); // Map to store connections for each neuron

        // Create connections between neurons
        layers.forEach((layer, layerIndex) => {
            if (layerIndex < layers.length - 1) {
                const currentNeurons = layer.querySelectorAll('.neuron');
                const nextNeurons = layers[layerIndex + 1].querySelectorAll('.neuron');

                currentNeurons.forEach(currentNeuron => {
                    if (!connectionMap.has(currentNeuron)) {
                        connectionMap.set(currentNeuron, { forward: [], backward: [] });
                    }

                    nextNeurons.forEach(nextNeuron => {
                        if (!connectionMap.has(nextNeuron)) {
                            connectionMap.set(nextNeuron, { forward: [], backward: [] });
                        }

                        const connection = document.createElement('div');
                        connection.className = 'connection';
                        
                        // Calculate positions
                        const rect1 = currentNeuron.getBoundingClientRect();
                        const rect2 = nextNeuron.getBoundingClientRect();
                        const networkRect = neuralNetwork.getBoundingClientRect();

                        const x1 = rect1.left + rect1.width / 2 - networkRect.left;
                        const y1 = rect1.top + rect1.height / 2 - networkRect.top;
                        const x2 = rect2.left + rect2.width / 2 - networkRect.left;
                        const y2 = rect2.top + rect2.height / 2 - networkRect.top;

                        // Calculate angle and length
                        const angle = Math.atan2(y2 - y1, x2 - x1);
                        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                        // Set connection style
                        connection.style.width = `${length}px`;
                        connection.style.left = `${x1}px`;
                        connection.style.top = `${y1}px`;
                        connection.style.transform = `rotate(${angle}rad)`;

                        neuralNetwork.appendChild(connection);
                        connections.push(connection);

                        // Store connections in both directions
                        connectionMap.get(currentNeuron).forward.push({
                            connection,
                            neuron: nextNeuron
                        });
                        connectionMap.get(nextNeuron).backward.push({
                            connection,
                            neuron: currentNeuron
                        });
                    });
                });
            }
        });

        let isAnimating = false;

        function activateConnection(connection, delay = 0) {
            setTimeout(() => {
                connection.classList.add('active');
                setTimeout(() => {
                    connection.classList.remove('active');
                }, 400);
            }, delay);
        }

        function activateNeuron(neuron, delay = 0) {
            setTimeout(() => {
                neuron.style.transform = 'scale(1.2)';
                neuron.style.boxShadow = '0 0 15px var(--primary-color)';
                setTimeout(() => {
                    neuron.style.transform = '';
                    neuron.style.boxShadow = '';
                }, 300);
            }, delay);
        }

        function propagateForward(startNeuron, delay = 0) {
            if (!connectionMap.has(startNeuron)) return;
            
            activateNeuron(startNeuron, delay);
            
            const connections = connectionMap.get(startNeuron).forward;
            connections.forEach(({ connection, neuron }) => {
                activateConnection(connection, delay);
                propagateForward(neuron, delay + 150);
            });
        }

        function propagateBackward(startNeuron, delay = 0) {
            if (!connectionMap.has(startNeuron)) return;
            
            activateNeuron(startNeuron, delay);
            
            const connections = connectionMap.get(startNeuron).backward;
            connections.forEach(({ connection, neuron }) => {
                activateConnection(connection, delay);
                propagateBackward(neuron, delay + 150);
            });
        }

        // Add hover effect
        neurons.forEach(neuron => {
            neuron.addEventListener('mouseenter', () => {
                if (isAnimating) return;
                isAnimating = true;

                const layerIndex = Array.from(neuron.parentElement.children).indexOf(neuron);
                const isOutputNeuron = neuron.parentElement.id === 'output-layer';

                if (isOutputNeuron) {
                    propagateBackward(neuron);
                } else {
                    propagateForward(neuron);
                }

                setTimeout(() => {
                    isAnimating = false;
                }, layers.length * 300);
            });
        });
    }

    // Enhanced navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    function toggleDarkMode() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    themeToggle.addEventListener('click', toggleDarkMode);
}); 