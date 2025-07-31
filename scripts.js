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
  if (window.innerWidth < 768) {
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
    if (window.innerWidth < 768) {
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
    if (window.innerWidth >= 768) return; // desktop: keep existing layout
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

// ==========================================
// CLEAN MOBILE NAVIGATION SYSTEM
// Replaces lines 1448-3089 with simple, reliable mobile menu
// ==========================================

(function() {
    'use strict';
    
    // Only run on mobile - leave desktop completely alone
    if (window.innerWidth >= 768) {
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
    if (window.innerWidth < 768) {
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
    if (window.innerWidth >= 768) {
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
            if (window.innerWidth >= 768) {
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
    if (window.innerWidth >= 768) return;
    
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
    if (window.innerWidth >= 768) return;
    
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
    if (window.innerWidth >= 768) return;
    
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
    if (window.innerWidth >= 768) return;
    
    console.log('📱 Loading complete mobile menu solution...');
    
    const burger = document.querySelector('.nav-burger-icon-black');
    const mobileMenu = document.querySelector('.nav-menu-mobile');
    const navBar = document.querySelector('.nav-bar');
    
    if (!burger || !mobileMenu || !navBar) {
        console.log('❌ Missing mobile menu elements');
        return;
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
    if (window.innerWidth >= 768) {
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
    if (window.innerWidth < 768) return;
    
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
    if (window.innerWidth < 768) {
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
        if (window.innerWidth < 768) {
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

<script>
// Slide 2 Text Animation - Film Festival Cinematic Style
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 2 text animations');
        return;
    }
    
    console.log('🎬 Initializing Slide 2 text animations...');
    
    let animationTriggered = false;
    
    function initSlide2Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide2Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 2 animations...');
        
        // Find the text elements
        const dateColumn = document.querySelector('.date-column');
        const headlineBlock = document.querySelector('.headline-block');
        const bodyTextBlock = document.querySelector('.body-text-block-may2015');
        
        // Check if elements exist
        if (!dateColumn || !headlineBlock || !bodyTextBlock) {
            console.log('❌ Some text elements not found for slide 2');
            console.log('Date column:', dateColumn);
            console.log('Headline block:', headlineBlock);
            console.log('Body text block:', bodyTextBlock);
            return;
        }
        
        console.log('✅ Found all slide 2 text elements');
        
        // Hide elements initially
        gsap.set([dateColumn, headlineBlock, bodyTextBlock], { 
            opacity: 0,
            y: 30
        });
        
        // Special setup for "2015" - make it more dramatic
        gsap.set(dateColumn, {
            opacity: 0,
            scale: 0.8,
            y: 50
        });
        
        console.log('🎯 Hidden slide 2 text elements initially');
        
        // Animation function
        function animateSlide2Text() {
            if (animationTriggered) {
                console.log('🔄 Slide 2 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('🎬 Starting slide 2 cinematic text animation...');
            
            // Create timeline for sequenced animation
            const tl = gsap.timeline();
            
            // 1. "2015" (or date) - Big dramatic entrance (slower)
            tl.to(dateColumn, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 2.0,
                ease: "back.out(1.7)",
                onComplete: () => console.log('✅ Date column animated')
            })
            
            // 2. Main headline - Film credits style fade up (slower)
            .to(headlineBlock, {
                opacity: 1,
                y: 0,
                duration: 2.5,
                ease: "power3.out",
                onComplete: () => console.log('✅ Headline animated')
            }, "-=1.2") // Start 1.2s before previous animation ends
            
            // 3. Body text - Typewriter/fade effect (slower)
            .to(bodyTextBlock, {
                opacity: 1,
                y: 0,
                duration: 3.0,
                ease: "power2.out",
                onComplete: () => console.log('✅ Body text animated')
            }, "-=1.8"); // Start 1.8s before previous animation ends
            
            console.log('🎭 Slide 2 animation sequence started');
        }
        
        // Setup visibility detection for the-beginning slide
        const theBeginningSlide = document.getElementById('the-beginning');
        if (theBeginningSlide) {
            console.log('📱 Setting up Intersection Observer for slide 2...');
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ Slide 2 visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log('🎯 Slide 2 is significantly visible!');
                        animateSlide2Text();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(theBeginningSlide);
            
            // Manual polling as backup
            function checkSlide2Visibility() {
                if (animationTriggered) return;
                
                const rect = theBeginningSlide.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log('🎯 Polling detected slide 2 is visible!');
                    animateSlide2Text();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkSlide2Visibility();
                if (animationTriggered) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkSlide2Visibility();
            }, 100);
            
        } else {
            console.log('❌ the-beginning slide not found');
        }
        
        console.log('✅ Slide 2 animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide2Animation, 2000);
});

console.log('🎬 Slide 2 text animation system loaded');
</script>

<script>
// Slide 4 Screenplay Typewriter Animation - Right Side Dialogue Only
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 4 typewriter animation');
        return;
    }
    
    console.log('📝 Initializing Slide 4 typewriter animation (right side only)...');
    
    let animationTriggered = false;
    
    function initSlide4Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide4Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 4 typewriter...');
        
        // Find screenplay slide
        const screenplaySlide = document.getElementById('screenplay');
        if (!screenplaySlide) {
            console.log('❌ Screenplay slide not found');
            return;
        }
        
        // Find ONLY the right dialogue container
        const dialogueRight = screenplaySlide.querySelector('.dialogue-right');
        if (!dialogueRight) {
            console.log('❌ Right dialogue container not found');
            return;
        }
        
        console.log('✅ Found right dialogue container');
        
        // Get all text elements from the right side only
        const rightTextElements = dialogueRight.querySelectorAll('*');
        const dialogueElements = [];
        
        rightTextElements.forEach(element => {
            const text = element.textContent || element.innerText;
            // Only include elements that have text and no child elements (leaf nodes)
            if (text && text.trim() && element.children.length === 0) {
                dialogueElements.push({
                    element: element,
                    text: text.trim(),
                    className: element.className
                });
            }
        });
        
        console.log(`✅ Found ${dialogueElements.length} dialogue elements on right side:`, dialogueElements);
        
        if (dialogueElements.length === 0) {
            console.log('❌ No dialogue elements found');
            return;
        }
        
        // Store original texts and clear elements
        const originalTexts = dialogueElements.map(item => {
            const text = item.text;
            item.element.textContent = ''; // Clear the text
            item.element.style.opacity = '1'; // Ensure container is visible
            return text;
        });
        
        console.log('🎯 Cleared right dialogue text, ready for typewriter effect');
        
        // Typewriter animation function
        function typewriterEffect(element, text, speed = 40, callback = null) {
            let i = 0;
            element.textContent = ''; // Ensure it starts empty
            
            function typeChar() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    
                    // Variable speed for punctuation pauses
                    let nextDelay = speed;
                    if (text.charAt(i - 1) === '.') nextDelay = speed * 3;
                    else if (text.charAt(i - 1) === ',') nextDelay = speed * 2;
                    else if (text.charAt(i - 1) === '?') nextDelay = speed * 2.5;
                    else if (text.charAt(i - 1) === '\n') nextDelay = speed * 2;
                    
                    setTimeout(typeChar, nextDelay);
                } else if (callback) {
                    // Pause before next element
                    setTimeout(callback, speed * 8);
                }
            }
            
            typeChar();
        }
        
        // Main animation function
        function animateTypewriter() {
            if (animationTriggered) {
                console.log('🔄 Slide 4 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('📝 Starting right-side dialogue typewriter animation...');
            
            // Start typing sequence
            let currentIndex = 0;
            
            function typeNextElement() {
                if (currentIndex < dialogueElements.length) {
                    const currentItem = dialogueElements[currentIndex];
                    const currentText = originalTexts[currentIndex];
                    
                    console.log(`📝 Typing element ${currentIndex + 1}: "${currentText.substring(0, 30)}..."`);
                    
                    // Determine speed based on content type
                    let speed = 45; // Default speed
                    
                    // Character names (likely to be green/short) type faster
                    if (currentText.length < 20 && (currentText.includes('Hotel') || currentText.includes('David'))) {
                        speed = 30;
                    }
                    // Questions type with normal speed
                    else if (currentText.includes('?')) {
                        speed = 40;
                    }
                    // Long responses type slightly slower for readability
                    else if (currentText.length > 50) {
                        speed = 50;
                    }
                    // Short responses type faster
                    else if (currentText.length < 20) {
                        speed = 60;
                    }
                    
                    typewriterEffect(currentItem.element, currentText, speed, () => {
                        currentIndex++;
                        typeNextElement();
                    });
                } else {
                    console.log('✅ All dialogue elements typed out!');
                }
            }
            
            // Start the sequence with a small delay
            setTimeout(typeNextElement, 800);
        }
        
        // Setup visibility detection for screenplay slide
        if (screenplaySlide) {
            console.log('📱 Setting up Intersection Observer for slide 4...');
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ Slide 4 visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log('🎯 Slide 4 is significantly visible!');
                        animateTypewriter();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(screenplaySlide);
            
            // Manual polling as backup
            function checkSlide4Visibility() {
                if (animationTriggered) return;
                
                const rect = screenplaySlide.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log('🎯 Polling detected slide 4 is visible!');
                    animateTypewriter();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkSlide4Visibility();
                if (animationTriggered) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkSlide4Visibility();
            }, 100);
        }
        
        console.log('✅ Slide 4 typewriter animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide4Animation, 2000);
});

console.log('📝 Slide 4 right-side typewriter animation system loaded');
</script>

<script>
// Slide 6 Ekta Animation - WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 6 animations');
        return;
    }
    
    console.log('🎭 Initializing Slide 6 Ekta WORKING animation...');
    
    let animationTriggered = false;
    
    function initSlide6Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide6Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 6 animations...');
        
        // Find the slide
        const ektaSlide = document.getElementById('ekta');
        if (!ektaSlide) {
            console.log('❌ Ekta slide not found');
            return;
        }
        
        console.log('✅ Found ekta slide');
        
        // Get the heading by ID (much more reliable!)
        const headingElement = ektaSlide.querySelector('#heading-3');
        
        console.log('🔍 Heading element (#heading-3):', headingElement);
        
        // Get all other text elements for body content
        const allElements = ektaSlide.querySelectorAll('*');
        const bodyElements = [];
        
        allElements.forEach(element => {
            const text = element.textContent || element.innerText;
            // Skip the heading element we already found, only include meaningful text
            if (element !== headingElement && text && text.trim().length > 10 && element.children.length === 0) {
                bodyElements.push(element);
            }
        });
        
        console.log(`✅ Found heading:`, headingElement);
        console.log(`✅ Found ${bodyElements.length} body elements:`, bodyElements);
        
        // Create animation sequence: heading first, then body elements
        const allTextElements = [];
        if (headingElement) allTextElements.push(headingElement);
        allTextElements.push(...bodyElements);
        
        console.log('📝 Animation sequence:', allTextElements);
        
        // Set initial states - hidden
        gsap.set(allTextElements, { 
            opacity: 0,
            y: 20
        });
        
        console.log('🎯 Set initial states - all text elements hidden');
        
        // Main animation function
        function animateSlide6() {
            if (animationTriggered) {
                console.log('🔄 Slide 6 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('🎭 Starting slide 6 sequential dissolve animation...');
            
            // Create timeline for staggered animation
            const tl = gsap.timeline();
            
            // Animate all text elements with stagger
            tl.to(allTextElements, {
                opacity: 1,
                y: 0,
                duration: 2.0,
                stagger: 0.6,
                ease: "power2.out",
                delay: 0.8,
                onStart: () => console.log('📝 Text dissolve animation started'),
                onComplete: () => console.log('✅ All text animations completed')
            });
        }
        
        // Setup visibility detection for ekta slide
        console.log('📱 Setting up Intersection Observer for ekta slide...');
        
        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log(`👁️ Ekta slide visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    console.log('🎯 Ekta slide is significantly visible!');
                    animateSlide6();
                }
            });
        }, {
            threshold: [0, 0.5, 1.0]
        });
        
        observer.observe(ektaSlide);
        
        // Manual polling as backup
        function checkSlide6Visibility() {
            if (animationTriggered) return;
            
            const rect = ektaSlide.getBoundingClientRect();
            const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
            
            if (isVisible) {
                console.log('🎯 Polling detected ekta slide is visible!');
                animateSlide6();
            }
        }
        
        // Check every 500ms
        const pollInterval = setInterval(() => {
            checkSlide6Visibility();
            if (animationTriggered) {
                clearInterval(pollInterval);
            }
        }, 500);
        
        // Check immediately if already visible
        setTimeout(() => {
            checkSlide6Visibility();
        }, 100);
        
        console.log('✅ Slide 6 animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide6Animation, 2000);
});

console.log('🎭 Slide 6 Ekta WORKING animation loaded');

// Slide 7 – Stranger Typewriter Animation + Note Dissolve
document.addEventListener('DOMContentLoaded', () => {
  // Only on desktop
  if (window.innerWidth < 768) return;
  let animationTriggered = false;

  function initSlide7Animation() {
    // Wait for GSAP
    if (typeof gsap === 'undefined') {
      return setTimeout(initSlide7Animation, 500);
    }

    const slide             = document.getElementById('stranger');
    const dialogueContainer = slide?.querySelector('.slide-7-dialogue');
    const noteElement       = slide?.querySelector('.slide-7-note');
    if (!slide || !dialogueContainer || !noteElement) return;

    // 1) Collect all leaf text elements
    const dialogueEls = [];
    dialogueContainer.querySelectorAll('*').forEach(el => {
      const txt = el.textContent.trim();
      if (txt && el.children.length === 0) {
        dialogueEls.push(el);
      }
    });
    if (dialogueEls.length === 0) return;

    // 2) Store originals & clear for typewriter
    const originals = dialogueEls.map(el => {
      const t = el.textContent.trim();
      el.textContent = '';
      el.style.opacity = '1';    // ensure visible
      return t;
    });

    // 3) Prepare the note for fade
    noteElement.style.opacity    = '0';
    noteElement.style.transform  = 'translateY(20px)';

    // --- Typewriter function (same as Slide 4) ---
    function typewriterEffect(el, text, speed = 40, cb) {
      let i = 0;
      el.textContent = '';
      function typeChar() {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
          let delay = speed;
          const ch = text.charAt(i - 1);
          if (ch === '.')      delay = speed * 3;
          else if (ch === ',') delay = speed * 2;
          else if (ch === '?') delay = speed * 2.5;
          setTimeout(typeChar, delay);
        } else if (cb) {
          setTimeout(cb, speed * 8);
        }
      }
      typeChar();
    }

    // 4) Drive the sequence
    function animateSequence() {
      if (animationTriggered) return;
      animationTriggered = true;

      let idx = 0;
      function next() {
        if (idx < dialogueEls.length) {
          typewriterEffect(
            dialogueEls[idx],
            originals[idx],
            45,
            () => { idx++; next(); }
          );
        } else {
          // all dialogue done → dissolve in the note
          gsap.to(noteElement, {
            opacity: 1,
            y:       0,
            duration: 0.6,
            ease:    'power2.out',
            delay:   0.2
          });
        }
      }
      // small startup delay to match Slide 4
      setTimeout(next, 800);
    }

    // 5) Trigger when #stranger is in view (IO + polling fallback)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          animateSequence();
        }
      });
    }, { threshold: [0, 0.5, 1] });
    observer.observe(slide);

    const poll = setInterval(() => {
      if (animationTriggered) {
        clearInterval(poll);
        return;
      }
      const rect = slide.getBoundingClientRect();
      const inView = rect.left < window.innerWidth * 0.8 &&
                     rect.right > window.innerWidth * 0.2;
      if (inView) animateSequence();
    }, 500);
  }

  // Kick it off after a brief delay
  setTimeout(initSlide7Animation, 1000);
});

// Slide 9 Partners Animation - TYPEWRITER REVEAL EFFECT
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 9 animations');
        return;
    }
    
    console.log('🤝 Initializing Slide 9 Partners animation with TYPEWRITER effect...');
    
    let animationTriggered = false;
    
    function initSlide9Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide9Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 9 animations...');
        
        // Find the slide and elements
        const partnersSlide = document.getElementById('partners');
        if (!partnersSlide) {
            console.log('❌ Partners slide not found');
            return;
        }
        
        // Find the three elements in the order they'll animate
        const heroImage = partnersSlide.querySelector('.slide-9-hero-image');
        const textElement = partnersSlide.querySelector('.slide-9-text');
        const dateColumn = partnersSlide.querySelector('.slide-9-date-column');
        
        console.log('🔍 Hero image element:', heroImage);
        console.log('🔍 Text element:', textElement);
        console.log('🔍 Date column element:', dateColumn);
        
        // Check if all elements exist
        const foundElements = [heroImage, textElement, dateColumn].filter(el => el !== null);
        
        if (foundElements.length === 0) {
            console.log('❌ No slide 9 elements found');
            return;
        }
        
        console.log(`✅ Found ${foundElements.length} elements for animation`);
        
        // Set initial states - hidden with slight Y offset for text elements
        gsap.set([textElement, dateColumn].filter(el => el !== null), { 
            opacity: 0,
            y: 30
        });
        
        // Set hero image initial state for typewriter effect
        if (heroImage) {
            heroImage.style.position = 'relative';
            heroImage.style.overflow = 'hidden';
            heroImage.style.clipPath = 'inset(0 100% 0 0)';
            gsap.set(heroImage, { opacity: 1 }); // Image is visible but clipped
        }
        
        console.log('🎯 Set initial states - typewriter effect ready');
        
        // Typewriter Reveal Effect
        function createTypewriterReveal(imageElement) {
            console.log('📝 Creating TYPEWRITER REVEAL effect...');
            
            return gsap.timeline()
                .to(imageElement, {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.6,
                    ease: "power2.inOut",
                    onStart: () => console.log('📝 Typewriter reveal started'),
                    onComplete: () => {
                        imageElement.style.clipPath = 'none';
                        console.log('✅ Typewriter reveal completed');
                    }
                });
        }
        
        // Main animation function
        async function animateSlide9() {
            if (animationTriggered) {
                console.log('🔄 Slide 9 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('🤝 Starting slide 9 partners animation sequence with TYPEWRITER...');
            
            // Create timeline for sequential animation
            const tl = gsap.timeline();
            
            // Step 1: Hero image with typewriter effect
            if (heroImage) {
                const typewriterEffect = createTypewriterReveal(heroImage);
                tl.add(typewriterEffect, 0.8);
                console.log('📝 Typewriter effect added to timeline');
            }
            
            // Step 2: Text fades in second (longer gap) - UNCHANGED
            if (textElement) {
                tl.to(textElement, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    onStart: () => console.log('📝 Text fade-in started'),
                    onComplete: () => console.log('✅ Text fade-in completed')
                }, "+=0.6"); // Wait 0.6s after hero image completes
            }
            
            // Step 3: Date column fades in last (even longer gap) - UNCHANGED
            if (dateColumn) {
                tl.to(dateColumn, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    onStart: () => console.log('📅 Date column fade-in started'),
                    onComplete: () => console.log('✅ Date column fade-in completed')
                }, "+=1.0"); // Wait 1.0s after text completes
            }
        }
        
        // Setup visibility detection for partners slide - UNCHANGED
        if (partnersSlide) {
            console.log('📱 Setting up Intersection Observer for slide 9...');
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ Slide 9 visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log('🎯 Slide 9 is significantly visible!');
                        animateSlide9();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(partnersSlide);
            
            // Manual polling as backup
            function checkSlide9Visibility() {
                if (animationTriggered) return;
                
                const rect = partnersSlide.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log('🎯 Polling detected slide 9 is visible!');
                    animateSlide9();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkSlide9Visibility();
                if (animationTriggered) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkSlide9Visibility();
            }, 100);
        }
        
        console.log('✅ Slide 9 typewriter animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide9Animation, 2000);
});

console.log('📝 Slide 9 Partners TYPEWRITER animation loaded');

// Slide 10 The LBSTR Animation - Credits then Copy Fade-in
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 10 animations');
        return;
    }
    
    console.log('🏠 Initializing Slide 10 The LBSTR animation...');
    
    let animationTriggered = false;
    
    function initSlide10Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide10Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 10 animations...');
        
        // Find the slide and elements
        const lbstrSlide = document.getElementById('the-lbstr');
        if (!lbstrSlide) {
            console.log('❌ The LBSTR slide not found');
            return;
        }
        
        // Find the three elements in animation order
        const ektaCredits = lbstrSlide.querySelector('.slide-10-credits-ekta');
        const robertCredits = lbstrSlide.querySelector('.slide-10-credits-robert');
        const copyElement = lbstrSlide.querySelector('.slide-10-copy');
        
        console.log('🔍 Ekta credits element:', ektaCredits);
        console.log('🔍 Robert credits element:', robertCredits);
        console.log('🔍 Copy element:', copyElement);
        
        // Check which elements exist
        const foundElements = [ektaCredits, robertCredits, copyElement].filter(el => el !== null);
        
        if (foundElements.length === 0) {
            console.log('❌ No slide 10 elements found');
            return;
        }
        
        console.log(`✅ Found ${foundElements.length} elements for animation`);
        
        // Set initial states - hidden with slight Y offset
        gsap.set(foundElements, { 
            opacity: 0,
            y: 20
        });
        
        console.log('🎯 Set initial states - all elements hidden');
        
        // Main animation function
        function animateSlide10() {
            if (animationTriggered) {
                console.log('🔄 Slide 10 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('🏠 Starting slide 10 The LBSTR animation sequence...');
            
            // Create timeline for sequential animation
            const tl = gsap.timeline();
            
            // Step 1: Ekta credits fade in first
            if (ektaCredits) {
                tl.to(ektaCredits, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    delay: 0.8,
                    onStart: () => console.log('👩‍🎬 Ekta credits fade-in started'),
                    onComplete: () => console.log('✅ Ekta credits fade-in completed')
                });
            }
            
            // Step 2: Robert credits fade in second
            if (robertCredits) {
                tl.to(robertCredits, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    onStart: () => console.log('👨‍💼 Robert credits fade-in started'),
                    onComplete: () => console.log('✅ Robert credits fade-in completed')
                }, "+=0.4"); // Wait 0.4s after Ekta completes
            }
            
            // Step 3: Copy fades in last
            if (copyElement) {
                tl.to(copyElement, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    onStart: () => console.log('📝 Copy fade-in started'),
                    onComplete: () => console.log('✅ Copy fade-in completed')
                }, "+=0.6"); // Wait 0.6s after Robert completes
            }
        }
        
        // Setup visibility detection for the-lbstr slide
        if (lbstrSlide) {
            console.log('📱 Setting up Intersection Observer for slide 10...');
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ Slide 10 visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log('🎯 Slide 10 is significantly visible!');
                        animateSlide10();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(lbstrSlide);
            
            // Manual polling as backup
            function checkSlide10Visibility() {
                if (animationTriggered) return;
                
                const rect = lbstrSlide.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log('🎯 Polling detected slide 10 is visible!');
                    animateSlide10();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkSlide10Visibility();
                if (animationTriggered) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkSlide10Visibility();
            }, 100);
        }
        
        console.log('✅ Slide 10 animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide10Animation, 2000);
});

console.log('🏠 Slide 10 The LBSTR animation loaded');

// Slide 13 Strategy Animation - Sequential Fade In
document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - skipping slide 13 animations');
        return;
    }
    
    console.log('📋 Initializing Slide 13 Strategy sequential fade animation...');
    
    let animationTriggered = false;
    
    function initSlide13Animation() {
        // Check if GSAP is ready
        if (typeof gsap === 'undefined') {
            console.log('⏳ GSAP not ready, waiting...');
            setTimeout(initSlide13Animation, 500);
            return;
        }
        
        console.log('✅ GSAP ready, setting up slide 13 animations...');
        
        // Find the slide
        const strategySlide = document.getElementById('strategy');
        if (!strategySlide) {
            console.log('❌ Strategy slide not found');
            return;
        }
        
        // Find the three elements in animation order
        const headline = strategySlide.querySelector('.slide-13-headline');
        const note = strategySlide.querySelector('.slide-13-note');
        const bodyCopy = strategySlide.querySelector('.slide-13-bodycopy');
        
        console.log('🔍 Headline element (.slide-13-headline):', headline);
        console.log('🔍 Note element (.slide-13-note):', note);
        console.log('🔍 Body copy element (.slide-13-bodycopy):', bodyCopy);
        
        // Check which elements exist
        const foundElements = [headline, note, bodyCopy].filter(el => el !== null);
        
        if (foundElements.length === 0) {
            console.log('❌ No slide 13 elements found');
            return;
        }
        
        console.log(`✅ Found ${foundElements.length} elements for animation`);
        
        // Set initial states - hidden with slight Y offset
        gsap.set(foundElements, { 
            opacity: 0,
            y: 20
        });
        
        console.log('🎯 Set initial states - all elements hidden');
        
        // Main animation function
        function animateSlide13() {
            if (animationTriggered) {
                console.log('🔄 Slide 13 animation already triggered, skipping');
                return;
            }
            
            animationTriggered = true;
            console.log('📋 Starting slide 13 strategy sequential animation...');
            
            // Create timeline for sequential animation
            const tl = gsap.timeline();
            
            // Step 1: Headline fades in first
            if (headline) {
                tl.to(headline, {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power2.out",
                    delay: 0.8,
                    onStart: () => console.log('📝 Headline fade-in started'),
                    onComplete: () => console.log('✅ Headline fade-in completed')
                });
            }
            
            // Step 2: Note fades in after 1 second
            if (note) {
                tl.to(note, {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power2.out",
                    onStart: () => console.log('📌 Note fade-in started'),
                    onComplete: () => console.log('✅ Note fade-in completed')
                }, "+=1.0"); // Wait 1 second after headline completes
            }
            
            // Step 3: Body copy fades in after another 1 second
            if (bodyCopy) {
                tl.to(bodyCopy, {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: "power2.out",
                    onStart: () => console.log('📖 Body copy fade-in started'),
                    onComplete: () => console.log('✅ Body copy fade-in completed')
                }, "+=1.0"); // Wait 1 second after note completes
            }
        }
        
        // Setup visibility detection for strategy slide
        if (strategySlide) {
            console.log('📱 Setting up Intersection Observer for slide 13...');
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log(`👁️ Slide 13 visible: ${entry.isIntersecting} (ratio: ${entry.intersectionRatio})`);
                    
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        console.log('🎯 Slide 13 is significantly visible!');
                        animateSlide13();
                    }
                });
            }, {
                threshold: [0, 0.5, 1.0]
            });
            
            observer.observe(strategySlide);
            
            // Manual polling as backup
            function checkSlide13Visibility() {
                if (animationTriggered) return;
                
                const rect = strategySlide.getBoundingClientRect();
                const isVisible = rect.left < window.innerWidth * 0.8 && rect.right > window.innerWidth * 0.2;
                
                if (isVisible) {
                    console.log('🎯 Polling detected slide 13 is visible!');
                    animateSlide13();
                }
            }
            
            // Check every 500ms
            const pollInterval = setInterval(() => {
                checkSlide13Visibility();
                if (animationTriggered) {
                    clearInterval(pollInterval);
                }
            }, 500);
            
            // Check immediately if already visible
            setTimeout(() => {
                checkSlide13Visibility();
            }, 100);
        }
        
        console.log('✅ Slide 13 animation setup complete');
    }
    
    // Wait for elements to load
    setTimeout(initSlide13Animation, 2000);
});

console.log('📋 Slide 13 Strategy sequential animation loaded');

// ——— Slide 15 “Problem Solving” Sequential Fade-In ———
document.addEventListener('DOMContentLoaded', function() {
  // Only on desktop
  if (window.innerWidth < 768) return;
  let animationTriggered = false;

  function initSlide15() {
    // Wait for GSAP
    if (typeof gsap === 'undefined') {
      setTimeout(initSlide15, 500);
      return;
    }

    const slide = document.getElementById('problem-solving');
    if (!slide) return;

    // Grab headline + challenges 1–14 + note
    const elems = [
      slide.querySelector('.slide-15-headline'),
      ...Array.from({ length: 14 }, (_, i) => document.getElementById(`challenge-${i+1}`)),
      document.getElementById('challenge-note')
    ].filter(Boolean);

    // Hide them initially
    gsap.set(elems, { opacity: 0, y: 20 });

    function play() {
      if (animationTriggered) return;
      animationTriggered = true;

      const tl = gsap.timeline();
      elems.forEach(el => {
        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power2.out'
        });
      });
    }

    // Trigger when slide is ~50% in view
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          play();
        }
      });
    }, { threshold: [0, 0.5, 1.0] });

    obs.observe(slide);
  }

  // Give the DOM time to settle
  setTimeout(initSlide15, 2000);
});

// ——— Slide 16 “Storytelling” Sequential Fade-In ———
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 768) return; // Desktop only
  let animationTriggered = false;

  function initSlide16() {
    if (typeof gsap === 'undefined') {
      setTimeout(initSlide16, 500);
      return;
    }

    const slide = document.getElementById('storytelling');
    if (!slide) return;

    const heading1 = document.getElementById('story-heading-1');
    const heading2 = document.getElementById('story-heading-2');
    const note = slide.querySelector('.slide-16-note');

    if (!heading1 || !heading2 || !note) return;

    gsap.set([heading1, heading2, note], { opacity: 0, y: 20 });

    function play() {
      if (animationTriggered) return;
      animationTriggered = true;

      const tl = gsap.timeline();
      tl.to(heading1, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' })
        .to(heading2, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' })
        .to(note, { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out' });
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          play();
        }
      });
    }, { threshold: [0, 0.5, 1.0] });

    obs.observe(slide);
  }

  setTimeout(initSlide16, 2000);
});

// ——— Slide 17 “Ideas” Sequential Fade-In ———
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 768) return;
  let animationTriggered = false;

  function initSlide17() {
    if (typeof gsap === 'undefined') {
      setTimeout(initSlide17, 500);
      return;
    }

    const slide = document.getElementById('ideas');
    if (!slide) return;

    const copy = slide.querySelector('.slide-17-copy');
    const note = slide.querySelector('.slide-17-note');

    if (!copy || !note) return;

    gsap.set([copy, note], { opacity: 0, y: 20 });

    function play() {
      if (animationTriggered) return;
      animationTriggered = true;

      const tl = gsap.timeline();
      tl.to(copy, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' })
        .to(note, { opacity: 1, y: 0, duration: 2.0, ease: 'power1.out' });
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          play();
        }
      });
    }, { threshold: [0, 0.5, 1.0] });

    obs.observe(slide);
  }

  setTimeout(initSlide17, 2000);
});

// ——— Slide 18 “The Storyteller” Fade-In ———
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 768) return;
  let animationTriggered = false;

  function initSlide18() {
    if (typeof gsap === 'undefined') {
      setTimeout(initSlide18, 500);
      return;
    }

    const slide = document.getElementById('the-storyteller');
    if (!slide) return;

    const copy = slide.querySelector('.slide-18-copy');
    if (!copy) return;

    gsap.set(copy, { opacity: 0, y: 20 });

    function play() {
      if (animationTriggered) return;
      animationTriggered = true;

      gsap.to(copy, {
        opacity: 1,
        y: 0,
        duration: 1.6,           // longer duration for smoother entrance
        ease: 'power2.out'
      });
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          play();
        }
      });
    }, { threshold: [0, 0.5, 1.0] });

    obs.observe(slide);
  }

  setTimeout(initSlide18, 2000);
});
