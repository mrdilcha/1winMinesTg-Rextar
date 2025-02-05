document.addEventListener('DOMContentLoaded', function () {
    const cellsBoard = document.querySelector('.cells-board');
    if (!cellsBoard) {
      console.error('Элемент .cells-board не найден.');
      return;
    }
  document.addEventListener('DOMContentLoaded', function() {
    // Prevent default touch behaviors globally
    function preventTouchBehaviors(e) {
        e.preventDefault();
    }

    // Disable zooming and scrolling
    document.addEventListener('touchmove', preventTouchBehaviors, { passive: false });
    
    // Prevent pinch zoom
    document.addEventListener('gesturestart', preventTouchBehaviors);
    document.addEventListener('gesturechange', preventTouchBehaviors);
    document.addEventListener('gestureend', preventTouchBehaviors);

    // Comprehensive zoom prevention
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent zoom on double tap
    let lastTouchTime = 0;
    document.addEventListener('touchend', function(e) {
        const now = new Date().getTime();
        if (now - lastTouchTime < 300) {
            e.preventDefault();
        }
        lastTouchTime = now;
    }, { passive: false });

    // Prevent scrolling and bouncing
    function preventScroll(e) {
        e.preventDefault();
        window.scrollTo(0, 0);
    }

    window.addEventListener('scroll', preventScroll);

    // Disable vertical scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Prevent default touch behaviors on the entire document
    document.documentElement.style.touchAction = 'none';
    document.body.style.touchAction = 'none';

    // Prevent zoom via keyboard shortcuts
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    });

    // Prevent wheel zoom
    window.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Additional iOS-specific prevention
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', preventTouchBehaviors, { passive: false });
        document.addEventListener('touchmove', preventTouchBehaviors, { passive: false });
        document.addEventListener('touchend', preventTouchBehaviors, { passive: false });
    }

    // Create a style to prevent user selection and additional touch behaviors
    const preventionStyle = document.createElement('style');
    preventionStyle.innerHTML = `
        html, body {
            position: fixed;
            overflow: hidden;
            overscroll-behavior: none;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: none;
        }
    `;
    document.head.appendChild(preventionStyle);

    // Ensure viewport meta tag is set correctly
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
        const newMetaViewport = document.createElement('meta');
        newMetaViewport.name = 'viewport';
        newMetaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(newMetaViewport);
    }
});

// Prevent default behavior for all touch events
document.addEventListener('touchstart', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function(e) {
    e.preventDefault();
}, { passive: false });

// Prevent browser back/forward swipe gestures
window.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
    let originalState = cellsBoard.innerHTML;
  
    const params = new URLSearchParams(window.location.search);
    const botName = params.get('botName') || 'Unknown';
    const language = params.get('language') || 'en';

    const botNameElement = document.getElementById('botName');
    if (botNameElement) {
      botNameElement.textContent = botName;
      botNameElement.style.display = 'block';
      botNameElement.style.color = 'white';
    }
  
    function hidePreloader() {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.classList.remove('fade-in');
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.remove('hidden');
          document.body.classList.add('fade-in');
        }, 1000);
      }
    }
    setTimeout(hidePreloader, 3000);
  
    const trapsOptions = [1, 3, 5, 7];
    const trapsToCellsOpenMapping = {
      1: 10,
      3: 5,
      5: 4,
      7: 3
    };
    let currentPresetIndex = 0;
    const trapsAmountElement = document.getElementById('trapsAmount');
    const prevPresetBtn = document.getElementById('prev_preset_btn');
    const nextPresetBtn = document.getElementById('next_preset_btn');

    function updateTrapsAmount() {
      if (trapsAmountElement) {
        trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
      }
    }
  
    if (prevPresetBtn) {
      prevPresetBtn.addEventListener('click', function () {
        if (currentPresetIndex > 0) {
          currentPresetIndex--;
          updateTrapsAmount();
        }
      });
    }
    if (nextPresetBtn) {
      nextPresetBtn.addEventListener('click', function () {
        if (currentPresetIndex < trapsOptions.length - 1) {
          currentPresetIndex++;
          updateTrapsAmount();
        }
      });
    }
    updateTrapsAmount();
  
    function attachCellClickListeners() {
      const cells = document.querySelectorAll('.cells-board .cell');
      cells.forEach(cell => {
        cell.addEventListener('click', () => {
          cell.style.transform = 'scale(0.7)';
          setTimeout(() => {
            cell.style.transform = 'scale(1)';
          }, 200);
        });
      });
    }
  
    let isFirstPlay = true;

    const playButton = document.getElementById('playButton');
    if (playButton) {
      playButton.addEventListener('click', function () {
        playButton.disabled = true;
  
        let cells = document.querySelectorAll('.cells-board .cell');

        if (!isFirstPlay) {
          cellsBoard.innerHTML = originalState;
          attachCellClickListeners();
          cells = document.querySelectorAll('.cells-board .cell');
        }

        const trapsAmount = parseInt(trapsAmountElement.textContent);
        const cellsToOpen = trapsToCellsOpenMapping[trapsAmount] || 0;
        const selectedCells = [];
  
        while (selectedCells.length < cellsToOpen) {
          const randomIndex = Math.floor(Math.random() * cells.length);
          if (!selectedCells.includes(randomIndex)) {
            selectedCells.push(randomIndex);
          }
        }

        let starIndex = 0;
        function animateStars() {
          if (starIndex < selectedCells.length) {
            const index = selectedCells[starIndex];
            const cell = cells[index];

            cell.classList.add('cell-fade-out');
  
             setTimeout(() => {
              cell.innerHTML = '';
              const newImg = document.createElement('img');
              newImg.setAttribute('width', '40');
              newImg.setAttribute('height', '40');
              newImg.style.opacity = '0';
              newImg.style.transform = 'scale(0)';
              newImg.src = 'img/stars.svg';
              newImg.classList.add('star-animation');
              cell.appendChild(newImg);
              setTimeout(() => {
                newImg.classList.add('fade-in');
              }, 50);
              cell.classList.remove('cell-fade-out');
            }, 500);
  
            starIndex++;
            setTimeout(animateStars, 650);
          } else {
            playButton.disabled = false;

            if (isFirstPlay) {
              isFirstPlay = false;
            }
          }
        }
        animateStars();
      });
    }
  });
