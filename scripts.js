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
  if (window.innerWidth < 992) {
    // ✅ MOBILE: use document.body since .scroll-container isn't producing scroll delta
    requestAnimationFrame(() => {
      window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(1, scrollTop / totalHeight) : 0;

        fill.style.removeProperty("width");
        fill.style.setProperty("width", `${progress * 100}%`, "important");
        console.log(`Scroll: ${Math.round(progress * 100)}% | Bar: ${fill.style.width}`);  
      });
    });
  } else {
    // DESKTOP: scroll happens on window
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(1, scrollTop / totalHeight);
      fill.style.removeProperty("height");
      fill.style.setProperty("height", `${progress * 100}%`, "important");
    });
  }
  // Reset on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth < 992) {
      fill.style.removeProperty("height");
      fill.style.setProperty("height", "0%", "important");
    } else {
      fill.style.removeProperty("width");
      fill.style.setProperty("width", "0%", "important");
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
            <button class="mobile-modal-close">×</button>
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
    if (window.innerWidth >= 992) return; // desktop: keep existing layout
    this.triggers = [
      { triggerClass: "bio-expand-trigger-4",    contentClass: "rh-bio-description", title: "Bio" },
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
  if (window.innerWidth < 992) new Slide14ModalSystem();
});

// === SLIDE 18 MODAL SYSTEM ===
class Slide18ModalSystem {
  constructor() {
    if (window.innerWidth >= 992) return; // mobile only
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
  if (window.innerWidth < 992) {
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
        trigger.style.fontWeight = 'normal';

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

// ==========================================
// CLEAN MOBILE NAVIGATION SYSTEM
// Replaces lines 1448-3089 with simple, reliable mobile menu
// ==========================================

(function() {
    'use strict';
    
    // Only run on mobile - leave desktop completely alone
    if (window.innerWidth >= 992) {
        console.log('💻 Desktop detected - skipping mobile navigation');
        return;
    }
    
    console.log('📱 Mobile detected - initializing clean navigation');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
    
    function initMobileNavigation() {
        console.log('🚀 Starting mobile navigation setup...');
        
        // Find elements
        const burger = document.querySelector('.nav-burger-icon-black');
        const mobileMenu = document.querySelector('.nav-menu-mobile');
        
        if (!burger || !mobileMenu) {
            console.error('❌ Mobile menu elements not found');
            return;
        }
        
        console.log('✅ Found burger and mobile menu elements');
        
        // Simple state tracking
        let isMenuOpen = false;
        
        // Clean initial state
        mobileMenu.classList.remove('active');
        burger.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        
        // Ensure menu starts hidden
        mobileMenu.style.display = 'none';
        
        console.log('🧹 Initial state cleaned');
        
        // Burger click handler
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isMenuOpen = !isMenuOpen;
            console.log(`🍔 Burger clicked - ${isMenuOpen ? 'Opening' : 'Closing'} menu`);
            
            if (isMenuOpen) {
                openMenu();
            } else {
                closeMenu();
            }
        });
        
        // Menu navigation setup
        setupMenuNavigation();
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                console.log('⌨️ Escape pressed - closing menu');
                closeMenu();
            }
        });
        
        console.log('✅ Mobile navigation initialized successfully');
        
        // Functions
        function openMenu() {
            console.log('📱 Opening mobile menu...');
            
            // Update states
            isMenuOpen = true;
            burger.classList.add('menu-open');
            mobileMenu.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Show menu with your existing Webflow styling
            mobileMenu.style.display = 'flex';
            
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            
            console.log('✅ Menu opened');
        }
        
        function closeMenu() {
            console.log('📱 Closing mobile menu...');
            
            // Update states
            isMenuOpen = false;
            burger.classList.remove('menu-open');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Hide menu
            mobileMenu.style.display = 'none';
            
            // Unlock body scroll
            document.body.style.overflow = '';
            
            console.log('✅ Menu closed');
        }
        
        function setupMenuNavigation() {
            console.log('🔗 Setting up menu navigation...');
            
            // Define navigation mapping
            const navigationMap = [
                { selector: '.the-lbstr-menu-mob', target: 'the-beginning', name: 'The LBSTR' },
                { selector: '.strategy-menu-mob', target: 'strategy', name: 'Strategy' },
                { selector: '.story-menu-mob', target: 'storytelling', name: 'Storytelling' },
                { selector: '.services-menu-mob', target: 'services', name: 'Services' },
                { selector: '.contact-menu-mob', target: 'contact', name: 'Contact' }
            ];
            
            navigationMap.forEach(({ selector, target, name }) => {
                const menuItem = mobileMenu.querySelector(selector);
                if (!menuItem) {
                    console.warn(`⚠️ Menu item not found: ${selector}`);
                    return;
                }
                
                // Find all clickable elements within this menu item
                const clickableElements = [
                    menuItem,
                    ...menuItem.querySelectorAll('a'),
                    ...menuItem.querySelectorAll('[class*="link"]')
                ];
                
                clickableElements.forEach(element => {
                    element.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`🎯 ${name} clicked - navigating to #${target}`);
                        
                        // Close menu first
                        closeMenu();
                        
                        // Navigate after short delay
                        setTimeout(() => {
                            navigateToSection(target, name);
                        }, 300);
                    });
                });
                
                console.log(`✅ ${name} navigation setup complete`);
            });
        }
        
        function navigateToSection(sectionId, sectionName) {
            console.log(`🧭 Navigating to: ${sectionName} (#${sectionId})`);
            
            const targetElement = document.getElementById(sectionId);
            if (!targetElement) {
                console.error(`❌ Section not found: #${sectionId}`);
                return;
            }
            
            // Smooth scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL hash
            history.pushState(null, '', '#' + sectionId);
            
            console.log(`✅ Successfully navigated to: ${sectionName}`);
        }
    }
    
    // Handle window resize - reinitialize if switching to mobile
    let wasDesktop = window.innerWidth >= 768;
    
    window.addEventListener('resize', function() {
        const isDesktop = window.innerWidth >= 768;
        
        if (wasDesktop && !isDesktop) {
            // Switched from desktop to mobile
            console.log('📱 Switched to mobile - initializing navigation');
            setTimeout(initMobileNavigation, 100);
        } else if (!wasDesktop && isDesktop) {
            // Switched from mobile to desktop
            console.log('💻 Switched to desktop - cleaning up mobile navigation');
            
            // Clean up mobile state
            const burger = document.querySelector('.nav-burger-icon-black');
            const mobileMenu = document.querySelector('.nav-menu-mobile');
            
            if (burger) burger.classList.remove('menu-open');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenu.style.display = '';
            }
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
        
        wasDesktop = isDesktop;
    });
    
    console.log('🎉 Clean mobile navigation system loaded');
    
})();

// ==========================================
// DESKTOP MENU SYSTEM
// Restores desktop burger menu functionality
// ==========================================

(function() {
    'use strict';
    
    // Only run on desktop - leave mobile to the clean mobile system
    if (window.innerWidth < 992) {
        console.log('📱 Mobile detected - skipping desktop menu');
        return;
    }
    
    console.log('💻 Desktop detected - initializing desktop menu');
    
    // Wait for DOM and GSAP to be ready
    function initDesktopMenu() {
        console.log('🚀 Starting desktop menu setup...');
        
        // Find elements
        const burger = document.querySelector('.nav-burger-icon-black');
        const desktopMenu = document.querySelector('.nav-menu-desktop');
        
        if (!burger || !desktopMenu) {
            console.error('❌ Desktop menu elements not found');
            return;
        }
        
        console.log('✅ Found burger and desktop menu elements');
        
        // Setup menu positioning and initial state
        setupMenuStyles();
        
        // State tracking
        let isMenuOpen = false;
        let currentAnimation = null;
        
        // Burger click handler
        burger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`🍔 Desktop burger clicked - ${isMenuOpen ? 'Closing' : 'Opening'} menu`);
            
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close button handler
        const closeButton = desktopMenu.querySelector('.close-button-menu');
        if (closeButton) {
            closeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close button clicked');
                closeMenu();
            });
        }
        
        // Setup menu navigation
        setupDesktopMenuNavigation();
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                console.log('⌨️ Escape pressed - closing menu');
                closeMenu();
            }
        });
        
        console.log('✅ Desktop menu initialized successfully');
        
        function setupMenuStyles() {
            // Ensure menu is properly positioned and initially hidden
            desktopMenu.style.position = 'fixed';
            desktopMenu.style.top = '0';
            desktopMenu.style.left = '0';
            desktopMenu.style.width = '100vw';
            desktopMenu.style.height = '100vh';
            desktopMenu.style.zIndex = '9999';
            desktopMenu.style.background = '#32b550';
            desktopMenu.style.display = 'flex';
            desktopMenu.style.transform = 'translateX(-100%)';
            desktopMenu.style.transition = 'none';
            
            console.log('🎨 Menu styles configured');
        }
        
        function openMenu() {
            if (currentAnimation) {
                currentAnimation.kill();
            }
            
            isMenuOpen = true;
            document.body.style.overflow = 'hidden';
            
            console.log('🎬 Opening desktop menu with GSAP...');
            
            // Get elements for stagger animation
            const navLinks = desktopMenu.querySelectorAll('a, .link-block');
            const closeButton = desktopMenu.querySelector('.close-button-menu');
            const socialHandles = desktopMenu.querySelector('.social-handles');
            
            // Reset all elements
            gsap.set(navLinks, { opacity: 0, y: 20 });
            if (closeButton) gsap.set(closeButton, { opacity: 0, y: 20 });
            if (socialHandles) gsap.set(socialHandles, { opacity: 0, y: 20 });
            
            // Create timeline
            currentAnimation = gsap.timeline({
                onComplete: () => {
                    console.log('✅ Desktop menu open animation complete');
                    currentAnimation = null;
                }
            });
            
            // Slide panel in
            currentAnimation.to(desktopMenu, {
                x: '0%',
                duration: 0.8,
                ease: "power2.out"
            });
            
            // Stagger in links
            if (navLinks.length > 0) {
                currentAnimation.to(navLinks, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power3.out"
                }, "-=0.5");
            }
            
            // Fade in close button
            if (closeButton) {
                currentAnimation.to(closeButton, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.3");
            }
            
            // Fade in social handles
            if (socialHandles) {
                currentAnimation.to(socialHandles, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.2");
            }
        }
        
        function closeMenu() {
            if (currentAnimation) {
                currentAnimation.kill();
            }
            
            isMenuOpen = false;
            
            console.log('🚪 Closing desktop menu...');
            
            // Get all content elements
            const allContent = desktopMenu.querySelectorAll('a, .link-block, .close-button-menu, .social-handles');
            
            currentAnimation = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    console.log('✅ Desktop menu closed');
                    currentAnimation = null;
                }
            });
            
            // Quick fade out content
            currentAnimation.to(allContent, {
                opacity: 0,
                y: 20,
                duration: 0.2,
                ease: "power2.in"
            });
            
            // Slide panel out
            currentAnimation.to(desktopMenu, {
                x: '-100%',
                duration: 0.6,
                ease: "power2.in"
            }, "-=0.1");
        }
        
        function setupDesktopMenuNavigation() {
            console.log('🔗 Setting up desktop menu navigation...');
            
            // Define navigation mapping (same targets as mobile for consistency)
            const navigationMap = [
                { selector: 'a[href="#the-beginning"], [href*="the-beginning"]', target: 'the-beginning', name: 'The LBSTR' },
                { selector: 'a[href="#strategy"], [href*="strategy"]', target: 'strategy', name: 'Strategy' },
                { selector: 'a[href="#storytelling"], [href*="storytelling"]', target: 'storytelling', name: 'Storytelling' },
                { selector: 'a[href="#services"], [href*="services"]', target: 'services', name: 'Services' },
                { selector: 'a[href="#contact"], [href*="contact"]', target: 'contact', name: 'Contact' }
            ];
            
            navigationMap.forEach(({ selector, target, name }) => {
                const menuItems = desktopMenu.querySelectorAll(selector);
                
                menuItems.forEach(menuItem => {
                    menuItem.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`🎯 Desktop: ${name} clicked - navigating to slide`);
                        
                        // Close menu first
                        closeMenu();
                        
                        // Navigate to slide after menu closes
                        setTimeout(() => {
                            navigateToSlide(target, name);
                        }, 700); // Wait for close animation
                    });
                });
                
                if (menuItems.length > 0) {
                    console.log(`✅ ${name} desktop navigation setup (${menuItems.length} items)`);
                } else {
                    console.warn(`⚠️ No menu items found for: ${selector}`);
                }
            });
        }
        
        function navigateToSlide(slideId, slideName) {
            console.log(`🧭 Desktop: Navigating to ${slideName} (#${slideId})`);
            
            // Find the target slide
            const targetSlide = document.getElementById(slideId);
            if (!targetSlide) {
                console.error(`❌ Slide not found: #${slideId}`);
                return;
            }
            
            // Check if we have the slide navigation system available
            if (window.lbstrSimpleNavigation && typeof window.lbstrSimpleNavigation.goToSlide === 'function') {
                // Use the existing slide navigation system
                const slideNumber = window.lbstrSimpleNavigation.slideMap[slideId];
                if (slideNumber) {
                    console.log(`🎬 Using slide navigation to go to slide ${slideNumber}`);
                    window.lbstrSimpleNavigation.goToSlide(slideNumber);
                } else {
                    console.warn(`⚠️ Slide number not found for ${slideId}, using GSAP scroll`);
                    useGSAPScroll(slideId, slideName);
                }
            } else {
                // Fallback to manual GSAP scroll
                console.log(`🎬 Using manual GSAP scroll to ${slideName}`);
                useGSAPScroll(slideId, slideName);
            }
        }
        
        function useGSAPScroll(slideId, slideName) {
            // Calculate slide position (assuming horizontal layout)
            const wrapper = document.querySelector('.wrapper');
            const slide = document.getElementById(slideId);
            
            if (!wrapper || !slide) {
                console.error(`❌ Wrapper or slide not found for ${slideId}`);
                return;
            }
            
            // Get slide index
            const slides = Array.from(wrapper.children);
            const slideIndex = slides.findIndex(s => s.id === slideId);
            
            if (slideIndex === -1) {
                console.error(`❌ Slide index not found for ${slideId}`);
                return;
            }
            
            // Calculate scroll position
            const slideWidth = window.innerWidth;
            const targetScroll = slideIndex * slideWidth;
            
            console.log(`🎬 Scrolling to slide ${slideIndex + 1} at position ${targetScroll}`);
            
            // Smooth scroll with GSAP
            gsap.to(window, {
                scrollTo: targetScroll,
                duration: 1.2,
                ease: "power2.inOut",
                onStart: () => console.log(`⬆️ Desktop: Scroll animation started to ${slideName}`),
                onComplete: () => {
                    console.log(`✅ Desktop: Successfully navigated to ${slideName}`);
                    // Update URL hash
                    history.pushState(null, '', '#' + slideId);
                }
            });
        }
    }
    
    // Initialize based on readiness
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        initDesktopMenu();
    } else {
        // Wait for GSAP to load
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
                clearInterval(checkGSAP);
                initDesktopMenu();
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkGSAP);
            console.warn('⚠️ GSAP not found - desktop menu may not work properly');
        }, 5000);
    }
    
    // Handle window resize
    let wasDesktop = true;
    
    window.addEventListener('resize', function() {
        const isDesktop = window.innerWidth >= 768;
        
        if (wasDesktop && !isDesktop) {
            // Switched to mobile - clean up desktop menu
            console.log('📱 Switched to mobile - cleaning desktop menu');
            const desktopMenu = document.querySelector('.nav-menu-desktop');
            if (desktopMenu) {
                gsap.set(desktopMenu, { x: '-100%' });
                document.body.style.overflow = '';
            }
        } else if (!wasDesktop && isDesktop) {
            // Switched to desktop - reinitialize
            console.log('💻 Switched to desktop - reinitializing menu');
            setTimeout(initDesktopMenu, 100);
        }
        
        wasDesktop = isDesktop;
    });
    
    console.log('🎉 Desktop menu system loaded');
    
})();

// ==========================================
// MOBILE PROGRESS BAR FIX
// Restores progress bar functionality on mobile
// ==========================================

(function() {
    'use strict';
    
    // Only run on mobile
    if (window.innerWidth >= 992) {
        console.log('💻 Desktop detected - skipping mobile progress bar');
        return;
    }
    
    console.log('📱 Mobile detected - initializing progress bar');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileProgressBar);
    } else {
        initMobileProgressBar();
    }
    
    function initMobileProgressBar() {
        console.log('🚀 Setting up mobile progress bar...');
        
        // Find progress bar element
        const progressFill = document.querySelector('.nav-progress-fill');
        
        if (!progressFill) {
            console.warn('⚠️ Progress bar element (.nav-progress-fill) not found');
            return;
        }
        
        console.log('✅ Found progress bar element');
        
        // Reset any desktop styles and ensure proper mobile styling
        progressFill.style.removeProperty('height');
        progressFill.style.setProperty('width', '0%', 'important');
        
        // Force proper mobile progress bar styling
        progressFill.style.setProperty('display', 'block', 'important');
        progressFill.style.setProperty('height', '3px', 'important');
        progressFill.style.setProperty('background-color', '#32b550', 'important');
        progressFill.style.setProperty('position', 'absolute', 'important');
        progressFill.style.setProperty('bottom', '0', 'important');
        progressFill.style.setProperty('left', '0', 'important');
        progressFill.style.setProperty('transition', 'width 0.1s ease', 'important');
        
        console.log('🎨 Applied mobile progress bar styling');
        
        // Throttle function for performance
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
        
        // Progress calculation function
        function updateProgressBar() {
            const scrollTop = window.scrollY;
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            
            // Prevent division by zero
            if (totalHeight <= 0) {
                progressFill.style.setProperty('width', '0%', 'important');
                return;
            }
            
            const progress = Math.min(1, Math.max(0, scrollTop / totalHeight));
            const progressPercent = progress * 100;
            
            progressFill.style.setProperty('width', `${progressPercent}%`, 'important');
            
            // Debug logging (remove if too verbose)
            // console.log(`📊 Progress: ${Math.round(progressPercent)}%`);
        }
        
        // Throttled scroll handler (60fps max)
        const throttledUpdate = throttle(updateProgressBar, 16);
        
        // Add scroll listener
        window.addEventListener('scroll', throttledUpdate, { passive: true });
        
        // Initial update
        updateProgressBar();
        
        console.log('✅ Mobile progress bar initialized');
        
        // Handle window resize - cleanup if switching to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                console.log('💻 Switched to desktop - cleaning up mobile progress bar');
                window.removeEventListener('scroll', throttledUpdate);
                
                // Reset to desktop format (vertical) and remove mobile styling
                progressFill.style.removeProperty('width');
                progressFill.style.removeProperty('display');
                progressFill.style.removeProperty('height');
                progressFill.style.removeProperty('background-color');
                progressFill.style.removeProperty('position');
                progressFill.style.removeProperty('bottom');
                progressFill.style.removeProperty('left');
                progressFill.style.removeProperty('transition');
                progressFill.style.setProperty('height', '0%', 'important');
            }
        });
    }
    
    console.log('📊 Mobile progress bar system loaded');
    
})();

// PERMANENT MOBILE SCROLL FIX + PROGRESS BAR
// Add this to your scripts.js to permanently fix mobile scrolling
(function() {
    'use strict';
    
    // Only run on mobile
    if (window.innerWidth >= 992) return;
    
    console.log('🔧 Applying permanent mobile scroll fix...');
    
    function fixMobileScrolling() {
        // Force reset all scroll-blocking elements
        const elements = [
            document.documentElement, 
            document.body,
            document.querySelector('.scroll-container'),
            document.querySelector('.wrapper'),
            document.querySelector('.smooth-wrapper'),
            document.querySelector('.smooth-content')
        ];
        
        elements.forEach(el => {
            if (el) {
                el.style.setProperty('overflow', 'visible', 'important');
                el.style.setProperty('overflow-y', 'auto', 'important');
                el.style.setProperty('position', 'static', 'important');
                el.style.setProperty('height', 'auto', 'important');
                el.style.setProperty('transform', 'none', 'important');
            }
        });
        
        // Specific body/html fixes
        document.body.style.setProperty('overflow-y', 'auto', 'important');
        document.body.style.setProperty('min-height', '100vh', 'important');
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
        
        console.log('✅ Mobile scroll fix applied');
    }
    
    function setupProgressBar() {
        const fill = document.querySelector('.nav-progress-fill');
        if (!fill) return;
        
        // Apply proper positioning
        fill.style.setProperty('position', 'fixed', 'important');
        fill.style.setProperty('top', '60px', 'important');
        fill.style.setProperty('left', '0', 'important');
        fill.style.setProperty('right', '0', 'important');
        fill.style.setProperty('width', '0%', 'important');
        fill.style.setProperty('height', '3px', 'important');
        fill.style.setProperty('background-color', '#32b550', 'important');
        fill.style.setProperty('z-index', '99999', 'important');
        
        // Progress update function
        function updateProgress() {
            const scrollTop = window.scrollY;
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (scrollTop / totalHeight) : 0;
            fill.style.setProperty('width', (progress * 100) + '%', 'important');
        }
        
        // Add scroll listener
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
        
        console.log('✅ Mobile progress bar setup complete');
    }
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            fixMobileScrolling();
            setupProgressBar();
        });
    } else {
        fixMobileScrolling();
        setupProgressBar();
    }
    
    // Reapply fixes if something tries to override them
    setInterval(fixMobileScrolling, 5000);
    
    console.log('🎉 Permanent mobile scroll fix loaded');
    
})();

// MOBILE PROGRESS BAR HEIGHT FIX
// Add this after your existing script
(function() {
    if (window.innerWidth >= 992) return;
    
    setTimeout(() => {
        const fill = document.querySelector('.nav-progress-fill');
        if (fill) {
            console.log('🔧 Fixing progress bar height...');
            
            // More aggressive height setting
            fill.style.setProperty('height', '3px', 'important');
            fill.style.setProperty('max-height', '3px', 'important');
            fill.style.setProperty('min-height', '3px', 'important');
            fill.style.setProperty('flex', 'none', 'important');
            fill.style.setProperty('flex-shrink', '0', 'important');
            fill.style.setProperty('flex-grow', '0', 'important');
            
            console.log('✅ Height fix applied - should now be 3px tall');
        }
    }, 1000);
})();

// MOBILE PROGRESS BAR COLOR THEME SYNC
// Add this after your height fix script
(function() {
    if (window.innerWidth >= 992) return;
    
    console.log('🎨 Setting up progress bar color theme sync...');
    
    function updateProgressBarColor() {
        const fill = document.querySelector('.nav-progress-fill');
        const navBar = document.querySelector('.nav-bar');
        
        if (!fill || !navBar) return;
        
        // Check nav bar theme classes
        if (navBar.classList.contains('nav-green')) {
            // Green nav = white progress bar
            fill.style.setProperty('background-color', 'white', 'important');
            console.log('🟢 Nav is green → Progress bar set to white');
        } else if (navBar.classList.contains('nav-black')) {
            // Black nav = green progress bar
            fill.style.setProperty('background-color', '#32b550', 'important');
            console.log('⚫ Nav is black → Progress bar set to green');
        } else if (navBar.classList.contains('nav-white')) {
            // White nav = green progress bar
            fill.style.setProperty('background-color', '#32b550', 'important');
            console.log('⚪ Nav is white → Progress bar set to green');
        } else {
            // Default fallback
            fill.style.setProperty('background-color', '#32b550', 'important');
            console.log('🔄 Nav theme unknown → Progress bar set to green (default)');
        }
    }
    
    // Update color immediately
    updateProgressBarColor();
    
    // Watch for nav theme changes using MutationObserver
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    console.log('🔄 Nav theme changed, updating progress bar color');
                    updateProgressBarColor();
                }
            });
        });
        
        observer.observe(navBar, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('✅ Progress bar color theme sync active');
    }
    
})();

// COMPLETE MOBILE MENU SOLUTION - FINAL VERSION WITH NAVIGATION FIX
// Combined: Nav positioning + Theme-aware white X + Separator line + Clean navigation
(function() {
    'use strict';
    
    // Only run on mobile
    if (window.innerWidth >= 992) return;
    
    console.log('📱 Loading complete mobile menu solution...');
    
    const burger = document.querySelector('.nav-burger-icon-black');
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    const navBar = document.querySelector('.nav-bar');
    
    if (!burger || !mobileMenu || !navBar) {
        console.log('❌ Missing mobile menu elements');
        return;
    }
    // --- Helper: put nav-bar back into normal flow ---
    function restoreNavBar () {
    const props = ['position','z-index','top','left','right'];
    props.forEach(p => navBar.style.removeProperty(p));
    }
    
    // Function to properly close menu and clean up everything
    function cleanCloseMenu() {
        console.log('🧹 Clean closing menu...');
        
        // Update all menu states
        burger.classList.remove('menu-open');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenu.style.display = 'none';
        
        // Restore burger visibility
        burger.style.removeProperty('opacity');
        
        // Remove external X and separator
        const xIcon = document.querySelector('.external-x-icon');
        const separator = document.querySelector('.nav-separator-line');
        if (xIcon) xIcon.remove();
        if (separator) separator.remove();
        
        // Unlock scroll
        document.body.style.overflow = '';

        // NEW: drop the nav-bar back into normal flow
        restoreNavBar();
        
        console.log('✅ Menu cleanly closed');
    }
    
    // Main burger click handler for opening/closing menu
    burger.addEventListener('click', function() {
        setTimeout(() => {
            const isMenuOpen = mobileMenu.classList.contains('active') || 
                              window.getComputedStyle(mobileMenu).display === 'flex';
            
            if (isMenuOpen) {
                console.log('📱 Menu opened - applying all fixes...');
                
                // FIX 1: Position mobile menu below nav bar
                const navHeight = navBar.offsetHeight;
                
                mobileMenu.style.setProperty('top', navHeight + 'px', 'important');
                mobileMenu.style.setProperty('height', `calc(100vh - ${navHeight}px)`, 'important');
                mobileMenu.style.setProperty('z-index', '9999', 'important');
                
                // Ensure nav bar stays on top
                navBar.style.setProperty('z-index', '10001', 'important');
                navBar.style.setProperty('position', 'fixed', 'important');
                navBar.style.setProperty('top', '0', 'important');
                navBar.style.setProperty('left', '0', 'important');
                navBar.style.setProperty('right', '0', 'important');
                
                // FIX 2: Theme-aware white X icon
                burger.style.setProperty('opacity', '0', 'important');
                
                // Remove existing elements
                const existingX = document.querySelector('.external-x-icon');
                const existingSeparator = document.querySelector('.nav-separator-line');
                if (existingX) existingX.remove();
                if (existingSeparator) existingSeparator.remove();
                
                // Check nav theme
                const isGreenNav = navBar.classList.contains('nav-green');
                
                // Get burger position
                const burgerRect = burger.getBoundingClientRect();
                
                // Create theme-appropriate white X
                const xIcon = document.createElement('div');
                xIcon.className = 'external-x-icon';
                xIcon.innerHTML = '✕';
                
                if (isGreenNav) {
                    // Green nav = white X, no background + separator line
                    xIcon.style.cssText = `
                        position: fixed !important;
                        top: ${burgerRect.top}px !important;
                        left: ${burgerRect.left}px !important;
                        width: ${burgerRect.width}px !important;
                        height: ${burgerRect.height}px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-family: 'Selecta', sans-serif !important;
                        font-size: 2rem !important;
                        font-weight: normal !important;
                        color: white !important;
                        background: transparent !important;
                        z-index: 999999 !important;
                        cursor: pointer !important;
                        line-height: 1 !important;
                        letter-spacing: 1px !important;
                    `;
                    
                    // Add separator line for green nav
                    const separator = document.createElement('div');
                    separator.className = 'nav-separator-line';
                    separator.style.cssText = `
                        position: fixed !important;
                        top: ${navHeight}px !important;
                        left: 0 !important;
                        right: 0 !important;
                        height: 1px !important;
                        background: black !important;
                        z-index: 10000 !important;
                        pointer-events: none !important;
                    `;
                    document.body.appendChild(separator);
                    
                } else {
                    // Black/white nav = white X with dark background
                    xIcon.style.cssText = `
                        position: fixed !important;
                        top: ${burgerRect.top}px !important;
                        left: ${burgerRect.left}px !important;
                        width: ${burgerRect.width}px !important;
                        height: ${burgerRect.height}px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-family: 'Selecta', sans-serif !important;
                        font-size: 2rem !important;
                        font-weight: normal !important;
                        color: white !important;
                        background: rgba(0,0,0,0.7) !important;
                        border-radius: 4px !important;
                        z-index: 999999 !important;
                        cursor: pointer !important;
                        line-height: 1 !important;
                        letter-spacing: 1px !important;
                    `;
                }
                
                // Make X clickable to close menu
                xIcon.addEventListener('click', function() {
                    burger.click();
                });
                
                document.body.appendChild(xIcon);
                
                console.log('✅ All mobile menu fixes applied');
                
            } else {
                console.log('📱 Menu closed - restoring elements...');
                cleanCloseMenu();
            }
        }, 50);
    });
    
    // FIX 3: Add clean close handlers to all menu items
    const menuItems = [
        '.the-lbstr-menu-mob',
        '.strategy-menu-mob', 
        '.story-menu-mob',
        '.services-menu-mob',
        '.contact-menu-mob'
    ];
    
    menuItems.forEach(selector => {
        const menuItem = mobileMenu.querySelector(selector);
        if (menuItem) {
            // Get all clickable elements
            const clickables = [
                menuItem,
                ...menuItem.querySelectorAll('a'),
                ...menuItem.querySelectorAll('[class*="link"]')
            ];
            
            clickables.forEach(element => {
                element.addEventListener('click', function(e) {
                    console.log(`🎯 Menu item clicked: ${selector}`);
                    cleanCloseMenu();
                });
            });
        }
    });
    
    console.log('✅ Complete mobile menu solution loaded');
    
})();

// Desktop logo click navigation - add this to your scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth >= 992) {
        const navBar = document.querySelector('.nav-bar');
        
        if (navBar) {
            navBar.addEventListener('click', function(e) {
                // Only respond to clicks on the left side (logo area)
                const rect = navBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                if (clickX < 150) { // Left 150px of nav bar = logo area
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('🏠 Logo clicked - navigating to home');
                    
                    // Calculate home slide position
                    const homeSlide = document.getElementById('home');
                    const wrapper = document.querySelector('.wrapper');
                    
                    if (homeSlide && wrapper) {
                        const slides = Array.from(wrapper.children);
                        const slideIndex = slides.findIndex(s => s.id === 'home');
                        const slideWidth = window.innerWidth;
                        const targetScroll = slideIndex * slideWidth;
                        
                        // Use GSAP to scroll to home
                        if (typeof gsap !== 'undefined') {
                            gsap.to(window, {
                                scrollTo: targetScroll,
                                duration: 1.2,
                                ease: "power2.inOut"
                            });
                        }
                        
                        // Update URL
                        history.pushState(null, '', '#home');
                    }
                }
            });
            
            console.log('✅ Desktop logo navigation initialized');
        }
    }
});

// Fix Image Nation link interference with video modal
document.addEventListener('DOMContentLoaded', () => {
    // Find the Image Nation link specifically
    const imageNationLink = document.querySelector('a[href*="image-nation"], a[href*="imagenation"]');
    
    if (imageNationLink) {
        imageNationLink.addEventListener('click', function(e) {
            // Stop the event from bubbling up to any parent elements
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Let the link work normally (open in new tab)
            console.log('🔗 Image Nation link clicked - preventing modal interference');
        });
    }
});

// All Films Thumbnail Animation - Random Frame Selection
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 992) return;
    
    console.log('🎬 All Films animation with random frame selection...');
    
    let attempts = 0;
    const maxAttempts = 10;
    let commercialAnimationTriggered = false;
    let personalAnimationTriggered = false;
    
    // Define all film frame configurations
    const filmConfigs = {
        commercial: {
            slideId: 'commercial-stories',
            films: [
                { prefix: 'mini-frame', name: 'Mini Cooper' },
                { prefix: 'him-frame', name: 'Himalaya' },
                { prefix: 'braun-frame', name: 'Braun' },
                { prefix: 'adnoc-frame', name: 'ADNOC' },
                { prefix: 'aldar-frame', name: 'Aldar' }
            ]
        },
        personal: {
            slideId: 'personal-stories',
            films: [
                { prefix: 'laundro-frame', name: 'Laundromat' },
                { prefix: 'datsun-frame', name: 'Datsun' },
                { prefix: 'karama-frame', name: 'Karama' },
                { prefix: 'cbd-frame', name: 'CBD Part 1' },
                { prefix: 'cbd2-frame', name: 'CBD Part 2' }
            ]
        }
    };
    
    // Function to randomly select frames from each film
    function getRandomFramesFromFilm(filmPrefix, totalFrames = 10, selectCount = 5) {
        const availableNumbers = Array.from({length: totalFrames}, (_, i) => i + 1);
        const selectedNumbers = [];
        
        // Randomly select frames
        for (let i = 0; i < selectCount && availableNumbers.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
            selectedNumbers.push(selectedNumber);
        }
        
        // Sort the selected numbers for cleaner logging
        selectedNumbers.sort((a, b) => a - b);
        
        return selectedNumbers.map(num => 
            document.querySelector(`.${filmPrefix}-${num}`)
        ).filter(frame => frame !== null);
    }
    
    function waitForElementsAndInit() {
        attempts++;
        console.log(`🔍 Attempt ${attempts}: Checking for film frames...`);
        
        // Test if any frames exist
        const testFrames = [
            document.querySelector('.mini-frame-1'),
            document.querySelector('.him-frame-1'),
            document.querySelector('.laundro-frame-1')
        ];
        
        const foundFrames = testFrames.filter(frame => frame !== null);
        
        if (foundFrames.length === 0) {
            console.log(`⏳ Elements not ready yet (attempt ${attempts}/${maxAttempts})`);
            
            if (attempts < maxAttempts) {
                setTimeout(waitForElementsAndInit, 1000);
                return;
            } else {
                console.log('❌ Gave up waiting for elements');
                return;
            }
        }
        
        console.log('✅ Elements found! Initializing all film animations...');
        initAllFilmAnimations();
    }
    
    function initAllFilmAnimations() {
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initAllFilmAnimations, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up all film animations...');
        
        // Setup each slide
        setupSlideAnimation('commercial', filmConfigs.commercial);
        setupSlideAnimation('personal', filmConfigs.personal);
        
        // Setup hover effects for all films
        setupAllHoverEffects();
        
        console.log('✅ All film animations setup complete!');
    }
    
    function setupSlideAnimation(slideType, config) {
        console.log(`🎬 Setting up ${slideType} stories animation...`);
        
        // Find random frames for this slide
        const allRandomFrames = [];
        
        config.films.forEach(film => {
            const randomFrames = getRandomFramesFromFilm(film.prefix, 10, 5);
            
            // Log which frames were selected
            const frameNumbers = randomFrames.map(frame => {
                const className = frame.className.split(' ').find(cls => cls.includes(film.prefix));
                return className ? className.split('-').pop() : '?';
            });
            
            console.log(`  🎲 ${film.name}: Random frames ${frameNumbers.join(', ')}`);
            allRandomFrames.push(...randomFrames);
        });
        
        if (allRandomFrames.length === 0) {
            console.log(`❌ No random frames found for ${slideType} stories`);
            return;
        }
        
        // Shuffle the frames so they don't animate in film order
        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        
        const shuffledFrames = shuffleArray(allRandomFrames);
        
        console.log(`✅ Total ${slideType} random frames: ${allRandomFrames.length} (shuffled sequence)`);
        
        // Hide random frames initially
        console.log(`🎯 Hiding random frames initially for ${slideType}...`);
        gsap.set(allRandomFrames, { opacity: 0 });
        
        // Animation function
        function animateRandomFrames() {
            const animationFlag = slideType === 'commercial' ? 'commercialAnimationTriggered' : 'personalAnimationTriggered';
            
            if (window[animationFlag]) {
                console.log(`🔄 ${slideType} animation already triggered, skipping`);
                return;
            }
            
            window[animationFlag] = true;
            console.log(`🎬 Animating ${slideType} random frames in shuffled order...`);
            
            gsap.to(shuffledFrames, {
                opacity: 1,
                duration: 2.2,
                stagger: 0.4,
                ease: "power2.out",
                onComplete: () => console.log(`✅ ${slideType} animation completed`)
            });
        }
        
        // Set up visibility detection
        const slideElement = document.getElementById(config.slideId);
        if (slideElement) {
            console.log(`📱 Setting up Intersection Observer for ${slideType}...`);
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ ${slideType} slide visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log(`🎯 ${slideType} slide is significantly visible!`);
                        animateRandomFrames();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(slideElement);
            
            // Manual polling as backup
            function checkVisibility() {
                const animationFlag = slideType === 'commercial' ? commercialAnimationTriggered : personalAnimationTriggered;
                if (animationFlag) return;
                
                const rect = slideElement.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log(`🎯 Polling detected ${slideType} slide is visible!`);
                    animateRandomFrames();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkVisibility();
                const animationFlag = slideType === 'commercial' ? commercialAnimationTriggered : personalAnimationTriggered;
                if (animationFlag) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkVisibility();
            }, 100);
        }
    }
    
    function setupAllHoverEffects() {
        console.log('🖱️ Setting up hover effects for all films...');
        
        // Get all film prefixes
        const allFilms = [
            ...filmConfigs.commercial.films,
            ...filmConfigs.personal.films
        ];
        
        allFilms.forEach(film => {
            for (let i = 1; i <= 10; i++) {
                const frame = document.querySelector(`.${film.prefix}-${i}`);
                if (frame) {
                    frame.addEventListener('mouseenter', function() {
                        console.log(`🎯 Hovering ${film.prefix}-${i}`);
                        gsap.to(frame, {
                            scale: 1.05,
                            filter: "brightness(1.1)",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    });
                    
                    frame.addEventListener('mouseleave', function() {
                        gsap.to(frame, {
                            scale: 1,
                            filter: "brightness(1)",
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    });
                }
            }
        });
        
        console.log('✅ Hover effects setup complete for all films');
    }
    
    // Global variables for animation flags
    window.commercialAnimationTriggered = false;
    window.personalAnimationTriggered = false;
    
    waitForElementsAndInit();
});

console.log('🎬 All Films random animation system loaded');

// Floating Lobsters Animation - Home Slide Only
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 992) {
        console.log('📱 Mobile detected - skipping floating lobsters');
        return;
    }
    
    console.log('🦞 Initializing floating lobsters for home slide...');
    
    let lobstersCreated = false;
    const interactedLobsters = [];
    const totalLobsters = 15;
    
    function createFloatingLobsters() {
        if (lobstersCreated) return;
        
        const homeSlide = document.getElementById('home');
        if (!homeSlide) {
            console.log('❌ Home slide not found');
            return;
        }
        
        console.log('🦞 Creating floating lobsters...');
        lobstersCreated = true;
        
        // Define zones for better distribution across the home slide
        const zones = [
            { x: [0.05, 0.25], y: [0.1, 0.3] },   // Top left
            { x: [0.75, 0.95], y: [0.1, 0.3] },   // Top right
            { x: [0.05, 0.25], y: [0.7, 0.9] },   // Bottom left
            { x: [0.75, 0.95], y: [0.7, 0.9] },   // Bottom right
            { x: [0.3, 0.7], y: [0.05, 0.25] },   // Top center
            { x: [0.05, 0.25], y: [0.4, 0.6] },   // Left center
            { x: [0.75, 0.95], y: [0.4, 0.6] },   // Right center
            { x: [0.3, 0.7], y: [0.75, 0.95] },   // Bottom center
            { x: [0.25, 0.5], y: [0.3, 0.7] },    // Center left
            { x: [0.5, 0.75], y: [0.3, 0.7] },    // Center right
            { x: [0.15, 0.35], y: [0.5, 0.7] },   // Mid left
            { x: [0.65, 0.85], y: [0.5, 0.7] },   // Mid right
            { x: [0.4, 0.6], y: [0.15, 0.35] },   // Upper center
            { x: [0.4, 0.6], y: [0.65, 0.85] },   // Lower center
            { x: [0.25, 0.75], y: [0.4, 0.6] }    // Wide center
        ];
        
        // Create lobsters
        for (let i = 0; i < totalLobsters; i++) {
            createSingleLobster(homeSlide, i, zones[i % zones.length]);
        }
        
        console.log(`✅ Created ${totalLobsters} floating lobsters`);
    }
    
    function createSingleLobster(container, lobsterId, zone) {
        const lobster = document.createElement('div');
        lobster.className = 'floating-lobster';
        lobster.setAttribute('data-lobster-id', lobsterId);
        
        // Use your lobster image
        lobster.innerHTML = `<img src="https://cdn.prod.website-files.com/67f68e2e70bcb6b026fb5829/67fe690c37d314763d659826_lbstr-black-cursor.png" alt="Floating Lobster" style="width: 100%; height: 100%; object-fit: contain;">`;
        
        // Style the lobster
        const randomSize = 25 + Math.random() * 20; // 25-45px
        lobster.style.cssText = `
            position: absolute;
            width: ${randomSize}px;
            height: ${randomSize}px;
            pointer-events: auto;
            cursor: pointer;
            z-index: 100;
            opacity: 0.8;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform, opacity;
        `;
        
        // Position within the zone
        const containerRect = container.getBoundingClientRect();
        const xRange = zone.x;
        const yRange = zone.y;
        const randomX = (xRange[0] + Math.random() * (xRange[1] - xRange[0])) * containerRect.width;
        const randomY = (yRange[0] + Math.random() * (yRange[1] - yRange[0])) * containerRect.height;
        
        lobster.style.left = randomX + 'px';
        lobster.style.top = randomY + 'px';
        
        // Add to container
        container.appendChild(lobster);
        
        // Setup floating animation
        setupLobsterAnimation(lobster, lobsterId);
        
        // Setup interaction
        setupLobsterInteraction(lobster, lobsterId);
    }
    
    function setupLobsterAnimation(lobster, lobsterId) {
        const startTime = Date.now() + (lobsterId * 200); // Stagger start times
        const duration = 8000 + Math.random() * 6000; // 8-14 seconds
        
        // Movement properties
        const amplitudeX = 30 + Math.random() * 80; // 30-110px horizontal
        const amplitudeY = 20 + Math.random() * 60; // 20-80px vertical
        const useHorizontal = Math.random() > 0.2; // 80% use both directions
        
        function animateLobster() {
            // Stop if lobster was removed
            if (!lobster.isConnected || !document.getElementById('home')) return;
            
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = (elapsed % duration) / duration; // 0 to 1, repeating
            
            // Calculate smooth floating movement
            const xOffset = useHorizontal ? 
                Math.sin(progress * Math.PI * 2) * amplitudeX : 
                Math.sin(progress * Math.PI * 2 + Math.PI/4) * (amplitudeX * 0.3);
                
            const yOffset = Math.sin(progress * Math.PI * 2 + Math.PI/3) * amplitudeY;
            
            // Apply smooth transformation
            lobster.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${xOffset * 0.05}deg)`;
            
            // Continue animation
            requestAnimationFrame(animateLobster);
        }
        
        // Start animation
        animateLobster();
    }
    
    function setupLobsterInteraction(lobster, lobsterId) {
        // Add hover listener for removal (instead of click)
        lobster.addEventListener('mouseenter', handleHover);
        
        function handleHover() {
            // Prevent multiple interactions
            if (interactedLobsters.includes(lobsterId)) return;
            
            console.log(`🦞 Lobster ${lobsterId} hovered - removing!`);
            
            // Add to interacted list
            interactedLobsters.push(lobsterId);
            
            // Disappear animation
            lobster.style.opacity = '0';
            lobster.style.transform = 'scale(0.8) rotate(45deg) translate(0px, -20px)';
            lobster.style.pointerEvents = 'none';
            
            // Remove after animation
            setTimeout(() => {
                if (lobster.parentNode) {
                    lobster.parentNode.removeChild(lobster);
                }
            }, 500);
        }
    }
    
    // Setup visibility detection for home slide
    function setupHomeSlideDetection() {
        const homeSlide = document.getElementById('home');
        if (!homeSlide) {
            setTimeout(setupHomeSlideDetection, 1000);
            return;
        }
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    console.log('🏠 Home slide is visible - creating lobsters');
                    createFloatingLobsters();
                }
            });
        }, {
            threshold: [0.5, 1.0]
        });
        
        observer.observe(homeSlide);
        
        // Also check immediately if already on home
        setTimeout(() => {
            const rect = homeSlide.getBoundingClientRect();
            const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
            if (isVisible) {
                console.log('🏠 Already on home slide - creating lobsters');
                createFloatingLobsters();
            }
        }, 1000);
    }
    
    // Wait for elements to load
    setTimeout(setupHomeSlideDetection, 2000);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 992) {
            // Remove all lobsters on mobile
            const lobsters = document.querySelectorAll('.floating-lobster');
            lobsters.forEach(lobster => {
                if (lobster.parentNode) {
                    lobster.parentNode.removeChild(lobster);
                }
            });
            lobstersCreated = false;
        }
    });
});

console.log('🦞 Floating lobsters script loaded for home slide');

document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth >= 992) return;
    const burger = document.querySelector('.nav-burger-icon-black');
    if (!burger) return;

    burger.addEventListener('click', function(e) {
      // look for any active modal overlay
      const svc21 = document.querySelector('.services-modal-overlay.modal-active');
      const val11 = document.querySelector('.mobile-modal-overlay.modal-active');          // slide-11 values
      const s14  = document.querySelector('#slide14-modal-overlay.modal-active');          // slide-14 bio/brands/recog
      const s18  = document.querySelector('.slide18-modal-overlay.modal-active');          // slide-18 Ekta bio

      if (svc21 || val11 || s14 || s18) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // close the right one
        if (svc21) {
          window.servicesToggleSystem?.closeActiveService();
        }
        else if (val11) {
          document.querySelector('.mobile-modal-close')?.click();
        }
        else if (s14) {
          document.querySelector('.slide14-modal-close')?.click();
        }
        else if (s18) {
          document.querySelector('.slide18-modal-close')?.click();
        }

        console.log('✔️ Closed active modal instead of toggling menu');
      }
    }, true);
  });
  document.addEventListener('DOMContentLoaded', function() {
    // only on mobile
    if (window.innerWidth >= 992) return;

    const burger = document.querySelector('.nav-burger-icon-black');
    if (!burger) return;

    // reuse your proven selector
    function syncBurger() {
      const anyOpen = !!document.querySelector('[class*="-modal-overlay"].modal-active');
      burger.classList.toggle('menu-open', anyOpen);
    }

    // run once immediately, then every 100ms
    syncBurger();
    setInterval(syncBurger, 100);
  });

// Mobile Floating Lobsters Animation - Home Slide Only
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile
    if (window.innerWidth >= 992) {
        console.log('💻 Desktop detected - skipping mobile floating lobsters');
        return;
    }
    
    console.log('📱🦞 Initializing mobile floating lobsters for home slide...');
    
    // Fix mobile viewport overflow immediately
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    let lobstersCreated = false;
    const interactedLobsters = [];
    const totalLobsters = 10; // Slightly fewer for mobile
    
    function createMobileFloatingLobsters() {
        if (lobstersCreated) return;
        
        const homeSlide = document.getElementById('home');
        if (!homeSlide) {
            console.log('❌ Home slide not found');
            return;
        }
        
        console.log('📱🦞 Creating mobile floating lobsters...');
        lobstersCreated = true;
        
        // Mobile-optimized zones for portrait layout
        const mobileZones = [
            { x: [0.05, 0.3], y: [0.1, 0.25] },   // Top left
            { x: [0.7, 0.95], y: [0.1, 0.25] },   // Top right
            { x: [0.05, 0.3], y: [0.75, 0.9] },   // Bottom left
            { x: [0.7, 0.95], y: [0.75, 0.9] },   // Bottom right
            { x: [0.35, 0.65], y: [0.05, 0.2] },  // Top center
            { x: [0.05, 0.3], y: [0.4, 0.6] },    // Left center
            { x: [0.7, 0.95], y: [0.4, 0.6] },    // Right center
            { x: [0.35, 0.65], y: [0.8, 0.95] },  // Bottom center
            { x: [0.15, 0.45], y: [0.3, 0.5] },   // Mid left
            { x: [0.55, 0.85], y: [0.3, 0.5] }    // Mid right
        ];
        
        // Create lobsters
        for (let i = 0; i < totalLobsters; i++) {
            createSingleMobileLobster(homeSlide, i, mobileZones[i % mobileZones.length]);
        }
        
        console.log(`✅ Created ${totalLobsters} mobile floating lobsters`);
    }
    
    function createSingleMobileLobster(container, lobsterId, zone) {
        const lobster = document.createElement('div');
        lobster.className = 'mobile-floating-lobster';
        lobster.setAttribute('data-lobster-id', lobsterId);
        
        // Use white lobster image
        lobster.innerHTML = `<img src="https://cdn.prod.website-files.com/67f68e2e70bcb6b026fb5829/6848235c72d6106a5f898c68_LTR25_Icons_Final__Lobster2.png" alt="Floating Lobster" style="width: 100%; height: 100%; object-fit: contain; filter: brightness(0) invert(1);">`;
        
        // Style the lobster - smaller for mobile
        const randomSize = 20 + Math.random() * 15; // 20-35px (smaller than desktop)
        lobster.style.cssText = `
            position: absolute;
            width: ${randomSize}px;
            height: ${randomSize}px;
            pointer-events: auto;
            cursor: pointer;
            z-index: 100;
            opacity: 0.7;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform, opacity;
            touch-action: manipulation;
        `;
        
        // Position within the zone (ensure stays within viewport - FIXED)
        const containerRect = container.getBoundingClientRect();
        const xRange = zone.x;
        const yRange = zone.y;
        
        // Calculate position but ensure lobster stays within bounds
        const lobsterSize = randomSize;
        const safeMargin = 10; // Extra safety margin
        
        // Use viewport width instead of container width to prevent overflow
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const maxX = viewportWidth - lobsterSize - safeMargin;
        const maxY = viewportHeight - lobsterSize - safeMargin;
        
        // Calculate position within zone but constrain to safe bounds
        const targetX = (xRange[0] + Math.random() * (xRange[1] - xRange[0])) * viewportWidth;
        const targetY = (yRange[0] + Math.random() * (yRange[1] - yRange[0])) * viewportHeight;
        
        const safeX = Math.max(safeMargin, Math.min(targetX, maxX));
        const safeY = Math.max(safeMargin, Math.min(targetY, maxY));
        
        lobster.style.left = safeX + 'px';
        lobster.style.top = safeY + 'px';
        
        // Add to container
        container.appendChild(lobster);
        
        // Setup floating animation
        setupMobileLobsterAnimation(lobster, lobsterId);
        
        // Setup interaction
        setupMobileLobsterInteraction(lobster, lobsterId);
    }
    
    function setupMobileLobsterAnimation(lobster, lobsterId) {
        const startTime = Date.now() + (lobsterId * 150); // Stagger start times
        const duration = 6000 + Math.random() * 4000; // 6-10 seconds (faster than desktop)
        
        // Much smaller movement for mobile to prevent overflow
        const amplitudeX = 10 + Math.random() * 20; // 10-30px horizontal (REDUCED)
        const amplitudeY = 8 + Math.random() * 15; // 8-23px vertical (REDUCED)
        const useHorizontal = Math.random() > 0.3; // 70% use both directions
        
        function animateMobileLobster() {
            // Stop if lobster was removed
            if (!lobster.isConnected || !document.getElementById('home')) return;
            
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = (elapsed % duration) / duration; // 0 to 1, repeating
            
            // Get current position
            const currentLeft = parseFloat(lobster.style.left) || 0;
            const currentTop = parseFloat(lobster.style.top) || 0;
            
            // Calculate smooth floating movement (much gentler for mobile)
            const xOffset = useHorizontal ? 
                Math.sin(progress * Math.PI * 2) * amplitudeX : 
                Math.sin(progress * Math.PI * 2 + Math.PI/4) * (amplitudeX * 0.4);
                
            const yOffset = Math.sin(progress * Math.PI * 2 + Math.PI/3) * amplitudeY;
            
            // Ensure animation doesn't push lobster outside bounds
            const finalX = currentLeft + xOffset;
            const finalY = currentTop + yOffset;
            const lobsterSize = parseFloat(lobster.style.width) || 25;
            const safeMargin = 10;
            
            const constrainedX = Math.max(safeMargin, Math.min(finalX, window.innerWidth - lobsterSize - safeMargin));
            const constrainedY = Math.max(safeMargin, Math.min(finalY, window.innerHeight - lobsterSize - safeMargin));
            
            // Apply constrained transformation
            lobster.style.transform = `translate(${constrainedX - currentLeft}px, ${constrainedY - currentTop}px) rotate(${xOffset * 0.01}deg)`;
            
            // Continue animation
            requestAnimationFrame(animateMobileLobster);
        }
        
        // Start animation
        animateMobileLobster();
    }
    
    function setupMobileLobsterInteraction(lobster, lobsterId) {
        // Add touch/tap listener for removal
        lobster.addEventListener('touchstart', handleTouch, { passive: false });
        lobster.addEventListener('click', handleTouch); // Fallback for non-touch
        
        function handleTouch(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Prevent multiple interactions
            if (interactedLobsters.includes(lobsterId)) return;
            
            console.log(`📱🦞 Mobile lobster ${lobsterId} tapped - removing!`);
            
            // Add to interacted list
            interactedLobsters.push(lobsterId);
            
            // Mobile-friendly disappear animation
            lobster.style.opacity = '0';
            lobster.style.transform = 'scale(0.6) rotate(30deg) translate(0px, -15px)';
            lobster.style.pointerEvents = 'none';
            
            // Add a little vibration feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Remove after animation
            setTimeout(() => {
                if (lobster.parentNode) {
                    lobster.parentNode.removeChild(lobster);
                }
            }, 400);
        }
    }
    
    // Setup visibility detection for home slide
    function setupMobileHomeSlideDetection() {
        const homeSlide = document.getElementById('home');
        if (!homeSlide) {
            setTimeout(setupMobileHomeSlideDetection, 1000);
            return;
        }
        
        // Mobile uses scroll position detection (since no horizontal scrolling)
        function checkMobileHomeVisibility() {
            if (lobstersCreated) return;
            
            const rect = homeSlide.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
            
            if (isVisible) {
                console.log('📱🏠 Home slide is visible on mobile - creating lobsters');
                createMobileFloatingLobsters();
            }
        }
        
        // Check on scroll
        window.addEventListener('scroll', checkMobileHomeVisibility, { passive: true });
        
        // Check immediately
        setTimeout(checkMobileHomeVisibility, 500);
        
        console.log('✅ Mobile home slide detection setup');
    }
    
    // Wait for elements to load
    setTimeout(setupMobileHomeSlideDetection, 1500);
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recreate lobsters after orientation change
            const existingLobsters = document.querySelectorAll('.mobile-floating-lobster');
            existingLobsters.forEach(lobster => {
                if (lobster.parentNode) {
                    lobster.parentNode.removeChild(lobster);
                }
            });
            
            // Reset and recreate
            lobstersCreated = false;
            interactedLobsters.length = 0;
            
            if (window.innerWidth < 992) {
                createMobileFloatingLobsters();
            }
        }, 500);
    });
});

console.log('📱🦞 Mobile floating lobsters script loaded for home slide');

// SEO Fix - Preserve Your Horizontal Scroll Experience
// Add this to your Webflow Body Code (Before Close Body Tag)

document.addEventListener('DOMContentLoaded', function() {
    // Now works on both desktop and mobile
    console.log('🔧 Initializing SEO-friendly URLs for both desktop and mobile...');
    
    // Map of sections to their SEO-friendly URLs (Based on content structure)
    const sectionURLMap = {
        'home': '/',
        'the-beginning': '/the-lbstr',
        'screenplay': '/the-lbstr',     
        'choice': '/the-lbstr',        
        'ekta': '/the-lbstr',          
        'stranger': '/the-lbstr',      
        'partners': '/the-lbstr',      
        'the-lbstr': '/the-lbstr',     
        'values': '/the-lbstr',        
        'crafts': '/the-lbstr',        
        'strategy': '/strategy',
        'the-strategist': '/strategy',
        'problem-solving': '/strategy',
        'storytelling': '/storytelling',
        'ideas': '/storytelling',
        'the-storyteller': '/storytelling', 
        'commercial-stories': '/storytelling',
        'personal-stories': '/storytelling',
        'services': '/services',
        'contact': '/contact'
    };
    
    // Reverse map for URL to section
    const urlSectionMap = {};
    Object.keys(sectionURLMap).forEach(section => {
        urlSectionMap[sectionURLMap[section]] = section;
    });
    
    // For /the-lbstr URL, we need to handle multiple sections, so let's target the main one
    urlSectionMap['/the-lbstr'] = 'the-lbstr'; // Will land on the main slide
    
    // SEO meta data based on actual website content - UPDATED
    const seoData = {
        '/': {
            title: 'The LBSTR | Strategy & Storytelling Studio',
            description: 'Meet Ekta & Robert, a filmmaker-strategist duo with 25 years of award-winning expertise. Strategy and storytelling studio based in Dubai.',
            keywords: 'strategy storytelling studio dubai, filmmaker strategist duo, ekta saran robert habib, brand strategy storytelling, dubai creative studio'
        },
        '/strategy': {
            title: 'Brand and Integrated Comms Strategy | The LBSTR ',
            description: 'Strategic consulting by The LBSTR strategy and storytelling studio. We help brands answer challenges through repeated prodding, not just prompting. Dubai-based, globally minded.',
            keywords: 'brand strategy dubai, strategic consulting, brand challenges, problem solving, marketing strategy, strategy storytelling studio'
        },
        '/storytelling': {
            title: 'Cinematic Storytelling & Film Direction | The LBSTR',
            description: 'Award-winning filmmaker Ekta Saran creates memorable brand stories. The LBSTR strategy and storytelling studio: commercial films for Mini Cooper, ADNOC, and personal films winning festivals.',
            keywords: 'brand storytelling, film director dubai, strategy storytelling studio, ekta saran director, commercial films, creative storytelling'
        },
        '/services': {
            title: 'Services | The LBSTR',
            description: 'Comprehensive services from The LBSTR strategy and storytelling studio: brand strategy, creative strategy, integrated communications, scriptwriting, and film direction.',
            keywords: 'strategy storytelling services, brand strategy services, scriptwriting, film direction, integrated communications, dubai studio'
        },
        '/contact': {
            title: 'Contact | The LBSTR',
            description: 'Work with The LBSTR strategy and storytelling studio. Contact filmmaker-strategist duo Ekta & Robert for brand strategy and storytelling. (Or ask for a book recommendation.)',
            keywords: 'contact strategy storytelling studio, brand strategy consultation, film direction services, hello@thelbstr.com, dubai studio'
        },
        '/the-lbstr': {
            title: 'The LBSTR Story | Strategy & Storytelling Studio',
            description: 'A strategist-filmmaker duo with 25 years of award-winning expertise in pushing brand decision making and storytelling to where it should go.',
            keywords: 'about the lbstr, filmmaker strategist duo, ekta saran robert habib, dubai studio story, obsessed disciplined kind'
        }
    };
    
    // Function to update URL and meta tags without affecting UX
    function updateSEOForSection(sectionId) {
        const newURL = sectionURLMap[sectionId];
        if (!newURL) return;
        
        // Update URL with proper history (enables forward/back support)
        const currentURL = window.location.pathname;
        if (currentURL !== newURL) {
            history.replaceState({ section: sectionId }, '', newURL);
        }
        
        // Update meta tags for SEO
        const seo = seoData[newURL];
        if (seo) {
            // Update title
            document.title = seo.title;
            
            // Update meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = seo.description;
            
            // Update meta keywords
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = seo.keywords;
            
            // Update canonical tag to avoid duplicate content
            let canonicalTag = document.querySelector('link[rel="canonical"]');
            if (!canonicalTag) {
                canonicalTag = document.createElement('link');
                canonicalTag.rel = 'canonical';
                document.head.appendChild(canonicalTag);
            }
            canonicalTag.href = `https://thelbstr.com${newURL}`;
            
            // Update Open Graph tags
            updateOpenGraph(seo, newURL);
            
            console.log(`📊 SEO updated for: ${sectionId} (${newURL})`);
        }
    }
    
    // Function to update Open Graph meta tags
    function updateOpenGraph(seo, url) {
        const ogTags = [
            { property: 'og:title', content: seo.title },
            { property: 'og:description', content: seo.description },
            { property: 'og:url', content: `https://thelbstr.com${url}` },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'The LBSTR' }
        ];
        
        ogTags.forEach(tag => {
            let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
            if (!ogTag) {
                ogTag = document.createElement('meta');
                ogTag.setAttribute('property', tag.property);
                document.head.appendChild(ogTag);
            }
            ogTag.content = tag.content;
        });
    }
    
    // Detect current section and update SEO
    function detectCurrentSection() {
        const slides = document.querySelectorAll('.slide');
        let visibleSection = 'home';
        
        slides.forEach(slide => {
            const rect = slide.getBoundingClientRect();
            const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
            
            if (isVisible) {
                visibleSection = slide.id || 'home';
            }
        });
        
        updateSEOForSection(visibleSection);
    }
    
    // Enhanced direct URL access handler
    function handleDirectURLAccess() {
        const currentPath = window.location.pathname;
        
        // If we're on home page, check for redirect intent
        if (currentPath === '/') {
            // Let the redirect handler manage navigation
            setTimeout(() => {
                if (window.lbstrRedirectHandler) {
                    window.lbstrRedirectHandler.navigateToIntendedSection();
                }
            }, 1000);
            return;
        }
        
        // Handle other direct access scenarios
        const targetSection = urlSectionMap[currentPath];
        if (targetSection && document.getElementById(targetSection)) {
            console.log(`🔗 Direct URL access: ${currentPath} → ${targetSection}`);
            setTimeout(() => {
                updateSEOForSection(targetSection);
            }, 1000);
        }
    }
    
    // Set up observers for section changes
    function setupSectionObserver() {
        // Use your existing slide detection logic
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    updateSEOForSection(sectionId);
                }
            });
        }, {
            threshold: [0.5, 1.0]
        });
        
        // Observe all slides
        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide);
        });
    }
    
    // Initialize on page load
    setTimeout(() => {
        handleDirectURLAccess();
        detectCurrentSection();
        setupSectionObserver();
        
        // Also listen to your existing navigation events
        document.addEventListener('slideChanged', function(e) {
            if (e.detail && e.detail.sectionId) {
                updateSEOForSection(e.detail.sectionId);
            }
        });
        
    }, 2000);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            // Let your existing navigation handle the scroll
            // Just update SEO
            setTimeout(() => {
                updateSEOForSection(e.state.section);
            }, 500);
        }
    });
    
    console.log('✅ SEO enhancement active - works on both desktop and mobile!');
});

// Add enhanced structured data for local business and services
document.addEventListener('DOMContentLoaded', function() {
    // Main Organization Schema - UPDATED
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "The LBSTR",
        "description": "Strategy and storytelling studio helping brands solve their biggest challenges",
        "url": "https://thelbstr.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "addressCountry": "AE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "25.2048",
            "longitude": "55.2708"
        },
        "serviceArea": {
            "@type": "Place",
            "name": "Global"
        },
        "areaServed": ["Dubai", "UAE", "Middle East", "Global"],
        "slogan": "The only bad stories are the ones left untold",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Strategy and Storytelling Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Integrated Strategy",
                        "description": "Strategic marketing consulting to help brands answer complex challenges",
                        "url": "https://thelbstr.com/strategy"
                    }
                },
                {
                    "@type": "Offer", 
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Cinematic Storytelling",
                        "description": "Compelling narratives that connect with audiences",
                        "url": "https://thelbstr.com/storytelling"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service", 
                        "name": "Strategy & Storytelling Services",
                        "description": "Comprehensive strategy and storytelling solutions",
                        "url": "https://thelbstr.com/services"
                    }
                }
            ]
        }
    };
    
    // FAQ Schema based on actual Slide 15 content
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What brand challenges does The LBSTR solve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We help brands answer challenges like: getting mixed feedback on brand positioning, finding growth opportunities, understanding new audience segments, improving marketing ROI, aligning messaging across channels, competitive threats, cultural adaptation, traffic conversion, and creating memorable storytelling."
                }
            },
            {
                "@type": "Question", 
                "name": "What makes The LBSTR different from other studios?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We're a strategy and storytelling studio - a filmmaker-strategist duo combining 25 years of expertise. Ekta is a self-taught film director with wins at Top Shorts Film Festival, and Robert managed the Maserati brand across 12 markets, led media and technology divisions and established the first strategy division in C2 Communication's 35-year history. We believe the only bad stories are the ones left untold."
                }
            },
            {
                "@type": "Question",
                "name": "What services does The LBSTR strategy and storytelling studio provide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer brand strategy (diagnosis, positioning, messaging), creative strategy (insight, ideation, territories), integrated communications (journey mapping, content strategy), scriptwriting, film conceptualization, and directing for both commercial and personal stories."
                }
            },
            {
                "@type": "Question",
                "name": "Who are Ekta Saran and Robert Habib?",
                "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "Ekta Saran is a writer-director obsessed with filmmaking craft, currently co-writing a feature film for Image Nation. Robert Habib is a strategist who's spent a decade asking 'What's the story?' across brand, media, technology and strategy roles. They met over a shared love of 'The Lobster' film."
                }
            }
        ]
    };
    
    // Add schemas to page
    const schemas = [organizationSchema, faqSchema];
    
    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        script.id = `structured-data-${index}`;
        document.head.appendChild(script);
    });
    
    console.log('✅ Enhanced structured data added: LocalBusiness + FAQ schemas');
});

// Add this to your Webflow Head Code - Manual Scroll Restoration (Chrome Only)
// Manual scroll position storage and restoration for Chrome ONLY
(function() {
    'use strict';
    
    // Only run on desktop where you have horizontal scrolling
    if (window.innerWidth < 992) return;
    
    // Detect Chrome specifically (don't run on Safari)
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/Edge/.test(navigator.userAgent);
    if (!isChrome) {
        console.log('🍎 Safari detected - skipping scroll restoration (Safari handles this natively)');
        return;
    }
    
    console.log('🔄 Setting up manual scroll restoration for Chrome...');
    
    let scrollPosition = 0;
    let isRestoring = false;
    
    // Save scroll position before page unloads
    function saveScrollPosition() {
        scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem('lbstrScrollPosition', scrollPosition.toString());
        console.log('💾 Saved scroll position:', scrollPosition);
    }
    
    // Restore scroll position after page loads
    function restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('lbstrScrollPosition');
        
        if (savedPosition && !isRestoring) {
            isRestoring = true;
            const targetPosition = parseInt(savedPosition);
            
            console.log('🔄 Attempting to restore scroll position:', targetPosition);
            
            // Wait for GSAP and your scroll system to be ready
            function attemptRestore(attempt = 1, maxAttempts = 8) {
                console.log(`🔄 Restore attempt ${attempt}/${maxAttempts}`);
                
                // Check if GSAP ScrollTrigger is ready
                if (typeof ScrollTrigger === 'undefined') {
                    if (attempt < maxAttempts) {
                        setTimeout(() => attemptRestore(attempt + 1, maxAttempts), 300);
                    } else {
                        console.log('❌ GSAP not ready, restoration failed');
                        sessionStorage.removeItem('lbstrScrollPosition');
                    }
                    return;
                }
                
                // Check if your scroll system is initialized
                const wrapper = document.querySelector('.wrapper');
                const scrollContainer = document.querySelector('.scroll-container');
                
                if (!wrapper || !scrollContainer) {
                    if (attempt < maxAttempts) {
                        setTimeout(() => attemptRestore(attempt + 1, maxAttempts), 300);
                    } else {
                        console.log('❌ Scroll elements not ready, restoration failed');
                        sessionStorage.removeItem('lbstrScrollPosition');
                    }
                    return;
                }
                
                // Check if wrapper has been properly sized (indicates scroll system is ready)
                const wrapperWidth = wrapper.offsetWidth;
                const expectedMinWidth = window.innerWidth * 2; // At least 2 slides worth
                
                if (wrapperWidth < expectedMinWidth) {
                    if (attempt < maxAttempts) {
                        console.log(`⏳ Wrapper not ready (${wrapperWidth}px), waiting...`);
                        setTimeout(() => attemptRestore(attempt + 1, maxAttempts), 300);
                    } else {
                        console.log('❌ Wrapper sizing not ready, restoration failed');
                        sessionStorage.removeItem('lbstrScrollPosition');
                    }
                    return;
                }
                
                // Everything looks ready, restore scroll position
                try {
                    // Disable scroll restoration to prevent conflicts
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }
                    
                    // Smooth scroll to saved position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'auto' // Instant restore, no animation
                    });
                    
                    console.log('✅ Successfully restored scroll position:', targetPosition);
                    
                    // Clean up
                    sessionStorage.removeItem('lbstrScrollPosition');
                    
                    // Re-enable automatic scroll restoration after restore
                    setTimeout(() => {
                        if ('scrollRestoration' in history) {
                            history.scrollRestoration = 'auto';
                        }
                        isRestoring = false;
                    }, 100);
                    
                } catch (error) {
                    console.error('❌ Error during scroll restoration:', error);
                    sessionStorage.removeItem('lbstrScrollPosition');
                    isRestoring = false;
                }
            }
            
            // Start restoration attempts
            attemptRestore();
        } else {
            console.log('📍 No saved scroll position or already restoring');
            isRestoring = false;
        }
    }
    
    // Save position on page unload
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Also save on page hide (for mobile back button scenarios)
    window.addEventListener('pagehide', saveScrollPosition);
    
    // Restore position after page loads
    window.addEventListener('load', function() {
        // Wait a bit for your initialization scripts to run first
        setTimeout(restoreScrollPosition, 1000);
    });
    
    // Alternative: Listen for DOMContentLoaded as backup
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(restoreScrollPosition, 1500);
    });
    
    console.log('✅ Manual scroll restoration system initialized');
})();

/* ---------- Overlay ⇆ burger-icon synchroniser ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-burger-icon-black');
  if (!burger) return;

  setInterval(() => {
    const overlayOpen = document.querySelector('[class$="-modal"].modal-active');
    burger.classList.toggle('menu-open', !!overlayOpen);
  }, 120);
});

// Disable GSAP ScrollTrigger on short screens
(function() {
  function handleShortScreens() {
    if (window.innerWidth >= 768 && window.innerHeight <= 700) {
      console.log('📱 Short desktop screen detected - disabling GSAP');
      
      // Kill any existing ScrollTriggers
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      
      // Reset any transforms
      if (typeof gsap !== 'undefined') {
        gsap.set(".wrapper", { x: 0, clearProps: "all" });
      }
    }
  }
  
  // Run on load and resize
  window.addEventListener('resize', handleShortScreens, { passive: true });
  window.addEventListener('load', handleShortScreens);
  
  // Run immediately
  handleShortScreens();
})();
