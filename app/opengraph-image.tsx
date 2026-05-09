import { ImageResponse } from 'next/og';

export const alt = 'Clicker Heroes Save Editor';
export const contentType = 'image/png';
export const size = {
	width: 1200,
	height: 630
};

export default function Image() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'stretch',
				background: '#0a0a0a',
				color: '#f0f0f0',
				display: 'flex',
				fontFamily: 'monospace',
				height: '100%',
				padding: '58px',
				position: 'relative',
				width: '100%'
			}}
		>
			<div
				style={{
					alignItems: 'center',
					background: 'linear-gradient(145deg, #7af4ff 0%, #35c4ff 45%, #2a63ff 100%)',
					border: '4px solid #c5f9ff',
					boxShadow: '0 0 0 6px rgba(53,196,255,0.22), 0 12px 24px rgba(9,18,40,0.65)',
					display: 'flex',
					height: '74px',
					justifyContent: 'center',
					position: 'absolute',
					right: '74px',
					top: '72px',
					transform: 'rotate(45deg)',
					width: '74px'
				}}
			>
				<div
					style={{
						background: 'rgba(238,252,255,0.75)',
						height: '16px',
						transform: 'rotate(-45deg)',
						width: '16px'
					}}
				/>
			</div>
			<div
				style={{
					border: '2px solid #2a5a2a',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '44px',
					width: '100%'
				}}
			>
				<div style={{ color: '#7fd67f', fontSize: 30, fontWeight: 600 }}>Free Online Tool</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
					<div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
						Clicker Heroes Save Editor
					</div>
					<div style={{ color: '#c7c7c7', fontSize: 34, lineHeight: 1.35, maxWidth: 920 }}>
						Decode, edit, and re-encode gold, rubies, heroes, Hero Souls, Ancients, ascensions,
						achievements, and more.
					</div>
				</div>
				<div style={{ color: '#d4af37', fontSize: 28 }}>clickerheroes.dev</div>
			</div>
		</div>,
		size
	);
}
