import type { CSSProperties } from "react";

import Image from "next/image";

type Props = {
	src: string;
	alt: string;
	size: number;
	className?: string;
	priority?: boolean;
	style?: CSSProperties;
};

export const EditorImage = ({ alt, className, priority, size, src, style }: Props) => {
	return (
		<Image
			alt={alt}
			className={className}
			height={size}
			priority={priority}
			sizes={`${size}px`}
			src={src}
			style={style}
			unoptimized
			width={size}
		/>
	);
};