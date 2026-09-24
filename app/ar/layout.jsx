import SiteDocument,{verification} from '../../components/SiteDocument';
export const metadata={verification};
export default function Layout({children}) { return <SiteDocument locale="ar">{children}</SiteDocument>; }
