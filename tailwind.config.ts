import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'flame-flicker': {
					'0%, 100%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'25%': {
						transform: 'scale(1.05) rotate(1deg)',
						opacity: '0.9'
					},
					'50%': {
						transform: 'scale(0.95) rotate(-1deg)',
						opacity: '1'
					},
					'75%': {
						transform: 'scale(1.02) rotate(0.5deg)',
						opacity: '0.95'
					}
				},
				'phoenix-rise': {
					'0%': {
						transform: 'translateY(100px) scale(0.8)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateY(-10px) scale(1.05)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 30px hsla(8, 100%, 50%, 0.6), 0 0 50px hsla(25, 95%, 60%, 0.4), 0 0 70px hsla(45, 100%, 70%, 0.2)'
					},
					'25%': {
						boxShadow: '0 0 40px hsla(8, 100%, 50%, 0.8), 0 0 70px hsla(25, 95%, 60%, 0.6), 0 0 100px hsla(45, 100%, 70%, 0.4), 0 0 120px hsla(0, 100%, 45%, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 50px hsla(8, 100%, 50%, 1), 0 0 80px hsla(25, 95%, 60%, 0.8), 0 0 120px hsla(45, 100%, 70%, 0.6), 0 0 150px hsla(0, 100%, 45%, 0.4)'
					},
					'75%': {
						boxShadow: '0 0 40px hsla(8, 100%, 50%, 0.8), 0 0 70px hsla(25, 95%, 60%, 0.6), 0 0 100px hsla(45, 100%, 70%, 0.4), 0 0 120px hsla(0, 100%, 45%, 0.3)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'25%': {
						transform: 'translateY(-5px) rotate(1deg)'
					},
					'50%': {
						transform: 'translateY(-10px) rotate(0deg)'
					},
					'75%': {
						transform: 'translateY(-5px) rotate(-1deg)'
					}
				},
				'ember-float': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px) scale(1)',
						opacity: '0.6'
					},
					'33%': {
						transform: 'translateY(-8px) translateX(3px) scale(1.1)',
						opacity: '0.8'
					},
					'66%': {
						transform: 'translateY(-4px) translateX(-2px) scale(0.9)',
						opacity: '0.7'
					}
				},
				'transformation-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsla(8, 100%, 50%, 0.3), inset 0 0 20px hsla(25, 95%, 60%, 0.2)'
					},
					'50%': {
						boxShadow: '0 0 40px hsla(8, 100%, 50%, 0.6), inset 0 0 30px hsla(25, 95%, 60%, 0.4), 0 0 60px hsla(45, 100%, 70%, 0.3)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'flame-flicker': 'flame-flicker 3s ease-in-out infinite',
				'phoenix-rise': 'phoenix-rise 1.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 4s ease-in-out infinite',
				'ember-float': 'ember-float 6s ease-in-out infinite',
				'transformation-glow': 'transformation-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;