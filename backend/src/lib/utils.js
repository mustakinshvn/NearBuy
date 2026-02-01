export const mergeOrdersByOrderId = async (data) => {
  const merged = {};

  data.forEach(item => {
    const orderId = item.order_id;
    if (!merged[orderId]) {
      merged[orderId] = {
        order_id: item.order_id,
        customer_id: item.customer_id,
        vendor_id: item.vendor_id,
        total_amount: item.total_amount,
        discount_amount: item.discount_amount,
        final_amount: item.final_amount,
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        order_status: item.order_status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        customer: {
          name: item.name,
          email: item.email,
          phone: item.phone
        },
        items: []
      };
    }

    merged[orderId].items.push({
      order_item_id: item.order_item_id,
      product_id: item.product_id,
      product_title: item.product_title,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_price: item.discount_price,
      total_price: item.total_price
    });
  });

  return Object.values(merged);
}