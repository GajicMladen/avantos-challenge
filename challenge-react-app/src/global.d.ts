declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.svg" {
    import * as React from "react";

    // for React components (when using svgr)
    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;

    // for importing the raw file path
    const src: string;
    export default src;
}