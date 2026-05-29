/* Paiement PayPal — plaques et boutique Macemay custom */
(function() {
    'use strict';

    let sdkPromise = null;
    let buttonsInstance = null;

    function getConfig() {
        return window.MACEMAY_CONFIG || {};
    }

    function loadPayPalSdk() {
        if (window.paypal) {
            return Promise.resolve(window.paypal);
        }
        if (sdkPromise) return sdkPromise;

        const clientId = (getConfig().paypalClientId || '').trim();
        if (!clientId) {
            return Promise.reject(new Error('Client ID PayPal manquant dans site-config.js'));
        }

        sdkPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&locale=fr_FR&intent=capture`;
            script.async = true;
            script.onload = () => resolve(window.paypal);
            script.onerror = () => reject(new Error('Chargement du SDK PayPal impossible'));
            document.head.appendChild(script);
        });

        return sdkPromise;
    }

    async function createPayPalOrderOnServer() {
        const cart = typeof window.getMacemayCart === 'function' ? window.getMacemayCart() : [];
        const endpoint = getConfig().paypalCreateOrderUrl || 'api/create-paypal-order.php';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.paypalOrderId) {
            throw new Error(data.error || 'Creation de commande PayPal impossible');
        }

        localStorage.setItem('macemay_pending_paypal_order', JSON.stringify({
            orderId: data.orderId,
            paypalOrderId: data.paypalOrderId,
            createdAt: new Date().toISOString()
        }));

        return data.paypalOrderId;
    }

    async function capturePayPalOrderOnServer(paypalOrderId) {
        const pendingRaw = localStorage.getItem('macemay_pending_paypal_order');
        let orderId = '';
        try {
            const pending = JSON.parse(pendingRaw || '{}');
            orderId = pending.orderId || '';
        } catch (error) {
            orderId = '';
        }

        const endpoint = getConfig().paypalCaptureOrderUrl || 'api/capture-paypal-order.php';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paypalOrderId, orderId })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Capture PayPal impossible');
        }
        return data;
    }

    async function renderPayPalButtons(container) {
        if (!container) return;

        container.innerHTML = '<p class="payment-loading">Chargement de PayPal…</p>';

        try {
            const paypal = await loadPayPalSdk();
            container.innerHTML = '<div id="paypal-buttons-host"></div>';
            const host = container.querySelector('#paypal-buttons-host');
            if (buttonsInstance) {
                try {
                    buttonsInstance.close();
                } catch (error) {
                    /* ignore */
                }
                buttonsInstance = null;
            }

            buttonsInstance = paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: async () => createPayPalOrderOnServer(),
                onApprove: async (data) => {
                    const capture = await capturePayPalOrderOnServer(data.orderID);
                    if (typeof window.saveCompletedOrder === 'function') {
                        window.saveCompletedOrder(
                            {
                                orderId: capture.orderId,
                                paymentId: data.orderID
                            },
                            {
                                status: 'paid',
                                paymentProvider: 'PayPal',
                                id: data.orderID
                            }
                        );
                    }
                    localStorage.removeItem('macemay_pending_paypal_order');
                    if (typeof window.showNotification === 'function') {
                        window.showNotification('Paiement PayPal confirmé. Merci pour votre commande !', 'success');
                    }
                    const modal = document.getElementById('paymentModal');
                    if (modal) modal.style.display = 'none';
                    if (typeof window.updateCartUI === 'function') window.updateCartUI();
                },
                onError: (error) => {
                    console.error(error);
                    if (typeof window.showNotification === 'function') {
                        window.showNotification('Le paiement PayPal a échoué ou a été annulé.', 'error');
                    }
                }
            });

            if (!buttonsInstance.isEligible()) {
                container.innerHTML = '<p class="payment-error">PayPal n\'est pas disponible sur ce navigateur.</p>';
                return;
            }

            await buttonsInstance.render(host);
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p class="payment-error">${error.message || 'PayPal indisponible. Vérifiez la configuration.'}</p>`;
        }
    }

    window.MacemayPaypal = {
        loadPayPalSdk,
        renderPayPalButtons
    };
})();
