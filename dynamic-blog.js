// dynamic-blog.js
// Script to dynamically update blog content based on player profile

document.addEventListener('DOMContentLoaded', function() {
  // Initialize dynamic blog content
  const blogManager = new DynamicBlogManager();
  blogManager.initialize();
});

/**
 * Dynamic Blog Content Manager
 * Handles fetching and rendering personalized blog content
 */
class DynamicBlogManager {
  constructor() {
    this.playerEmail = null;
    this.blogContent = null;
    this.contentContainer = document.querySelector('.container main');
    this.initialized = false;
  }

  /**
   * Initialize the blog manager
   */
  async initialize() {
    if (this.initialized) return;
    
    // Get player email from URL parameter or localStorage
    this.playerEmail = this.getPlayerEmail();
    
    if (!this.playerEmail) {
      console.log('No player email found, showing static content');
      return;
    }
    
    // Load dynamic content
    await this.loadDynamicContent();
    this.initialized = true;
  }

  /**
   * Get player email from URL parameter or localStorage
   * @returns {string|null} - Player's email or null
   */
  getPlayerEmail() {
    // First check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const playerParam = urlParams.get('player');
    
    if (playerParam) {
      // Store in localStorage for future use
      localStorage.setItem('player_email', playerParam);
      return playerParam;
    }
    
    // Check localStorage as fallback
    return localStorage.getItem('player_email');
  }

  /**
   * Load dynamic blog content from API
   */
  async loadDynamicContent() {
    try {
      // Show subtle loading indicator
      this.showLoadingState();
      
      // Fetch dynamic content from API
      const response = await fetch(`https://decoding-death-backend.vercel.app/api/external/blog-content?player=${encodeURIComponent(this.playerEmail)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to load blog content');
      }
      
      this.blogContent = await response.json();
      
      // Update the blog content
      this.updateBlogContent();
      
      // Apply hidden clues
      this.applyHiddenClues();
      
    } catch (error) {
      console.error('Error loading dynamic blog content:', error);
      // Fallback to static content on error
    } finally {
      // Remove loading indicator
      this.hideLoadingState();
    }
  }

  /**
   * Show subtle loading state while content loads
   */
  showLoadingState() {
    if (!this.contentContainer) return;
    
    // Reduce opacity of current content
    this.contentContainer.style.opacity = '0.6';
    this.contentContainer.style.transition = 'opacity 0.5s ease';
    
    // Add subtle loading indicator
    const loader = document.createElement('div');
    loader.id = 'blog-loader';
    loader.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 3px solid #333;
      border-top: 3px solid #a70000;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      z-index: 1000;
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loader);
  }

  /**
   * Hide loading state after content loads
   */
  hideLoadingState() {
    if (!this.contentContainer) return;
    
    // Restore opacity
    this.contentContainer.style.opacity = '1';
    
    // Remove loader
    const loader = document.getElementById('blog-loader');
    if (loader) {
      loader.remove();
    }
  }

  /**
   * Update blog content with dynamically generated entries
   */
  updateBlogContent() {
    if (!this.contentContainer || !this.blogContent || !this.blogContent.entries) return;
    
    // Clear existing content
    this.contentContainer.innerHTML = '';
    
    // Create entries
    this.blogContent.entries.forEach(entry => {
      const entryElement = document.createElement('div');
      entryElement.className = 'entry';
      
      const dateElement = document.createElement('div');
      dateElement.className = 'date';
      dateElement.textContent = entry.date;
      
      const contentElement = document.createElement('div');
      contentElement.className = 'content';
      
      // Convert content string to paragraphs
      const paragraphs = entry.content.split('\n\n');
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          const p = document.createElement('p');
          p.textContent = paragraph;
          contentElement.appendChild(p);
        }
      });
      
      entryElement.appendChild(dateElement);
      entryElement.appendChild(contentElement);
      
      this.contentContainer.appendChild(entryElement);
    });
    
    // Append original footer if needed
    const originalFooter = document.querySelector('footer');
    if (originalFooter) {
      const footerClone = originalFooter.cloneNode(true);
      this.contentContainer.appendChild(footerClone);
    }
  }

  /**
   * Apply hidden clues to the page
   */
  applyHiddenClues() {
    if (!this.blogContent || !this.blogContent.hiddenClues) return;
    
    const { konamiCode, htmlComment, cssClue, firstLetterMessage } = this.blogContent.hiddenClues;
    
    // Add HTML comment
    if (htmlComment) {
      const commentNode = document.createComment(htmlComment.replace(/<!--\s*|\s*-->/g, ''));
      this.contentContainer.appendChild(commentNode);
    }
    
    // Add CSS clue
    if (cssClue) {
      const style = document.createElement('style');
      style.textContent = `${cssClue.selector} { ${cssClue.style} }`;
      document.head.appendChild(style);
    }
    
    // Add first letter message
    if (firstLetterMessage && firstLetterMessage.paragraphs && firstLetterMessage.paragraphs.length > 0) {
      // Create hidden section for this
      const hiddenSection = document.createElement('div');
      hiddenSection.className = 'hidden-content';
      hiddenSection.style.cssText = 'opacity: 0.1; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;';
      
      firstLetterMessage.paragraphs.forEach((paragraph, index) => {
        const p = document.createElement('p');
        p.className = 'first-letter-clue';
        p.textContent = paragraph;
        // Add special style to first letter
        const style = document.createElement('style');
        style.textContent = `.first-letter-clue:nth-child(${index + 1})::first-letter { color: #a70000; }`;
        document.head.appendChild(style);
        
        hiddenSection.appendChild(p);
      });
      
      this.contentContainer.appendChild(hiddenSection);
    }
    
    // Add Konami code if enabled
    if (konamiCode) {
      this.setupKonamiCode();
    }
  }

  /**
   * Setup Konami code easter egg
   */
  setupKonamiCode() {
    // Konami code sequence
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                          'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    // Listen for key presses
    document.addEventListener('keydown', function(e) {
      // Reset if key doesn't match sequence
      if (e.key !== konamiSequence[konamiIndex]) {
        konamiIndex = 0;
        return;
      }
      
      // Increment index
      konamiIndex++;
      
      // Check if sequence is complete
      if (konamiIndex === konamiSequence.length) {
        // Reveal hidden message
        const secretDiv = document.createElement('div');
        secretDiv.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px;
          background-color: #a70000;
          color: #fff;
          font-family: 'Courier New', monospace;
          z-index: 1000;
          box-shadow: 0 0 20px rgba(167, 0, 0, 0.6);
        `;
        
        // Get a random message
        const messages = [
          "THE CLOCK TOWER HOLDS THE KEY",
          "LOOK BENEATH THE SURFACE",
          "41°24'12.2\"N 2°10'26.5\"E",
          "TIME IS A RIVER THAT CARRIES ALL THINGS AWAY",
          "SHE TRIED TO WARN THEM"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        secretDiv.innerText = message;
        document.body.appendChild(secretDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
          document.body.removeChild(secretDiv);
        }, 5000);
        
        // Reset index
        konamiIndex = 0;
      }
    });
  }
}
