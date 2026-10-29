const brief = {
 en: `Business and offer:
Audience and what they need to understand:
Project objective and how we will assess it:
Required deliverables, quantities and formats:
Channels and languages (Arabic / English):
Brand assets and references we can supply:
Budget range and what it must cover:
Deadline, milestones and location constraints:
Permissions, usage rights and responsibilities:
Person consolidating feedback and final approver:`,
 ar: `الشركة وما تقدمه:
الجمهور وما يحتاج إلى فهمه:
هدف المشروع وطريقة تقييمه:
المخرجات المطلوبة وأعدادها وصيغها:
القنوات واللغات (العربية / الإنجليزية):
أصول العلامة والمراجع المتاحة لدينا:
نطاق الميزانية وما يجب أن يشمله:
الموعد النهائي والمراحل وقيود الموقع:
التصاريح وحقوق الاستخدام والمسؤوليات:
مسؤول تجميع الملاحظات وصاحب الاعتماد النهائي:`
};

export default function GuideResource({slug, locale}) {
 const ar = locale === 'ar';
 if (slug === 'creative-agency-brief') return <section className="guide-resource">
  <h2>{ar ? 'موجز يمكنك نسخه وتعبئته' : 'A brief you can copy and complete'}</h2>
  <p>{ar ? 'انسخ هذه الأسئلة إلى مستندك وأجب عنها قبل طلب عرض. ضع علامة على البنود غير المحسومة لمناقشتها.' : 'Copy these prompts into your document before requesting a proposal. Mark undecided items for discussion.'}</p>
  <pre tabIndex={0}>{brief[locale]}</pre>
  <h3>{ar ? 'مثال توضيحي: إطلاق قائمة مقهى' : 'Illustrative example: a café menu launch'}</h3>
  <p>{ar ? 'الهدف: تعريف الزوار بصنف جديد ومساعدتهم على العثور على القائمة. المخرجات المقترحة: ثلاثة مقاطع عمودية وست صور، مع نصوص عربية وإنجليزية. الأصول المتاحة: الشعار والقائمة المعتمدة. مسؤول الملاحظات: مدير المقهى. قبل التسعير: تأكيد موعد التصوير والميزانية وحقوق الاستخدام وعدد جولات التعديل. هذا مثال افتراضي لتوضيح الموجز، وليس مشروع عميل أو نتيجة فعلية.' : 'Objective: introduce a new item and help visitors find the menu. Proposed outputs: three vertical clips and six photographs, with Arabic and English copy. Available assets: the logo and approved menu. Feedback owner: the café manager. Before quoting: confirm the shoot date, budget, usage rights and revision rounds. This is a fictional planning example, not a client project or a measured result.'}</p>
 </section>;
 if (slug === 'website-redesign-checklist') return <section className="guide-resource">
  <h2>{ar ? 'مثال توضيحي لخريطة إعادة التوجيه' : 'Illustrative redirect map'}</h2>
  <p>{ar ? 'هذه مسارات افتراضية للتخطيط، وليست روابط فعلية أو سجلاً لترحيل موقع عميل. تحقق من وجود صفحة بديلة مكافئة قبل إضافة إعادة توجيه.' : 'These fictional paths illustrate the planning process; they are not live links or a client migration record. Confirm an equivalent replacement exists before adding a redirect.'}</p>
  <table><thead><tr><th>{ar ? 'الرابط السابق' : 'Old path'}</th><th>{ar ? 'القرار' : 'Decision'}</th><th>{ar ? 'وجهة مكافئة' : 'Equivalent destination'}</th></tr></thead><tbody>
   <tr><td><bdi>/video-services/</bdi></td><td>{ar ? 'نقل دائم: 301' : 'Permanent move: 301'}</td><td><bdi>/services/video-production/</bdi></td></tr>
   <tr><td><bdi>/ar/video-services/</bdi></td><td>{ar ? 'نقل دائم: 301' : 'Permanent move: 301'}</td><td><bdi>/ar/services/video-production/</bdi></td></tr>
  </tbody></table>
  <p>{ar ? 'فحص الإطلاق: تأكد من حالة إعادة التوجيه ووجهتها على النطاق المنشور، ثم افحص حالة 200 للرابط الجديد والرابط الأساسي وبديل اللغة. حدث الروابط الداخلية وخريطة الموقع، واختبر اختيار الخدمة بعد تبديل اللغة.' : 'Launch check: verify the redirect status and destination on the deployed domain, then check that the new URL returns 200 with the right canonical and language alternate. Update internal links and the sitemap, and test service selection after switching language.'}</p>
 </section>;
 return null;
}
