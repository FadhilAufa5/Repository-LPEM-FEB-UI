import React from 'react';

export default function AppLogoIcon(
    props: React.ImgHTMLAttributes<HTMLImageElement>
) {
    const { className, alt = 'App logo', ...rest } = props;
    const defaultClasses = 'h-12 w-12 object-contain';
    const classes = className
        ? /\b(h-|w-|size-)/i.test(className)
            ? className
            : `${className} ${defaultClasses}`
        : defaultClasses;

    return (
        <img
            src="/logo ui2.png"
            alt={alt}
            className={classes}
            {...rest}
        />
    );
}
