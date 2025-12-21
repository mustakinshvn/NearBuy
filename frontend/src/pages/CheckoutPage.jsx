import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import logoImg from '../assets/logo-nearbuy.png';
import BillingSection from '../component/checkout/BillingSection';
import ShippingSection from '../component/checkout/ShippingSection';
import PaymentSection from '../component/checkout/PaymentSection';
import OrderSummaryCard from '../component/checkout/OrderSummaryCard';
import ButtonCard from '../component/sharingComponents/Button';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    area: '',
    city: '',
    postal_code: '',
    payment_method: 'cash_on_delivery',
    card_number: '',
    card_expiry: '',
    card_cvv: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;
  if (cart.length === 0 && !orderPlaced) {
    navigate('/products');
    return null;
  }

  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 0 ? 60 : 0;
  const finalTotal = cartTotal + shippingCost;

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });

  const generatePDF = async () => {
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

      const html2canvas = window.html2canvas;
      const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
      if (!html2canvas || !jsPDF) throw new Error('PDF libraries not available');

      const container = document.createElement('div');
      container.style.width = '800px';
      container.style.padding = '24px';
      container.style.background = '#ffffff';
      container.style.fontFamily = 'Arial, Helvetica, sans-serif';
      container.style.color = '#263238';
      container.style.boxSizing = 'border-box';

      const itemsHtml = cart.map(it => `
        <tr>
          <td style="padding:8px 4px;border-bottom:1px solid #eee">${(it.title || '').replace(/</g,'&lt;')}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td>
          <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:right">৳${(((it.discount_price||it.price)||0) * it.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:12px">
            <img src="${logoImg}" alt="logo" style="height:56px;object-fit:contain" />
            <div>
              <div style="font-size:20px;font-weight:700;color:#0f172a">NearBuy</div>
              <div style="font-size:12px;color:#64748b">E-commerce Invoice</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:700">Order Summary</div>
            <div style="font-size:12px;color:#64748b">Generated: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div style="margin:12px 0;padding:12px;border:1px solid #f1f5f9;border-radius:6px">
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">Customer Information</div>
          <div style="font-size:12px;color:#0f172a;margin-bottom:4px">${(formData.name || user?.name || 'N/A').replace(/</g,'&lt;')}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:2px">Email: ${((formData.email || user?.email || 'N/A')).replace(/</g,'&lt;')}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">Phone: ${((formData.phone || user?.phone || 'N/A')).replace(/</g,'&lt;')}</div>
          <div style="font-size:12px;color:#64748b;margin-top:6px;margin-bottom:4px">Shipping Address</div>
          <div style="font-size:12px;color:#0f172a">${((formData.street || '') + (formData.area ? ', ' + formData.area : '') + (formData.city ? ', ' + formData.city : '')).replace(/</g,'&lt;')}</div>
          <div style="font-size:12px;color:#0f172a">${(formData.postal_code || '').replace(/</g,'&lt;')}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 4px;border-bottom:2px solid #e6eef6">Item</th>
              <th style="text-align:center;padding:8px 4px;border-bottom:2px solid #e6eef6">Qty</th>
              <th style="text-align:right;padding:8px 4px;border-bottom:2px solid #e6eef6">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top:16px;display:flex;justify-content:flex-end">
          <div style="width:320px;padding:12px;border:1px solid #f1f5f9;border-radius:6px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px"><div style="color:#64748b">Subtotal</div><div>৳${cartTotal.toFixed(2)}</div></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px"><div style="color:#64748b">Shipping</div><div>৳${shippingCost.toFixed(2)}</div></div>
            <div style="border-top:1px dashed #e6eef6;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700"><div>Total</div><div>৳${finalTotal.toFixed(2)}</div></div>
          </div>
        </div>

        <div style="margin-top:22px;font-size:12px;color:#64748b">Thanks for shopping with NearBuy. If you have any questions, reply to your order confirmation email.</div>
      `;

      container.style.position = 'fixed';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = { width: canvas.width, height: canvas.height };
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;

      pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 20, imgWidth, imgHeight);
      pdf.save(`nearbuy-order-${Date.now()}.pdf`);

      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Unable to generate PDF. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        discount_price: item.discount_price || null,
        product_title: item.title,
        product_image: item.image || null,
      }));

      const vendorId = cart[0]?.seller_id || 1;

      const orderData = {
        customer_id: user.customer_id,
        vendor_id: vendorId,
        total_amount: cartTotal,
        discount_amount: 0,
        payment_method: formData.payment_method,
        items: orderItems,
        shipping_address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          postal_code: formData.postal_code
        },
        billing_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      };

      const result = await createOrder(orderData);
      if (result.success) {
        try {
          await generatePDF();
        } catch (pdfErr) {
          console.error('Auto PDF generation failed', pdfErr);
        }
        clearCart();
        setOrderPlaced(true);
      } else {
        setOrderError(result.error || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      setOrderError('An unexpected error occurred. Please try again.');
      console.error('Order creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-slate-600 mb-2">Thank you for your order</p>
          <p className="text-sm text-slate-500 mb-8">You will receive a confirmation email shortly</p>
          <div className="space-y-3">
            <ButtonCard label="View Orders" onClick={() => navigate('/orders')}  />
            <ButtonCard label="Continue Shopping" onClick={() => navigate('/products')} className="bg-linear-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <h1 className="text-4xl font-bold text-slate-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <BillingSection formData={formData} onChange={handleInputChange} />
              <ShippingSection formData={formData} onChange={handleInputChange} />
              <PaymentSection formData={formData} onChange={handleInputChange} />

              {orderError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-red-600">{orderError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-linear-to-r from-red-600 to-yellow-600 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-yellow-700'
                }`}
              >
                {isSubmitting ? 'Processing...' : `Place Order - ৳${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <OrderSummaryCard
              cart={cart}
              cartTotal={cartTotal}
              shippingCost={shippingCost}
              finalTotal={finalTotal}
              generatePDF={generatePDF}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;