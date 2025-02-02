import React from 'react';
interface IconPageProps {
    _title: string;
    version?: string;
    meta?: Record<string, string>;
    favicon?: string;
    _type?: 'font-class' | 'unicode' | 'symbol';
    _link?: string;
    classNamePrefix?: string;
    fontname?: string;
    corners?: {
        url?: string;
        width?: number;
        bgColor?: string;
    };
    logo?: string | React.ReactNode;
    description?: string;
    links?: Array<{
        url: string;
        title: string;
    }>;
    footerInfo?: React.ReactNode;
    _IconHtml?: string;
}
declare const IconPage: React.FC<IconPageProps>;
export default IconPage;
