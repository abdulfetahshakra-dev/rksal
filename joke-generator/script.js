// Joke Generator Application
class JokeGenerator {
    constructor() {
        this.currentJoke = null;
        this.favorites = this.loadFavorites();
        this.loadedCount = 0;
        this.selectedCategory = 'any';
        this.apiUrl = 'https://v2.jokeapi.dev/joke/';
        
        this.elements = {
            jokeContent: document.getElementById('jokeContent'),
            jokeType: document.getElementById('jokeType'),
            jokeCategory: document.getElementById('jokeCategory'),
            jokeId: document.getElementById('jokeId'),
            newJokeBtn: document.getElementById('newJokeBtn'),
            shareBtn: document.getElementById('shareBtn'),
            copyBtn: document.getElementById('copyBtn'),
            favoriteBtn: document.getElementById('favoriteBtn'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            spinner: document.getElementById('spinner'),
            favoritesList: document.getElementById('favoritesList'),
            toggleFavorites: document.getElementById('toggleFavorites'),
            favoriteCount: document.getElementById('favoriteCount'),
            loadedCount: document.getElementById('loadedCount')
        };
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.getNewJoke();
        this.updateStats();
        this.renderFavorites();
    }

    attachEventListeners() {
        // Main buttons
        this.elements.newJokeBtn.addEventListener('click', () => this.getNewJoke());
        this.elements.shareBtn.addEventListener('click', () => this.shareJoke());
        this.elements.copyBtn.addEventListener('click', () => this.copyJoke());
        this.elements.favoriteBtn.addEventListener('click', () => this.toggleFavorite());

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.category-btn').classList.add('active');
                this.selectedCategory = e.target.closest('.category-btn').dataset.category;
                this.getNewJoke();
            });
        });

        // Favorites toggle
        this.elements.toggleFavorites.addEventListener('click', () => this.toggleFavoritesPanel());
    }

    async getNewJoke() {
        try {
            this.showSpinner(true);
            
            let endpoint = this.selectedCategory === 'any' ? 'Any' : this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1);
            const url = `${this.apiUrl}${endpoint}?format=json`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch joke');
            
            const data = await response.json();
            
            if (data.error) {
                this.displayError('Could not retrieve a joke. Try again!');
                return;
            }
            
            this.currentJoke = data;
            this.loadedCount++;
            this.displayJoke(data);
            this.updateStats();
            this.updateFavoriteButton();
        } catch (error) {
            console.error('Error fetching joke:', error);
            this.displayError('Error loading joke. Please check your connection.');
        } finally {
            this.showSpinner(false);
        }
    }

    displayJoke(joke) {
        let jokeText = '';
        
        if (joke.type === 'single') {
            jokeText = joke.joke;
        } else if (joke.type === 'twopart') {
            jokeText = `<strong>${joke.setup}</strong><br><br>${joke.delivery}`;
        }
        
        this.elements.jokeContent.innerHTML = `<p>${jokeText}</p>`;
        this.elements.jokeType.textContent = joke.type.toUpperCase();
        this.elements.jokeCategory.textContent = joke.category;
        this.elements.jokeId.textContent = `ID: ${joke.id}`;
    }

    displayError(message) {
        this.elements.jokeContent.innerHTML = `<p style="color: #ef4444;">${message}</p>`;
    }

    shareJoke() {
        if (!this.currentJoke) return;
        
        const jokeText = this.currentJoke.type === 'single' 
            ? this.currentJoke.joke
            : `${this.currentJoke.setup}\n${this.currentJoke.delivery}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out this joke!',
                text: jokeText
            }).catch(err => console.log('Error sharing:', err));
        } else {
            this.copyJoke();
        }
    }

    copyJoke() {
        if (!this.currentJoke) return;
        
        const jokeText = this.currentJoke.type === 'single' 
            ? this.currentJoke.joke
            : `${this.currentJoke.setup}\n${this.currentJoke.delivery}`;
        
        navigator.clipboard.writeText(jokeText).then(() => {
            this.showToast('Joke copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy joke');
        });
    }

    toggleFavorite() {
        if (!this.currentJoke) return;
        
        const isFavorited = this.favorites.some(fav => fav.id === this.currentJoke.id);
        
        if (isFavorited) {
            this.favorites = this.favorites.filter(fav => fav.id !== this.currentJoke.id);
            this.showToast('Removed from favorites');
        } else {
            this.favorites.push(this.currentJoke);
            this.showToast('Added to favorites!');
        }
        
        this.saveFavorites();
        this.updateStats();
        this.updateFavoriteButton();
        this.renderFavorites();
    }

    updateFavoriteButton() {
        const isFavorited = this.favorites.some(fav => fav.id === this.currentJoke.id);
        const icon = this.elements.favoriteBtn.querySelector('i');
        
        if (isFavorited) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.elements.favoriteBtn.style.color = 'var(--secondary-color)';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.elements.favoriteBtn.style.color = 'inherit';
        }
    }

    toggleFavoritesPanel() {
        const list = this.elements.favoritesList;
        const btn = this.elements.toggleFavorites;
        
        list.classList.toggle('hidden');
        btn.classList.toggle('expanded');
    }

    renderFavorites() {
        const list = this.elements.favoritesList;
        
        if (this.favorites.length === 0) {
            list.innerHTML = '<div class="empty-favorites"><p>No favorites yet. Add some jokes to your favorites!</p></div>';
            return;
        }
        
        list.innerHTML = '';
        this.favorites.forEach(joke => {
            const jokeText = joke.type === 'single' ? joke.joke : `${joke.setup} - ${joke.delivery}`;
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <div class="favorite-text">${jokeText}</div>
                <button class="favorite-remove" data-id="${joke.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            item.querySelector('.favorite-remove').addEventListener('click', () => {
                this.favorites = this.favorites.filter(fav => fav.id !== joke.id);
                this.saveFavorites();
                this.updateStats();
                this.updateFavoriteButton();
                this.renderFavorites();
                this.showToast('Removed from favorites');
            });
            
            list.appendChild(item);
        });
    }

    updateStats() {
        this.elements.favoriteCount.textContent = this.favorites.length;
        this.elements.loadedCount.textContent = this.loadedCount;
    }

    saveFavorites() {
        localStorage.setItem('jokeGeneratorFavorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const stored = localStorage.getItem('jokeGeneratorFavorites');
        return stored ? JSON.parse(stored) : [];
    }

    showToast(message) {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.toast.classList.add('hidden');
        }, 3000);
    }

    showSpinner(show) {
        if (show) {
            this.elements.spinner.classList.remove('hidden');
        } else {
            this.elements.spinner.classList.add('hidden');
        }
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new JokeGenerator();
    });
} else {
    new JokeGenerator();
}
