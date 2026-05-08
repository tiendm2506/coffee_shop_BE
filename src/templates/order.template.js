export const orderSuccessTemplate = ({
  customerName,
  orderId,
  items,
  finalTotal
}) => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style='padding: 12px; border-bottom: 1px solid #eee;'>
            <img 
              src='${item.image}' 
              alt='${item.name}' 
              width='60'
              style='border-radius: 8px;'
            />
          </td>

          <td style='padding: 12px; border-bottom: 1px solid #eee;'>
            ${item.name}
          </td>

          <td style='padding: 12px; border-bottom: 1px solid #eee; text-align:center;'>
            ${item.quantity}
          </td>

          <td style='padding: 12px; border-bottom: 1px solid #eee; text-align:right;'>
            $${item.final_price}
          </td>
        </tr>
      `
    )
    .join('')

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset='UTF-8' />
      <title>Order Confirmation</title>
    </head>

    <body
      style='
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: Arial, sans-serif;
      '
    >
      <table
        width='100%'
        cellpadding='0'
        cellspacing='0'
        style='padding: 40px 0;'
      >
        <tr>
          <td align='center'>
            <table
              width='600'
              cellpadding='0'
              cellspacing='0'
              style='
                background: white;
                border-radius: 16px;
                overflow: hidden;
              '
            >
              <!-- HEADER -->
              <tr>
                <td
                  style='
                    background: #111827;
                    color: white;
                    padding: 32px;
                    text-align: center;
                  '
                >
                  <h1 style='margin:0;'>☕ Coffee Shop</h1>
                  <p style='margin-top:8px;'>
                    Thank you for your order
                  </p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style='padding: 32px;'>
                  <h2>Hello ${customerName}</h2>

                  <p>
                    Your order has been placed successfully.
                  </p>

                  <p>
                    <strong>Order ID:</strong> ${orderId}
                  </p>

                  <!-- ITEMS -->
                  <table
                    width='100%'
                    cellpadding='0'
                    cellspacing='0'
                    style='
                      margin-top: 24px;
                      border-collapse: collapse;
                    '
                  >
                    <thead>
                      <tr style='background:#f3f4f6;'>
                        <th style='padding:12px;'>Image</th>
                        <th style='padding:12px;'>Product</th>
                        <th style='padding:12px;'>Qty</th>
                        <th style='padding:12px;'>Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- TOTAL -->
                  <div
                    style='
                      margin-top: 24px;
                      text-align: right;
                    '
                  >
                    <h2 style='color:#dc2626;'>
                      Total: $${finalTotal}
                    </h2>
                  </div>

                  <!-- BUTTON -->
                  <div style='margin-top:32px; text-align:center;'>
                    <a
                      href='https://coffeeshop.com/order/${orderId}'
                      style='
                        display:inline-block;
                        padding:14px 24px;
                        background:#111827;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                      '
                    >
                      View Order
                    </a>
                  </div>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td
                  style='
                    background:#f9fafb;
                    padding:24px;
                    text-align:center;
                    color:#6b7280;
                    font-size:14px;
                  '
                >
                  © 2026 Coffee Shop. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}