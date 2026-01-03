[file name]: checkout.js
[file content begin]
// ============================
// 💳 نظام الدفع المبسط للهاتف
// ============================

class CheckoutManager {
    constructor() {
        console.log('💳 بدء تهيئة نظام الدفع...');
        this.modal = document.getElementById('checkout-modal');
        this.checkoutForm = document.getElementById('checkout-form');
        this.checkoutItems = document.getElementById('checkout-items');
        this.checkoutSubtotal = document.getElementById('checkout-subtotal');
        this.checkoutTotal = document.getElementById('checkout-total');
        this.submitOrderBtn = document.getElementById('submit-order');
        
        // الحقول الإضافية
        this.customerName = document.getElementById('customer-name');
        this.customerPhone = document.getElementById('customer-phone');
        this.deliveryAddress = document.getElementById('delivery-address');
        this.orderNotes = document.getElementById('order-notes');
        this.agreeTerms = document.getElementById('agree-terms');
        
        this.init();
    }
    
    init() {
        this.initPaymentMethods();
        this.setupEventListeners();
        console.log('✅ نظام الدفع جاهز');
    }
    
    // تهيئة طرق الدفع المبسطة
    initPaymentMethods() {
        const container = document.getElementById('payment-methods');
        if (!container) return;
        
        const methods = [
            {
                id: 'cash',
                name: 'الدفع عند الاستلام',
                icon: 'fas fa-money-bill-wave',
                recommended: true
            },
            {
                id: 'bank',
                name: 'تحويل بنكي',
                icon: 'fas fa-university'
            },
            {
                id: 'mada',
                name: 'بطاقة مدى',
                icon: 'fas fa-credit-card'
            }
        ];
        
        let html = '';
        methods.forEach(method => {
            html += `
                <div class="payment-method" style="margin-bottom: 10px;">
                    <input type="radio" id="payment-${method.id}" name="payment" 
                           value="${method.id}" ${method.recommended ? 'checked' : ''} 
                           style="margin-left: 8px;">
                    <label for="payment-${method.id}" style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 2px solid #eee; border-radius: 8px; cursor: pointer;">
                        <div style="color: var(--primary); font-size: 1.2rem;">
                            <i class="${method.icon}"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600;">${method.name}</div>
                        </div>
                        ${method.recommended ? '<div style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">مفضل</div>' : ''}
                    </label>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // إعداد مستمعي الأحداث المبسطة
    setupEventListeners() {
        // إغلاق نافذة الدفع
        const closeBtn = this.modal?.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // إرسال النموذج
        if (this.checkoutForm) {
            this.checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
        
        // التحقق من صحة الهاتف أثناء الكتابة
        if (this.customerPhone) {
            this.customerPhone.addEventListener('input', (e) => {
                this.validatePhoneInput(e.target);
            });
        }
    }
    
    // فتح نافذة الدفع
    openCheckoutModal() {
        if (!window.cartManager || window.cartManager.cart.length === 0) {
            this.showNotification('السلة فارغة', 'أضف منتجات إلى السلة أولاً', 'error');
            return;
        }
        
        this.updateOrderSummary();
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        setTimeout(() => {
            this.modal.classList.add('visible');
        }, 10);
        
        console.log('📄 فتح نافذة الدفع');
    }
    
    // إغلاق نافذة الدفع
    closeModal() {
        this.modal.classList.remove('visible');
        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }, 300);
    }
    
    // تحديث ملخص الطلب المبسط
    updateOrderSummary() {
        if (!this.checkoutItems || !window.cartManager) return;
        
        const cartDetails = window.cartManager.getCartDetails();
        
        // عرض المنتجات بشكل مبسط
        let itemsHTML = '';
        cartDetails.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <div style="font-weight: 600; font-size: 0.9rem;">${item.name}</div>
                        <div style="font-size: 0.8rem; color: #666;">${item.quantity} × ${item.price} ريال</div>
                    </div>
                    <div style="font-weight: 700;">${itemTotal} ريال</div>
                </div>
            `;
        });
        
        this.checkoutItems.innerHTML = itemsHTML;
        
        // تحديث الأسعار
        if (this.checkoutSubtotal) {
            this.checkoutSubtotal.textContent = `${cartDetails.subtotal.toFixed(2)} ريال`;
        }
        
        if (this.checkoutTotal) {
            this.checkoutTotal.textContent = `${cartDetails.total.toFixed(2)} ريال`;
        }
    }
    
    // معالجة الطلب المبسطة
    async processOrder() {
        if (!this.validateForm()) return;
        
        const submitBtn = this.submitOrderBtn;
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
        
        try {
            // جمع بيانات الطلب
            const orderData = this.collectOrderData();
            
            // التحقق من صحة البيانات
            if (!this.validateOrderData(orderData)) {
                throw new Error('بيانات الطلب غير صالحة');
            }
            
            // حفظ الطلب محلياً
            this.saveOrderLocally(orderData);
            
            // عرض تأكيد الطلب النهائي
            this.showFinalConfirmation(orderData);
            
            // إغلاق نافذة الدفع
            this.closeModal();
            
        } catch (error) {
            console.error('❌ خطأ في معالجة الطلب:', error);
            this.showNotification('خطأ', error.message || 'حدث خطأ أثناء معالجة الطلب', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
    
    // جمع بيانات الطلب المبسطة
    collectOrderData() {
        const cartDetails = window.cartManager.getCartDetails();
        
        return {
            // معلومات العميل
            customerName: this.customerName?.value.trim() || '',
            customerPhone: this.customerPhone?.value.trim() || '',
            
            // العنوان
            address: this.deliveryAddress?.value.trim() || '',
            
            // طريقة الدفع
            paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'cash',
            
            // الملاحظات
            notes: this.orderNotes?.value.trim() || '',
            
            // المنتجات
            items: cartDetails.items,
            
            // الأسعار
            subtotal: cartDetails.subtotal,
            total: cartDetails.total,
            
            // معلومات إضافية
            orderId: this.generateOrderId(),
            date: new Date().toLocaleString('ar-SA'),
            timestamp: new Date().getTime()
        };
    }
    
    // التحقق من صحة النموذج المبسط
    validateForm() {
        let isValid = true;
        let errorMessage = '';
        
        // التحقق من الاسم
        if (!this.customerName?.value.trim()) {
            errorMessage = 'الرجاء إدخال الاسم الكامل';
            this.customerName?.focus();
            isValid = false;
        }
        
        // التحقق من الهاتف
        else if (!this.customerPhone?.value.trim()) {
            errorMessage = 'الرجاء إدخال رقم الهاتف';
            this.customerPhone?.focus();
            isValid = false;
        } else if (!/^05\d{8}$/.test(this.customerPhone.value.trim())) {
            errorMessage = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)';
            this.customerPhone?.focus();
            isValid = false;
        }
        
        // التحقق من العنوان
        else if (!this.deliveryAddress?.value.trim()) {
            errorMessage = 'الرجاء إدخال عنوان التوصيل';
            this.deliveryAddress?.focus();
            isValid = false;
        }
        
        // التحقق من شروط الخدمة
        else if (!this.agreeTerms?.checked) {
            errorMessage = 'الرجاء الموافقة على شروط الخدمة';
            this.agreeTerms?.focus();
            isValid = false;
        }
        
        if (!isValid) {
            this.showNotification('خطأ في البيانات', errorMessage, 'error');
        }
        
        return isValid;
    }
    
    // التحقق من صحة بيانات الطلب
    validateOrderData(orderData) {
        if (!orderData.customerName || orderData.customerName.length < 2) {
            throw new Error('الاسم غير صالح');
        }
        
        if (!orderData.customerPhone || !/^05\d{8}$/.test(orderData.customerPhone)) {
            throw new Error('رقم الهاتف غير صالح');
        }
        
        if (!orderData.address || orderData.address.length < 5) {
            throw new Error('العنوان غير صالح');
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('السلة فارغة');
        }
        
        return true;
    }
    
    // حفظ الطلب محلياً
    saveOrderLocally(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('store_orders') || '[]');
            orders.push(orderData);
            
            if (orders.length > 20) {
                orders.shift();
            }
            
            localStorage.setItem('store_orders', JSON.stringify(orders));
            localStorage.setItem('last_order', JSON.stringify(orderData));
            
            console.log('💾 تم حفظ الطلب محلياً:', orderData.orderId);
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ الطلب:', error);
            return false;
        }
    }
    
    // عرض تأكيد الطلب النهائي المبسط
    showFinalConfirmation(orderData) {
        // إنشاء رسالة الطلب المبسطة
        const message = this.createOrderMessage(orderData);
        
        // إنشاء نافذة التأكيد المبسطة
        const confirmationModal = document.createElement('div');
        confirmationModal.className = 'final-confirmation-modal';
        confirmationModal.innerHTML = `
            <div class="final-confirmation-content">
                <div class="confirmation-header">
                    <i class="fas fa-check-circle"></i>
                    <h3>تم تأكيد طلبك</h3>
                </div>
                
                <div class="confirmation-body">
                    <div class="order-details">
                        <div class="order-detail">
                            <span>رقم الطلب:</span>
                            <strong>${orderData.orderId}</strong>
                        </div>
                        <div class="order-detail">
                            <span>الاسم:</span>
                            <span>${orderData.customerName}</span>
                        </div>
                        <div class="order-detail">
                            <span>الهاتف:</span>
                            <span>${orderData.customerPhone}</span>
                        </div>
                        <div class="order-detail">
                            <span>المجموع:</span>
                            <strong>${orderData.total.toFixed(2)} ريال</strong>
                        </div>
                    </div>
                    
                    <div class="whatsapp-notice">
                        <i class="fab fa-whatsapp"></i>
                        <p>سيتم إرسال الطلب عبر الواتساب.</p>
                    </div>
                </div>
                
                <div class="confirmation-footer">
                    <button class="btn-success send-whatsapp" onclick="checkoutManager.sendToWhatsApp('${this.escapeText(message)}')">
                        <i class="fab fa-whatsapp"></i>
                        إرسال عبر الواتساب
                    </button>
                    <button class="btn-secondary edit-order" onclick="checkoutManager.editOrder()">
                        تعديل الطلب
                    </button>
                </div>
            </div>
        `;
        
        // إضافة الأنماط
        this.addConfirmationStyles();
        
        // إضافة النافذة إلى الصفحة
        document.body.appendChild(confirmationModal);
        
        // إظهار النافذة
        setTimeout(() => {
            confirmationModal.classList.add('active');
        }, 50);
    }
    
    // إنشاء رسالة الطلب للواتساب
    createOrderMessage(orderData) {
        let message = `🛒 *طلب جديد - Nexus Store* 🛒\n`;
        message += `══════════════════════\n\n`;
        
        message += `📋 *معلومات الطلب:*\n`;
        message += `🔢 رقم الطلب: ${orderData.orderId}\n`;
        message += `👤 الاسم: ${orderData.customerName}\n`;
        message += `📞 الهاتف: ${orderData.customerPhone}\n`;
        message += `📍 العنوان: ${orderData.address}\n`;
        message += `💳 الدفع: ${this.getPaymentMethodName(orderData.paymentMethod)}\n\n`;
        
        message += `🛍️ *المنتجات:*\n`;
        message += `══════════════════════\n`;
        
        orderData.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. ${item.name}\n`;
            message += `   الكمية: ${item.quantity}\n`;
            message += `   السعر: ${item.price} × ${item.quantity} = ${itemTotal} ريال\n\n`;
        });
        
        message += `══════════════════════\n`;
        message += `💰 *الإجمالي:* ${orderData.total.toFixed(2)} ريال\n\n`;
        
        if (orderData.notes) {
            message += `📝 *ملاحظات:*\n`;
            message += `${orderData.notes}\n\n`;
        }
        
        message += `══════════════════════\n`;
        message += `شكراً لطلبكم من Nexus Store! 🚀\n`;
        
        return message;
    }
    
    // إرسال إلى واتساب
    sendToWhatsApp(message) {
        try {
            const decodedMessage = message.replace(/\\'/g, "'").replace(/\\n/g, '\n');
            const whatsappNumber = "+966551234567";
            const cleanNumber = whatsappNumber.replace(/\D/g, '');
            const encodedMessage = encodeURIComponent(decodedMessage);
            const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
            
            // إغلاق نافذة التأكيد
            const confirmationModal = document.querySelector('.final-confirmation-modal');
            if (confirmationModal) {
                confirmationModal.classList.remove('active');
                setTimeout(() => confirmationModal.remove(), 300);
            }
            
            // إفراغ السلة
            window.cartManager?.clearCart();
            
            // إظهار رسالة النجاح
            this.showNotification('نجاح', 'تم إرسال الطلب بنجاح!', 'success');
            
            // فتح واتساب
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 500);
            
        } catch (error) {
            console.error('❌ خطأ في إرسال واتساب:', error);
            this.showNotification('خطأ', 'حدث خطأ أثناء الإرسال', 'error');
        }
    }
    
    // تعديل الطلب
    editOrder() {
        const confirmationModal = document.querySelector('.final-confirmation-modal');
        if (confirmationModal) {
            confirmationModal.classList.remove('active');
            setTimeout(() => {
                confirmationModal.remove();
                this.openCheckoutModal();
            }, 300);
        }
    }
    
    // ==================== دوال مساعدة ====================
    
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }
    
    getPaymentMethodName(methodId) {
        const methods = {
            'cash': 'الدفع عند الاستلام',
            'bank': 'تحويل بنكي',
            'mada': 'بطاقة مدى'
        };
        return methods[methodId] || 'غير محدد';
    }
    
    validatePhoneInput(input) {
        input.value = input.value.replace(/\D/g, '');
        
        if (input.value.length > 0 && !input.value.startsWith('05')) {
            input.value = '05' + input.value.replace(/^05/, '');
        }
        
        if (input.value.length > 10) {
            input.value = input.value.substring(0, 10);
        }
    }
    
    escapeText(text) {
        return text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    }
    
    showNotification(title, message, type = 'info') {
        if (window.uiManager?.showNotification) {
            window.uiManager.showNotification(title, message, type);
        } else {
            alert(`${title}: ${message}`);
        }
    }
    
    addConfirmationStyles() {
        if (document.querySelector('#confirmation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'confirmation-styles';
        style.textContent = `
            .final-confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .final-confirmation-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .final-confirmation-content {
                background: white;
                border-radius: 12px;
                max-width: 400px;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .final-confirmation-modal.active .final-confirmation-content {
                transform: translateY(0);
            }
            
            .confirmation-header {
                background: linear-gradient(135deg, var(--success), #0DA67A);
                color: white;
                padding: 20px;
                text-align: center;
            }
            
            .confirmation-header i {
                font-size: 2.5rem;
                margin-bottom: 10px;
                display: block;
            }
            
            .confirmation-header h3 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .confirmation-body {
                padding: 20px;
            }
            
            .order-details {
                background: var(--light);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .order-detail {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                font-size: 0.9rem;
            }
            
            .order-detail:last-child {
                border-bottom: none;
            }
            
            .whatsapp-notice {
                background: #25D366;
                color: white;
                padding: 12px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                font-size: 0.9rem;
            }
            
            .whatsapp-notice i {
                font-size: 1.2rem;
            }
            
            .confirmation-footer {
                padding: 20px;
                border-top: 1px solid var(--gray);
                display: flex;
                gap: 10px;
            }
            
            .confirmation-footer .btn-success {
                background: #25D366;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }
            
            .confirmation-footer .btn-success:hover {
                background: #128C7E;
            }
            
            .confirmation-footer .btn-secondary {
                background: transparent;
                border: 2px solid var(--gray);
                color: var(--text);
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                flex: 1;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }
            
            .confirmation-footer .btn-secondary:hover {
                border-color: var(--primary);
                color: var(--primary);
            }
            
            @media (max-width: 480px) {
                .confirmation-footer {
                    flex-direction: column;
                }
                
                .confirmation-footer button {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// تهيئة نظام الدفع
window.checkoutManager = new CheckoutManager();
[file content end]
