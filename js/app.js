[file name]: app.js
[file content begin]
// js/app.js - التطبيق الرئيسي المحسّن للهاتف

console.log('🚀 Nexus Store - Starting...');

class NexusStore {
    constructor() {
        this.currentCategory = 'all';
        this.products = {};
        this.categories = [
            { id: 'all', name: 'جميع المنتجات', icon: 'fas fa-store', color: '#FF6B8B' },
            { id: 'offers', name: 'عروض خاصة', icon: 'fas fa-tags', color: '#EF476F' },
            { id: 'electronics', name: 'إلكترونيات', icon: 'fas fa-laptop', color: '#4361EE' },
            { id: 'fashion', name: 'أزياء', icon: 'fas fa-tshirt', color: '#F72585' },
            { id: 'home', name: 'منزلية', icon: 'fas fa-home', color: '#4CC9F0' },
            { id: 'beauty', name: 'جمال', icon: 'fas fa-spa', color: '#7209B7' },
            { id: 'sports', name: 'رياضة', icon: 'fas fa-futbol', color: '#06D6A0' },
            { id: 'books', name: 'كتب', icon: 'fas fa-book', color: '#FB5607' },
            { id: 'toys', name: 'ألعاب', icon: 'fas fa-gamepad', color: '#FFD166' }
        ];
        
        this.init();
    }
    
    async init() {
        console.log('🎯 NexusStore initialization...');
        
        // Initialize components
        await this.initComponents();
        
        // Load data
        await this.loadInitialData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show welcome
        this.showWelcome();
        
        console.log('✅ NexusStore ready!');
    }
    
    async initComponents() {
        // Initialize managers
        if (typeof CartManager !== 'undefined') {
            window.cartManager = new CartManager();
        }
        
        if (typeof UIManager !== 'undefined') {
            window.uiManager = new UIManager();
        }
        
        if (typeof CheckoutManager !== 'undefined') {
            window.checkoutManager = new CheckoutManager();
        }
    }
    
    async loadInitialData() {
        try {
            // Load products
            await this.loadProducts();
            
            // Load special offers (سيتم عرضها أولاً)
            await this.loadSpecialOffers();
            
            // Update UI
            this.updateCategoryUI();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showFallbackUI();
        }
    }
    
    async loadProducts() {
        // استخدام البيانات المحلية
        this.loadLocalProducts();
    }
    
    loadLocalProducts() {
        // بيانات المنتجات المحسنة للهاتف
        this.products = {
            electronics: [
                { id: 'elec1', name: 'سماعات لاسلكية', price: 299, image: '🎧', description: 'سماعات بلوتوث عالية الجودة', category: 'electronics' },
                { id: 'elec2', name: 'ساعة ذكية', price: 499, image: '⌚', description: 'ساعة ذكية متطورة', category: 'electronics' },
                { id: 'elec3', name: 'لابتوب محمول', price: 3499, image: '💻', description: 'لابتوب بمواصفات عالية', category: 'electronics' },
                { id: 'elec4', name: 'كاميرا ديجيتال', price: 1299, image: '📷', description: 'كاميرا احترافية', category: 'electronics' }
            ],
            fashion: [
                { id: 'fash1', name: 'قميص رجالي', price: 89, image: '👔', description: 'قميص قطني عالي الجودة', category: 'fashion' },
                { id: 'fash2', name: 'فستان سهرة', price: 299, image: '👗', description: 'فستان أنيق للمناسبات', category: 'fashion' },
                { id: 'fash3', name: 'حذاء رياضي', price: 199, image: '👟', description: 'حذاء رياضي مريح', category: 'fashion' },
                { id: 'fash4', name: 'حقيبة يد', price: 149, image: '👜', description: 'حقيبة يد أنيقة', category: 'fashion' }
            ],
            home: [
                { id: 'home1', name: 'سجادة صوف', price: 199, image: '🧶', description: 'سجادة صوف طبيعي', category: 'home' },
                { id: 'home2', name: 'مصباح طاولة', price: 149, image: '💡', description: 'مصباح LED عصري', category: 'home' },
                { id: 'home3', name: 'طقم أطباق', price: 179, image: '🍽️', description: 'طقم أطباق سيراميك', category: 'home' },
                { id: 'home4', name: 'مفرش طاولة', price: 89, image: '🧵', description: 'مفرش طاولة قطني', category: 'home' }
            ],
            beauty: [
                { id: 'beauty1', name: 'مجموعة تجميل', price: 179, image: '💄', description: 'مجموعة كاملة', category: 'beauty' },
                { id: 'beauty2', name: 'عطر نسائي', price: 249, image: '🌸', description: 'عطر برائحة مميزة', category: 'beauty' },
                { id: 'beauty3', name: 'كريم ترطيب', price: 99, image: '🧴', description: 'كريم ترطيب للبشرة', category: 'beauty' }
            ],
            sports: [
                { id: 'sport1', name: 'كرة قدم', price: 129, image: '⚽', description: 'كرة قدم احترافية', category: 'sports' },
                { id: 'sport2', name: 'حذاء جري', price: 299, image: '👟', description: 'حذاء جري رياضي', category: 'sports' }
            ],
            books: [
                { id: 'book1', name: 'رواية عالمية', price: 49, image: '📚', description: 'رواية أدبية مشهورة', category: 'books' },
                { id: 'book2', name: 'كتاب تطوير الذات', price: 59, image: '📖', description: 'كتاب في التنمية البشرية', category: 'books' }
            ],
            toys: [
                { id: 'toy1', name: 'لعبة أطفال', price: 79, image: '🧸', description: 'لعبة تعليمية للأطفال', category: 'toys' },
                { id: 'toy2', name: 'سيارة تحكم', price: 199, image: '🚗', description: 'سيارة تحكم عن بعد', category: 'toys' }
            ],
            offers: [
                { id: 'offer1', name: 'عرض خاص', price: 249, image: '🔥', description: 'خصم 50% لفترة محدودة', category: 'offers', oldPrice: 499, badge: 'خصم 50%' },
                { id: 'offer2', name: 'تخفيض الصيف', price: 399, image: '🏖️', description: 'عروض الصيف الحصرية', category: 'offers', oldPrice: 599, badge: 'خصم 30%' },
                { id: 'offer3', name: 'تخفيض الشتاء', price: 199, image: '❄️', description: 'عروض شتوية مميزة', category: 'offers', oldPrice: 299, badge: 'خصم 33%' }
            ]
        };
        
        this.renderAllProducts();
    }
    
    renderAllProducts() {
        const container = document.getElementById('category-sections');
        if (!container) {
            console.error('❌ Container not found for products!');
            return;
        }
        
        console.log('🎨 Rendering all products...');
        
        let html = '';
        
        this.categories.forEach(category => {
            if (category.id === 'all' || category.id === 'offers') return;
            
            const categoryProducts = this.products[category.id] || [];
            if (categoryProducts.length === 0) return;
            
            html += `
                <section class="section" id="category-${category.id}" style="padding: var(--space-lg) 0;">
                    <div class="container">
                        <div class="category-header">
                            <h2 style="display: flex; align-items: center; gap: var(--space-sm); color: ${category.color}; font-size: 1.3rem;">
                                <i class="${category.icon}"></i>
                                ${category.name}
                                <span style="font-size: 0.9rem; color: var(--text-light);">
                                    (${categoryProducts.length})
                                </span>
                            </h2>
                        </div>
                        
                        <div class="products-grid">
                            ${categoryProducts.map(product => this.renderProductCard(product)).join('')}
                        </div>
                        
                        ${categoryProducts.length > 4 ? `
                        <div style="text-align: center; margin-top: var(--space-lg);">
                            <button class="btn btn-outline btn-sm" onclick="app.viewMore('${category.id}')">
                                <i class="fas fa-eye"></i>
                                عرض المزيد
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </section>
            `;
        });
        
        container.innerHTML = html;
        
        console.log('✅ Products rendered successfully');
        
        // Add event listeners to product buttons
        this.addProductEventListeners();
    }
    
    renderProductCard(product) {
        const discountBadge = product.oldPrice ? 
            `<div class="discount-badge">${Math.round((1 - product.price / product.oldPrice) * 100)}%</div>` : '';
        
        const productBadge = product.badge ? `
            <div class="product-badge ${this.getBadgeClass(product.badge)}">
                ${product.badge}
            </div>
        ` : '';
        
        // حجم أصغر للمنتجات
        return `
            <div class="product-card card" data-id="${product.id}" style="height: 320px;">
                ${discountBadge}
                ${productBadge}
                
                <div class="product-image" style="height: 140px; font-size: 2.5rem;">
                    ${product.image || '📦'}
                </div>
                
                <div class="product-info" style="padding: var(--space-md);">
                    <div class="product-category" style="font-size: 0.75rem;">
                        <i class="fas fa-tag"></i>
                        ${this.getCategoryName(product.category)}
                    </div>
                    
                    <h3 class="product-name" style="font-size: 0.95rem; margin-bottom: 4px; height: 40px; overflow: hidden;">
                        ${product.name}
                    </h3>
                    
                    <p class="product-description" style="font-size: 0.8rem; margin-bottom: var(--space-sm); height: 36px; overflow: hidden;">
                        ${product.description}
                    </p>
                    
                    <div class="product-price" style="margin-bottom: var(--space-md);">
                        <span class="price-current" style="font-size: 1.1rem;">${product.price} ر.س</span>
                        ${product.oldPrice ? `
                            <span class="price-old" style="font-size: 0.8rem;">${product.oldPrice} ر.س</span>
                        ` : ''}
                    </div>
                    
                    <div class="product-actions" style="gap: 6px;">
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}" style="padding: 6px 12px; font-size: 0.8rem;">
                            <i class="fas fa-shopping-cart"></i>
                            أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getBadgeClass(badge) {
        const badgeClasses = {
            'جديد': 'badge-new',
            'خصم': 'badge-sale',
            'محدود': 'badge-limited'
        };
        
        return badgeClasses[badge] || 'badge-new';
    }
    
    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }
    
    async loadSpecialOffers() {
        const offersContainer = document.getElementById('special-offers');
        if (!offersContainer) {
            console.error('❌ Special offers container not found!');
            return;
        }
        
        const offers = this.products.offers || [];
        
        if (offers.length === 0) {
            offersContainer.innerHTML = `
                <div class="offer-card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-lg);">
                    <h3 class="offer-title" style="font-size: 1.1rem;">لا توجد عروض حالياً</h3>
                    <p class="offer-description" style="font-size: 0.9rem;">تابعنا للحصول على أحدث العروض</p>
                </div>
            `;
            return;
        }
        
        offersContainer.innerHTML = offers.map(offer => `
            <div class="offer-card" style="min-height: 180px;">
                <div class="offer-content" style="padding: var(--space-md);">
                    <h3 class="offer-title" style="font-size: 1.1rem; margin-bottom: 8px;">${offer.name}</h3>
                    <p class="offer-description" style="font-size: 0.9rem; margin-bottom: var(--space-sm);">
                        ${offer.description}
                    </p>
                    
                    <div class="offer-price" style="margin-bottom: var(--space-md);">
                        <span style="font-size: 1.3rem; font-weight: 800;">${offer.price} ر.س</span>
                        ${offer.oldPrice ? `
                            <span style="text-decoration: line-through; opacity: 0.7; margin-right: 6px; font-size: 0.9rem;">
                                ${offer.oldPrice} ر.س
                            </span>
                        ` : ''}
                    </div>
                    
                    <button class="btn btn-secondary" onclick="app.addToCart('${offer.id}')" style="padding: 8px 16px; font-size: 0.9rem;">
                        <i class="fas fa-bolt"></i>
                        احصل على العرض
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Special offers rendered');
    }
    
    addProductEventListeners() {
        console.log('🎯 Adding product event listeners...');
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.currentTarget.dataset.id;
                console.log(`🛒 Add to cart clicked for product: ${productId}`);
                this.addToCart(productId);
            });
        });
        
        console.log('✅ Product event listeners added');
    }
    
    addToCart(productId) {
        console.log(`📥 Adding product ${productId} to cart`);
        
        if (window.cartManager) {
            const success = window.cartManager.addToCart(productId);
            
            if (success) {
                // Show notification
                if (window.uiManager) {
                    window.uiManager.showNotification('تمت الإضافة', 'تم إضافة المنتج إلى السلة', 'success');
                }
            }
        } else {
            console.error('❌ cartManager not available');
        }
    }
    
    viewMore(categoryId) {
        // Scroll to category section
        const section = document.getElementById(`category-${categoryId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    updateCategoryUI() {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.category;
                this.switchCategory(categoryId);
            });
        });
    }
    
    switchCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === categoryId) {
                btn.classList.add('active');
            }
        });
        
        // Scroll to category section
        if (categoryId !== 'all') {
            const section = document.getElementById(`category-${categoryId}`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Search input - تحسين للهاتف
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // إظهار نتائج البحث عند التركيز على الهاتف
            if (window.innerWidth <= 768) {
                searchInput.addEventListener('focus', () => {
                    const results = document.getElementById('search-results');
                    if (results) {
                        results.style.display = 'block';
                    }
                });
                
                searchInput.addEventListener('blur', () => {
                    setTimeout(() => {
                        const results = document.getElementById('search-results');
                        if (results) {
                            results.style.display = 'none';
                        }
                    }, 200);
                });
            }
        }
        
        // Close cart
        const closeCart = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const continueShopping = document.getElementById('continue-shopping');
        
        [closeCart, cartOverlay, continueShopping].forEach(element => {
            if (element) {
                element.addEventListener('click', () => {
                    if (window.uiManager) {
                        window.uiManager.closeCartSidebar();
                    }
                });
            }
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (window.checkoutManager) {
                    window.checkoutManager.openCheckoutModal();
                }
            });
        }
        
        // Back to top
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
        }
        
        // Add event listeners to category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.category;
                this.switchCategory(categoryId);
            });
        });
        
        console.log('✅ Event listeners setup complete');
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            const results = document.getElementById('search-results');
            if (results) {
                results.innerHTML = '';
                results.style.display = 'none';
            }
            return;
        }
        
        // Search logic
        const results = this.searchProducts(query);
        this.displaySearchResults(results);
    }
    
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        const results = [];
        
        Object.values(this.products).forEach(categoryProducts => {
            categoryProducts.forEach(product => {
                const searchFields = [
                    product.name,
                    product.description,
                    product.category
                ];
                
                if (searchFields.some(field => 
                    field && field.toLowerCase().includes(searchTerm)
                )) {
                    results.push(product);
                }
            });
        });
        
        return results.slice(0, 8); // Limit to 8 results
    }
    
    displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        if (window.innerWidth <= 768) {
            container.style.position = 'absolute';
            container.style.top = '100%';
            container.style.left = '0';
            container.style.right = '0';
            container.style.zIndex = '1000';
            container.style.maxHeight = '300px';
            container.style.overflowY = 'auto';
            container.style.backgroundColor = 'white';
            container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            container.style.borderRadius = '8px';
            container.style.marginTop = '8px';
        }
        
        if (results.length === 0) {
            container.innerHTML = `
                <div style="padding: var(--space-lg); text-align: center; color: var(--text-light);">
                    <i class="fas fa-search" style="font-size: 1.5rem; margin-bottom: 8px; opacity: 0.5;"></i>
                    <div style="font-size: 0.9rem;">لم يتم العثور على منتجات تطابق بحثك</div>
                </div>
            `;
        } else {
            container.innerHTML = results.map(product => `
                <div class="search-result-item" style="padding: 12px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 12px; cursor: pointer;" onclick="app.addToCart('${product.id}')">
                    <div style="font-size: 1.5rem; width: 40px; text-align: center;">
                        ${product.image}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 2px; font-size: 0.9rem;">${product.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px;">${product.description}</div>
                        <div style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">${product.price} ر.س</div>
                    </div>
                </div>
            `).join('');
        }
        
        container.style.display = 'block';
    }
    
    showWelcome() {
        setTimeout(() => {
            if (window.uiManager) {
                window.uiManager.showNotification(
                    'مرحباً بك في Nexus Store!',
                    'تصفح المنتجات واستمتع بتجربة تسوق سهلة',
                    'info'
                );
            }
        }, 1500);
    }
    
    showNotification(title, message, type = 'info') {
        if (window.uiManager) {
            window.uiManager.showNotification(title, message, type);
        }
    }
    
    showFallbackUI() {
        const container = document.getElementById('category-sections');
        if (container) {
            container.innerHTML = `
                <section class="section">
                    <div class="container">
                        <div style="text-align: center; padding: var(--space-xl) 0;">
                            <div style="font-size: 3rem; margin-bottom: var(--space-md);">🛒</div>
                            <h2 style="margin-bottom: var(--space-md); font-size: 1.5rem;">Nexus Store</h2>
                            <p style="color: var(--text-light); margin-bottom: var(--space-lg); max-width: 500px; margin-left: auto; margin-right: auto; font-size: 0.9rem;">
                                متجر إلكتروني يقدم أفضل المنتجات
                            </p>
                            <button class="btn btn-primary" onclick="app.loadInitialData()" style="padding: 10px 20px; font-size: 0.9rem;">
                                <i class="fas fa-sync-alt"></i>
                                إعادة تحميل
                            </button>
                        </div>
                    </div>
                </section>
            `;
        }
    }
    
    getProductById(productId) {
        console.log('🔍 [NexusStore] Searching for product with ID:', productId);
        
        for (const category in this.products) {
            const categoryProducts = this.products[category];
            if (Array.isArray(categoryProducts)) {
                const product = categoryProducts.find(p => p.id === productId);
                if (product) {
                    console.log('✅ [NexusStore] Found product:', product);
                    return product;
                }
            }
        }
        
        console.log('❌ [NexusStore] Product not found');
        return null;
    }
    
    getAllProducts() {
        const allProducts = [];
        for (const category in this.products) {
            if (Array.isArray(this.products[category])) {
                allProducts.push(...this.products[category]);
            }
        }
        return allProducts;
    }
    
    getProductsByCategory(categoryId) {
        return this.products[categoryId] || [];
    }
    
    getCategoryNameById(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }
    
    reloadProducts() {
        console.log('🔄 Reloading products...');
        this.renderAllProducts();
    }
}

// Initialize app
window.app = new NexusStore();

// جعل الدوال متاحة عالمياً
if (window.app) {
    window.getProductById = (id) => window.app.getProductById(id);
    window.getAllProducts = () => window.app.getAllProducts();
    window.getProductsByCategory = (category) => window.app.getProductsByCategory(category);
    window.getCategoryNameById = (categoryId) => window.app.getCategoryNameById(categoryId);
    window.reloadProducts = () => window.app.reloadProducts();
}

console.log('✅ app.js loaded - Mobile optimized');
[file content end]
