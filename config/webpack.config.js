
const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootDir = process.cwd()
const { MFSU } = require('@umijs/mfsu')

const mfsu = new MFSU({
    implementor: webpack,
    buildDepWithESBuild: true,
    depBuildConfig: {
        loader: {
            '.png': 'file',
            '.jpeg': 'file',
            '.gif': 'file',
            '.css': 'css',
        }
    }
    // runtimePublicPath: '/',
    // cwd: process.cwd()
})
module.exports = async (env) => {
    const nodeEnv = process.env.NODE_ENV
    const isEnvDevelopment = env.mode === 'development' || env.mode === 'local'
    const isEnvProduction = env.mode === 'production' || env.mode === 'staging'
    const isEnvLocal = env.mode === 'local'
    const shouldUseSourceMap = isEnvProduction ? process.env.GENERATE_SOURCEMAP !== 'false' : isEnvDevelopment
    const config = {
        resolve: {
            extensions: ['.js', '.jsx'],
            symlinks: false,
            fallback: {},
            unsafeCache: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                // 'process.env.NODE_ENV': JSON.stringify(nodeEnv),
                'process.env.MODE_ENV': JSON.stringify(env.mode),
                'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
                'process.env.CLIENT_SET_COOKIE': true,
            }),
            new HtmlWebpackPlugin({
                title: '测试',
                forceHttps: false,
                template: path.join(rootDir, 'index.html'),
                chunks: ['react_base', 'app'],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    include: [
                        path.resolve(rootDir, 'src'),
                    ],
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: isEnvProduction,
                        plugins: mfsu ? [
                            ...mfsu.getBabelPlugins()
                        ] : null,
                        exclude: [
                            // \\ for Windows, \/ for Mac OS and Linux
                            /node_modules[\\\/]core-js/,
                            /node_modules[\\\/]webpack[\\\/]buildin/,
                        ],
                    },
                }
            ],
            unsafeCache: true,
        },
        experiments: isEnvLocal ? {
            cacheUnaffected: true,
        } : {},
        cache: isEnvProduction ? {
            store: 'pack',
            type: 'filesystem',
            buildDependencies: {
                defaultWebpack: ['webpack/lib/'],
                config: [__filename],
            },
            name: `${ env.mode }-cache`,
        } : true,
        target: ['browserslist'],
        stats: 'errors-warnings',
        bail: isEnvProduction,
        infrastructureLogging: {
            level: 'info',
        },
        optimization: {
            runtimeChunk: {
                name: (entrypoint) => `runtime~${entrypoint.name}`,
            },
            minimize: false,
            splitChunks: false,
        },
        mode: 'development',
        devtool: 'cheap-module-source-map',
        entry: {
            app: path.join(rootDir, '/src'),
        },
        output: {
            path: `${rootDir}/dist`,
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[contenthash].js',
            publicPath: '/',
            pathinfo: true,
            assetModuleFilename: '[path][name]_[contenthash][ext]'
        },
        devServer: {
            port: '8899',
            setupMiddlewares: function (middlewares) {
                if (mfsu) {
                    middlewares.unshift(...mfsu.getMiddlewares())
                }
                return middlewares
            },
        },
        watchOptions: {
            aggregateTimeout: 200,
            ignored: [
                '**/node_modules',
                '**/package.json',
                '**/jsconfig.json',
                '**/pastcss.config.js',
                '**/stylelint.config.js',
                '**/babel.config.js',
                '**/.gitignore',
                '**/.editorconfig',
                '**/.eslintrc.js',
                '**/.prettierrc.js',
            ],
            stdin: true,
        },
        profile: true,
        recordsPath: path.join(rootDir, 'records.json'),
        parallelism: 100,
    }
    await mfsu.setWebpackConfig({
        config,
        depConfig: {
            devtool: 'cheap-module-source-map',
            mode: 'development',
            output: {},
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                symlinks: false,
            },
            module: config.module,
            plugins: [],
        }
    })
    return config
}
