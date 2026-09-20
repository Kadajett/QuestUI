import type { SVGProps } from "react"
const paths = {
 spark:"M7 0h2v5h2v2h5v2h-5v2H9v5H7v-5H5V9H0V7h5V5h2z",
 heart:"M2 2h4v2h4V2h4v2h2v6h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V4h2z",
 arrow:"M8 2h2v2h2v2h2v2h2v2h-2v2h-2v2h-2v2H8v-4h2v-2H0V8h10V6H8z",
 check:"M12 2h4v4h-2v2h-2v2h-2v2H8v2H4v-2H2v-2H0V6h4v2h2v2h2V8h2V6h2z",
 grid:"M0 0h6v6H0zM10 0h6v6h-6zM0 10h6v6H0zM10 10h6v6h-6z",
 cursor:"M2 0h2v2h2v2h2v2h2v2h2v2H8v2h2v4H6v-4H4v2H2z",
 code:"M4 2h2v2H4v2H2v4h2v2h2v2H4v-2H2v-2H0V6h2V4h2zM10 2h2v2h2v2h2v4h-2v2h-2v2h-2v-2h2v-2h2V6h-2V4h-2z",
 down:"M6 0h4v8h4v2h-2v2h-2v2H6v-2H4v-2H2V8h4zM0 14h4v2H0zM12 14h4v2h-4z",
 plus:"M6 0h4v6h6v4h-6v6H6v-6H0V6h6z",
 diamond:"M6 0h4v2h2v2h2v2h2v4h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V6h2V4h2V2h2z",
} as const
export type PixelIconName = keyof typeof paths
export function PixelIcon({name,...props}: SVGProps<SVGSVGElement> & {name:PixelIconName}) {
 return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" {...props}><path d={paths[name]}/></svg>
}
