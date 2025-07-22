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
    this.title = "Ekta Bio";
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
  if (e.key === 'Escape' && this.modalOverlay.classList.contains('show')) {
    this.closeModal();
  }
});

    console.log('✅ Slide 18 modal created');
  }

  openModal(title, content) {
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = content;
    this.modalOverlay.style.display = 'flex';
    
    // Change this line - use 'show' instead of 'modal-active'
    setTimeout(() => {
        this.modalOverlay.classList.add('show');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

closeModal() {
    // Change this line - use 'show' instead of 'modal-active'
    this.modalOverlay.classList.remove('show');
    
    setTimeout(() => {
        this.modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
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

        // Enhanced initialization with multiple attempts for solve4
        this.services.forEach((service, index) => {
            // Staggered delays to ensure all elements are available
            const delay = index * 150; // 150ms between each service
            
            setTimeout(() => {
                this.initializeService(service);
            }, delay);
        });

        // Special handling for solve4 - try again after 2 seconds if not found
        setTimeout(() => {
            if (!this.serviceElements.has('solve4')) {
                console.log('🔄 solve4 not found in first pass, retrying...');
                const solve4Service = this.services.find(s => s.triggerClass === 'solve4');
                if (solve4Service) {
                    this.initializeService(solve4Service, true); // Force attempt
                }
            }
        }, 2000);
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

        const trigger = serviceData.trigger;
        const currentText = trigger.textContent;
        const newText = currentText.replace('[+]', '[-]');
        trigger.textContent = newText;

        trigger.classList.add('service-active');
        trigger.setAttribute('data-service-active', 'true');

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
            
            // Re-initialize after restoring content
            this.serviceElements.clear();
            this.init();

            requestAnimationFrame(() => {
                this.servicesContent.style.opacity = '1';
            });
        }, 300);

        this.activeService = null;
        console.log('🖥️ Desktop: Closed service');
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
