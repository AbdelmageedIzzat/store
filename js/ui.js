[file name]: ui.js
[file content begin]
// js/ui.js - نظام واجهة المستخدم المبسط للهاتف
console.log('🎨 ui.js - Loading mobile optimized UI system...');

class UIManager {
    constructor() {
        this.notification = null;
        this.notificationTimeout = null;
        
        this.init();
    }
    
    init() {
        console.log('🎯 UIManager initialization...');
        
        // إنشاء العناصر الديناميكية
        this.createNotification();
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners();
        
        // تهيئة المكونات
        this.initComponents();
        
        // إعداد تحسينات الموبايل
        this.setupMobileFeatures();
        
        console.log('✅ UIManager ready!');
    }
    
    createNotification() {
        if (!document.getElementById('notification')) {
            this.notification = document.createElement('div');
            this.notification.id = 'notification';
            this.notification.className = 'notification';
            this.notification.innerHTML = `
                <i class="fas fa-check-circle notification-icon success" id="notification-icon"></i>
                <div class="notification-content">
                    <div class="notification-title" id="notification-title"></div>
                    <div class="notification-message" id="notification-message"></div>
                </div>
                <button class="notification-close" id="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(this.notification);
        } else {
            this.notification = document.getElementById('notification');
        }
    }
    
    initComponents() {
        // تهيئة السلة
        this.initCart();
        
        // تهيئة أزرار الفئات
        this.initCategoryButtons();
    }
    
    initCart() {
        console.log('🛒 Initializing cart system in UI...');
        
        // زر فتح السلة
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                console.log('Cart button clicked');
                this.openCartSidebar();
                if (window.cartManager) {
                    setTimeout(() => {
                        window.cartManager.updateCartUI();
                    }, 300);
                }
            });
        }
        
        // زر إغلاق السلة
        const closeCart = document.getElementById('close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }
        
        // زر متابعة التسوق
        const continueShopping = document.getElementById('continue-shopping');
        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                this.closeCartSidebar();
            });
        }
        
        // زر إتمام الشراء
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (window.cartManager && !window.cartManager.isEmpty()) {
                    this.closeCartSidebar();
                    if (window.checkoutManager) {
                        window.checkoutManager.openCheckoutModal();
                    }
                } else {
                    this.showNotification('السلة فارغة', 'يرجى إضافة منتجات إلى السلة أولاً', 'warning');
                }
            });
        }
        
        // مستمع حدث تحديث السلة
        window.addEventListener('cart-updated', () => {
            console.log('Cart updated event received');
            if (window.cartManager) {
                window.cartManager.updateCartUI();
            }
        });
        
        document.addEventListener('cart-sidebar-opened', () => {
            console.log('Cart sidebar opened');
            if (window.cartManager) {
                setTimeout(() => {
                    window.cartManager.updateCartUI();
                }, 100);
            }
        });
        
        console.log('✅ Cart system initialized');
    }
    
    initCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                if (window.app) {
                    window.app.switchCategory(category);
                }
            });
        });
    }
    
    setupEventListeners() {
        // إغلاق الإشعار
        const notificationClose = document.getElementById('notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }
        
        // زر العودة للأعلى
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
        
        // النقر خارج السلة لإغلاقها
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartOverlay = document.getElementById('cart-overlay');
            
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                if (e.target === cartOverlay) {
                    this.closeCartSidebar();
                }
            }
        });
        
        // إغلاق الإشعار تلقائياً
        this.notification?.addEventListener('click', (e) => {
            if (e.target === this.notification) {
                this.hideNotification();
            }
        });
        
        // تحديث السلة عند تحميل الصفحة
        window.addEventListener('load', () => {
            console.log('Page loaded');
            if (window.cartManager) {
                setTimeout(() => {
                    window.cartManager.updateCartCount();
                }, 500);
            }
        });
    }
    
    // الإشعارات
    showNotification(title, message, type = 'info', duration = 3000) {
        if (!this.notification) return;
        
        this.hideNotification();
        
        const icon = this.notification.querySelector('#notification-icon');
        const titleEl = this.notification.querySelector('#notification-title');
        const messageEl = this.notification.querySelector('#notification-message');
        
        if (icon && titleEl && messageEl) {
            icon.className = `fas notification-icon ${this.getNotificationIcon(type)} ${type}`;
            titleEl.textContent = title;
            messageEl.textContent = message;
            
            this.notification.classList.add('show');
            
            this.notificationTimeout = setTimeout(() => {
                this.hideNotification();
            }, duration);
        }
    }
    
    hideNotification() {
        if (this.notification) {
            this.notification.classList.remove('show');
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
                this.notificationTimeout = null;
            }
        }
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    // السلة الجانبية
    openCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const event = new CustomEvent('cart-sidebar-opened');
            window.dispatchEvent(event);
            
            console.log('Cart sidebar opened');
        }
    }
    
    closeCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            console.log('Cart sidebar closed');
        }
    }
    
    // تحسين تجربة المستخدم على الموبايل
    setupMobileFeatures() {
        // منع التكبير في حقول الإدخال على iOS
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.fontSize = '16px';
            }
        });
        
        // إصلاح ارتفاع 100vh على الموبايل
        this.fixViewportHeight();
        
        // إضافة class للكشف عن الموبايل
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.body.classList.add('is-mobile');
        }
    }
    
    fixViewportHeight() {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVh();
        window.addEventListener('resize', setVh);
        window.addEventListener('orientationchange', setVh);
    }
    
    // دوال مساعدة
    showLoading(message = 'جاري التحميل...') {
        const loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(loading);
    }
    
    hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => loading.remove(), 300);
        }
    }
}

window.uiManager = new UIManager();
console.log('✅ UIManager loaded successfully - Mobile optimized');
[file content end]
