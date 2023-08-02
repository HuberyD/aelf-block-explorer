/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:19:21
 * @Description: next config
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [  
            {
                source: '/xxx',
                destination: '/address',
            }
        ]
    },
}

module.exports = nextConfig
