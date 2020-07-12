module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        'plugin:vue/essential',
        'standard'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'indent': 'off',
        'vue/script-indent': [
            'error',
            4,
        ],
        'semi': ["error", "always"],
        "vue/html-indent": ["error", 4, {}],
        'generator-star-spacing': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'eqeqeq': 'off', //===和==
        "no-console": 1, // 不允许出现console语句
        "no-extra-semi": 1, // 不允许出现不必要的分号
    }
}