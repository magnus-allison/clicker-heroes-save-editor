import { ImageResponse } from 'next/og';
import rubyGem from '@/public/assets/profile/ruby_gem.png';

export const alt = 'Clicker Heroes Save Editor';
export const contentType = 'image/png';
export const size = {
	width: 1200,
	height: 630
};

const red = '#7A041D';

export default function Image() {
	const siteUrl =
		process.env.NEXT_PUBLIC_SITE_URL ??
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
	const rubyGemUrl = new URL(rubyGem.src, siteUrl).toString();

	return new ImageResponse(
		<div
			style={{
				alignItems: 'stretch',
				background: '#0a0a0a',
				color: '#f0f0f0',
				display: 'flex',
				fontFamily: '"Courier New", Courier, monospace',
				height: '100%',
				padding: '58px',
				position: 'relative',
				width: '100%'
			}}
		>
			<div
				style={{
					border: `2px solid ${red}`,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '44px',
					width: '100%'
				}}
			>
				<div style={{ alignItems: 'center', display: 'flex', height: '82px', width: '94px' }}>
					<img
						alt='Ruby gem icon'
						src={rubyGemUrl}
						width={94}
						height={82}
						style={{
							height: '100%',
							objectFit: 'contain',
							width: '100%'
						}}
					/>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
					<div
						style={{
							fontFamily: '"Courier New", Courier, monospace',
							fontSize: 78,
							fontWeight: 700,
							lineHeight: 1.05
						}}
					>
						Clicker Heroes Save Editor
					</div>
					<div style={{ color: '#c7c7c7', fontSize: 34, lineHeight: 1.35, maxWidth: 920 }}>
						Decode, edit, and re-encode gold, rubies, heroes, Hero Souls, Ancients, ascensions,
						achievements, and more.
					</div>
				</div>
				<div style={{ color: '#fff', fontSize: 28 }}>clickerheroes.dev</div>
			</div>
		</div>,
		size
	);
}
