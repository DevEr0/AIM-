document.addEventListener('DOMContentLoaded', () => {
    const teamItems = document.querySelectorAll('.team-item');
    const logoContainer = document.querySelector('.logo-container');
    const parallaxLogo = document.querySelector('.parallax-logo');
    const teamSection = document.querySelector('.team-section');
    const maxScale = 1.8;
    const minScale = 0.8;
    let currentScale = minScale;
    let targetScale = minScale;
    let scrollIndex = 0;
    const totalItems = teamItems.length;
    let isParallaxActive = false;
    let isLogoScaled = false;
    const itemRange = 3; // Increased for longer visibility
    const maxScrollIndex = 1 + totalItems * itemRange;
  
    // Smooth scaling function
    const lerp = (start, end, t) => start + (end - start) * t;
  
    const updateContent = () => {
      const sectionRect = teamSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const logoRect = logoContainer.getBoundingClientRect();
      const logoCenterY = logoRect.top + logoRect.height / 2;
      const viewportCenterY = viewportHeight / 2;
      const isLogoCentered = Math.abs(logoCenterY - viewportCenterY) < 50;
  
      if (sectionRect.top <= viewportHeight && sectionRect.bottom >= 0) {
        logoContainer.style.display = 'block';
  
        if (isLogoCentered && !isParallaxActive) {
          isParallaxActive = true;
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          window.scrollTo(0, window.scrollY);
          logoContainer.classList.add('fixed');
        }
  
        const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - sectionRect.top) / (viewportHeight * 0.5)));
  
        if (scrollProgress <= 1 && !isLogoScaled) {
          scrollIndex = scrollProgress;
          targetScale = minScale + (maxScale - minScale) * scrollIndex;
          teamItems.forEach(item => item.classList.remove('visible'));
        }
  
        if (scrollProgress >= 1 && !isLogoScaled) {
          isLogoScaled = true;
        }
      } else {
        logoContainer.style.display = 'none';
        teamItems.forEach(item => item.classList.remove('visible'));
        isParallaxActive = false;
        isLogoScaled = false;
        scrollIndex = 0;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        logoContainer.classList.remove('fixed');
      }
  
      if (isParallaxActive && isLogoScaled) {
        targetScale = maxScale;
        const itemProgress = scrollIndex - 1;
        teamItems.forEach((item, index) => {
          const itemStart = index * itemRange;
          const itemEnd = (index + 1) * itemRange;
          if (itemProgress >= itemStart && itemProgress < itemEnd && index < totalItems) {
            item.classList.add('visible');
          } else {
            item.classList.remove('visible');
          }
        });
      }
    };
  
    // Smooth scaling animation
    const smoothScale = () => {
      currentScale = lerp(currentScale, targetScale, 0.1);
      parallaxLogo.style.transform = `scale(${currentScale})`;
      requestAnimationFrame(smoothScale);
    };
  
    // Handle scroll wheel
    const handleScroll = (e) => {
      e.preventDefault();
      if (!isParallaxActive) return;
  
      const deltaY = e.deltaY || (e.detail ? e.detail * -40 : 0);
      if (deltaY < 0 && scrollIndex <= 0) {
        // Scrolling up from the beginning
        isParallaxActive = false;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        logoContainer.classList.remove('fixed');
        logoContainer.style.display = 'none';
      } else if (deltaY > 0 && scrollIndex >= maxScrollIndex) {
        // Scrolling down from the end
        isParallaxActive = false;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        logoContainer.classList.remove('fixed');
        logoContainer.style.display = 'none';
      } else {
        scrollIndex += deltaY * 0.001; // Decreased sensitivity
        scrollIndex = Math.max(0, Math.min(maxScrollIndex, scrollIndex));
        updateContent();
      }
    };
  
    // Touch support
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
  
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isParallaxActive) return;
  
      const deltaY = touchStartY - e.touches[0].clientY;
      scrollIndex += deltaY * 0.01; // Decreased sensitivity
      if (scrollIndex < 0) {
        scrollIndex = 0;
        isParallaxActive = false;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        logoContainer.classList.remove('fixed');
        logoContainer.style.display = 'none';
      } else if (scrollIndex > maxScrollIndex) {
        scrollIndex = maxScrollIndex;
        isParallaxActive = false;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        logoContainer.classList.remove('fixed');
        logoContainer.style.display = 'none';
      } else {
        updateContent();
      }
      touchStartY = e.touches[0].clientY;
    };
  
    // Event listeners
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('DOMMouseScroll', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('scroll', updateContent);
    window.addEventListener('resize', updateContent);
  
    // Initialize
    updateContent();
    requestAnimationFrame(smoothScale);
  });