const projects = [
    {
        id: 1,
        title: "Portfolio Website",
        description: "A modern portfolio showcasing my work with a focus on clean design and smooth interactions. Built with the latest web technologies to ensure optimal performance and user experience.",
        image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 2,
        title: "E-commerce App",
        description: "Full-featured online shopping platform with real-time inventory management, secure payments, and a seamless checkout process. Designed to provide an exceptional shopping experience.",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Real-time weather tracking application featuring detailed forecasts, interactive maps, and severe weather alerts. Stay informed with accurate weather data from multiple sources.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 4,
        title: "Task Manager",
        description: "Efficient project management tool with task prioritization, team collaboration features, and progress tracking. Boost productivity with intuitive organization tools.",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 5,
        title: "Social Network",
        description: "Connect and share with your community through a modern social platform. Features include real-time messaging, content sharing, and personalized news feeds.",
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 6,
        title: "AI Assistant",
        description: "Smart companion for daily tasks powered by advanced artificial intelligence. Helps streamline your workflow with intelligent automation and personalized recommendations.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 7,
        title: "Game Platform",
        description: "Interactive gaming experience with multiplayer support, achievements, and social features. Enjoy a diverse collection of games with friends and compete globally.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 8,
        title: "Music Player",
        description: "Stream your favorite tunes with this feature-rich music player. Includes playlist management, equalizer settings, and seamless integration with popular music services.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800&h=600"
    }
];

class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = 5000;
        this.autoPlayTimer = null;
        this.isPaused = false;
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.track = document.querySelector('.carousel-track');
        this.dotsContainer = document.querySelector('.dots-container');
        this.projectInfo = document.querySelector('.project-info');
        this.projectTitle = this.projectInfo.querySelector('h2');
        this.projectDescription = this.projectInfo.querySelector('p');

        this.setupCarousel();
        this.setupDots();
        this.setupNavigation();
        this.setupTouchEvents();
        this.setupResizeHandler();
        this.startAutoPlay();
        this.updateProjectInfo(projects[0]);
    }

    setupCarousel() {
        const items = [...projects, ...projects, ...projects];
        
        items.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.backgroundImage = `url(${project.image})`;
            
            const content = document.createElement('div');
            content.className = 'card-content';
            content.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            `;
            
            card.appendChild(content);
            this.track.appendChild(card);

            card.addEventListener('click', () => this.goToSlide(index % projects.length));
        });

        this.updateSlidePosition();
    }

    setupTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.isTouching = true;
            this.touchStartX = e.touches[0].clientX;
            this.track.style.transition = 'none';
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!this.isTouching) return;
            this.touchEndX = e.touches[0].clientX;
            const diff = this.touchStartX - this.touchEndX;
            const slideWidth = this.getSlideWidth();
            const currentTransform = -((this.currentIndex + projects.length) * slideWidth);
            this.track.style.transform = `translateX(${currentTransform - diff}px)`;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            if (!this.isTouching) return;
            const diff = this.touchStartX - this.touchEndX;
            this.track.style.transition = 'transform 0.6s var(--transition)';
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            } else {
                this.updateSlidePosition();
            }
            this.isTouching = false;
        });
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateSlidePosition();
            }, 100);
        });
    }

    getSlideWidth() {
        const card = this.track.querySelector('.project-card');
        return card.offsetWidth + parseFloat(getComputedStyle(card).marginRight);
    }

    setupDots() {
        projects.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.updateDots();
    }

    setupNavigation() {
        document.querySelector('.prev-btn').addEventListener('click', () => this.prev());
        document.querySelector('.next-btn').addEventListener('click', () => this.next());
        
        const carousel = document.querySelector('.carousel-container');
        carousel.addEventListener('mouseenter', () => this.pause());
        carousel.addEventListener('mouseleave', () => this.resume());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    updateProjectInfo(project) {
        this.projectInfo.classList.remove('visible');
        setTimeout(() => {
            this.projectTitle.textContent = project.title;
            this.projectDescription.textContent = project.description;
            this.projectInfo.classList.add('visible');
        }, 300);
    }

    updateSlidePosition() {
        if (this.isTouching) return;
        const slideWidth = this.getSlideWidth();
        const offset = -((this.currentIndex + projects.length) * slideWidth);
        this.track.style.transform = `translateX(${offset}px)`;
        
        const cards = this.track.querySelectorAll('.project-card');
        cards.forEach(card => card.classList.remove('active'));
        cards[this.currentIndex + projects.length].classList.add('active');
        
        this.updateProjectInfo(projects[this.currentIndex]);
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        this.updateSlidePosition();
        this.updateDots();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % projects.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + projects.length) % projects.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isPaused && !this.isTouching) {
                this.next();
            }
        }, this.autoPlayInterval);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

class ReviewCarousel {
    constructor() {
        this.userCircles = document.querySelectorAll('.user-circle');
        this.reviews = document.querySelectorAll('.review');
        this.currentIndex = 0;
        this.intervalId = null;
        this.intervalTime = 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.addClickListeners();
        this.addHoverListeners();
        this.addTouchListeners();
        this.addKeyboardListeners();
        this.start();
    }

    showReview(reviewNumber) {
        this.reviews.forEach(review => review.classList.remove('active'));
        this.userCircles.forEach(circle => circle.classList.remove('active'));

        const targetReview = document.querySelector(`.review[data-review="${reviewNumber}"]`);
        const targetCircle = document.querySelector(`.user-circle[data-review="${reviewNumber}"]`);

        if (targetReview && targetCircle) {
            targetReview.classList.add('active');
            targetCircle.classList.add('active');
        }
    }

    nextReview() {
        this.currentIndex = (this.currentIndex + 1) % this.userCircles.length;
        this.showReview(this.currentIndex + 1);
    }

    previousReview() {
        this.currentIndex = (this.currentIndex - 1 + this.userCircles.length) % this.userCircles.length;
        this.showReview(this.currentIndex + 1);
    }

    start() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.nextReview(), this.intervalTime);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    addClickListeners() {
        this.userCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                this.stop();
                const reviewNumber = circle.getAttribute('data-review');
                this.showReview(reviewNumber);
                this.currentIndex = parseInt(reviewNumber) - 1;
                this.start();
            });
        });
    }

    addHoverListeners() {
        const container = document.querySelector('.reviews-container');
        
        // Only add hover listeners if not on touch device
        if (!('ontouchstart' in window)) {
            container.addEventListener('mouseenter', () => this.stop());
            container.addEventListener('mouseleave', () => this.start());
        }
    }

    addTouchListeners() {
        const container = document.querySelector('.reviews-container');
        
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.stop();
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            const swipeDistance = this.touchEndX - this.touchStartX;
            const minSwipeDistance = 50;

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    this.previousReview();
                } else {
                    this.nextReview();
                }
            }
            this.start();
        });
    }

    addKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stop();
                this.previousReview();
                this.start();
            } else if (e.key === 'ArrowRight') {
                this.stop();
                this.nextReview();
                this.start();
            }
        });
    }
}

// Initialize the carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewCarousel();
});


document.addEventListener('DOMContentLoaded', () => {
    const optionBoxes = document.querySelectorAll('.option-box');
    const formContainer = document.getElementById('form-container');
    const requirementForm = document.getElementById('requirements-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const continueBtn = document.getElementById('continue-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
  
    let selectedServices = new Set();
  
    function toggleService(option) {
      const selectedBox = document.querySelector(`[data-option="${option}"]`);
      
      if (selectedServices.has(option)) {
        selectedServices.delete(option);
        selectedBox.classList.remove('selected');
      } else {
        selectedServices.add(option);
        selectedBox.classList.add('selected');
      }
      
      if (selectedServices.size > 0) {
        continueBtn.classList.add('show');
      } else {
        continueBtn.classList.remove('show');
        formContainer.classList.remove('show');
        setTimeout(() => {
          formContainer.classList.add('hidden');
        }, 300);
      }
    }
  
    function updateRequirementBox() {
      const requirementsContainer = document.getElementById('requirements-container');
      requirementsContainer.innerHTML = '';
  
      if (selectedServices.size > 0) {
        const selectedServicesList = Array.from(selectedServices).map(service => {
          const serviceName = {
            'graphic': 'Graphic Design',
            'website': 'Website',
            'social': 'Social Media'
          }[service];
          return serviceName;
        }).join(', ');
  
        const requirementBox = document.createElement('div');
        requirementBox.className = 'requirement-box';
        requirementBox.innerHTML = `
          <h3 class="requirement-title">Requirements for ${selectedServicesList}</h3>
          <textarea 
            id="combined-requirements"
            name="combined-requirements"
            placeholder="Please describe your requirements for the selected services..."
            required
          ></textarea>
          <div class="char-count">Characters: <span id="combined-char-count">0</span></div>
        `;
  
        requirementsContainer.appendChild(requirementBox);
  
        // Add character counter for the textarea
        const textarea = requirementBox.querySelector('textarea');
        const charCount = requirementBox.querySelector('#combined-char-count');
        
        textarea.addEventListener('input', () => {
          const currentLength = textarea.value.length;
          charCount.textContent = currentLength;
        });
      }
    }
  
    // Add click handlers to option boxes
    optionBoxes.forEach(box => {
      box.addEventListener('click', () => {
        toggleService(box.dataset.option);
      });
    });
  
    // Handle continue button click
    continueBtn.addEventListener('click', () => {
      updateRequirementBox();
      formContainer.classList.remove('hidden');
      formContainer.offsetHeight; // Force reflow
      formContainer.classList.add('show');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    });
  
    // Handle form submission
    requirementForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        requirements: document.getElementById('combined-requirements').value.trim()
      };
  
      if (!formData.requirements) {
        alert('Please fill in the requirements');
        return;
      }
  
      try {
        // Send data to Formspree
        const response = await fetch('https://formspree.io/f/xpwzowow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert('We will contact you shortly!');
        } else {
          alert('There was an error submitting the form. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error. Please check your connection and try again.');
      }
  
      // Reset form
      nameInput.value = '';
      emailInput.value = '';
      selectedServices.clear();
      formContainer.classList.remove('show');
      continueBtn.classList.remove('show');
      setTimeout(() => {
        formContainer.classList.add('hidden');
      }, 300);
  
      // Remove selected state from boxes
      optionBoxes.forEach(box => {
        box.classList.remove('selected');
      });
    });
  
    // Handle cancel button
    cancelBtn.addEventListener('click', () => {
      formContainer.classList.remove('show');
      setTimeout(() => {
        formContainer.classList.add('hidden');
        nameInput.value = '';
        emailInput.value = '';
        selectedServices.clear();
        
        // Remove selected state from boxes
        optionBoxes.forEach(box => {
          box.classList.remove('selected');
        });
        continueBtn.classList.remove('show');
      }, 300);
    });
  });
  