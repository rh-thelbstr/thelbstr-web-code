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
      ["home", "nav-black"],
      ["the-beginning", "nav-green"],
      ["slide-3", "nav-green"],
      ["screenplay", "nav-black"],
      ["choice", "nav-black"],
      ["ekta", "nav-green"],
      ["stranger", "nav-black"],
      ["slide-8", "nav-green"],
      ["partners", "nav-green"],
      ["the-lbstr", "nav-green"],
      ["values", "nav-black"],
      ["crafts", "nav-green"],
      ["strategy", "nav-black"],
      ["the-strategist", "nav-green"],
      ["problem-solving", "nav-black"],
      ["storytelling", "nav-green"],
      ["ideas", "nav-green"],
      ["the-storyteller", "nav-green"],
      ["commercial-stories", "nav-black"],
      ["personal-stories", "nav-black"],
      ["services", "nav-green"],
      ["contact", "nav-black"] 
      
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
    // DESKTOP: scroll happens on window
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(1, scrollTop / totalHeight);
      fill.style.height = `${progress * 100}%`;
    });
 class ExpandAccordion {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        
        this.triggers = [
            { triggerId: "expand-trigger-1", contentId: "obsessed-content", title: "Obsessed" },
            { triggerId: "expand-trigger-2", contentId: "disciplined-content", title: "Disciplined" },
            { triggerId: "expand-trigger-3", contentId: "kind-content", title: "Kind" },
        ];
        this.openId = null;
        this.init();
    }

    init() {
        this.triggers.forEach(({ triggerId, contentId, title }) => {
            const trigger = document.getElementById(triggerId);
            const content = document.getElementById(contentId);

            if (trigger && content) {
                // Store references for efficiency
                trigger.contentElement = content;
                trigger.contentId = contentId;
                trigger.title = title; // Add title for mobile

                // Add event listeners
                trigger.addEventListener('click', (e) => this.handleClick(e));
                trigger.addEventListener('keydown', (e) => this.handleKeydown(e));

                // Set initial state based on device
                if (this.isMobile) {
                    // Mobile: Hide content, make trigger clickable
                    content.style.display = 'none';
                    trigger.style.cursor = 'pointer';
                } else {
                    // Desktop: Use existing accordion logic
                    this.closeContent(trigger, content);
                }
            }
        });
    }

   handleClick(e) {
    const trigger = e.target;
    const content = trigger.contentElement;
    const contentId = trigger.contentId;
    const title = trigger.title;

    if (this.isMobile) {
        // Mobile: Open modal
        e.preventDefault();
        e.stopPropagation();
        this.openMobileModal(title, content);
        console.log(`📱 Mobile modal opened: ${title}`);
    } else {
        // Desktop: Use existing accordion logic
        const isAlreadyOpen = this.openId === contentId;
        this.closeAll();
        
        if (!isAlreadyOpen) {
            this.openContent(trigger, content);
            this.openId = contentId;
        } else {
            this.openId = null;
        }
    }
}

// Add this new method to create mobile modals
openMobileModal(title, contentElement) {
    // Get the text content from the accordion content
    const contentText = contentElement.textContent || contentElement.innerText || '';
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'mobile-modal-overlay';

    // Create modal content (remove all inline styles - let CSS handle it)
    modalOverlay.innerHTML = `
        <div>
            <h2>${title}</h2>
            <button class="mobile-modal-close">✕</button>
        </div>
        <div>${contentText}</div>
    `;

    // Add to document
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';

    // Trigger animation
    requestAnimationFrame(() => {
        modalOverlay.classList.add('modal-active');
    });

    // Close functionality
    const closeBtn = modalOverlay.querySelector('.mobile-modal-close');
    const closeModal = () => {
        modalOverlay.classList.remove('modal-active');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
        }, 500);
    };

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

    // Keep all existing methods for desktop
    handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleClick(e);
        }
    }

    openContent(trigger, content) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.textContent = '[-]';
        content.classList.add('expanded');
        this.announceChange('expanded');
    }

    closeContent(trigger, content) {
        trigger.setAttribute('aria-expanded', 'false');
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
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Section ${state}`;
        document.body.appendChild(announcement);

        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ExpandAccordion(); // Works for both desktop and mobile now
});

// === SLIDE 14 MODAL SYSTEM ===
class Slide14ModalSystem {
  constructor() {
    if (window.innerWidth >= 768) return; // desktop: keep existing layout
    this.triggers = [
      { triggerClass: "bio-expand-trigger-4",    contentClass: "rh-bio-description", title: "Biography" },
      { triggerClass: "brands-expand-trigger-5", contentClass: "brands-list-mobile",  title: "Brands"    },
      { triggerClass: "recog-expand-trigger-6",  contentClass: "recog-list-mobile",   title: "Recognition" }
    ];
    this.activeModal = null;
    this.init();
    this.createModal();
  }

  init() {
    this.triggers.forEach(({ triggerClass, contentClass, title }) => {
      const trigger = document.querySelector(`.${triggerClass}`);
      const content = document.querySelector(`.${contentClass}`);
      if (!trigger || !content) return;
      content.style.display = 'none';
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        this.openModal(title, content.innerHTML);
      });
      console.log(`✅ Slide 14: ${title} modal initialized`);
    });
  }

  createModal() {
    const html = `
      <div id="slide14-modal-overlay" class="slide14-modal-overlay">
        <div class="slide14-modal-content">
          <div class="slide14-modal-header">
            <h3 class="slide14-modal-title" id="slide14-modal-title">Title</h3>
            <button class="slide14-modal-close" id="slide14-modal-close" aria-label="Close modal">×</button>
          </div>
          <div class="slide14-modal-body" id="slide14-modal-body"></div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    this.overlay = document.getElementById('slide14-modal-overlay');
    this.titleEl = document.getElementById('slide14-modal-title');
    this.bodyEl  = document.getElementById('slide14-modal-body');
    this.close   = document.getElementById('slide14-modal-close');
    this.close.addEventListener('click', () => this.closeModal());
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.overlay.style.display === 'flex') this.closeModal();
    });
    console.log('✅ Slide 14 modal created');
  }

  openModal(title, content) {
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML    = content;
    this.overlay.style.display = 'flex';
    requestAnimationFrame(() => this.overlay.classList.add('modal-active'));
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.overlay.classList.remove('modal-active');
    setTimeout(() => {
      this.overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

// initialize on mobile only
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) new Slide14ModalSystem();
});

// === SLIDE 18 MODAL SYSTEM ===
class Slide18ModalSystem {
  constructor() {
    if (window.innerWidth >= 768) return; // mobile only
    this.triggerClass = "bio-ekta-trigger";
    this.contentClass = "slide-18-copy";
    this.title = "Bio";
    this.activeModal = null;
    this.init();
    this.createModal();
  }

  init() {
    const trigger = document.querySelector(`.${this.triggerClass}`);
    const content = document.querySelector(`.${this.contentClass}`);
    
    if (!trigger || !content) {
      console.log(`❌ Slide 18: .${this.triggerClass} or .${this.contentClass} not found`);
      return;
    }

    // Hide content and make trigger clickable
    content.style.display = 'none';
    trigger.style.cursor = 'pointer';
    trigger.style.userSelect = 'none';

    // Add click listener
    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.openModal(this.title, content.innerHTML);
    });

    console.log(`✅ Slide 18: ${this.title} modal initialized`);
  }

  createModal() {
    const modalHTML = `
      <div id="slide18-modal-overlay" class="slide18-modal-overlay">
        <div class="slide18-modal-content">
          <div class="slide18-modal-header">
            <h3 class="slide18-modal-title" id="slide18-modal-title">Title</h3>
            <button class="slide18-modal-close" id="slide18-modal-close" aria-label="Close modal">×</button>
          </div>
          <div class="slide18-modal-body" id="slide18-modal-body"></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Store references
    this.modalOverlay = document.getElementById('slide18-modal-overlay');
    this.modalTitle = document.getElementById('slide18-modal-title');
    this.modalBody = document.getElementById('slide18-modal-body');
    this.closeButton = document.getElementById('slide18-modal-close');

    // Event listeners
    this.closeButton.addEventListener('click', () => this.closeModal());
    
    this.modalOverlay.addEventListener('click', e => {
      if (e.target === this.modalOverlay) this.closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.modalOverlay.style.display === 'flex') {
        this.closeModal();
      }
    });

    console.log('✅ Slide 18 modal created');
  }

  openModal(title, content) {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = content;
    this.modalOverlay.style.display = 'flex';
    
    requestAnimationFrame(() => {
      this.modalOverlay.classList.add('modal-active');
    });
    
    document.body.style.overflow = 'hidden';
    this.activeModal = title;
    console.log(`📱 Slide 18: Opened ${title} modal`);
  }

  closeModal() {
    this.modalOverlay.classList.remove('modal-active');
    
    setTimeout(() => {
      this.modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 500);
    
    this.activeModal = null;
    console.log('📱 Slide 18: Closed modal');
  }
}

// Update the initialization to include Slide 18
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    new Slide14ModalSystem();
    new Slide18ModalSystem(); // Add this line
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

// Enhanced Services Toggle System with solve4 fix
class ServicesToggleSystem {
    constructor() {
        console.log('🚀 Initializing Services Toggle System...');
        
        this.services = [
            { triggerClass: 'brand', descriptionClass: 'brand-descr', name: 'Brand' },
            { triggerClass: 'creative', descriptionClass: 'creative-descr', name: 'Creative' },
            { triggerClass: 'imc', descriptionClass: 'imc-descr', name: 'Integrated Communications' },
            { triggerClass: 'solve4', descriptionClass: 'solve4-descr', name: 'Solve for' },
            { triggerClass: 'scriptwriting', descriptionClass: 'scriptwriting-descr', name: 'Scriptwriting' },
            { triggerClass: 'film-conceptualisation', descriptionClass: 'film-concept-descr', name: 'Film Conceptualisation' },
            { triggerClass: 'directing', descriptionClass: 'film-direct-descr', name: 'Film Directing' }
        ];

        this.isMobile = window.innerWidth < 768;
        this.servicesContent = document.querySelector('.capabilities') || document.querySelector('.services');

        if (!this.servicesContent) {
            console.log('❌ Services content container not found');
            return;
        }

        this.activeService = null;
        this.originalServicesContent = null;
        this.serviceElements = new Map();

        this.init();
        
        if (this.isMobile) {
            this.createMobileModal();
        }

        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✅ Services Toggle System initialized');
    }

    init() {
    console.log('🔧 Initializing individual services...');
    this.originalServicesContent = this.servicesContent.innerHTML;

    // Reduce delays - they're causing timing issues
    this.services.forEach((service, index) => {
        const delay = index * 50; // Reduced from 150ms to 50ms
        setTimeout(() => {
            this.initializeService(service);
        }, delay);
    });

    // Reduce solve4 retry delay
    setTimeout(() => {
        if (!this.serviceElements.has('solve4')) {
            console.log('🔄 solve4 not found in first pass, retrying...');
            const solve4Service = this.services.find(s => s.triggerClass === 'solve4');
            if (solve4Service) {
                this.initializeService(solve4Service, true);
            }
        }
    }, 1000); // Reduced from 2000ms to 1000ms
}

    initializeService(service, forceAttempt = false) {
        const triggerElement = document.querySelector(`.${service.triggerClass}`);
        const descriptionElement = document.querySelector(`.${service.descriptionClass}`);

        console.log(`🔍 ${service.name}:`);
        console.log(`  Trigger (.${service.triggerClass}):`, triggerElement);
        console.log(`  Description (.${service.descriptionClass}):`, descriptionElement);

        if (triggerElement && descriptionElement) {
            // Check if already initialized
            if (this.serviceElements.has(service.triggerClass)) {
                console.log(`⚠️ ${service.name} already initialized, skipping`);
                return;
            }

            const serviceData = {
                trigger: triggerElement,
                description: descriptionElement,
                service: service
            };

            this.serviceElements.set(service.triggerClass, serviceData);
            descriptionElement.style.display = 'none';

            // Enhanced element preparation for solve4
            if (service.triggerClass === 'solve4' || forceAttempt) {
                // Extra preparations for solve4
                triggerElement.style.pointerEvents = 'auto';
                triggerElement.style.position = 'relative';
                triggerElement.style.zIndex = '10';
            }

            // Clone element to remove any conflicting listeners
            const newTrigger = triggerElement.cloneNode(true);
            triggerElement.parentNode.replaceChild(newTrigger, triggerElement);

            // Add event listener
            newTrigger.addEventListener('click', (e) => {
                console.log(`🖱️ ${service.name} clicked!`);
                this.handleServiceToggle(e, service.triggerClass);
            });

            // Update service data with new trigger
            serviceData.trigger = newTrigger;
            this.serviceElements.set(service.triggerClass, serviceData);

            // Make clickable
            newTrigger.style.cursor = 'pointer';
            newTrigger.style.userSelect = 'none';

            console.log(`✅ ${service.name} initialized successfully`);
        } else {
            console.log(`❌ ${service.name} elements not found`);
            if (!triggerElement) console.log(`   Missing: .${service.triggerClass}`);
            if (!descriptionElement) console.log(`   Missing: .${service.descriptionClass}`);
        }
    }

    handleServiceToggle(e, serviceKey) {
        console.log(`🔄 Handling toggle for: ${serviceKey}`);
        e.preventDefault();
        e.stopPropagation();

        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) {
            console.log(`❌ No service data found for: ${serviceKey}`);
            return;
        }

        if (this.activeService === serviceKey) {
            console.log(`🔒 Closing active service: ${serviceKey}`);
            this.closeActiveService();
            return;
        }

        if (this.activeService) {
            console.log(`🔄 Closing previous service: ${this.activeService}`);
            this.closeActiveService();
        }

        console.log(`🚀 Opening service: ${serviceKey} (Mobile: ${this.isMobile})`);
        if (this.isMobile) {
            this.openServiceMobile(serviceKey);
        } else {
            this.openServiceDesktop(serviceKey);
        }
    }

       openServiceDesktop(serviceKey) {
        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) return;

        // First restore all OTHER triggers, but skip the current one
        this.restoreTriggerStates(serviceKey);

        const trigger = serviceData.trigger;
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;
        trigger.classList.add('service-active');
        trigger.setAttribute('data-service-active', 'true');
    
        // Make it green and bold
        trigger.style.color = '#32b550';
        trigger.style.fontWeight = 'bold';

        this.servicesContent.style.opacity = '0';

        setTimeout(() => {
            this.servicesContent.innerHTML = serviceData.description.innerHTML;
            this.styleNumbersInBrackets();
            this.servicesContent.classList.add('showing-service-description');
            this.servicesContent.setAttribute('data-active-service', serviceKey);

            requestAnimationFrame(() => {
                this.servicesContent.style.opacity = '1';
            });
        }, 300);

        this.activeService = serviceKey;
        console.log(`🖥️ Desktop: Opened ${serviceData.service.name}`);
    }

    closeServiceDesktop() {
    this.servicesContent.style.opacity = '0';
    
    setTimeout(() => {
        this.servicesContent.innerHTML = this.originalServicesContent;
        this.servicesContent.classList.remove('showing-service-description');
        this.servicesContent.removeAttribute('data-active-service');
        
        // Instead of clearing and re-init, just restore trigger states
        this.restoreTriggerStates(); // Keep this as-is when closing all services
        
        requestAnimationFrame(() => {
            this.servicesContent.style.opacity = '1';
        });
    }, 300);
    
    this.activeService = null;
    console.log('🖥️ Desktop: Closed service');
}
    // ADD THE NEW HELPER METHOD HERE:
restoreTriggerStates(skipServiceKey = null) {
    // Restore all trigger texts to [+] state, except the one we're about to activate
    this.serviceElements.forEach((serviceData, key) => {
        // Skip the service we're about to activate
        if (key === skipServiceKey) return;
        
        const trigger = document.querySelector(`.${serviceData.service.triggerClass}`);
        if (trigger) {
            const currentText = trigger.textContent;
            const newText = currentText.replace('[-]', '[+]');
            trigger.textContent = newText;
            trigger.classList.remove('service-active');
            trigger.removeAttribute('data-service-active');
            // Reset styling
            trigger.style.color = '';
            trigger.style.fontWeight = '';
        }
    });
}
    openServiceMobile(serviceKey) {
        const serviceData = this.serviceElements.get(serviceKey);
        if (!serviceData) return;

        const trigger = serviceData.trigger;
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;

        trigger.classList.add('service-active');
        trigger.setAttribute('data-service-active', 'true');

        this.showMobileModal(serviceData);
        this.activeService = serviceKey;
        console.log(`📱 Mobile: Opened ${serviceData.service.name} in modal`);
    }

    closeServiceMobile() {
        this.hideMobileModal();
        this.activeService = null;
        console.log('📱 Mobile: Closed service modal');
    }

    closeActiveService() {
        if (!this.activeService) return;

        const serviceData = this.serviceElements.get(this.activeService);
        if (!serviceData) return;

        const trigger = serviceData.trigger;
        const currentText = trigger.textContent;
        const newText = currentText.replace('[-]', '[+]');
        trigger.textContent = newText;
        trigger.classList.remove('service-active');
        trigger.removeAttribute('data-service-active');

        if (this.isMobile) {
            this.closeServiceMobile();
        } else {
            this.closeServiceDesktop();
        }
    }

    createMobileModal() {
        if (!this.isMobile) return;

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

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);

        document.body.appendChild(modalOverlay);

        this.modalOverlay = modalOverlay;
        this.modalBody = modalBody;
        this.modalTitle = modalTitle;

        closeButton.addEventListener('click', () => this.closeActiveService());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeActiveService();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeService && this.isMobile) {
                this.closeActiveService();
            }
        });

        console.log('📱 Mobile modal created');
    }

    showMobileModal(serviceData) {
        if (!this.modalOverlay || !this.modalBody) return;

        this.modalTitle.textContent = serviceData.service.name;
        this.modalBody.innerHTML = serviceData.description.innerHTML;
        this.styleNumbersInBracketsMobile(this.modalBody);

        this.modalOverlay.style.display = 'flex';
        requestAnimationFrame(() => {
            this.modalOverlay.classList.add('modal-active');
        });

        document.body.style.overflow = 'hidden';
    }

    hideMobileModal() {
        if (!this.modalOverlay) return;

        this.modalOverlay.classList.remove('modal-active');
        
        setTimeout(() => {
            this.modalOverlay.style.display = 'none';
            this.modalBody.innerHTML = '';
        }, 300);

        document.body.style.overflow = '';
    }

    closeAll() {
        if (this.activeService) {
            this.closeActiveService();
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;

        if (wasMobile !== this.isMobile) {
            this.closeAll();
            if (this.isMobile && !this.modalOverlay) {
                this.createMobileModal();
            }
        }
    }

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

// Add this AFTER your existing ServicesToggleSystem initialization
// This ensures solve4 is always registered even if the normal init misses it

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, initializing Services Toggle System...');
    
    setTimeout(() => {
        window.servicesToggleSystem = new ServicesToggleSystem();
        
        // SOLVE4 FORCE REGISTRATION - runs after main system initializes
        setTimeout(() => {
            console.log('🔧 Checking solve4 registration...');
            
            if (window.servicesToggleSystem && !window.servicesToggleSystem.serviceElements.has('solve4')) {
                console.log('⚠️ solve4 not found in service map, force registering...');
                
                const solve4Element = document.querySelector('.solve4');
                const solve4Descr = document.querySelector('.solve4-descr');
                
                if (solve4Element && solve4Descr) {
                    // Create service data
                    const serviceData = {
                        trigger: solve4Element,
                        description: solve4Descr,
                        service: { 
                            triggerClass: 'solve4', 
                            descriptionClass: 'solve4-descr', 
                            name: 'Solve for [insert challenge here]' 
                        }
                    };
                    
                    // Add to service map
                    window.servicesToggleSystem.serviceElements.set('solve4', serviceData);
                    
                    // Hide description
                    solve4Descr.style.display = 'none';
                    
                    // Clone element to remove conflicts
                    const newSolve4 = solve4Element.cloneNode(true);
                    solve4Element.parentNode.replaceChild(newSolve4, solve4Element);
                    
                    // Update service data with new element
                    serviceData.trigger = newSolve4;
                    window.servicesToggleSystem.serviceElements.set('solve4', serviceData);
                    
                    // Make it clickable
                    newSolve4.style.cursor = 'pointer';
                    newSolve4.style.userSelect = 'none';
                    newSolve4.style.pointerEvents = 'auto';
                    
                    // Add click listener
                    newSolve4.addEventListener('click', function(e) {
                        console.log('🖱️ solve4 clicked via force registration!');
                        e.preventDefault();
                        e.stopPropagation();
                        window.servicesToggleSystem.handleServiceToggle(e, 'solve4');
                    });
                    
                    console.log('✅ solve4 force registered successfully');
                    console.log('Final service map size:', window.servicesToggleSystem.serviceElements.size);
                } else {
                    console.log('❌ solve4 elements not found for force registration');
                }
            } else {
                console.log('✅ solve4 already registered normally');
            }
        }, 2000); // Wait 2 seconds after main system initialization
        
    }, 1000);
});

// Scroll Position Memory for Mobile
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && scrollContainer) {
        // Restore scroll position on page load
        const savedScrollTop = sessionStorage.getItem('mobileScrollPosition');
        if (savedScrollTop) {
            scrollContainer.scrollTop = parseInt(savedScrollTop);
        }
        
        // Save scroll position on scroll
        scrollContainer.addEventListener('scroll', () => {
            sessionStorage.setItem('mobileScrollPosition', scrollContainer.scrollTop);
        });
        
        // Save scroll position before page unload
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('mobileScrollPosition', scrollContainer.scrollTop);
        });
    }
});
// ===== LBSTR MENU - FORCE EVERYTHING APPROACH =====
// Put this in "Before body tag" - NO CSS in head needed

console.log('🚀 LBSTR Force Menu: Starting...');

// Try multiple times to catch the elements when they're ready
function tryInitMenu() {
  const burger = document.querySelector('.nav-burger-icon-black');
  const menu = document.querySelector('.nav-menu-desktop');
  
  console.log('🔍 Attempt - Burger:', !!burger, 'Menu:', !!menu, 'GSAP:', typeof gsap !== 'undefined');
  
  if (!burger || !menu || typeof gsap === 'undefined') {
    return false; // Not ready yet
  }
  
  console.log('✅ All elements found - forcing setup...');
  
  // FORCE EVERYTHING - No CSS dependencies
  
  // 1. Force nav bar to stay on top
  const navBar = document.querySelector('.nav-bar, #nav-bar, [class*="nav-bar"]');
  if (navBar) {
    navBar.style.cssText += `
      position: fixed !important;
      z-index: 10000 !important;
      pointer-events: auto !important;
    `;
  }
  
  // 2. FORCE menu to be visible and positioned
  menu.style.cssText = `
    position: fixed !important;
    top: 0px !important;
    left: 0px !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background-color: rgb(50, 181, 80) !important;
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: translateX(-100%) !important;
    transition: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-sizing: border-box !important;
  `;
  
  // 3. FORCE burger to be clickable
  burger.style.cssText += `
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 10001 !important;
    position: relative !important;
  `;
  
  console.log('🎨 Everything forced - menu should now be setup');
  
  // 4. Test that menu is actually positioned correctly
  setTimeout(() => {
    const rect = menu.getBoundingClientRect();
    console.log('📐 Menu position check:', {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    });
  }, 100);
  
  let isOpen = false;
  let currentTween = null;
  
  // ANIMATION FUNCTIONS
  function openMenu() {
    console.log('🎬 FORCE Opening menu...');
    isOpen = true;
    
    if (currentTween) currentTween.kill();
    
    // Force body scroll lock
    document.body.style.overflow = 'hidden';
    
    // Get stagger elements
    const navLinks = menu.querySelectorAll('a, .link-block');
    const closeButton = menu.querySelector('.close-button-menu');
    const socialHandles = menu.querySelector('.social-handles');
    
    console.log('🔍 Stagger elements found:', {
      links: navLinks.length,
      closeBtn: !!closeButton,
      social: !!socialHandles
    });
    
    // AGGRESSIVE RESET - Clear all GSAP properties first
    console.log('🔄 AGGRESSIVE reset of all content...');
    
    navLinks.forEach(link => {
      gsap.set(link, { clearProps: "all" }); // Clear all GSAP properties
      link.style.cssText = ''; // Clear all inline styles
    });
    
    if (closeButton) {
      gsap.set(closeButton, { clearProps: "all" });
      closeButton.style.cssText = '';
    }
    
    if (socialHandles) {
      gsap.set(socialHandles, { clearProps: "all" });
      socialHandles.style.cssText = '';
    }
    
    console.log('✅ All GSAP properties cleared');
    
    // Small delay to ensure reset is complete
    setTimeout(() => {
      // Now set initial states for stagger
      gsap.set(navLinks, { opacity: 0, y: 20 });
      if (closeButton) gsap.set(closeButton, { opacity: 0, y: 20 });
      if (socialHandles) gsap.set(socialHandles, { opacity: 0, y: 20 });
      
      console.log('✅ Initial stagger states set');
      
      // GSAP Timeline for stagger
      currentTween = gsap.timeline({
        onComplete: () => {
          console.log('✅ FORCE menu open complete');
          currentTween = null;
        }
      });
      
      // Step 1: Slide panel
      currentTween.to(menu, {
        x: '0%',
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        onStart: () => console.log('🎬 Panel should be sliding in now...'),
        onComplete: () => console.log('✅ Panel slide complete')
      });
      
      // Step 2: Stagger links
      if (navLinks.length > 0) {
        currentTween.to(navLinks, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          onComplete: () => console.log('✅ Links staggered')
        }, "-=0.5");
      }
      
      // Step 3: Close button
      if (closeButton) {
        currentTween.to(closeButton, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.3");
      }
      
      // Step 4: Social
      if (socialHandles) {
        currentTween.to(socialHandles, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2");
      }
      
    }, 50); // 50ms delay for reset to complete
  }
  
  function closeMenu() {
    console.log('🚪 FORCE Closing menu...');
    isOpen = false;
    
    if (currentTween) currentTween.kill();
    
    // Get all content elements
    const navLinks = menu.querySelectorAll('a, .link-block');
    const closeButton = menu.querySelector('.close-button-menu');
    const socialHandles = menu.querySelector('.social-handles');
    const allStaggerContent = [...navLinks];
    if (closeButton) allStaggerContent.push(closeButton);
    if (socialHandles) allStaggerContent.push(socialHandles);
    
    currentTween = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        
        // FORCE RESET all elements after close (prevents stuck state)
        console.log('🔄 Resetting all elements after close...');
        allStaggerContent.forEach(el => {
          el.style.opacity = '';
          el.style.transform = '';
        });
        
        console.log('✅ FORCE menu closed and reset');
        currentTween = null;
      }
    });
    
    // Quick fade stagger content
    currentTween.to(allStaggerContent, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => console.log('✅ Content faded for close')
    });
    
    // Slide panel out
    currentTween.to(menu, {
      x: '-100%',
      duration: 0.6,
      ease: "power2.in",
      force3D: true,
      onComplete: () => console.log('✅ Panel slid out')
    }, "-=0.1");
  }
  
  // EVENT LISTENERS
  burger.addEventListener('click', function(e) {
    console.log('🎯 FORCE Burger clicked!');
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  
  // Close button
  const closeButton = menu.querySelector('.close-button-menu');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      console.log('❌ FORCE Close clicked!');
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) closeMenu();
    });
  }
  
  // ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      console.log('⌨️ FORCE ESC pressed');
      closeMenu();
    }
  });
  
  console.log('✅ FORCE menu setup complete!');
  return true; // Success
}

// Try initializing multiple times
const delays = [500, 1000, 2000, 3000, 5000];
let initialized = false;

delays.forEach((delay, index) => {
  setTimeout(() => {
    if (!initialized && tryInitMenu()) {
      initialized = true;
      console.log(`🎉 FORCE menu initialized on attempt ${index + 1}`);
    }
  }, delay);
});

console.log('🎯 FORCE initialization attempts scheduled');

// ===== SECOND MIGRATION INTO GITHUB FROM WEBFLOW =====

console.log('🧭 LBSTR Simple Navigation: Starting...');

class LBSTRSimpleNavigation {
  constructor() {
    this.totalSlides   = 0;
    this.currentSlide  = 1;
    this.isNavigating  = false;
    this.skipTracking  = false;
    this.wrapper       = null;
    this.slideMap      = {};
    this.slideToId     = {};
    this.init();
  }

  init() {
    // allow other scripts (ScrollTrigger) time to initialize
    setTimeout(() => this.setup(), 2000);
  }

  setup() {
    console.log('🔍 Setting up simple navigation...');
    this.wrapper = document.querySelector('.wrapper');
    if (!this.wrapper) {
      console.error('❌ Wrapper not found');
      return;
    }
    console.log('✅ Wrapper found');

    // build maps from direct child slides only
    this.buildMaps();

    this.setupMenuNavigation();
    this.setupUrlTracking();
    this.handleInitialUrl();
    console.log('✅ Simple navigation ready!');
  }

  buildMaps() {
    // only grab direct children of .wrapper that have an id
    const slides = Array.from(this.wrapper.children).filter(el => el.id);
    slides.forEach((el, idx) => {
      const id  = el.id;
      const num = idx + 1;
      this.slideMap[id]     = num;
      this.slideToId[num]   = id;
    });
    this.totalSlides = slides.length;
    console.log('🔄 slideMap rebuilt:', this.slideMap);
  }

 setupMenuNavigation() {
  console.log('🔗 Setting up both desktop & mobile menu navigation…');

  // target both desktop + mobile containers
  const menus = document.querySelectorAll('.nav-menu-desktop, .nav-menu-mobile');
  if (!menus.length) {
    console.warn('⚠️ No menu elements found');
    return;
  }

  menus.forEach(menu => {
    menu.addEventListener('click', e => {
      const link = e.target.closest('a[href*="#"], .link-block');
      if (!link || this.isNavigating) return;

      e.preventDefault();
      e.stopPropagation();

      const href              = link.getAttribute('href') || '';
      const rawId             = href.startsWith('#') ? href.slice(1) : href;
      const targetSlideNumber = this.slideMap[rawId] || 1;

      console.log('🎯 Menu click (mobile/desktop) → slide', targetSlideNumber);
      this.closeMenu();

      setTimeout(() => {
        this.navigateToSlide(targetSlideNumber);
      }, 300);
    });
  });

  console.log('✅ Desktop & mobile menu navigation wired up');
}

  closeMenu() {
    if (window.lbstrMenu && typeof window.lbstrMenu.close === 'function') {
      window.lbstrMenu.close(); console.log('✅ Menu closed via lbstrMenu.close()'); return;
    }
    if (window.lbstrMenu && typeof window.lbstrMenu.closeMenu === 'function') {
      window.lbstrMenu.closeMenu(); console.log('✅ Menu closed via lbstrMenu.closeMenu()'); return;
    }
    const closeButton = document.querySelector('.close-button-menu');
    if (closeButton) {
      closeButton.click(); console.log('✅ Menu closed via close-button click'); return;
    }
    const burger = document.querySelector('.nav-burger-icon-black');
    if (burger) {
      burger.click(); console.log('✅ Menu closed via burger click');
    }
  }

  navigateToSlide(targetSlideNumber) {
    if (this.isNavigating || targetSlideNumber < 1 || targetSlideNumber > this.totalSlides) {
      return console.log('❌ Navigation blocked:', { isNavigating: this.isNavigating, targetSlideNumber });
    }
    this.isNavigating = true;
    this.skipTracking = true;
    console.log('🎬 scrolling to slide:', targetSlideNumber);

    const scrollY = (targetSlideNumber - 1) * window.innerWidth;

    gsap.to(window, {
      scrollTo: scrollY,
      duration: 1.2,
      ease: "power2.inOut",
      onStart:   () => console.log('⬆️ Scroll animation started to:', scrollY),
      onComplete:() => {
        this.currentSlide = targetSlideNumber;
        this.isNavigating = false;
        console.log('✅ scrollTo complete, now at slide:', targetSlideNumber);
        this.updateUrlHash(this.slideToId[targetSlideNumber]);
        setTimeout(() => this.skipTracking = false, 300);
      }
    });
  }

  setupUrlTracking() {
    console.log('📊 Setting up URL tracking...');
    setInterval(() => {
      if (!this.isNavigating && !this.skipTracking && this.wrapper) {
        const currentX   = gsap.getProperty(this.wrapper, "x") || 0;
        const slideWidth = window.innerWidth;
        const newSlide   = Math.round(Math.abs(currentX) / slideWidth) + 1;
        if (newSlide !== this.currentSlide) {
          this.currentSlide = newSlide;
          console.log('📍 Now on slide:', newSlide);
          this.updateUrlHash(this.slideToId[newSlide]);
        }
      }
    }, 200);
    console.log('✅ URL tracking ready');
  }

  handleInitialUrl() {
    console.log('🔍 Handling initial URL…');
    const rawHash = window.location.hash.replace('#','');
    let targetId  = rawHash && this.slideMap[rawHash] ? rawHash : null;

    if (targetId) {
      const slideNum = this.slideMap[targetId];
      console.log('🎯 Deep‐link to:', targetId, '→ slideNum:', slideNum);
      setTimeout(() => {
        gsap.set(this.wrapper, { x: -(slideNum - 1) * window.innerWidth });
        this.currentSlide = slideNum;
        console.log('✅ Deep‐link position set');
        if (ScrollTrigger) ScrollTrigger.refresh();
      }, 4000);
      history.replaceState(null, '', `#${targetId}`);
    } else {
      console.log('🏠 No valid hash, defaulting to first slide');
      const firstId = this.slideToId[1];
      history.replaceState(null, '', `#${firstId}`);
    }
  }

  updateUrlHash(slideId) {
    if (!slideId) return;
    const newHash = `#${slideId}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
      console.log('🔗 Hash updated to:', newHash);
    }
  }

  getCurrentSlide() {
    return this.currentSlide;
  }

  goToSlide(slideNumber) {
    this.navigateToSlide(slideNumber);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('🚀 Initializing simple navigation...');
    window.lbstrSimpleNavigation = new LBSTRSimpleNavigation();
  }, 3000);
});

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const burgerMobile = document.querySelector('.nav-burger-icon-black');
      const mobileMenu   = document.querySelector('.nav-menu-mobile');
      let isOpen         = false;

      if (!burgerMobile || !mobileMenu) return;

      // Toggle slide-down/up animation
      burgerMobile.addEventListener('click', () => {
        if (!isOpen) {
          gsap.to(mobileMenu, {
            height: 'auto',
            duration: 0.5,
            ease: 'power2.out'
          });
        } else {
          gsap.to(mobileMenu, {
            height: 0,
            duration: 0.3,
            ease: 'power2.in'
          });
        }
        isOpen = !isOpen;
      });

      // Auto-close when any link is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          gsap.to(mobileMenu, {
            height: 0,
            duration: 0.3,
            ease: 'power2.in'
          });
          isOpen = false;
        });
      });
    }, 500);
  });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const burger    = document.querySelector('.nav-burger-icon-black');
      const mobileNav = document.querySelector('.nav-menu-mobile');
      let   open      = false;

      if (!burger || !mobileNav) {
        console.warn('Mobile nav elements not found');
        return;
      }

      // ensure menu starts closed
      mobileNav.style.display = 'none';
      mobileNav.style.top     = '-100%';

      burger.addEventListener('click', () => {
        if (!open) {
          // slide down
          mobileNav.style.display = 'flex';
          gsap.fromTo(mobileNav,
            { top: '-100%' },
            { top: '0%', duration: 0.5, ease: 'power2.out' }
          );
        } else {
          // slide up
          gsap.to(mobileNav, {
            top: '-100%',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              mobileNav.style.display = 'none';
            }
          });
        }
        open = !open;
      });

      // auto-close when any link is clicked
      mobileNav.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
          gsap.to(mobileNav, {
            top: '-100%',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              mobileNav.style.display = 'none';
            }
          });
          open = false;
        })
      );
    }, 500);
  });

<!-- DEVICE-AWARE NAVIGATION SYSTEM -->
    
console.log('🎯 Device-Aware Navigation: Starting...');

document.addEventListener('DOMContentLoaded', () => {
    const isDesktop = window.innerWidth >= 768;
    const isMobile = window.innerWidth < 768;
    
    console.log(`📱 Device detected: ${isDesktop ? 'Desktop' : 'Mobile'}`);
    
    if (isDesktop) {
        // DESKTOP ONLY: Navigation click handlers
        setTimeout(() => {
            setupDesktopNavigation();
        }, 1000);
    }
    
    if (isMobile) {
        // MOBILE ONLY: Mobile menu functionality  
        setTimeout(() => {
            setupMobileMenu();
        }, 1000);
    }
});

// DESKTOP NAVIGATION - Only runs on desktop
function setupDesktopNavigation() {
    console.log('🖥️ Setting up desktop navigation...');
    
    // Add your desktop navigation code here
    // This is where you put the code that handles clicking section headers
    // to navigate to different slides on desktop
    
    // Example structure:
    // const sectionHeaders = document.querySelectorAll('.section-header, .nav-link');
    // sectionHeaders.forEach(header => {
    //     header.addEventListener('click', function(e) {
    //         // Your desktop navigation logic here
    //     });
    // });
    
    console.log('✅ Desktop navigation ready');
}

// MOBILE MENU - Only runs on mobile
function setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');
    
    const burger = document.querySelector('.nav-burger-icon-black');
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    
    if (!burger || !mobileMenu) {
        console.error('❌ Mobile menu elements not found');
        return;
    }

    console.log('✅ Mobile menu elements found');

    let isMenuOpen = false;

    // Mobile burger click handler
    burger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('📱 Mobile burger clicked');
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.add('active');
            burger.classList.add('menu-open');
            document.body.classList.add('menu-open');
            console.log('📱 Menu opened');
        } else {
            mobileMenu.classList.remove('active');
            burger.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
            console.log('📱 Menu closed');
        }
    });

    // Mobile menu navigation
    const menuItems = [
        { selector: '.the-lbstr-menu-mob', target: 'the-beginning', name: 'The LBSTR' },
        { selector: '.strategy-menu-mob', target: 'strategy', name: 'Strategy' },
        { selector: '.story-menu-mob', target: 'storytelling', name: 'Storytelling' },
        { selector: '.services-menu-mob', target: 'services', name: 'Services' },
        { selector: '.contact-menu-mob', target: 'contact', name: 'Contact' }
    ];

    menuItems.forEach(({ selector, target, name }) => {
        const menuItem = mobileMenu.querySelector(selector);
        if (menuItem) {
            // Get all clickable elements within this menu item
            const clickables = [
                ...menuItem.querySelectorAll('a'),
                ...menuItem.querySelectorAll('[class*="link-block"]'),
                menuItem // Include the container itself
            ];
            
            clickables.forEach((clickable, index) => {
                clickable.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log(`📱 ${name} menu item clicked (element ${index})`);
                    
                    // Close menu
                    mobileMenu.classList.remove('active');
                    burger.classList.remove('menu-open');
                    document.body.classList.remove('menu-open');
                    isMenuOpen = false;
                    console.log('📱 Menu closed');
                    
                    // Navigate
                    setTimeout(() => {
                        const section = document.getElementById(target);
                        if (section) {
                            section.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                            history.pushState(null, '', '#' + target);
                            console.log(`✅ Navigated to ${name}`);
                        } else {
                            console.error(`❌ Section not found: ${target}`);
                        }
                    }, 200);
                });
            });
            
            console.log(`✅ ${name} mobile menu item setup (${clickables.length} clickables)`);
        } else {
            console.warn(`⚠️ Menu item not found: ${selector}`);
        }
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !burger.contains(e.target)) {
            mobileMenu.classList.remove('active');
            burger.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
            isMenuOpen = false;
            console.log('📱 Menu closed by outside click');
        }
    });

    // Close menu on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            mobileMenu.classList.remove('active');
            burger.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
            isMenuOpen = false;
            console.log('📱 Menu closed by escape key');
        }
    });

    console.log('✅ Mobile menu setup complete');
}

// Handle window resize - switch navigation systems if needed
window.addEventListener('resize', function() {
    const wasDesktop = window.innerWidth >= 768;
    
    // You can add logic here to handle device switching if needed
    console.log(`📱 Window resized - now: ${wasDesktop ? 'Desktop' : 'Mobile'}`);
});

// ==========================================
// COMPLETE MOBILE/DESKTOP ISOLATION FIX
// This stops desktop scripts from interfering with mobile
// ==========================================

if (window.innerWidth < 768) {
  console.log('📱 Applying complete mobile isolation...');
  
  // =================================
  // DISABLE DESKTOP NAVIGATION COMPLETELY
  // =================================
  
  // Disable lbstrSimpleNavigation on mobile
  if (window.lbstrSimpleNavigation) {
    window.lbstrSimpleNavigation = null;
    console.log('🚫 Disabled lbstrSimpleNavigation on mobile');
  }
  
  // Prevent desktop navigation from loading
  Object.defineProperty(window, 'lbstrSimpleNavigation', {
    value: null,
    writable: false,
    configurable: false
  });
  
  // Disable GSAP ScrollTrigger completely
  if (window.ScrollTrigger) {
    ScrollTrigger.killAll();
    ScrollTrigger.disable();
    console.log('🚫 Killed and disabled ScrollTrigger on mobile');
  }
  
  // Prevent ScrollTrigger from reactivating
  Object.defineProperty(window, 'ScrollTrigger', {
    get: () => ({ 
      killAll: () => {}, 
      disable: () => {}, 
      refresh: () => {} 
    }),
    configurable: false
  });
  
  // =================================
  // CLEAN MOBILE PROGRESS BAR
  // =================================
  
  setTimeout(() => {
    const progressFill = document.querySelector('.nav-progress-fill');
    if (progressFill) {
      console.log('📊 Setting up clean mobile progress bar...');
      
      // Clear any existing progress handlers
      const newProgressFill = progressFill.cloneNode(true);
      progressFill.parentNode.replaceChild(newProgressFill, progressFill);
      
      function updateProgress() {
        const scrollTop = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? scrollTop / totalHeight : 0;
        
        newProgressFill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
        newProgressFill.style.height = '4px';
        newProgressFill.style.display = 'block';
        newProgressFill.style.backgroundColor = '#32b550';
      }
      
      // Force scroll event listener
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('touchmove', updateProgress, { passive: true });
      
      updateProgress(); // Initial update
      console.log('✅ Clean progress bar setup complete');
    }
  }, 1000);
  
  // =================================
  // CLEAN MOBILE BURGER
  // =================================
  setTimeout(() => {
    const burger = document.querySelector('.nav-burger-icon-black');
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    
    if (burger && mobileMenu) {
      console.log('🍔 Setting up clean mobile burger...');
      
      // Remove ALL existing click handlers by cloning
      const newBurger = burger.cloneNode(true);
      burger.parentNode.replaceChild(newBurger, burger);
      
      let isOpen = false;
      
      // Single, clean click handler
      newBurger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        console.log('🍔 Clean burger click, toggling to:', !isOpen);
        
        isOpen = !isOpen;
        
        if (isOpen) {
          newBurger.classList.add('menu-open');
          mobileMenu.classList.add('active');
          document.body.classList.add('menu-open');
          mobileMenu.style.display = 'flex';
        } else {
          newBurger.classList.remove('menu-open');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenu.style.display = 'none';
        }
      });
      
      console.log('✅ Clean burger setup complete');
    }
  }, 1500);
  
  // =================================
  // PREVENT DESKTOP SCRIPT INTERFERENCE
  // =================================
  
  // Override any desktop navigation functions
  const noOp = () => {};
  
  if (window.gsap) {
    window.gsap.to = (target, vars) => {
      // Block any GSAP animations that might interfere with mobile
      if (typeof target === 'string' && target.includes('wrapper')) {
        console.log('🚫 Blocked GSAP wrapper animation on mobile');
        return;
      }
      return { kill: noOp };
    };
  }
  
  console.log('🛡️ Complete mobile isolation applied');
}

// ==========================================
// MOBILE FIXES V2 - Fix Progress Bar & Burger Conflicts
// Replace your existing mobile fixes with this
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Only run on mobile
  if (window.innerWidth < 768) {
    console.log('📱 Mobile detected - applying targeted Webflow navigation fix');
    
    function hideDesktopNavigation() {
      console.log('🎯 Targeting Webflow desktop navigation structure...');
      
      // Target the main desktop nav container
      const desktopNav = document.querySelector('.nav-menu-desktop');
      
      if (desktopNav) {
        console.log('✅ Found .nav-menu-desktop element');
        
        // Hide the entire desktop nav container
        desktopNav.style.setProperty('display', 'none', 'important');
        desktopNav.style.setProperty('visibility', 'hidden', 'important');
        desktopNav.style.setProperty('opacity', '0', 'important');
        desktopNav.style.setProperty('pointer-events', 'none', 'important');
        desktopNav.style.setProperty('position', 'absolute', 'important');
        desktopNav.style.setProperty('left', '-9999px', 'important');
        desktopNav.style.setProperty('top', '-9999px', 'important');
        desktopNav.style.setProperty('z-index', '-9999', 'important');
        desktopNav.style.setProperty('width', '0', 'important');
        desktopNav.style.setProperty('height', '0', 'important');
        desktopNav.style.setProperty('overflow', 'hidden', 'important');
        
        console.log('✅ Desktop nav container hidden with nuclear CSS');
        
        // Also target child elements individually as backup
        const childSelectors = [
          '.menu-container-left',
          '.menu-container-right', 
          '.social-handles'
        ];
        
        childSelectors.forEach(selector => {
          const elements = desktopNav.querySelectorAll(selector);
          elements.forEach(element => {
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('visibility', 'hidden', 'important');
            console.log(`✅ Hidden child element: ${selector}`);
          });
        });
        
        // Final verification
        const computedStyle = window.getComputedStyle(desktopNav);
        console.log('🔍 Final verification - Desktop nav display:', computedStyle.display);
        
        if (computedStyle.display === 'none') {
          console.log('🎉 SUCCESS: Desktop navigation fully hidden!');
        } else {
          console.log('⚠️ WARNING: Desktop nav still showing, trying DOM removal...');
          // Last resort - temporarily remove from DOM
          desktopNav.parentNode.removeChild(desktopNav);
          // Store reference to add back if needed
          window.hiddenDesktopNav = desktopNav;
        }
        
      } else {
        console.log('❌ .nav-menu-desktop not found');
      }
      
      // Ensure mobile nav elements are ready
      const mobileNav = document.querySelector('.nav-menu-mobile');
      if (mobileNav) {
        console.log('✅ Mobile nav found and ready');
      } else {
        console.log('⚠️ Mobile nav not found yet');
      }
    }
    
    // Apply fix immediately and with delays
    hideDesktopNavigation();
    setTimeout(hideDesktopNavigation, 100);
    setTimeout(hideDesktopNavigation, 500);
    setTimeout(hideDesktopNavigation, 1000);
    
    // Create observer to catch any attempts to show desktop nav
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          const target = mutation.target;
          
          // If desktop nav tries to reappear, hide it again
          if (target.classList && target.classList.contains('nav-menu-desktop')) {
            console.log('🚫 Desktop nav tried to reappear - hiding again');
            hideDesktopNavigation();
          }
        }
      });
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('🛡️ Desktop navigation protection active with DOM monitoring');
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
      // Switched to mobile - apply fix
      setTimeout(hideDesktopNavigation, 100);
    } else if (window.innerWidth >= 768 && window.hiddenDesktopNav) {
      // Switched to desktop - restore nav if it was removed
      if (window.hiddenDesktopNav && !document.contains(window.hiddenDesktopNav)) {
        document.body.appendChild(window.hiddenDesktopNav);
        window.hiddenDesktopNav = null;
      }
    }
  });
  
});

document.addEventListener('DOMContentLoaded', function() {
  
  // Only run fixes on mobile
  if (window.innerWidth < 768) {
    console.log('📱 Applying mobile navigation fixes...');
    
    // FIX 1: Remove inline styles that override Webflow design
    function cleanMobileMenuStyles() {
      const mobileMenu = document.querySelector('.nav-menu-mobile');
      if (mobileMenu) {
        // Remove problematic inline styles
        mobileMenu.style.removeProperty('display');
        mobileMenu.style.removeProperty('top');
        mobileMenu.style.removeProperty('height');
        mobileMenu.style.removeProperty('position');
        mobileMenu.style.removeProperty('background');
        
        console.log('✅ Cleaned mobile menu inline styles');
      }
    }
    
    // FIX 2: Prevent navigation conflicts by adding delay
    function fixNavigationTiming() {
      const mobileMenu = document.querySelector('.nav-menu-mobile');
      if (!mobileMenu) return;
      
      // Add single click handler that prevents conflicts
      mobileMenu.addEventListener('click', function(e) {
        const menuItem = e.target.closest('[class*="menu-mob"]');
        if (!menuItem) return;
        
        // Prevent multiple handlers from firing
        e.stopImmediatePropagation();
        
        console.log('📱 Menu item clicked:', menuItem.textContent);
        
        // Get the target section
        const menuText = menuItem.textContent.trim().toLowerCase();
        let targetSection = '';
        
        switch(menuText) {
          case 'the lbstr':
            targetSection = 'the-beginning';
            break;
          case 'strategy':
            targetSection = 'strategy';
            break;
          case 'storytelling':
            targetSection = 'storytelling';
            break;
          case 'services':
            targetSection = 'services';
            break;
          case 'contact':
            targetSection = 'contact';
            break;
        }
        
        if (targetSection) {
          // Close mobile menu first
          const burger = document.querySelector('.nav-burger-icon-black');
          const body = document.body;
          
          if (burger && burger.classList.contains('menu-open')) {
            burger.classList.remove('menu-open');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
          }
          
          // Wait for menu to close, then navigate
          setTimeout(() => {
            // Force scroll to target section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
              // Reset any GSAP scroll locks
              if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
              }
              
              // Force scroll with native scrollIntoView
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
              
              // Update URL hash
              history.pushState(null, '', '#' + targetSection);
              
              console.log('✅ Navigated to:', targetSection);
            }
          }, 300);
        }
      }, true); // Use capture phase to intercept before other handlers
    }
    
    // FIX 3: Ensure scroll is unlocked after navigation
    function ensureScrollUnlocked() {
      // Remove any scroll locks that might persist
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('height');
      document.documentElement.style.removeProperty('overflow');
      
      // Reset GSAP if it's interfering
      if (window.gsap) {
        gsap.set(document.body, { clearProps: "all" });
      }
    }
    
    // Apply fixes
    setTimeout(() => {
      cleanMobileMenuStyles();
      fixNavigationTiming();
    }, 1000);
    
    // Clean up after any navigation
    document.addEventListener('scroll', ensureScrollUnlocked);
    window.addEventListener('hashchange', ensureScrollUnlocked);
    
    console.log('🛡️ Mobile navigation fixes applied');
  }
});

// FIX 4: Override any GSAP scroll locking on mobile
if (window.innerWidth < 768) {
  // Disable ScrollTrigger on mobile completely
  if (window.ScrollTrigger) {
    ScrollTrigger.disable();
  }
  
  // Ensure GSAP doesn't lock scrolling
  if (window.gsap) {
    gsap.set(document.body, { clearProps: "overflow,position,height" });
  }
}

// ==========================================
// PROGRESS BAR FIX ONLY - Add this after your existing mobile fixes
// ==========================================

// Only fix progress bar on mobile
if (window.innerWidth < 768) {
  setTimeout(() => {
    const fill = document.querySelector('.nav-progress-fill');
    if (fill) {
      console.log('📊 Fixing mobile progress bar...');
      
      function updateMobileProgress() {
        const scrollTop = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollTop / totalHeight));
        
        // Mobile uses width, not height
        fill.style.width = `${progress * 100}%`;
        fill.style.height = '4px'; // Ensure visible height
      }
      
      // Update on scroll
      window.addEventListener('scroll', updateMobileProgress);
      updateMobileProgress(); // Initial update
      
      console.log('✅ Mobile progress bar fixed');
    }
  }, 1500);
}

// ==========================================
// BURGER CLICK FIX ONLY - Add this after your existing mobile fixes
// ==========================================

// Only fix burger timing on mobile
if (window.innerWidth < 768) {
  setTimeout(() => {
    const burger = document.querySelector('.nav-burger-icon-black');
    if (burger) {
      console.log('🍔 Adding burger reliability fix...');
      
      // Add a priority click handler that fires first
      burger.addEventListener('click', function(e) {
        // Small delay to ensure all systems are ready
        setTimeout(() => {
          console.log('🍔 Burger click processed');
        }, 50);
      }, true); // Capture phase - fires before other handlers
      
      console.log('✅ Burger reliability improved');
    }
  }, 1500);
}

// ==========================================
// EXACT FIXES - Based on diagnostic results
// Add these AFTER your existing mobile fixes
// ==========================================

// Only run on mobile and after other scripts load
if (window.innerWidth < 768) {
  setTimeout(() => {
    
    // =================================
    // FIX 1: PROGRESS BAR - Add missing scroll handler
    // =================================
    const progressFill = document.querySelector('.nav-progress-fill');
    if (progressFill) {
      console.log('📊 Adding mobile progress bar scroll handler...');
      
      function updateMobileProgressBar() {
        const scrollTop = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollTop / totalHeight)) : 0;
        
        // Use width for mobile (like the diagnostic showed works)
        progressFill.style.width = `${progress * 100}%`;
        progressFill.style.height = '4px';
        progressFill.style.backgroundColor = ''; // Remove diagnostic red
      }
      
      // Add scroll listener for mobile
      window.addEventListener('scroll', updateMobileProgressBar, { passive: true });
      
      // Update immediately
      updateMobileProgressBar();
      
      console.log('✅ Mobile progress bar scroll handler added');
    }
    
    // =================================
    // FIX 2: BURGER RELIABILITY - Reduce click conflicts
    // =================================
    const burger = document.querySelector('.nav-burger-icon-black');
    if (burger) {
      console.log('🍔 Adding burger reliability fix...');
      
      // Add a high-priority click handler that ensures menu toggle works
      burger.addEventListener('click', function(e) {
        console.log('🍔 Priority burger handler triggered');
        
        // Small delay to let other handlers process first
        setTimeout(() => {
          const mobileMenu = document.querySelector('.nav-menu-mobile');
          const isMenuCurrentlyOpen = burger.classList.contains('menu-open');
          
          console.log('🍔 Menu state check - currently open:', isMenuCurrentlyOpen);
          
          // If burger state doesn't match menu state, force correction
          if (mobileMenu) {
            const menuIsVisible = window.getComputedStyle(mobileMenu).display !== 'none';
            
            if (isMenuCurrentlyOpen !== menuIsVisible) {
              console.log('🍔 State mismatch detected, correcting...');
              
              if (isMenuCurrentlyOpen && !menuIsVisible) {
                // Burger says open but menu is hidden - show menu
                mobileMenu.classList.add('active');
                document.body.classList.add('menu-open');
              } else if (!isMenuCurrentlyOpen && menuIsVisible) {
                // Menu is visible but burger says closed - hide menu
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
              }
            }
          }
        }, 100);
        
      }, true); // Capture phase - runs first
      
      console.log('✅ Burger reliability fix added');
    }
    
    console.log('🎯 Targeted fixes applied successfully');
    
  }, 2000); // Wait for all other scripts to load
}

// ==========================================
// POST-GITHUB SCRIPTS ISOLATION
// This runs AFTER your GitHub scripts.js loads and disables desktop functionality
// ==========================================

// Wait for GitHub scripts to fully load, then override them
setTimeout(() => {
  if (window.innerWidth < 768) {
    console.log('📱 POST-GITHUB ISOLATION: Disabling desktop scripts...');
    
    // =================================
    // DISABLE GITHUB SCRIPTS ON MOBILE
    // =================================
    
    // Kill ScrollTrigger after it loads
    if (window.ScrollTrigger) {
      ScrollTrigger.killAll();
      ScrollTrigger.disable();
      console.log('🚫 Killed ScrollTrigger after GitHub scripts loaded');
    }
    
    // Disable lbstrSimpleNavigation after it loads
    if (window.lbstrSimpleNavigation) {
      window.lbstrSimpleNavigation = null;
      console.log('🚫 Disabled lbstrSimpleNavigation after GitHub scripts loaded');
    }
    
    // Override GSAP to prevent animations
    if (window.gsap) {
      const originalTo = gsap.to;
      gsap.to = function(target, vars) {
        // Block wrapper animations on mobile
        if (typeof target === 'string' && target.includes('.wrapper')) {
          console.log('🚫 Blocked GSAP wrapper animation');
          return { kill: () => {} };
        }
        if (target && target.classList && target.classList.contains('wrapper')) {
          console.log('🚫 Blocked GSAP wrapper element animation');
          return { kill: () => {} };
        }
        return originalTo.call(this, target, vars);
      };
      console.log('🚫 GSAP wrapper animations blocked');
    }
    
    // =================================
    // FORCE ENABLE SCROLL EVENTS
    // =================================
    
    // Reset any scroll prevention
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Force scroll events to fire
    const progressFill = document.querySelector('.nav-progress-fill');
    if (progressFill) {
      console.log('📊 Force-enabling scroll events for progress bar...');
      
      let lastScrollTop = -1;
      
      function forceUpdateProgress() {
        const scrollTop = window.scrollY;
        if (scrollTop !== lastScrollTop) {
          lastScrollTop = scrollTop;
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? scrollTop / totalHeight : 0;
          
          progressFill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
          progressFill.style.height = '4px';
          progressFill.style.backgroundColor = '#32b550';
        }
        requestAnimationFrame(forceUpdateProgress);
      }
      
      forceUpdateProgress();
      console.log('✅ Progress bar force-update loop started');
    }
    
    // =================================
    // CLEAN BURGER MENU
    // =================================
    
    const burger = document.querySelector('.nav-burger-icon-black');
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    
    if (burger && mobileMenu) {
      console.log('🍔 Force-cleaning burger menu...');
      
      // Replace burger completely to remove all handlers
      const newBurger = burger.cloneNode(true);
      burger.parentNode.replaceChild(newBurger, burger);
      
      let isMenuOpen = false;
      
      newBurger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        isMenuOpen = !isMenuOpen;
        console.log('🍔 Clean burger click - toggling to:', isMenuOpen);
        
        if (isMenuOpen) {
          newBurger.classList.add('menu-open');
          mobileMenu.classList.add('active');
          document.body.classList.add('menu-open');
        } else {
          newBurger.classList.remove('menu-open');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      });
      
      console.log('✅ Burger menu force-cleaned');
    }
    
    console.log('🎉 POST-GITHUB ISOLATION COMPLETE');
  }
}, 3000); // Wait 3 seconds for GitHub scripts to load

// ==========================================
// TARGETED MOBILE ADDITION - Add to your existing fixes
// This complements what you already have
// ==========================================

// Only run on mobile and after all your existing fixes
if (window.innerWidth < 768) {
  
  // Wait for your existing fixes to complete (4 seconds)
  setTimeout(() => {
    console.log('🎯 TARGETED ADDITION: Running final mobile optimizations...');
    
    // =================================
    // FINAL SCROLL UNLOCK (if still locked)
    // =================================
    function emergencyScrollUnlock() {
      // More aggressive scroll unlocking than your current approach
      const elementsToUnlock = [
        document.documentElement,
        document.body,
        document.querySelector('.scroll-container'),
        document.querySelector('.wrapper'),
        document.querySelector('main'),
        document.querySelector('.main-wrapper')
      ];
      
      elementsToUnlock.forEach(element => {
        if (element) {
          element.style.setProperty('overflow', 'visible', 'important');
          element.style.setProperty('overflow-y', 'auto', 'important');
          element.style.setProperty('height', 'auto', 'important');
          element.style.setProperty('position', 'static', 'important');
          element.style.removeProperty('transform');
          element.style.removeProperty('will-change');
        }
      });
      
      console.log('🔓 Emergency scroll unlock applied');
    }
    
    // =================================
    // PROGRESS BAR FINAL FIX (if still not working)
    // =================================
    function finalProgressBarFix() {
      const progressFill = document.querySelector('.nav-progress-fill');
      if (!progressFill) {
        console.log('❌ No progress bar found');
        return;
      }
      
      // Remove any conflicting styles first
      progressFill.style.removeProperty('width');
      progressFill.style.removeProperty('height');
      
      // Force visible styling
      progressFill.style.setProperty('position', 'fixed', 'important');
      progressFill.style.setProperty('top', '0', 'important');
      progressFill.style.setProperty('left', '0', 'important');
      progressFill.style.setProperty('z-index', '9999', 'important');
      progressFill.style.setProperty('height', '4px', 'important');
      progressFill.style.setProperty('background', '#32b550', 'important');
      progressFill.style.setProperty('transition', 'width 0.1s ease', 'important');
      
      let isUpdating = false;
      
      function updateProgress() {
        if (isUpdating) return;
        isUpdating = true;
        
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          const scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          );
          const clientHeight = window.innerHeight || document.documentElement.clientHeight;
          
          const totalScrollable = scrollHeight - clientHeight;
          const progress = totalScrollable > 0 ? Math.min(1, Math.max(0, scrollTop / totalScrollable)) : 0;
          
          progressFill.style.setProperty('width', `${progress * 100}%`, 'important');
          
          isUpdating = false;
        });
      }
      
      // Multiple event listeners for maximum compatibility
      window.addEventListener('scroll', updateProgress, { passive: true });
      document.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
      
      // Initial update
      updateProgress();
      
      console.log('✅ Final progress bar fix applied');
    }
    
    // =================================
    // BURGER MENU FINAL STATE CHECK
    // =================================
    function finalBurgerCheck() {
      const burger = document.querySelector('.nav-burger-icon-black');
      const mobileMenu = document.querySelector('.nav-menu-mobile');
      
      if (!burger || !mobileMenu) {
        console.log('❌ Burger or mobile menu not found');
        return;
      }
      
      // Add a state verification that runs every 2 seconds
      setInterval(() => {
        const burgerIsOpen = burger.classList.contains('menu-open');
        const menuIsVisible = window.getComputedStyle(mobileMenu).display !== 'none';
        const bodyHasMenuClass = document.body.classList.contains('menu-open');
        
        // Check for mismatched states
        if (burgerIsOpen !== menuIsVisible || burgerIsOpen !== bodyHasMenuClass) {
          console.log('🔧 Fixing burger state mismatch');
          
          // Force consistent state (closed by default)
          burger.classList.remove('menu-open');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenu.style.display = 'none';
        }
      }, 2000);
      
      console.log('✅ Burger state monitoring active');
    }
    
    // =================================
    // FORCE LAYOUT RECALCULATION
    // =================================
    function forceLayoutRecalc() {
      // Force browser to recalculate layout
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      
      // Trigger resize event to refresh everything
      window.dispatchEvent(new Event('resize'));
      
      console.log('🔄 Layout recalculation forced');
    }
    
    // =================================
    // RUN ALL FINAL FIXES
    // =================================
    emergencyScrollUnlock();
    
    setTimeout(() => {
      finalProgressBarFix();
    }, 200);
    
    setTimeout(() => {
      finalBurgerCheck();
    }, 400);
    
    setTimeout(() => {
      forceLayoutRecalc();
    }, 600);
    
    console.log('🎉 TARGETED ADDITION COMPLETE - All final optimizations applied');
    
  }, 4000); // Wait 4 seconds for your existing fixes
  
} else {
  console.log('💻 Desktop detected - skipping targeted mobile additions');
}

// =================================
// CONTINUOUS MONITORING (Lightweight)
// =================================
if (window.innerWidth < 768) {
  // Very lightweight monitoring that doesn't conflict with your existing code
  setInterval(() => {
    // Just ensure scroll is never locked
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
      console.log('🔓 Scroll auto-unlocked');
    }
    
    // Ensure progress bar is visible
    const progressFill = document.querySelector('.nav-progress-fill');
    if (progressFill && progressFill.style.display === 'none') {
      progressFill.style.display = 'block';
      console.log('📊 Progress bar auto-restored');
    }
  }, 5000); // Check every 5 seconds
}

// ===============================================
// PERMANENT PROGRESS BAR POSITIONING FIX
// Add this to your GitHub scripts.js (replace previous progress bar fixes)
// ===============================================

// Only run on mobile
if (window.innerWidth < 768) {
    console.log('📊 Permanent Progress Bar Fix: Starting...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('📊 Applying permanent progress bar positioning...');
            
            const progressBar = document.querySelector('.nav-progress-fill');
            const navBar = document.querySelector('.nav-bar') || document.querySelector('#nav-bar');
            
            if (!progressBar || !navBar) {
                console.log('❌ Missing elements - Progress:', !!progressBar, 'Nav:', !!navBar);
                return;
            }
            
            console.log('✅ Found both progress bar and nav bar');
            
            // =================================
            // POSITION PROGRESS BAR BELOW NAV
            // =================================
            
            function positionProgressBar() {
                const navRect = navBar.getBoundingClientRect();
                const navHeight = navRect.height || 60;
                const navBottom = navRect.bottom;
                
                // Position progress bar just below nav bar
                progressBar.style.setProperty('position', 'fixed', 'important');
                progressBar.style.setProperty('top', navBottom + 'px', 'important');
                progressBar.style.setProperty('left', '0', 'important');
                progressBar.style.setProperty('right', '0', 'important');
                progressBar.style.setProperty('width', '100%', 'important');
                progressBar.style.setProperty('height', '4px', 'important');
                progressBar.style.setProperty('z-index', '9999', 'important');
                progressBar.style.setProperty('display', 'block', 'important');
                progressBar.style.setProperty('visibility', 'visible', 'important');
                progressBar.style.setProperty('opacity', '1', 'important');
                
                console.log(`📊 Progress bar positioned at ${navBottom}px (below ${navHeight}px nav)`);
            }
            
            // =================================
            // PROGRESS BAR COLOR & WIDTH UPDATE
            // =================================
            
            function updateProgressBar() {
                // Update position first
                positionProgressBar();
                
                // Calculate scroll progress
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
                const scrollHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                );
                const clientHeight = window.innerHeight || document.documentElement.clientHeight;
                
                const totalScrollable = scrollHeight - clientHeight;
                const progress = totalScrollable > 0 ? Math.min(1, Math.max(0, scrollTop / totalScrollable)) : 0;
                
                // Update width
                progressBar.style.setProperty('width', `${progress * 100}%`, 'important');
                
                // Update color based on nav theme
                if (navBar.classList.contains('nav-green')) {
                    progressBar.style.setProperty('background', 'white', 'important');
                } else if (navBar.classList.contains('nav-black')) {
                    progressBar.style.setProperty('background', '#32b550', 'important');
                } else if (navBar.classList.contains('nav-white')) {
                    progressBar.style.setProperty('background', '#32b550', 'important');
                } else {
                    progressBar.style.setProperty('background', '#32b550', 'important'); // Default
                }
            }
            
            // =================================
            // EVENT LISTENERS
            // =================================
            
            // Initial positioning and setup
            positionProgressBar();
            updateProgressBar();
            
            // Update on scroll
            window.addEventListener('scroll', updateProgressBar, { passive: true });
            document.addEventListener('scroll', updateProgressBar, { passive: true });
            window.addEventListener('touchmove', updateProgressBar, { passive: true });
            
            // Update on resize (nav height might change)
            window.addEventListener('resize', () => {
                setTimeout(positionProgressBar, 100);
            }, { passive: true });
            
            // Monitor nav bar for theme changes
            const navObserver = new MutationObserver(() => {
                updateProgressBar();
            });
            
            navObserver.observe(navBar, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            // =================================
            // CONTINUOUS MONITORING
            // =================================
            
            // Ensure progress bar stays positioned correctly
            setInterval(() => {
                const currentTop = progressBar.style.top;
                const expectedTop = navBar.getBoundingClientRect().bottom + 'px';
                
                if (currentTop !== expectedTop) {
                    console.log('🔧 Repositioning progress bar...');
                    positionProgressBar();
                }
            }, 3000);
            
            console.log('🎉 Permanent progress bar positioning complete!');
            
        }, 1000); // Wait for page to settle
    });
}

// ===============================================
// NAV BAR RESTORE FIX - Mobile Only
// Add this to your GitHub scripts.js (after the progress bar fix)
// ===============================================

// Only run on mobile
if (window.innerWidth < 768) {
    console.log('🧭 Nav Bar Restore Fix: Starting...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('🧭 Restoring mobile nav bar...');
            
            // Find all possible nav bar elements
            const navSelectors = [
                '.nav-bar',
                '#nav-bar',
                '.navbar',
                '.w-nav',
                'nav',
                '[class*="nav-bar"]'
            ];
            
            let navBar = null;
            
            // Try each selector until we find the nav
            for (const selector of navSelectors) {
                navBar = document.querySelector(selector);
                if (navBar) {
                    console.log(`✅ Found nav bar: ${selector}`);
                    break;
                }
            }
            
            if (!navBar) {
                console.log('❌ Nav bar not found with any selector');
                return;
            }
            
            // =================================
            // FORCE NAV BAR VISIBILITY
            // =================================
            
            // Ensure nav bar is visible and properly positioned
            navBar.style.setProperty('display', 'flex', 'important');
            navBar.style.setProperty('visibility', 'visible', 'important');
            navBar.style.setProperty('opacity', '1', 'important');
            navBar.style.setProperty('position', 'fixed', 'important');
            navBar.style.setProperty('top', '0', 'important');
            navBar.style.setProperty('left', '0', 'important');
            navBar.style.setProperty('right', '0', 'important');
            navBar.style.setProperty('width', '100%', 'important');
            navBar.style.setProperty('z-index', '10000', 'important'); // Higher than progress bar
            navBar.style.setProperty('pointer-events', 'auto', 'important');
            
            // Ensure nav has proper height
            const currentHeight = navBar.offsetHeight;
            if (currentHeight < 50) {
                navBar.style.setProperty('height', '60px', 'important');
                navBar.style.setProperty('min-height', '60px', 'important');
            }
            
            console.log(`✅ Nav bar restored - height: ${navBar.offsetHeight}px`);
            
            // =================================
            // ADJUST PROGRESS BAR Z-INDEX
            // =================================
            
            const progressFill = document.querySelector('.nav-progress-fill');
            if (progressFill) {
                // Make sure progress bar is below nav bar
                progressFill.style.setProperty('z-index', '9999', 'important'); // Lower than nav
                console.log('✅ Progress bar z-index adjusted to be below nav');
            }
            
            // =================================
            // ENSURE NAV CONTENT IS VISIBLE
            // =================================
            
            // Make sure all nav content is visible
            const navChildren = navBar.querySelectorAll('*');
            navChildren.forEach((child, index) => {
                if (child.style.display === 'none' || 
                    child.style.visibility === 'hidden' || 
                    child.style.opacity === '0') {
                    
                    child.style.setProperty('display', '', 'important');
                    child.style.setProperty('visibility', 'visible', 'important');
                    child.style.setProperty('opacity', '1', 'important');
                }
            });
            
            console.log(`✅ Made ${navChildren.length} nav children visible`);
            
            // =================================
            // CONTINUOUS NAV BAR MONITORING
            // =================================
            
            // Check every 2 seconds that nav bar stays visible
            setInterval(() => {
                const navDisplay = window.getComputedStyle(navBar).display;
                const navVisibility = window.getComputedStyle(navBar).visibility;
                const navOpacity = window.getComputedStyle(navBar).opacity;
                
                if (navDisplay === 'none' || navVisibility === 'hidden' || navOpacity === '0') {
                    console.log('🔧 Nav bar hidden, restoring...');
                    
                    navBar.style.setProperty('display', 'flex', 'important');
                    navBar.style.setProperty('visibility', 'visible', 'important');
                    navBar.style.setProperty('opacity', '1', 'important');
                    navBar.style.setProperty('z-index', '10000', 'important');
                }
            }, 2000);
            
            // =================================
            // TEST NAV BAR ELEMENTS
            // =================================
            
            // Check for specific nav elements
            const logo = navBar.querySelector('.nav-lbstr-logo, [class*="logo"]');
            const burger = navBar.querySelector('.nav-burger-icon-black, [class*="burger"]');
            
            console.log('🔍 Nav elements check:');
            console.log(`  Logo found: ${!!logo}`);
            console.log(`  Burger found: ${!!burger}`);
            
            if (logo) {
                logo.style.setProperty('display', 'block', 'important');
                logo.style.setProperty('visibility', 'visible', 'important');
            }
            
            if (burger) {
                burger.style.setProperty('display', 'flex', 'important');
                burger.style.setProperty('visibility', 'visible', 'important');
                burger.style.setProperty('pointer-events', 'auto', 'important');
            }
            
            console.log('🎉 Nav bar restore complete!');
            
        }, 1200); // Run after progress bar fix
    });
}
