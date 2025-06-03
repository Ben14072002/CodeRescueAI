// Scroll animation utilities
export class ScrollAnimationManager {
  private observer: IntersectionObserver;
  private parallaxElements: Array<{ element: HTMLElement; speed: number; offset: number }> = [];
  private counters: Array<{ element: HTMLElement; target: number; current: number; animated: boolean }> = [];

  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.initializeScrollListener();
    this.initializeParallax();
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        
        // Add animate class for scroll animations
        if (element.classList.contains('scroll-animate') ||
            element.classList.contains('scroll-animate-left') ||
            element.classList.contains('scroll-animate-right') ||
            element.classList.contains('section-reveal') ||
            element.classList.contains('stagger-children') ||
            element.classList.contains('feature-grid')) {
          element.classList.add('animate');
        }

        // Handle counter animations
        if (element.classList.contains('counter-animate')) {
          this.animateCounter(element);
        }

        // Stop observing this element after animation
        this.observer.unobserve(element);
      }
    });
  }

  private animateCounter(element: HTMLElement) {
    const target = parseInt(element.getAttribute('data-target') || '0');
    const duration = parseInt(element.getAttribute('data-duration') || '2000');
    const startTime = performance.now();
    
    element.classList.add('animate');

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth counter animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(target * easeOutQuart);
      
      element.textContent = current.toString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString();
      }
    };

    requestAnimationFrame(updateCounter);
  }

  private initializeScrollListener() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Only add scroll listener on desktop for performance
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  private initializeParallax() {
    // Skip parallax on mobile for performance
    if (window.innerWidth <= 768) return;

    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
      const offset = parseFloat(element.getAttribute('data-offset') || '0');
      
      this.parallaxElements.push({
        element: element as HTMLElement,
        speed,
        offset
      });
    });
  }

  private updateParallax() {
    const scrollY = window.pageYOffset;

    this.parallaxElements.forEach(({ element, speed, offset }) => {
      const yPos = -(scrollY * speed) + offset;
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  public observeElement(element: HTMLElement) {
    this.observer.observe(element);
  }

  public observeElements(selector: string) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.observer.observe(element);
    });
  }

  public init() {
    // Initialize all scroll-triggered elements
    this.observeElements('.scroll-animate');
    this.observeElements('.scroll-animate-left');
    this.observeElements('.scroll-animate-right');
    this.observeElements('.section-reveal');
    this.observeElements('.stagger-children');
    this.observeElements('.feature-grid');
    this.observeElements('.counter-animate');
  }

  public destroy() {
    this.observer.disconnect();
    window.removeEventListener('scroll', this.updateParallax);
  }
}

// Global instance
let scrollManager: ScrollAnimationManager | null = null;

export function initializeScrollAnimations() {
  if (scrollManager) {
    scrollManager.destroy();
  }
  
  scrollManager = new ScrollAnimationManager();
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scrollManager?.init();
    });
  } else {
    scrollManager.init();
  }
}

export function getScrollManager() {
  return scrollManager;
}