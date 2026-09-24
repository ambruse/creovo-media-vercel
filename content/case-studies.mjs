// These are owner-supplied client references, NOT publishable case studies yet.
// Populate only verified fields and set status to published after editorial approval.
export const caseStudies = [
 ['Catharei','catharei','https://catharei.com'],
 ['Argus Shipping','argus-shipping','https://argusshipping.co'],
 ['Argus Computers','argus-computers','https://www.arguscomputers.net'],
].map(([clientName,slug,website])=>({clientName,slug,website,status:'draft',industry:null,summary:null,challenge:null,objective:null,services:[],strategy:null,creativeDirection:null,execution:null,deliverables:[],images:[],videos:[],results:[],testimonial:null,credits:[],relatedServices:[],relatedInsights:[],language:null,publishedDate:null,updatedDate:null}));
export const publishedCaseStudies = caseStudies.filter(p=>p.status==='published' && p.summary && p.services.length && p.execution);
