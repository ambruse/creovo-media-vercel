// Optional editorial fields keyed by the stable ID in video-manifest.json.
// Add approved bilingual titles/descriptions, client, categories, rights and
// actual public uploadDate here. Do not infer dates from filesystem timestamps.
// Source scans preserve these entries. Empty categories mean unclassified.
// Titles describe visible subjects / source filenames, not verified campaign results.
const title=(en,ar)=>({title:{en,ar},categories:['content-creation']});
export const videoDetails = {
 'arg-1':title('A quiet moment at home','لحظة هادئة في المنزل'),
 'arg-2':title('Between the containers','بين الحاويات'),
 'arg-3':title('Cargo in detail','تفاصيل الشحن'),
 'arg-4':title('Through the doorway','عبر المدخل'),
 'arg-5':title('Warehouse exterior','واجهة المستودع'),
 'arg-6':title('A message on screen','رسالة على الشاشة'),
 'arg-7':title('Inside the workspace','داخل مساحة العمل'),
 'arg-8':title('Everyday connections','تواصل يومي'),
 'arg-9':title('Inside the warehouse','داخل المستودع'),
 'arg-10':title('Retail in focus','التجزئة تحت العدسة'),
 'arg-11':title('Packed for the journey','جاهز للرحلة'),
 'arg-12':title('Desert textures','ملامس الصحراء'),
 'chocolate-tart-re-edit':title('Chocolate tart — alternate edit','تارت الشوكولاتة — مونتاج بديل'),
 'chocolate-tart':title('Chocolate tart','تارت الشوكولاتة'),
 'doha-chocolate-review':title('Chocolate tasting','تذوق الشوكولاتة'),
 'img-9438':title('Cake at the counter','كيك على المنضدة'),
 'london-cake-rewised':title('Cake in close-up','الكيك عن قرب'),
 'lotus-cake':title('Cake and café moments','كيك ولحظات في المقهى'),
 'mini-sandwiches':title('Mini sandwiches','ساندويتشات صغيرة'),
 'missing-cat':title('A sweet discovery','اكتشاف حلو'),
 'truffles':title('Truffles — product story','ترافل — قصة منتج'),
};
