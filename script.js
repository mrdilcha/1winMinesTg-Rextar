document.addEventListener('DOMContentLoaded', function () {
    const cellsBoard = document.querySelector('.cells-board');
    if (!cellsBoard) {
      console.error('Элемент .cells-board не найден.');
      return;
    }
  document.addEventListener('DOMContentLoaded', function() {
    // Prevent default touch behaviors
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // Disable zooming
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });

    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });

    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });

    // Prevent pinch zoom
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Disable browser zoom and scrolling
    function disableZoom() {
        document.documentElement.style.touchAction = 'none';
        document.body.style.overflow = 'hidden';
        
        // Prevent default zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.blur();
            });
        });
    }

    // Prevent zoom on double tap
    let lastTouchTime = 0;
    document.addEventListener('touchend', function(e) {
        const now = new Date().getTime();
        if (now - lastTouchTime < 300) {
            e.preventDefault();
        }
        lastTouchTime = now;
    }, false);

    // Prevent zooming via meta viewport tag
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // CSS to prevent selection and zoom
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            touch-action: none;
        }
        input, textarea {
            user-select: text;
        }
    `;
    document.head.appendChild(style);

    // Call disable zoom function
    disableZoom();

    // Prevent scrolling
    window.addEventListener('scroll', function(e) {
        window.scrollTo(0, 0);
    });

    // Additional iOS-specific prevention
    if ('ontouchstart' in window) {
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
});

// Prevent zoom on wheel
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent keyboard zoom
window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === '+' || e.key === '-')) {
        e.preventDefault();
    }
});
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
