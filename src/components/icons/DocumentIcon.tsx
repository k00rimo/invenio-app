import { cn } from '@/lib/utils'

type DocumentIconProps = React.SVGProps<SVGSVGElement>

const DocumentIcon = ({ className, ...props }: DocumentIconProps) => {
  return (
    <svg
      width="240"
      height="241"
      viewBox="0 0 240 241"
      fill="none"
      className={cn("", className)}
      {...props}
    >
      <g clip-path="url(#clip0_530_6669)">
        <path d="M120.001 240.489C186.272 240.489 239.995 186.766 239.995 120.495C239.995 54.2235 186.272 0.5 120.001 0.5C53.7293 0.5 0.00585938 54.2235 0.00585938 120.495C0.00585938 186.766 53.7293 240.489 120.001 240.489Z" fill="#1950DD"/>
        <path opacity="0.1" d="M238.231 140.956L171.432 74.1566V74.156L149.018 51.7422H68.5664V184.688V189.248L119.814 240.496C119.876 240.496 119.937 240.5 119.999 240.5C179.297 240.5 228.516 197.48 238.231 140.956Z" fill="black"/>
        <path d="M171.432 184.699H68.5664V189.26H171.432V184.699Z" fill="#D5D6DB"/>
        <path d="M148.811 52.2422L170.932 74.3633V184.188H69.0664V52.2422H148.811Z" fill="white" stroke="#1950DD"/>
        <path d="M170.227 73.6562H149.52V52.9492L170.227 73.6562Z" fill="#EBF0F3" stroke="#1950DD"/>
        <path d="M100.143 64.8672H78.1152V67.3667H100.143V64.8672Z" fill="#44C4A1"/>
        <path d="M161.36 158.369H139.332V160.869H161.36V158.369Z" fill="#27A2DB"/>
        <path d="M161.369 166.43H146.812V168.929H161.369V166.43Z" fill="#EBF0F3"/>
        <path d="M138.219 87.7637H101.758V90.2631H138.219V87.7637Z" fill="#E56353"/>
        <path d="M161.369 98.957H78.6309V101.456H161.369V98.957Z" fill="#EBF0F3"/>
        <path d="M161.369 108.16H78.6309V110.66H161.369V108.16Z" fill="#EBF0F3"/>
        <path d="M141.746 117.383H78.6309V119.882H141.746V117.383Z" fill="#EBF0F3"/>
        <path d="M161.369 126.594H78.6309V129.093H161.369V126.594Z" fill="#EBF0F3"/>
        <path d="M161.369 135.799H78.6309V138.298H161.369V135.799Z" fill="#EBF0F3"/>
        <path d="M126.003 145H78.6309V147.499H126.003V145Z" fill="#EBF0F3"/>
        <path d="M110.596 74.2012H78.1152V76.7006H110.596V74.2012Z" fill="#EBF0F3"/>
      </g>
      <defs>
        <clipPath id="clip0_530_6669">
         <rect width="240" height="240" fill="white" transform="translate(0 0.5)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export default DocumentIcon
