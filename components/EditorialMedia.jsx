import Image from 'next/image';

const responsiveWidths = width => [...new Set([480,640,800,1200,1600].map(size=>Math.min(size,width)))];

export default function EditorialMedia({id,width,height,alt,ratio,position='50% 50%',sizes='(max-width: 700px) calc(100vw - 44px), (max-width: 1000px) 90vw, 48vw',className=''}) {
 const base=`/images/creovo/editorial/${id}`;
 const widths=responsiveWidths(width);
 const srcSet=format=>widths.map(size=>`${base}-${size}.${format} ${size}w`).join(', ');
 return <picture className={`editorial-media ${className}`} style={{'--editorial-ratio':ratio||`${width} / ${height}`}}>
  <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes}/>
  <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes}/>
  <Image src={`${base}-${widths.at(-1)}.webp`} width={width} height={height} alt={alt} sizes={sizes} quality={82} unoptimized loading="lazy" style={{objectFit:'cover',objectPosition:position}}/>
 </picture>;
}
