import pymupdf,csv,re,json
from pathlib import Path
src=Path(r'C:\Users\WORK\Downloads\Creovo_Media_SEO_Keywords_Qatar_Expanded.pdf')
doc=pymupdf.open(src); out=Path('docs/seo'); out.mkdir(exist_ok=True)
(out/'KEYWORD_SOURCE_EXTRACT.txt').write_text('\n\n'.join(f'PAGE {i+1}\n'+p.get_text(sort=True) for i,p in enumerate(doc)),encoding='utf-8')
labels={'Agency':'agency','Branding':'branding','Social Media':'social-media','Video Production':'video-production','Video':'video-production','Content Creation':'content-creation','Content':'content-creation','Digital Marketing':'digital-marketing','SEO':'seo','Website Design':'web-design','Website':'web-design','Influencer Marketing':'influencer-marketing','Influencers':'influencer-marketing','Event Coverage':'event-coverage','Events':'event-coverage'}
rows=[]
def classify(t):
 t=t.lower()
 for pattern,slug in [(r'influenc|inful|influen|مؤثر','influencer-marketing'),(r'event|conference|exhibition|فعال|مناسب','event-coverage'),(r'\bseo\b|seach|search engine|rank|organic|not.*google|جوجل|محركات','seo'),(r'web|مواقع','web-design'),(r'brand|brading|logo|identiy|هوية|شعار|لوجو','branding'),(r'social|socail|instagram|insta|facebook|tiktok|page handling|حسابات|تواصل','social-media'),(r'video|vedio|videogr|film|فيديو','video-production'),(r'content|reel|photo|photograp|منتجات','content-creation'),(r'market|markting|advertis|\bads\b|lead|تسويق|إعلا|إعال','digital-marketing')]:
  if re.search(pattern,t):return slug
 return 'agency'
def add(t,p,cluster=None):
 t=t.strip().strip('"').strip('.');
 if not t:return
 cluster=cluster or classify(t);lang='ar' if re.search('[\u0600-\u06ff]',t) else 'en'
 # Repair PDF ligature extraction only; retain raw source separately.
 t=t.replace('إعالمية','إعلامية').replace('إعالنات','إعلانات').replace('االجتماعي','الاجتماعي')
 path='/' if cluster=='agency' else '/services/'+cluster+'/'
 action='Monitor existing page; no duplicate URL'
 if p==11:action='Research typo only; never publish misspelling'
 if p==6:action='Map to service; industry expansion requires approved project proof'
 if 'ecommerce' in t.lower():action='Needs business verification before targeting ecommerce offering'
 rows.append([t,lang,'Qatar' if re.search('qatar|قطر',t,re.I) else 'Doha' if re.search('doha|دوحة',t,re.I) else 'Near me' if 'near me' in t else 'None','Commercial research' if p==7 else 'Provider/service',cluster,'https://creovomedia.com'+('/ar' if lang=='ar' else '')+path,*(['Unknown']*7),'High service relevance (hypothesis)','P3' if p==11 else 'P1',action,str(p),'Supplied PDF; unvalidated research candidate'])
for i,page in enumerate(doc):
 p=i+1;cluster=None;buffer=[]
 spans=[s for b in page.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans']]
 for s in spans:
  t=s['text'];size=round(s['size'],1)
  if t in labels:cluster=labels[t]
  if p==2 and size==7.2 and t.endswith(('Qatar','Doha')):add(t,p)
  if p in (3,4,5) and size in (8.1,6.8) and not t.isdigit() and not t.startswith('0 '):add(t,p,cluster)
  if p==6 and size==6.8 and not t.isdigit() and not t.startswith('0 '):add(t,p)
  if p==7 and size==7.5 and not t.isupper():add(t,p)
  if p in (8,12) and size==9.8:add(t,p)
  if p in (9,10,11) and size==6.9 and t not in labels:add(t,p,cluster)
  if p==12 and size==7.2 and ( ';' in t or t=='website'):buffer.append(t if t!='website' else '')
  if p==12 and t=='website':buffer[-2]+=' website'
 if p==12:
  for t in ';'.join(buffer).split(';'):add(t,p)
# Examples and worked variations outside the candidate tables.
for t in ['Restaurant social media management Qatar','website design company Qatar','media company Qatar','make website for my business','website designer near me']:add(t,13)
fields=['Keyword','Language','Location Modifier','Intent','Cluster','Target URL','Search Volume','Difficulty','GSC Impressions','Clicks','CTR','Position','Lead Value','Business Value','Priority','Action','PDF Page','Source']
unique={}
for r in rows:
 k=r[0].casefold()
 if k not in unique:unique[k]=r
 else:unique[k][-2]+=','+r[-2]
with (out/'MASTER_KEYWORD_MAP.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(fields);w.writerows(unique.values())
print('Keyword candidates:',len(unique));print('All 16 pages extracted. Metrics unknown, no invented demand.')
