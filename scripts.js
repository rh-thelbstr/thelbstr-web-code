// Create the cursor element
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
cursor.classList.add('light'); // Default to light mode
document.body.appendChild(cursor);

// Position the cursor on mouse move
document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Force opacity back to 1 (DEBUG FIX)
    cursor.style.opacity = '1';
    
    // Update cursor color based on background
    updateCursorColor(e);
});

// Handle cursor disappearing when it leaves the window
document.addEventListener('mouseout', function(e) {
    if (e.relatedTarget == null || e.relatedTarget.nodeName == 'HTML') {
        cursor.style.opacity = '0';
    }
});

document.addEventListener('mouseover', function() {
    cursor.style.opacity = '1';
});

// Function to update cursor color based on background
function updateCursorColor(e) {
    // Get the element under the cursor
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    
    if (!elementUnderCursor) return;
    
    // Get the computed background color
    const computedStyle = window.getComputedStyle(elementUnderCursor);
    let backgroundColor = computedStyle.backgroundColor;
    
    // If transparent, check parent elements
    let currentElement = elementUnderCursor;
    while (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        currentElement = currentElement.parentElement;
        if (!currentElement || currentElement === document.body) break;
        backgroundColor = window.getComputedStyle(currentElement).backgroundColor;
    }
    
    // Parse RGB values
    const rgbMatch = backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    
    if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        
        // Check if it's green (#32b550 = rgb(50, 181, 80)) or close to it
        const isGreen = (r >= 40 && r <= 60) && (g >= 170 && g <= 190) && (b >= 70 && b <= 90);
        
        // Check if it's white or very light
        const isLight = r > 200 && g > 200 && b > 200;
        
        // Check if it's dark/black
        const isDark = r < 50 && g < 50 && b < 50;
        
        if (isGreen || isLight) {
            // Light/green background = dark cursor
            cursor.classList.remove('dark');
            cursor.classList.add('light');
        } else if (isDark) {
            // Dark background = green cursor
            cursor.classList.remove('light');
            cursor.classList.add('dark');
        } else {
            // Default to light for other colors
            cursor.classList.remove('dark');
            cursor.classList.add('light');
        }
    }
}

// Track lobster color state
let lobsterIsWhite = true; // Start with white (default)

// Add click listener for lobster color change
document.addEventListener('click', function(e) {
    // Toggle lobster color
    if (lobsterIsWhite) {
        // Change to opposite of circle color
        if (cursor.classList.contains('light')) {
            // Circle is black, make lobster green
            cursor.classList.add('lobster-green');
            cursor.classList.remove('lobster-black');
        } else {
            // Circle is green, make lobster black
            cursor.classList.add('lobster-black');
            cursor.classList.remove('lobster-green');
        }
        lobsterIsWhite = false;
    } else {
        // Change back to white
        cursor.classList.remove('lobster-green', 'lobster-black');
        lobsterIsWhite = true;
    }
});

// Simple Safari refresh for Webflow interactions
if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    });
}

  document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const wrapper = document.querySelector(".wrapper");
    const scrollContainer = document.querySelector(".scroll-container");
    const navBar = document.getElementById("nav-bar");

    if (!wrapper || !scrollContainer || !navBar) return;

    const isDesktop = window.innerWidth >= 768;
    const isMobile = !isDesktop;

    if (!isDesktop && scrollContainer) {
      scrollContainer.style.minHeight = "100vh";
      scrollContainer.style.height = "auto";
      scrollContainer.style.overflowY = "auto";
    }

    if (isDesktop) {
  gsap.registerPlugin(ScrollTrigger);

   ScrollSmoother.create({
    wrapper: ".smooth-wrapper",
    content: ".smooth-content",
    smooth: 1.2,
    effects: true
  });

  const fullWidth = slides.length * window.innerWidth;
  const scrollDistance = fullWidth - window.innerWidth;

  wrapper.style.width = `${fullWidth}px`;
  scrollContainer.style.height = "100vh";
  document.body.style.height = `${scrollDistance + window.innerHeight}px`;

  gsap.to(wrapper, {
    x: -scrollDistance,
    ease: "none",
    scrollTrigger: {
      trigger: scrollContainer,
      start: "top top",
      end: scrollDistance,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

}
    const slideThemeMap = new Map([
      ["slide-1", "nav-black"],
      ["slide-2", "nav-green"],
      ["slide-3", "nav-green"],
      ["slide-4", "nav-black"],
      ["slide-5", "nav-black"],
      ["slide-6", "nav-green"],
      ["slide-7", "nav-black"],
      ["slide-8", "nav-green"],
      ["slide-9", "nav-green"],
      ["slide-10", "nav-green"],
      ["slide-11", "nav-black"],
      ["slide-12", "nav-green"],
      ["slide-13", "nav-black"],
      ["slide-14", "nav-green"],
      ["slide-15", "nav-black"],
      ["slide-16", "nav-green"],
      ["slide-17", "nav-green"],
      ["slide-18", "nav-green"],
      ["slide-19", "nav-black"],
      ["slide-20", "nav-black"],
      ["slide-21", "nav-green"]
      
    ]);

    let initialTheme = "nav-black";

    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        const theme = slideThemeMap.get(slide.id);
        if (theme) initialTheme = theme;
      }
    });

    navBar.classList.add(initialTheme);
    navBar.dataset.currentTheme = initialTheme;

    const throttle = (fn, limit) => {
      let inThrottle;
      return function () {
        if (!inThrottle) {
          fn.apply(this, arguments);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const updateNavTheme = throttle((newTheme) => {
      if (!newTheme || navBar.dataset.currentTheme === newTheme) return;
      navBar.className = `nav-bar ${newTheme}`;
      navBar.dataset.currentTheme = newTheme;
    }, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = isMobile
            ? entry.isIntersecting
            : entry.intersectionRatio >= 0.95;
          if (isVisible) {
            const theme = slideThemeMap.get(entry.target.id);
            updateNavTheme(theme);
          }
        });
      },
      {
        threshold: isMobile ? 0.3 : [0.95, 0.98, 1.0]
      }
    );

    slides.forEach((slide) => observer.observe(slide));
    window.addEventListener("unload", () => observer.disconnect());

   const fill = document.querySelector(".nav-progress-fill");
if (fill) {
    if (window.innerWidth < 768) {
        // MOBILE: scroll happens on .scroll-container
        scrollContainer.addEventListener("scroll", () => {
            const scrollTop = scrollContainer.scrollTop;
            const totalHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const progress = Math.min(1, scrollTop / totalHeight);
            
            // Mobile needs explicit height (desktop uses CSS height)
            fill.style.height = "4px";
            fill.style.width = `${progress * 100}%`;
        });
  } else {
    // DESKTOP: scroll happens on window
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(1, scrollTop / totalHeight);
      fill.style.height = `${progress * 100}%`;
    });
  }

  // Reset bar on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      fill.style.height = "0%";
    } else {
      fill.style.width = "0%";
    }
  });
}
  });
  class ExpandAccordion {
  constructor() {
    this.triggers = [
      { triggerId: "expand-trigger-1", contentId: "obsessed-content" },
      { triggerId: "expand-trigger-2", contentId: "disciplined-content" },
      { triggerId: "expand-trigger-3", contentId: "kind-content" },
    ];
    this.openId = null;
    this.init();
  }

  init() {
    this.triggers.forEach(({ triggerId, contentId }) => {
      const trigger = document.getElementById(triggerId);
      const content = document.getElementById(contentId);
      
      if (trigger && content) {
        // Store references for efficiency
        trigger.contentElement = content;
        trigger.contentId = contentId;
        
        // Add event listeners
        trigger.addEventListener('click', (e) => this.handleClick(e));
        trigger.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Set initial state
        this.closeContent(trigger, content);
      }
    });
  }

  handleClick(e) {
    const trigger = e.target;
    const content = trigger.contentElement;
    const contentId = trigger.contentId;
    const isAlreadyOpen = this.openId === contentId;
    
    // Close all first
    this.closeAll();
    
    // Open this one if it wasn't already open
    if (!isAlreadyOpen) {
      this.openContent(trigger, content);
      this.openId = contentId;
    } else {
      this.openId = null;
    }
  }

  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleClick(e);
    }
  }

  openContent(trigger, content) {
    // Update ARIA
    trigger.setAttribute('aria-expanded', 'true');
    
    // Update visual state
    trigger.textContent = '[–]';
    content.classList.add('expanded');
    
    // Announce to screen readers
    this.announceChange('expanded');
  }

  closeContent(trigger, content) {
    // Update ARIA
    trigger.setAttribute('aria-expanded', 'false');
    
    // Update visual state
    trigger.textContent = '[+]';
    content.classList.remove('expanded');
  }

  closeAll() {
    this.triggers.forEach(({ triggerId, contentId }) => {
      const trigger = document.getElementById(triggerId);
      const content = document.getElementById(contentId);
      
      if (trigger && content) {
        this.closeContent(trigger, content);
      }
    });
  }

  announceChange(state) {
    // Create temporary announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Section ${state}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ExpandAccordion();
});

// === SLIDE 14 MOBILE ACCORDION ===

class Slide14Accordion {
    constructor() {
        // Only run on mobile
        if (window.innerWidth >= 768) return;
        
        this.triggers = [
            { triggerClass: "bio-expand-trigger-4", contentClass: "rh-bio-description" },
            { triggerClass: "brands-expand-trigger-5", contentClass: "brands-list-mobile" },
            { triggerClass: "recog-expand-trigger-6", contentClass: "recog-list-mobile" }
        ];
        
        this.openId = null;
        this.init();
    }

    init() {
        this.triggers.forEach(({ triggerClass, contentClass }) => {
            const trigger = document.querySelector(`.${triggerClass}`);
            const content = document.querySelector(`.${contentClass}`);
            
            if (trigger && content) {
                // Store references
                trigger.contentElement = content;
                trigger.contentClass = contentClass;
                trigger.triggerClass = triggerClass;
                
                // Add click listener
                trigger.addEventListener('click', (e) => this.handleClick(e));
                
                // Set initial state - closed
                this.closeContent(trigger, content);
                
                console.log(`Slide 14 accordion: .${triggerClass} initialized`);
            } else {
                console.log(`Slide 14 accordion: .${triggerClass} or .${contentClass} not found`);
            }
        });
    }

    handleClick(e) {
        const trigger = e.target;
        const content = trigger.contentElement;
        const contentClass = trigger.contentClass;
        const triggerClass = trigger.triggerClass;
        
        const isAlreadyOpen = this.openId === triggerClass;

        // Close all sections first
        this.closeAll();

        // Open this section if it wasn't already open
        if (!isAlreadyOpen) {
            this.openContent(trigger, content);
            this.openId = triggerClass;
        } else {
            this.openId = null;
        }
    }

    openContent(trigger, content) {
        // Update trigger text from [+] to [-]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;
        
        // Show content
        content.style.display = 'block';
        
        console.log(`Opened: .${trigger.triggerClass}`);
    }

    closeContent(trigger, content) {
        // Update trigger text from [-] to [+]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[-]', '[+]');
        trigger.textContent = newText;
        
        // Hide content
        content.style.display = 'none';
        
        console.log(`Closed: .${trigger.triggerClass}`);
    }

    closeAll() {
        this.triggers.forEach(({ triggerClass, contentClass }) => {
            const trigger = document.querySelector(`.${triggerClass}`);
            const content = document.querySelector(`.${contentClass}`);
            
            if (trigger && content) {
                this.closeContent(trigger, content);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only run on mobile
    if (window.innerWidth < 768) {
        new Slide14Accordion();
        console.log('Slide 14 mobile accordion initialized');
    }
});
// === EKTA BIO MOBILE ACCORDION ===
// Add this to your existing before </body> section

class EktaBioAccordion {
    constructor() {
        // Only run on mobile
        if (window.innerWidth >= 768) return;
        
        this.triggerClass = "bio-ekta-trigger";
        this.contentClass = "slide-18-copy";
        this.isOpen = false;
        this.init();
    }

    init() {
        const trigger = document.querySelector(`.${this.triggerClass}`);
        const content = document.querySelector(`.${this.contentClass}`);
        
        if (trigger && content) {
            // Store references
            trigger.contentElement = content;
            trigger.contentClass = this.contentClass;
            trigger.triggerClass = this.triggerClass;
            
            // Add click listener
            trigger.addEventListener('click', (e) => this.handleClick(e));
            
            // Set initial state - closed
            this.closeContent(trigger, content);
            
            console.log(`Ekta bio accordion: .${this.triggerClass} initialized`);
        } else {
            console.log(`Ekta bio accordion: .${this.triggerClass} or .${this.contentClass} not found`);
        }
    }

    handleClick(e) {
        const trigger = e.target;
        const content = trigger.contentElement;
        
        if (this.isOpen) {
            this.closeContent(trigger, content);
        } else {
            this.openContent(trigger, content);
        }
    }

    openContent(trigger, content) {
        // Update trigger text from [+] to [-]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;
        
        // Show content
        content.style.display = 'block';
        this.isOpen = true;
        
        console.log(`Opened: .${trigger.triggerClass}`);
    }

    closeContent(trigger, content) {
        // Update trigger text from [-] to [+]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[-]', '[+]');
        trigger.textContent = newText;
        
        // Hide content
        content.style.display = 'none';
        this.isOpen = false;
        
        console.log(`Closed: .${trigger.triggerClass}`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only run on mobile
    if (window.innerWidth < 768) {
        new EktaBioAccordion();
        console.log('Ekta bio mobile accordion initialized');
    }
});

// === ENHANCED MULTI-FILM MODAL WITH THUMBNAILS ===

// Global variables
let filmModal, closeBtn, video;

// All films mapping to CMS slugs
const films = {
    'mini-cooper': { cmsSlug: 'mini-cooper' },
    'himalaya': { cmsSlug: 'himalaya' },
    'braun': { cmsSlug: 'braun' },
    'adnoc': { cmsSlug: 'adnoc' },
    'aldar': { cmsSlug: 'aldar-x-chef-izu' },
    'the-laundromat': { cmsSlug: 'the-laundromat' },
    'datsun-fairlady-280z': { cmsSlug: 'datsun-fairlady-280z' },
    'karama-267': { cmsSlug: 'karama-267' },
    'chasing-bur-dubai-part-1': { cmsSlug: 'chasing-bur-dubai-part-1' },
    'chasing-bur-dubai-part-2': { cmsSlug: 'chasing-bur-dubai-part-2' }
};

// Function to fetch CMS data including thumbnail
function getCMSData(slug) {
    const cmsItem = document.querySelector(`[data-cms-slug="${slug}"]`);
    if (cmsItem) {
        return {
            brandName: cmsItem.dataset.brandName || '',
            filmTitle: cmsItem.dataset.filmTitle || '',
            videoUrl: cmsItem.dataset.videoUrl || '',
            duration: cmsItem.dataset.duration || '',
            credits: cmsItem.dataset.credits || '',
            thumbnail: cmsItem.dataset.thumbnail || ''
        };
    }
    return null;
}

// Parse credits function
function parseCreditsText(creditsText) {
    if (!creditsText) return [];
    const lines = creditsText.split('\n').filter(line => line.trim());
    return lines.map(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            return {
                role: line.substring(0, colonIndex).trim(),
                name: line.substring(colonIndex + 1).trim()
            };
        }
        return { role: '', name: line.trim() };
    }).filter(credit => credit.role || credit.name);
}

function createCreditsHTML(credits) {
    const creditsContainer = document.getElementById('creditsContainer');
    if (!creditsContainer) return;
    
    const creditsArray = parseCreditsText(credits);
    const creditsHTML = creditsArray.map(credit => `
        <div class="credit-line">
            <span class="credit-role">${credit.role}</span>
            <span class="credit-name">${credit.name}</span>
        </div>
    `).join('');
    
    creditsContainer.innerHTML = `
        <div class="credits-grid">
            <div class="credit-section">${creditsHTML}</div>
        </div>
    `;
}

// Show custom thumbnail with video controls visible
function showThumbnailFirst(thumbnailUrl, videoUrl) {
    const videoContainer = video.parentElement;
    
    // Clean up any existing thumbnail elements
    const existingThumbnail = videoContainer.querySelector('.modal-thumbnail');
    const existingPlayBtn = videoContainer.querySelector('.modal-play-button');
    const existingOverlay = videoContainer.querySelector('.thumbnail-overlay');
    if (existingThumbnail) existingThumbnail.remove();
    if (existingPlayBtn) existingPlayBtn.remove();
    if (existingOverlay) existingOverlay.remove();
    
    // Set up video with poster and controls
    video.src = videoUrl;
    video.poster = thumbnailUrl;
    video.controls = true;
    video.playsinline = true;
    video.preload = 'metadata';
    video.muted = false;
    
    // Reset video styling
    video.style.position = 'relative';
    video.style.zIndex = 'auto';
    video.style.backgroundColor = '#000';
    
    // Load the video
    video.load();
    
    console.log('🖼️ Video loaded with custom poster:', thumbnailUrl);
}

function openModal(filmId) {
    const film = films[filmId];
    if (!film) return;
    
    const cmsData = getCMSData(film.cmsSlug);
    if (!cmsData) {
        console.error('CMS data not found for:', filmId);
        return;
    }
    
    createCreditsHTML(cmsData.credits);
    filmModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.style.cursor = 'auto';
    filmModal.style.cursor = 'auto';
    
    requestAnimationFrame(() => {
        filmModal.classList.add('is-active');
    });
    
    // Check if custom thumbnail exists
    if (cmsData.thumbnail && cmsData.thumbnail.trim() !== '') {
        console.log('🖼️ Using custom thumbnail for:', cmsData.brandName);
        showThumbnailFirst(cmsData.thumbnail, cmsData.videoUrl);
    } else {
        console.log('📹 No thumbnail, loading video directly for:', cmsData.brandName);
        video.src = cmsData.videoUrl;
        video.load();
    }
    
    console.log('🎬 Opening:', cmsData.brandName, '-', cmsData.filmTitle);
}

function closeModal() {
    filmModal.classList.remove('is-active');
    setTimeout(() => {
        filmModal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.cursor = '';
        video.pause();
        video.src = '';
        
        // Clean up thumbnail elements
        const videoContainer = video.parentElement;
        const thumbnail = videoContainer.querySelector('.modal-thumbnail');
        const playBtn = videoContainer.querySelector('.modal-play-button');
        if (thumbnail) thumbnail.remove();
        if (playBtn) playBtn.remove();
        
        const creditsContainer = document.getElementById('creditsContainer');
        if (creditsContainer) creditsContainer.innerHTML = '';
    }, 500);
    console.log('🚪 Modal closed');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Enhanced Multi-Film Modal: Starting...');
    
    filmModal = document.getElementById('filmModal');
    closeBtn = document.getElementById('closeModal');
    video = document.getElementById('filmVideo');
    
    // Fix video element
    if (video && video.tagName === 'DIV') {
        const newVideo = document.createElement('video');
        newVideo.id = 'filmVideo';
        newVideo.className = 'video-player';
        newVideo.controls = true;
        newVideo.playsinline = true;
        newVideo.preload = 'metadata';
        newVideo.style.cssText = 'width: 100%; height: 100%; display: block;';
        video.parentNode.replaceChild(newVideo, video);
        video = newVideo;
    }
    
    if (!filmModal || !closeBtn || !video) {
        console.error('❌ Elements not found');
        return;
    }
    
    // Multi-film detection
setTimeout(() => {
    const filmDetections = [
        { text: 'Mini Cooper', filmId: 'mini-cooper' },
        { text: 'Himalaya', filmId: 'himalaya' },
        { text: 'Braun', filmId: 'braun' },
        { text: 'ADNOC', filmId: 'adnoc' },
        { text: 'Aldar x Chef Izu', filmId: 'aldar' },
        { text: 'The Laundromat', filmId: 'the-laundromat' },
        { text: 'Datsun Fairlady 280Z', filmId: 'datsun-fairlady-280z' },
        { text: 'Karama 267', filmId: 'karama-267' },
        { text: 'Chasing Bur Dubai', filmId: 'chasing-bur-dubai-part-1' },
        { text: 'Chasing Bur Dubai', filmId: 'chasing-bur-dubai-part-2' }
    ];
    
    // Add frame detections
    const frameDetections = [
        { className: 'mini-cooper-frames', filmId: 'mini-cooper' },
        { className: 'himalaya-frames', filmId: 'himalaya' },
        { className: 'braun-frames', filmId: 'braun' },
        { className: 'adnoc-frames', filmId: 'adnoc' },
        { className: 'aldar-frames', filmId: 'aldar' },
        { className: 'laundromat-frames', filmId: 'the-laundromat' },
        { className: 'datsun-frames', filmId: 'datsun-fairlady-280z' },
        { className: 'karama-frames', filmId: 'karama-267' },
        { className: 'cbd-frames', filmId: 'chasing-bur-dubai-part-1' },
        { className: 'cbd2-frames', filmId: 'chasing-bur-dubai-part-2' }
    ];
    
    // Make text elements clickable (existing code)
    filmDetections.forEach(detection => {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.textContent && 
                el.textContent.trim() === detection.text && 
                el.children.length === 0 &&
                !el.closest('.film-modal')) {
                
                let current = el;
                for (let i = 0; i < 3; i++) {
                    if (current && current !== document.body) {
                        current.style.cursor = 'pointer';
                        
                        if (current.filmClickHandler) {
                            current.removeEventListener('click', current.filmClickHandler);
                        }
                        
                        current.filmClickHandler = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`🎬 ${detection.text} clicked!`);
                            openModal(detection.filmId);
                        };
                        
                        current.addEventListener('click', current.filmClickHandler);
                    }
                    current = current.parentElement;
                }
                console.log(`✅ ${detection.text} made clickable with thumbnail support`);
            }
        });
    });
    
    // Make frame elements clickable (NEW)
    frameDetections.forEach(detection => {
        const frameElement = document.querySelector(`.${detection.className}`);
        if (frameElement) {
            frameElement.style.cursor = 'pointer';
            
            // Remove existing handler if any
            if (frameElement.filmClickHandler) {
                frameElement.removeEventListener('click', frameElement.filmClickHandler);
            }
            
            // Add click handler
            frameElement.filmClickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎬 ${detection.className} frame clicked!`);
                openModal(detection.filmId);
            };
            
            frameElement.addEventListener('click', frameElement.filmClickHandler);
            
            console.log(`✅ .${detection.className} frame made clickable`);
        } else {
            console.log(`❌ .${detection.className} frame not found`);
        }
    });
    
}, 2000);
    
    // Event listeners
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });
    
    filmModal.addEventListener('click', (e) => {
        if (e.target === filmModal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filmModal.classList.contains('is-active')) {
            closeModal();
        }
    });
    
    console.log('🎯 Enhanced Multi-Film Modal: Ready with thumbnails!');
});

// Services Toggle System with Mobile Modal (Desktop Untouched)
class ServicesToggleSystem {
    constructor() {
        // Define all services with their trigger and description classes
        this.services = [
            { triggerClass: 'brand', descriptionClass: 'brand-descr', name: 'Brand' },
            { triggerClass: 'creative', descriptionClass: 'creative-descr', name: 'Creative' },
            { triggerClass: 'imc', descriptionClass: 'imc-descr', name: 'Integrated Communications' },
            { triggerClass: 'solve4', descriptionClass: 'solve4-descr', name: 'Solve for' },
            { triggerClass: 'scriptwriting', descriptionClass: 'scriptwriting-descr', name: 'Scriptwriting' },
            { triggerClass: 'film-conceptualisation', descriptionClass: 'film-concept-descr', name: 'Film Conceptualisation' },
            { triggerClass: 'directing', descriptionClass: 'film-direct-descr', name: 'Film Directing' }
        ];

        // Check if mobile
        this.isMobile = window.innerWidth < 768;

        // Find the main content container
        this.servicesContent = document.querySelector('.capabilities') || document.querySelector('.services');

        if (!this.servicesContent) {
            console.log('Services toggle: Main content container not found');
            return;
        }

        this.activeService = null;
        this.originalServicesContent = null;
        this.serviceElements = new Map();

        this.init();
        this.createMobileModal(); // Create modal for mobile

        // Listen for resize to switch between mobile/desktop
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        // Store the original services content
        this.originalServicesContent = this.servicesContent.innerHTML;

        // Process each service
        this.services.forEach(service => {
            const triggerElement = document.querySelector(`.${service.triggerClass}`);
            const descriptionElement = document.querySelector(`.${service.descriptionClass}`);

            if (triggerElement && descriptionElement) {
                // Store elements for this service
                const serviceData = {
                    trigger: triggerElement,
                    description: descriptionElement,
                    service: service
                };

                this.serviceElements.set(service.triggerClass, serviceData);

                // Hide original description
                descriptionElement.style.display = 'none';

                // Add click listener
                triggerElement.addEventListener('click', (e) => this.handleServiceToggle(e, service.triggerClass));

                // Make clickable
                triggerElement.style.cursor = 'pointer';
                triggerElement.style.userSelect = 'none';

                console.log(`✅ ${service.name} initialized successfully`);
            } else {
                console.log(`❌ ${service.name} elements not found`);
            }
        });
    }

    handleServiceToggle(e, serviceKey) {
        e.preventDefault();
        e.stopPropagation();

        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) return;

        // If this service is already active, close it
        if (this.activeService === serviceKey) {
            this.closeActiveService();
            return;
        }

        // Close any currently active service first
        if (this.activeService) {
            this.closeActiveService();
        }

        // Open the clicked service
        if (this.isMobile) {
            this.openServiceMobile(serviceKey);
        } else {
            this.openServiceDesktop(serviceKey);
        }
    }

    // DESKTOP FUNCTIONALITY - COMPLETELY UNTOUCHED
    openServiceDesktop(serviceKey) {
        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) return;

        const trigger = serviceData.trigger;

        // Update trigger: [+] to [-]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;

        // Add active class and attribute for maximum specificity
        trigger.classList.add('service-active');
        trigger.setAttribute('data-service-active', 'true');

        // Fade out current content first
        this.servicesContent.style.opacity = '0';

        setTimeout(() => {
            // Replace services content with this service's description
            this.servicesContent.innerHTML = serviceData.description.innerHTML;

            // Style the numbers in brackets green
            this.styleNumbersInBrackets();

            // Add class to indicate active state
            this.servicesContent.classList.add('showing-service-description');
            this.servicesContent.setAttribute('data-active-service', serviceKey);

            // Fade in the new content
            requestAnimationFrame(() => {
                this.servicesContent.style.opacity = '1';
            });
        }, 300);

        this.activeService = serviceKey;
        console.log(`🖥️ Desktop: Opened ${serviceData.service.name}`);
    }

    closeServiceDesktop() {
        // Fade out before restoring content
        this.servicesContent.style.opacity = '0';

        setTimeout(() => {
            // Restore original services content
            this.servicesContent.innerHTML = this.originalServicesContent;

            // Remove active state indicators
            this.servicesContent.classList.remove('showing-service-description');
            this.servicesContent.removeAttribute('data-active-service');

            // Fade back in
            requestAnimationFrame(() => {
                this.servicesContent.style.opacity = '1';
            });
        }, 300);

        this.activeService = null;
        console.log('🖥️ Desktop: Closed service');
    }

    // MOBILE FUNCTIONALITY - NEW MODAL APPROACH
    openServiceMobile(serviceKey) {
        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) return;

        const trigger = serviceData.trigger;

        // Update trigger: [+] to [-]
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;

        // Add active class
        trigger.classList.add('service-active');
        trigger.setAttribute('data-service-active', 'true');

        // Show modal with content
        this.showMobileModal(serviceData);

        this.activeService = serviceKey;
        console.log(`📱 Mobile: Opened ${serviceData.service.name} in modal`);
    }

    closeServiceMobile() {
        // Hide modal
        this.hideMobileModal();

        this.activeService = null;
        console.log('📱 Mobile: Closed service modal');
    }

    closeActiveService() {
        if (!this.activeService) return;

        const serviceData = this.serviceElements.get(this.activeService);
        if (!serviceData) return;

        const trigger = serviceData.trigger;

        // Restore trigger: [-] to [+] and remove green class and attribute
        const currentText = trigger.textContent;
        const newText = currentText.replace('[-]', '[+]');
        trigger.textContent = newText;
        trigger.classList.remove('service-active');
        trigger.removeAttribute('data-service-active');
        
        // Force reset any inline styles
        trigger.style.fontSize = '';
        trigger.style.fontWeight = '';
        trigger.style.transform = '';

        if (this.isMobile) {
            this.closeServiceMobile();
        } else {
            this.closeServiceDesktop();
        }
    }

    // CREATE MOBILE MODAL
    createMobileModal() {
        // Only create on mobile
        if (!this.isMobile) return;

        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'services-modal-overlay';
        modalOverlay.className = 'services-modal-overlay';

        const modalContent = document.createElement('div');
        modalContent.className = 'services-modal-content';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'services-modal-header';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'services-modal-title';
        modalTitle.textContent = 'Service Details';

        const closeButton = document.createElement('button');
        closeButton.className = 'services-modal-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close modal');

        const modalBody = document.createElement('div');
        modalBody.className = 'services-modal-body';
        modalBody.id = 'services-modal-body';

        // Assemble modal
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);

        // Add to document
        document.body.appendChild(modalOverlay);

        // Store references
        this.modalOverlay = modalOverlay;
        this.modalBody = modalBody;
        this.modalTitle = modalTitle;

        // Add event listeners
        closeButton.addEventListener('click', () => this.closeActiveService());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeActiveService();
            }
        });

        // ESC key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeService && this.isMobile) {
                this.closeActiveService();
            }
        });

        console.log('📱 Mobile modal created');
    }

    showMobileModal(serviceData) {
        if (!this.modalOverlay || !this.modalBody) return;

        // Set modal content
        this.modalTitle.textContent = serviceData.service.name;
        this.modalBody.innerHTML = serviceData.description.innerHTML;

        // Style numbers in modal
        this.styleNumbersInBracketsMobile(this.modalBody);

        // Show modal with animation
        this.modalOverlay.style.display = 'flex';
        requestAnimationFrame(() => {
            this.modalOverlay.classList.add('modal-active');
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    hideMobileModal() {
        if (!this.modalOverlay) return;

        // Hide modal with animation
        this.modalOverlay.classList.remove('modal-active');
        
        setTimeout(() => {
            this.modalOverlay.style.display = 'none';
            this.modalBody.innerHTML = '';
        }, 300);

        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Method to close all services
    closeAll() {
        if (this.activeService) {
            this.closeActiveService();
        }
    }

    // Method to handle window resize
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;

        // If switching between mobile/desktop, handle modal
        if (wasMobile !== this.isMobile) {
            this.closeAll();

            if (this.isMobile && !this.modalOverlay) {
                this.createMobileModal();
            }
        }
    }

    // DESKTOP NUMBER STYLING - UNTOUCHED
    styleNumbersInBrackets() {
        const walker = document.createTreeWalker(
            this.servicesContent,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const bracketNumberRegex = /\[(\d+)\]/g;

            if (bracketNumberRegex.test(text)) {
                const span = document.createElement('span');
                const styledText = text.replace(bracketNumberRegex, (match, number) => {
                    return `<span style="color: #32b550;">[${number}]</span>`;
                });

                span.innerHTML = styledText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }

    // MOBILE NUMBER STYLING
    styleNumbersInBracketsMobile(container) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const bracketNumberRegex = /\[(\d+)\]/g;

            if (bracketNumberRegex.test(text)) {
                const span = document.createElement('span');
                const styledText = text.replace(bracketNumberRegex, (match, number) => {
                    return `<span style="color: #32b550;">[${number}]</span>`;
                });

                span.innerHTML = styledText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🎯 Initializing Services Toggle System with Mobile Modal...');
        window.servicesToggleSystem = new ServicesToggleSystem();
    }, 500);
});
