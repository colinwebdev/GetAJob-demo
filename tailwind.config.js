/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                purpleTeal: {
                    primary: '#8650D4',
                    secondary: '#60B4F0',
                    accent: '#203CA1',
                    neutral: '#1A0736',
                    'base-100': '#ECF7FF',
                    info: '#2DC8EB',
                    success: '#23C88D',
                    warning: '#FF9776',
                    error: '#FA4C76',
                },
            },
            'retro',
            'cyberpunk',
            'cmyk',
            'dracula',
        ],
    },
}
