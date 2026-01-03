[file name]: cart.js
[file content begin]
// js/cart.js - نظام سلة المشتريات مع إصلاح مشكلة الزيادة

console.log('🛒 cart.js - Loading cart system...');

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.discounts = {
            'WELCOME10': { percent: 10, minAmount: 100 },
            'SUMMER25': { percent: 25, minAmount: 300 }
        };
        this.activeDiscount = null;
        this.shippingFee = 0;
        this.freeShippingThreshold = 200;
        
        this.init();
    }
    
    init() {
        console.log('🎯 CartManager initialization...');
        this.updateCartUI();
        this.setupEventListeners();
    }
    
    loadCart() {
        try {
            const cart = localStorage.getItem('nexus_cart');
            const parsed = cart ? JSON.parse(cart) : [];
            console.log('📦 Loaded cart from localStorage:', parsed);
            return parsed;
        } catch (error) {
            console.error('❌ Error loading cart:', error);
            return [];
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem('nexus_cart', JSON.stringify(this.cart));
            console.log('💾 Saved cart to localStorage');
        } catch (error) {
            console.error('❌ Error saving cart:', error);
        }
    }
    
    addToCart(productId, quantity = 1) {
        console.log('📥 [CartManager] Adding to cart - Product ID:', productId);
        
        const product = this.findProductById(productId);
        
        if (!product) {
            console.error('❌ [CartManager] Product not found:', productId);
            this.showNotification('خطأ', 'المنتج غير متوفر', 'error');
            return false;
        }
        
        console.log('✅ [CartManager] Found product:', product);
        
        const existingIndex = this.cart.findIndex(item => item.id === productId);
        
        if (existingIndex !== -1) {
            // تحديث الكمية
            this.cart[existingIndex].quantity += quantity;
            this.cart[existingIndex].total = this.cart[existingIndex].price * this.cart[existingIndex].quantity;
            console.log('🔄 Updated existing item:', this.cart[existingIndex]);
        } else {
            const cartItem = {
                id: product.id,
                name: product.name || `منتج ${productId}`,
                price: product.price || 0,
                oldPrice: product.oldPrice,
                image: product.image || '📦',
                category: product.category || 'general',
                quantity: quantity,
                total: (product.price || 0) * quantity,
                maxStock: 99
            };
            
            this.cart.push(cartItem);
            console.log('➕ Added new item:', cartItem);
        }
        
        this.saveCart();
        this.updateCartUI();
        
        this.showNotification('تمت الإضافة', 
            `تم إضافة ${product.name || 'المنتج'} إلى السلة`, 'success');
        
        this.pulseCartIcon();
        this.dispatchCartUpdatedEvent();
        
        return true;
    }
    
    findProductById(productId) {
        console.log('🔍 [CartManager] Searching for product:', productId);
        
        if (window.app && typeof window.app.getProductById === 'function') {
            const product = window.app.getProductById(productId);
            if (product) {
                console.log('✅ Found in app:', product);
                return product;
            }
        }
        
        const fallbackProducts = {
            'elec1': { id: 'elec1', name: 'سماعات لاسلكية', price: 299, image: '🎧', category: 'electronics' },
            'elec2': { id: 'elec2', name: 'ساعة ذكية', price: 499, image: '⌚', category: 'electronics' },
            'fash1': { id: 'fash1', name: 'قميص رجالي', price: 89, image: '👔', category: 'fashion' },
            'fash2': { id: 'fash2', name: 'فستان سهرة', price: 299, image: '👗', category: 'fashion' },
            'home1': { id: 'home1', name: 'سجادة صوف', price: 199, image: '🧶', category: 'home' },
            'home2': { id: 'home2', name: 'مصباح طاولة', price: 149, image: '💡', category: 'home' },
            'beauty1': { id: 'beauty1', name: 'مجموعة تجميل', price: 179, image: '💄', category: 'beauty' },
            'offer1': { id: 'offer1', name: 'عرض خاص', price: 249, image: '🔥', category: 'offers' },
            'offer2': { id: 'offer2', name: 'تخفيض الصيف', price: 399, image: '🏖️', category: 'offers' },
            'offer3': { id: 'offer3', name: 'تخفيض الشتاء', price: 199, image: '❄️', category: 'offers' }
        };
        
        return fallbackProducts[productId] || {
            id: productId,
            name: `منتج ${productId}`,
            price: 100,
            image: '📦',
            category: 'general'
        };
    }
    
    removeFromCart(productId) {
        console.log('🗑️ Removing from cart:', productId);
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length < initialLength) {
            this.saveCart();
            this.updateCartUI();
            this.showNotification('تمت الإزالة', 'تمت إزالة المنتج من السلة');
            this.dispatchCartUpdatedEvent();
        }
    }
    
    updateQuantity(productId, newQuantity) {
        console.log('🔄 Updating quantity:', productId, '->', newQuantity);
        
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            
            // التأكد من أن الكمية رقمية
            newQuantity = parseInt(newQuantity);
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
            }
            
            // التحقق من المخزون
            const maxStock = this.cart[itemIndex].maxStock || 99;
            if (newQuantity > maxStock) {
                this.showNotification('مخزون محدود', `الحد الأقصى ${maxStock} قطعة`, 'warning');
                newQuantity = maxStock;
            }
            
            this.cart[itemIndex].quantity = newQuantity;
            this.cart[itemIndex].total = this.cart[itemIndex].price * newQuantity;
            
            this.saveCart();
            this.updateCartUI();
            this.dispatchCartUpdatedEvent();
        }
    }
    
    increaseQuantity(productId) {
        console.log('➕ Increasing quantity for:', productId);
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }
    
    decreaseQuantity(productId) {
        console.log('➖ Decreasing quantity for:', productId);
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }
    
    dispatchCartUpdatedEvent() {
        const event = new CustomEvent('cart-updated', {
            detail: { cart: this.cart }
        });
        window.dispatchEvent(event);
        console.log('📢 Cart updated event dispatched');
    }
    
    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.total || 0), 0);
    }
    
    getDiscountAmount() {
        if (!this.activeDiscount) return 0;
        const subtotal = this.getSubtotal();
        return (subtotal * this.activeDiscount.percent / 100);
    }
    
    calculateShipping() {
        const subtotal = this.getSubtotal();
        this.shippingFee = (subtotal >= this.freeShippingThreshold || this.cart.length === 0) ? 0 : 25;
        return this.shippingFee;
    }
    
    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.getDiscountAmount();
        const shipping = this.calculateShipping();
        return subtotal - discount + shipping;
    }
    
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    
    clearCart() {
        this.cart = [];
        this.activeDiscount = null;
        this.saveCart();
        this.updateCartUI();
        this.showNotification('تم تفريغ السلة', 'تمت إزالة جميع المنتجات من السلة');
        this.dispatchCartUpdatedEvent();
    }
    
    updateCartUI() {
        console.log('🔄 Updating cart UI...');
        console.log('📦 Cart items:', this.cart);
        
        this.renderCartItems();
        this.updateCartSummary();
        this.updateCartCount();
        this.updateCheckoutButton();
        
        console.log('✅ Cart UI updated');
    }
    
    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) {
            console.error('❌ Cart container not found!');
            return;
        }
        
        if (this.cart.length === 0) {
            container.innerHTML = this.createEmptyCartTemplate();
            return;
        }
        
        container.innerHTML = this.cart.map(item => this.createCartItemTemplate(item)).join('');
        
        setTimeout(() => {
            this.addCartEventListeners();
        }, 100);
    }
    
    createEmptyCartTemplate() {
        return `
            <div style="text-align: center; padding: var(--space-xl);">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--text-light); margin-bottom: var(--space-md); opacity: 0.5;"></i>
                <h3 style="margin-bottom: var(--space-sm); color: var(--text-light); font-size: 1.1rem;">سلة المشتريات فارغة</h3>
                <p style="color: var(--text-light); margin-bottom: var(--space-xl); font-size: 0.9rem;">لم تقم بإضافة أي منتجات بعد</p>
                <button class="btn btn-primary" onclick="window.uiManager?.closeCartSidebar(); window.app?.switchCategory('all');" style="padding: 10px 20px;">
                    <i class="fas fa-shopping-cart"></i>
                    ابدأ التسوق الآن
                </button>
            </div>
        `;
    }
    
    createCartItemTemplate(item) {
        console.log('🖼️ Creating cart item template for:', item);
        
        const categoryName = this.getCategoryName(item.category);
        const totalPrice = item.total || (item.price * item.quantity);
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image" style="width: 60px; height: 60px; font-size: 1.5rem;">
                    ${item.image || '📦'}
                </div>
                
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <h4 class="cart-item-name" style="font-size: 0.9rem;">${item.name || `منتج ${item.id}`}</h4>
                        <button class="btn btn-icon btn-sm btn-danger remove-item" data-id="${item.id}" title="إزالة" style="width: 24px; height: 24px; font-size: 0.8rem;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-category" style="font-size: 0.75rem;">
                        <i class="fas fa-tag"></i>
                        ${categoryName}
                    </div>
                    
                    <div class="cart-item-price" style="font-size: 0.9rem;">
                        ${(item.price || 0).toFixed(2)} ر.س
                        ${item.oldPrice ? `
                            <span style="text-decoration: line-through; color: var(--text-light); font-size: 0.8rem; margin-right: 4px;">
                                ${item.oldPrice.toFixed(2)} ر.س
                            </span>
                        ` : ''}
                    </div>
                    
                    <div class="cart-item-quantity" style="margin-top: 8px;">
                        <button class="quantity-btn minus" data-id="${item.id}" title="تقليل" style="width: 28px; height: 28px; font-size: 0.8rem;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity" style="font-size: 0.9rem; min-width: 30px;">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-id="${item.id}" title="زيادة" style="width: 28px; height: 28px; font-size: 0.8rem;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-total" style="font-size: 1rem;">
                    ${totalPrice.toFixed(2)} ر.س
                </div>
            </div>
        `;
    }
    
    getCategoryName(categoryId) {
        if (!categoryId) return 'عام';
        
        if (window.app?.categories) {
            const category = window.app.categories.find(c => c.id === categoryId);
            if (category) return category.name;
        }
        
        return categoryId;
    }
    
    addCartEventListeners() {
        console.log('🎯 Adding cart event listeners');
        
        // أزرار الإزالة
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const productId = e.currentTarget.dataset.id;
                console.log('🗑️ Remove button clicked for:', productId);
                this.removeFromCart(productId);
            });
        });
        
        // أزرار الزيادة - إصلاح مشكلة الزيادة
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const productId = e.currentTarget.dataset.id;
                console.log('➕ Plus button clicked for:', productId);
                this.increaseQuantity(productId);
            });
        });
        
        // أزرار التقليل
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const productId = e.currentTarget.dataset.id;
                console.log('➖ Minus button clicked for:', productId);
                this.decreaseQuantity(productId);
            });
        });
    }
    
    updateCartSummary() {
        const subtotal = this.getSubtotal();
        const shipping = this.calculateShipping();
        const total = this.getTotal();
        
        console.log('💰 Cart summary:', { subtotal, shipping, total });
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const totalEl = document.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} ر.س`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ر.س`;
        if (totalEl) totalEl.textContent = `${total.toFixed(2)} ر.س`;
        
        this.updateCartCount();
    }
    
    updateCartCount() {
        const count = this.getItemCount();
        console.log('🔢 Cart count:', count);
        
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(el => {
            el.textContent = count;
        });
    }
    
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }
    
    setupEventListeners() {
        window.addEventListener('cart-updated', () => {
            console.log('📢 Cart updated event received');
            this.updateCartUI();
        });
        
        document.addEventListener('cart-sidebar-opened', () => {
            console.log('📢 Cart sidebar opened event received');
            this.updateCartUI();
        });
        
        window.addEventListener('load', () => {
            console.log('📢 Page loaded, updating cart');
            setTimeout(() => {
                this.updateCartUI();
            }, 500);
        });
    }
    
    pulseCartIcon() {
        const cartIcon = document.getElementById('cart-btn');
        if (cartIcon) {
            cartIcon.classList.add('pulse');
            setTimeout(() => {
                cartIcon.classList.remove('pulse');
            }, 1000);
        }
    }
    
    showNotification(title, message, type = 'info') {
        if (window.uiManager) {
            window.uiManager.showNotification(title, message, type);
        }
    }
    
    getCartItems() {
        return [...this.cart];
    }
    
    isEmpty() {
        return this.cart.length === 0;
    }
}

window.cartManager = new CartManager();
console.log('✅ CartManager loaded successfully');
[file content end]
