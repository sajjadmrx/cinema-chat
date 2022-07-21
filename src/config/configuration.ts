export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mode: process.env.NODE_ENV
});