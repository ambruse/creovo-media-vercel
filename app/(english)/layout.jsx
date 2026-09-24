import SiteDocument,{verification} from '../../components/SiteDocument';
export const metadata={verification};
export default function Layout({children}) { return <SiteDocument locale="en">{children}</SiteDocument>; }
