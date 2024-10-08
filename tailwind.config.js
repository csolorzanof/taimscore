/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')

export default withMT({
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            width: {
                128: '32rem',
                132: '36rem',
                136: '40rem',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
})
