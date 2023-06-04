const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "phamnguyenbaoquy@gmail.com",
    pass: "nbwqvyxlvctnzqad",
  },
});

const Email = (options) => {
  return new Promise((resolve) => {
    transpoter.sendMail(options, (err) => {
      if (err) resolve(false);
      else resolve(true);
    });
  });
};

module.exports = {
  Sender: (to_mail, url, name) => {
    const options = {
      from: to_mail,
      to: to_mail,
      subject: "Xác Nhận Kích Hoạt Tài Khoản",
      html: `<div style="background-color:#ffffff">
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
             <tbody>
                <tr>
                   <td valign="top" style="padding:0;Margin:0">
                      <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-header" align="center" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                         <tbody>
                            <tr>
                               <td align="center" style="padding:0;Margin:0">
                                  <table bgcolor="#ffffff" class="m_1237883845838510533es-header-body" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:558px">
                                     <tbody>
                                        <tr>
                                           <td align="left" style="padding:0;Margin:0">
                                              <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px">
                                                 <tbody>
                                                    <tr>
                                                       <td align="center" valign="top" style="padding:0;Margin:0;width:558px">
                                                          <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                             <tbody>
                                                                <tr>
                                                                   <td align="center" style="padding:0;Margin:0;padding-top:20px;font-size:0">
                                                                      <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                                         <tbody>
                                                                            <tr>
                                                                               <td style="padding:0;Margin:0;border-bottom:0px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                            </tr>
                                                                         </tbody>
                                                                      </table>
                                                                   </td>
                                                                </tr>
                                                             </tbody>
                                                          </table>
                                                       </td>
                                                    </tr>
                                                 </tbody>
                                              </table>
                                           </td>
                                        </tr>
                                     </tbody>
                                  </table>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                      <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-content" align="center" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                         <tbody>
                            <tr> 
                            </tr>
                         </tbody>
                      </table>
                      <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-content" align="center" style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                         <tbody>
                            <tr>
                               <td align="center" style="padding:0;Margin:0">
                                  <table class="m_1237883845838510533es-content-body" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;border-right:1px solid #efefef;border-left:1px solid #efefef;width:558px;border-bottom:1px solid #efefef" bgcolor="#ffffff">
                                     <tbody>
                                        <tr>
                                           <td align="left" bgcolor="#ffffff" style="padding:0;Margin:0;background-color:#fff">
                                              <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px">
                                                 <tbody>
                                                    <tr>
                                                       <td width="100%">
       </div>
       <div>
       <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
       <tbody>
       <tr>
       <td style="width:12px">&nbsp;</td>
       <td valign="top" style="padding-top:0px;padding-right:5px;padding-bottom:9px;padding-left:10px;color:#606060;font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">
       <div style="padding-top:0px;padding-right:10px;padding-bottom:9px;padding-left:0px;color:#606060;font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">Gửi <strong>${name}</strong> thân mến,<div style="text-align:center"><br></div><div style="padding-top:10px;padding-bottom:10px" align="center">
       <a href="${url}" style="border-color:rgb(23,134,252);border-width:10px 20px;border-style:solid;text-decoration:none;border-radius:3px;background-color:rgb(23,134,252);display:inline-block;font-size:16px;color:rgb(255,255,255)" background="#m_1237883845838510533_1786fc" target="_blank">Xác Nhận Ngay!</a>
       <div style="clear:both"></div>                                </div><div style="padding:10px 10px 10px 0px;color:rgb(96,96,96);font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left"> Lợi ích xác nhận tài khoản:<ul><li>Tham gia kênh chat tổng</li><li>Đăng bài viết, bình luận trong bài viết</li></ul><div style="text-align:center"><strong>Cảm ơn!</strong></div></div>
       </td>
       </tr>
       </tbody>
       </table>
       </div>
       </td>
       </tr>
       </tbody></table>
       </td>
       </tr>
       </tbody></table></td> 
       </tr> 
       </tbody></table></td> 
       </tr> 
       </tbody></table> 
       </div>`,
    };
    return Email(options);
  },

  Edit: (to_mail, time, name, url, url2) => {
    const options = {
      from: to_mail,
      to: to_mail,
      subject: "Xác Nhận Thay ĐỔi Email",
      html: `<div style="background-color:#ffffff">
           <table width="100%" cellspacing="0" cellpadding="0"
               style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
               <tbody>
                   <tr>
                       <td valign="top" style="padding:0;Margin:0">
                           <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-header" align="center"
                               style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                               <tbody>
                                   <tr>
                                       <td align="center" style="padding:0;Margin:0">
                                           <table bgcolor="#ffffff" class="m_1237883845838510533es-header-body" align="center"
                                               cellpadding="0" cellspacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:558px">
                                               <tbody>
                                                   <tr>
                                                       <td align="left" style="padding:0;Margin:0">
                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                               style="border-collapse:collapse;border-spacing:0px">
                                                               <tbody>
                                                                   <tr>
                                                                       <td align="center" valign="top"
                                                                           style="padding:0;Margin:0;width:558px">
                                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                                               role="presentation"
                                                                               style="border-collapse:collapse;border-spacing:0px">
                                                                               <tbody>
                                                                                   <tr>
                                                                                       <td align="center"
                                                                                           style="padding:0;Margin:0;padding-top:20px;font-size:0">
                                                                                           <table border="0" width="100%"
                                                                                               height="100%" cellpadding="0"
                                                                                               cellspacing="0"
                                                                                               role="presentation"
                                                                                               style="border-collapse:collapse;border-spacing:0px">
                                                                                               <tbody>
                                                                                                   <tr>
                                                                                                       <td
                                                                                                           style="padding:0;Margin:0;border-bottom:0px solid #cccccc;background:none;height:1px;width:100%;margin:0px">
                                                                                                       </td>
                                                                                                   </tr>
                                                                                               </tbody>
                                                                                           </table>
                                                                                       </td>
                                                                                   </tr>
                                                                               </tbody>
                                                                           </table>
                                                                       </td>
                                                                   </tr>
                                                               </tbody>
                                                           </table>
                                                       </td>
                                                   </tr>
                                               </tbody>
                                           </table>
                                       </td>
                                   </tr>
                               </tbody>
                           </table>
                           <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-content" align="center"
                               style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                               <tbody>
                                   <tr>
                                   </tr>
                               </tbody>
                           </table>
                           <table cellpadding="0" cellspacing="0" class="m_1237883845838510533es-content" align="center"
                               style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                               <tbody>
                                   <tr>
                                       <td align="center" style="padding:0;Margin:0">
                                           <table class="m_1237883845838510533es-content-body" align="center" cellpadding="0"
                                               cellspacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;border-right:1px solid #efefef;border-left:1px solid #efefef;width:558px;border-bottom:1px solid #efefef"
                                               bgcolor="#ffffff">
                                               <tbody>
                                                   <tr>
                                                       <td align="left" bgcolor="#ffffff"
                                                           style="padding:0;Margin:0;background-color:#fff">
                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                               style="border-collapse:collapse;border-spacing:0px">
                                                               <tbody>
                                                                   <tr>
                                                                       <td width="100%">
       </div>
       <div>
           <table align="left" border="0" cellpadding="0" cellspacing="0"
               style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
               <tbody>
                   <tr>
                       <td style="width:12px">&nbsp;</td>
                       <td valign="top"
                           style="padding-top:0px;padding-right:5px;padding-bottom:9px;padding-left:10px;color:#606060;font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">
                           <div
                               style="padding-top:0px;padding-right:10px;padding-bottom:9px;padding-left:0px;color:#606060;font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">
                               <div style="text-align:center"><br>
                                   Vào lúc <strong>${time}</strong> tài khoản: <strong>${name}</strong> đã thay đổi địa chỉ
                                   email
                               </div>
                               <div style="padding-top:10px;padding-bottom:10px" align="center">
                                   <a href="${url}"
                                       style="border-color:rgb(23,134,252);border-width:10px 20px;border-style:solid;text-decoration:none;border-radius:3px;background-color:rgb(23,134,252);display:inline-block;font-size:16px;color:rgb(255,255,255)"
                                       background="#m_1237883845838510533_1786fc" target="_blank">Xác Nhận</a>
                               </div>
                               <div style="padding-top:10px;padding-bottom:10px" align="center">
                                   <a href="${url2}"
                                       style="border-color:rgb(255, 0, 0);border-width:10px 20px;border-style:solid;text-decoration:none;border-radius:3px;background-color:rgb(255, 0, 0);display:inline-block;font-size:16px;color:rgb(255,255,255)"
                                       background="#m_1237883845838510533_1786fc" target="_blank">Không Phải Tôi</a>
                                   <div style="clear:both"></div>
                               </div>
                               <div
                                   style="padding:10px 10px 10px 0px;color:rgb(96,96,96);font-family:Arial,sans-serif;font-size:14px;line-height:150%;text-align:left">
                                   Nhấn không phải tôi sẽ hoàn tác lại email và tiến hành đổi lại mật khẩu tài khoản của bạn<br/>
                                   Có hiệu lực trong vòng <strong>30 ngày</strong>
                                   <div style="text-align:center"><strong>Thân</strong></div>
                               </div>
                       </td>
                   </tr>
               </tbody>
           </table>
       </div>
       </td>
       </tr>
       </tbody>
       </table>
       </td>
       </tr>
       </tbody>
       </table>
       </td>
       </tr>
       </tbody>
       </table>
       </td>
       </tr>
       </tbody>
       </table>
       </div>`,
    };
    return Email(options);
  },
};
