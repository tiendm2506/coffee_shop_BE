export const subscribeTemplate = ({ email }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset='UTF-8' />
      <title>Subscribe Success</title>
    </head>

    <body style='margin:0; padding:0; background:#f6f6f6; font-family:Arial, sans-serif;'>
      
      <table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;'>
        <tr>
          <td align='center'>

            <!-- CARD -->
            <table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff; border-radius:12px; overflow:hidden;'>

              <!-- HEADER -->
              <tr>
                <td style='background:#111827; padding:30px; text-align:center; color:#ffffff;'>
                  <h1 style='margin:0; font-size:22px;'>Subscription Successful</h1>
                  <p style='margin-top:8px; font-size:14px; color:#d1d5db;'>
                    Coffee Shop Promotions
                  </p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style='padding:32px;'>

                  <h2 style='margin-top:0;'>Hello</h2>

                  <p style='font-size:15px; color:#333;'>
                    Thank you for subscribing to our promotion updates!
                  </p>

                  <p style='font-size:15px; color:#333;'>
                    We will send you exclusive deals, discount codes, and special offers directly to your inbox.
                  </p>

                  <!-- EMAIL BOX -->
                  <div style='margin:20px 0; padding:14px; background:#f3f4f6; border-radius:8px;'>
                    <p style='margin:0; font-size:14px;'>
                      Registered email:
                      <strong>${email}</strong>
                    </p>
                  </div>

                  <!-- CTA -->
                  <div style='text-align:center; margin-top:30px;'>
                    <a href='https://coffeeshop.com'
                      style='
                        background:#111827;
                        color:#fff;
                        padding:12px 20px;
                        text-decoration:none;
                        border-radius:6px;
                        display:inline-block;
                        font-weight:bold;
                      '>
                      Go to Shop
                    </a>
                  </div>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style='background:#f9fafb; text-align:center; padding:20px; font-size:12px; color:#6b7280;'>
                  © ${new Date().getFullYear()} Coffee Shop. All rights reserved.
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