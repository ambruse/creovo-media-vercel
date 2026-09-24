import ContentPage from '../../../components/ContentPage';
import { allRoutes,routeForSlug,metadataFor } from '../../../lib/site';
export const dynamicParams=false;
export function generateStaticParams(){return allRoutes().map(route=>({slug:route==='/'?undefined:route.split('/').filter(Boolean)}));}
export async function generateMetadata({params}){return metadataFor(routeForSlug((await params).slug),'en');}
export default async function Page({params}){return <ContentPage route={routeForSlug((await params).slug)} locale="en"/>;}
