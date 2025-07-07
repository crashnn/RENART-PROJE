document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  const wrapper = document.getElementById('carouselWrapper');
  const sortBySelect = document.getElementById('sort-by'); 

  let allProducts = []; 

  function renderError(message) { 
    track.innerHTML = `
      <div class="carousel-item">
        <p style="padding:20px; text-align:center;">${message}</p>
      </div>`;
  }

  function renderProducts(productsToRender) { 
    track.innerHTML = ''; 
    productsToRender.forEach(product => { 
      const card = document.createElement('div'); 
      card.className = 'carousel-item'; 
      card.innerHTML = `
        <img src="${product.images.yellow}" alt="${product.name}" class="product-image">
        <h4>${product.name}</h4>
        <p class="price">${product.price} $</p>
        <div class="color-buttons">
          <button class="color-button" data-img="${product.images.yellow}"><span class="yellow-circle"></span></button>
          <button class="color-button" data-img="${product.images.white}"><span class="white-circle"></span></button>
          <button class="color-button" data-img="${product.images.rose}"><span class="rose-circle"></span></button>
        </div>
        <div class="description">
          <p>Yellow Gold</p>
        </div>
        <div class="popularity">
          <span style="color:yellow; font-size:24px;">${generateStars(product.popularityScore)}</span>
          <span class="popularity-score">${product.popularityScore}/5</span>
        </div>
        `;

      const imgEl = card.querySelector('.product-image'); 
      const descriptionEl = card.querySelector('.description p'); 
      card.querySelectorAll('.color-button').forEach(btn => { 
        btn.addEventListener('click', () => { 
          imgEl.src = btn.dataset.img; 
          if (btn.dataset.img === product.images.yellow) { 
            descriptionEl.textContent = 'Yellow Gold'; 
          } else if (btn.dataset.img === product.images.white) { 
            descriptionEl.textContent = 'White Gold'; 
          } else if (btn.dataset.img === product.images.rose) { 
            descriptionEl.textContent = 'Rose Gold'; 
          }
        });
      });

      track.appendChild(card); 
    });
  }

  function sortAndRenderProducts() { 
    const sortBy = sortBySelect.value;
    let sortedProducts = [...allProducts]; 

    switch (sortBy) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popularity-asc':
        sortedProducts.sort((a, b) => a.popularityScore - b.popularityScore);
        break;
      case 'popularity-desc':
        sortedProducts.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case 'default':
      default:
        break;
    }
    renderProducts(sortedProducts);
  }

  function loadCarousel() { 
    track.innerHTML = ''; 
    fetch('products.php') 
      .then(res => { 
        if (!res.ok) throw new Error(`HTTP ${res.status}`); 
        return res.json(); 
      })
      .then(products => { 
        if (!Array.isArray(products) || products.length === 0) { 
          throw new Error('Ürün bulunamadı');
        }
        allProducts = products; 
        sortAndRenderProducts(); 
      })
      .catch(err => { 
        console.error('Carousel yüklenemedi:', err); 
        renderError('Ürünler şu anda yüklenemiyor. Lütfen bağlantınızı kontrol edin.'); //
      });
  }

 
  sortBySelect.addEventListener('change', sortAndRenderProducts);

  if (navigator.onLine) { 
    loadCarousel(); 
  } else { 
    renderError('İnternet bağlantısı yok'); 
  }

});

function scrollCarousel(direction) { 
  const wrapper = document.getElementById('carouselWrapper'); 
  const scrollAmount = 300; 
  wrapper.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' }); 
}

function generateStars(score) { 
  const fullStars = Math.floor(score); 
  const halfStar = score % 1 > 0.5; 
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 

  let starsHtml = ""; 

  for (let i = 0; i < fullStars; i++) { 
    starsHtml += '★'; 
  }
  if (halfStar) { 
    starsHtml += '⯪'; 
  }
  for (let i = 0; i < emptyStars; i++) { 
    starsHtml += '☆'; 
  }
  return starsHtml; 

}