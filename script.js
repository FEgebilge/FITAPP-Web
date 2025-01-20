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

    // Function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to reorder member cards
    function reorderMemberCards() {
        const cardsArray = Array.from(memberCards);
        const shuffledCards = shuffleArray([...cardsArray]);
        
        // Remove all cards from grid
        cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.remove();
        });
        
        // Append cards in new order and animate them
        shuffledCards.forEach((card, index) => {
            membersGrid.appendChild(card);
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }

    const membersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isExpanded) {
                isExpanded = true;
                membersGrid.style.opacity = '1';
                membersGrid.style.transform = 'translateY(0)';
                
                // Reorder and animate cards
                reorderMemberCards();
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
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    function toggleDarkMode() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
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

    // Slider functionality
    const sliderTrack = document.querySelector('.slider-track');
    const sliderItems = Array.from(document.querySelectorAll('.slider-item'));
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const dotsContainer = document.querySelector('.nav-dots');

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Create dots
    sliderItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function updateSlideClasses() {
        sliderItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === sliderItems.length - 1)) {
                item.classList.add('prev');
            } else if (index === currentIndex + 1 || (currentIndex === sliderItems.length - 1 && index === 0)) {
                item.classList.add('next');
            }
        });

        // Update dots
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        const slideWidth = sliderItems[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(sliderTrack).gap);
        const offset = (slideWidth + gap) * currentIndex;
        sliderTrack.style.transform = `translateX(${-offset}px)`;
        updateSlideClasses();
    }

    // Navigation buttons
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
        goToSlide(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % sliderItems.length;
        goToSlide(currentIndex);
    });

    // Touch events
    sliderTrack.addEventListener('touchstart', touchStart);
    sliderTrack.addEventListener('touchmove', touchMove);
    sliderTrack.addEventListener('touchend', touchEnd);

    // Mouse events
    sliderTrack.addEventListener('mousedown', touchStart);
    sliderTrack.addEventListener('mousemove', touchMove);
    sliderTrack.addEventListener('mouseup', touchEnd);
    sliderTrack.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        startX = getPositionX(event);
        isDragging = true;
        currentTranslate = getTranslate(sliderTrack);
        sliderTrack.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const diff = currentX - startX;
        sliderTrack.style.transform = `translateX(${currentTranslate + diff}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        const slideWidth = sliderItems[0].offsetWidth;
        const diff = getTranslate(sliderTrack) - prevTranslate;
        
        if (Math.abs(diff) > slideWidth / 4) {
            if (diff > 0) {
                currentIndex = Math.max(0, currentIndex - 1);
            } else {
                currentIndex = Math.min(sliderItems.length - 1, currentIndex + 1);
            }
        }
        
        goToSlide(currentIndex);
        prevTranslate = getTranslate(sliderTrack);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function getTranslate(element) {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    // Click on slides
    sliderItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index !== currentIndex) {
                goToSlide(index);
            }
        });
    });

    // Initialize
    updateSlideClasses();

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            goToSlide(currentIndex);
        }, 100);
    });

    // App Showcase scroll animations
    const showcaseTitle = document.querySelector('.showcase-title');
    const showcaseScreens = document.querySelectorAll('.showcase-screen');

    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe showcase title
    showcaseObserver.observe(showcaseTitle);

    // Observe each screen with a delay
    showcaseScreens.forEach((screen, index) => {
        screen.style.transitionDelay = `${index * 0.2}s`;
        showcaseObserver.observe(screen);
    });
}); 