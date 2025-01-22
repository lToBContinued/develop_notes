# vue项目代码规范配置

## 初始化vue项目

```bash
npm init vue@latest
pnpm create vue@latest
```

删除无用的文件，执行pnpm install

## 统一使用pnpm包管理器

新建文件：根目录\\scripts\\preinstall.js

```js
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository must using pnpm as the package manager ` + ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1)
}
```

修改文件：根目录\\package.json文件

```json
{
  ...其他配置
  "scripts": {
    "preinstall": "node ./scripts/preinstall.js"
  }
}
```

## 编码样式配置

新增文件：根目录\\.editorConfig

```
# 告诉EditorConfig插件，这是根文件，不用继续往上查找
root = true
# 匹配全部文件
[*]
# 设置字符集
charset = utf-8
# 缩进风格，可选"space"、"tab"
indent_style = tab
# 缩进的空格数
indent_size = 2
# 结尾换行符，可选"lf"、"cr"、"crlf"
end_of_line = lf
# 在文件结尾插入新行
insert_final_newline = true
# 删除一行中的前后空格
trim_trailing_whitespace = true
```

## 配置环境变量

新建文件：根目录\\.env

```
VITE_TITLE='Vite demo 1111'
VITE_BASE_API = '/api'
VITE_APP_VERSION='1.0.0'
VITE_LOGO = '你的favicon.ico路径'
```

新建文件：根目录\\.env.development

```
VITE_ENV='development'
VITE_BASE_URL='https://你的开发环境基地址'
```

新建文件：根目录\\.env.production

```
VITE_ENV='production'
VITE_BASE_URL='https://你的生产环境基地址'
```

新建文件：根目录\\.env.test

```
VITE_ENV='test'
VITE_BASE_URL='https://你的测试环境基地址'
```

修改文件：根目录\\index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="%VITE_LOGO%">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%VITE_TITLE%</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

修改文件：根目录\\package.json

```json
{
  ...其他配置
  "scripts": {
    ...其他配置
    "dev": "vite",
    "test": "vite --mode test",
    "prod": "vite --mode production",
    "build:dev": "vite build --mode development",
    "build:test": "vite build --mode test",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## vite配置scss全局变量

安装sass

```bash
pnpm i sass sass-loader -D
```

修改文件：根目录\\vite.config.js

```js
// ...其他配置

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  return {
    // ...其他配置
    // 样式相关
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variable.scss" as *;`, // 全局引入scss变量
        },
      },
    },
  }
})
```

> variable.scss 见文末

## vite集成svg图标

安装svg图标插件

```bash
npm i vite-plugin-svg-icons -D
```

修改文件：根目录\\vite.config.js

```js
// ...其他配置
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import path from 'node:path'

export default defineConfig(({ mode, command }) => {
  return {
    // ...其他配置
    plugins: [
      // ...其他配置
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, "src/assets/icons")],
        symbolId: "icon-[name]",
      }),
    ]
  }
})
```

新建文件夹：根目录\\src\\assets\\icons，在文件夹中放置svg图标，如：icon-xxx.svg

新建文件： 根目录\\src\\components\\SvgIcon\\index.vue

```vue

<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  })

  const symbolId = computed(() => {
    return `#${ props.prefix }-${ props.name }`
  })
</script>

<style scoped lang="scss">
  .svg-icon {
    overflow: hidden;
    width: 1em;
    height: 1em;
    fill: currentcolor;
    vertical-align: -0.15em;
  }
</style>
```

新建文件：根目录\\src\\plugin\\icon\\index.js

```js
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

export function setup(app) {
  app.component('SvgIcon', SvgIcon)
}
```

新建文件：根目录\\src\\plugin\\index.js

```js
// ...其他配置
import { setup as setSvg } from './icon/index.js'

export function setup(app) {
  // ...其他配置
  setSvg(app)
}
```

修改文件：根目录\\src\\main.js

```js
// ...其他配置
import { setup as setupPlugin } from '@/plugin/index.js'

setupPlugin(app) // 写在createApp(App)之后
```

## vite服务及代理跨域

修改文件：根目录\\vite.config.js

```js
// ...其他配置
export default defineConfig(({ mode, command }) => {
  return {
    // ...其他配置
    server: {
      port: 8000, // 项目在本地运行的端口号
      open: true, // 项目运行自动打开浏览器
      // 配置跨域代理
      proxy: {
        '/api': {
          target: 'http://你的后端服务器地址' // vite服务将/api开头的请求代理到http://你的后端服务器地址
          changeOrigin: true // 是否开启跨域
          rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
        }
      }
    }
  }
})
```

## 配置prettier

安装prettier插件

```bash
pnpm i prettier -D 
```

新建文件：根目录\\.prettierrc

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "endOfLine": "auto",
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

新建文件：根目录\\.prettierignore

```
dist
node_modules
.eslintignore
.prettierignore
```

修改文件：根目录\\package.json

```json
{
  ...其他配置
  "scripts": {
    ...其他配置
    "format": "prettier --write src/"
  }
}
```

## 配置eslint

安装eslint插件

```bash
pnpm i eslint/js eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue -D
```

新建文件：根目录\\eslint.config.js

> 有关 ts 的内容，在 js 的项目中可以不写

```js
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import parserVue from 'vue-eslint-parser'

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.ts?(x)', '**/*.vue'],
    ignores: ['**/dist/**', '**/node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: parserVue,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.commonjs,
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    // 🟡 recommended.plugins: ['prettier']
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // 🟡 recommended.extends: ['prettier']
      ...configPrettier.rules,
      // 🟡 recommended.rules: { ... }
      ...pluginPrettier.configs.recommended.rules,

      // 🟡 一些自己的自定义 rules
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',

      // eslint（https://eslint.bootcss.com/docs/rules/）
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'no-useless-escape': 'off', // 禁止不必要的转义字符

      // typeScript (https://typescript-eslint.io/rules)
      '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
      '@typescript-eslint/semi': 'off',

      // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
      'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
      'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
      'vue/attribute-hyphenation': 'off', // 自定义组件属性使用连字符分隔的命名方式
    },
  },
]
```

新建文件：根目录\\.eslintignore

```
node_modules
dist
public
```

修改文件：根目录\\vite.config.js

```js
// ...其他配置
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig(({ mode, command }) => {
  return {
    // ...其他配置
    plugins: [
      // ...其他配置
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue'],
        cache: true,
      }),
    ]
  }
})
```

修改文件：根目录\\package.json

```json
{
  ...其他配置
  "scripts": {
    ...其他配置
    "lint": "eslint",
    "lint:eslint": "eslint --fix"
  }
}
```

## 配置stylelint

安装stylelint插件

```bash
pnpm i -D stylelint stylelint-config-clean-order stylelint-config-html stylelint-config-recommended-scss stylelint-config-recommended-vue stylelint-config-standard stylelint-config-standard-scss stylelint-prettier
```

新建文件：根目录\\stylelint.config.js

```js
{
  "ignoreFiles": [
    "**/*.js",
    "**/*.ts",
    "**/*.jsx",
    "**/*.tsx",
    "**/*.json",
    "**/*.md",
    "**/*.yaml",
    "**/node_modules/**",
    "**/dist/**"
  ],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-clean-order",
    "stylelint-config-html/vue",
    "stylelint-prettier/recommended"
  ],
  "overrides": [
    {
      "files": ["**/*.(scss|css|vue|html)"],
      "customSyntax": "postcss-scss"
    },
    {
      "files": ["**/*.(html|vue)"],
      "customSyntax": "postcss-html"
    }
  ],
  "rules": {
    "value-keyword-case": "lower",
    "no-descending-specificity": null,
    "function-url-quotes": "always",
    "no-empty-source": null,
    "property-no-unknown": null,
    "value-no-vendor-prefix": null,
    "property-no-vendor-prefix": null,
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global", "v-deep", "deep"]
      }
    ]
  }
}

```

新建文件：根目录\\.stylelintignore

```
/node_modules/*
/dist/*
/html/*
/public/*
```

修改文件：根目录\\package.json

```json
{
  ...其他配置
  "scripts": {
    ...其他配置
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
  }
}
```

## 配置mock

安装mockjs插件

```bash
pnpm i mockjs
```

新建文件：根目录\\src\\mock\\index.js

```js
import Mock from 'mockjs'

Mock.mock('/api/user/info', 'get', () => {
  return Mock.mock({
    code: 200,
    msg: 'success',
    data: {
      currentPage: 1,
      pageSize: 10,
      'records|10': [
        {
          'id|+1': 1,
          name: '@cname',
          'role|1': ['管理员', '普通员工', '经理', 'HR'],
          age: '@integer(18,35)',
          'weight|50-70.2': 50,
          job: /前端开发|技术经理|后端开发|产品/,
          idcard: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
          mobile: /^(?:(?:\+|00)86)?1\d{10}$/,
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          sex: /男|女/,
          'sex2|1': ['男', '女']
        }
      ]
    }
  })
})

```

修改文件：根目录\\main.js

```js
// ...其他配置
import './mock/index.js'
```

## 配置husky

安装husky插件

```bash
pnpm i husky lint-staged @commitlint/cli @commitlint/config-conventional -D
```

husky初始化

> 注意：初始化husky之前先要初始化git仓库

```bash
npx husky init
```

添加文件：根目录\\.commitlintrc.js

```js
// https://www.npmjs.com/package/@commitlint/config-conventional
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        'feat', // 新功能
        'fix', // 修补bug
        'docs', // 文档修改
        'style', // 代码格式修改, 注意不是 css 修改
        'refactor', // 重构
        'perf', // 优化相关，比如提升性能、体验
        'test', // 测试用例修改
        'revert', // 代码回滚
        'ci', // 持续集成修改
        'config', // 配置修改
        'chore' // 其他改动
      ]
    ]
  }
}
```

修改文件：根目录\\package.json

```json
{
  ...其他配置
  "script": {
    ...其他配置
    "prepare": "husky",
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{js,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

修改文件：根目录\\.husky\\pre-commit

```
npx lint-staged
```

添加文件：根目录\\.husky\\commit-msg

```
npx --no -- commitlint --edit ${1}
```

# scss样式文件

## 样式初始化

新建文件：根目录\\src\\style\\reset.scss

```scss
@use '@/styles/variable.scss';

// 统一浏览器默认标准盒子模型
*,
*:after,
*:before {
  box-sizing: border-box;
  outline: none;
}

// 清除标签默认间距
html,
body,
div,
span,
applet,
object,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  padding: 0;
  border: 0;
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
i {
  font-style: normal;
  font-weight: 400;
}

/* 旧版本浏览器对H5新标签兼容处理 */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

// 清除标签默认样式
ol,
ul,
li {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote::before,
blockquote::after,
q::before,
q::after {
  content: '';
  content: none;
}

// 表格重置
table {
  border-collapse: collapse;
  border-spacing: 0;
}

th,
td {
  vertical-align: middle;
}

/* 全局自定义标签样式 */
a {
  backface-visibility: hidden;
  outline: none;
  text-decoration: none;
}

a:focus {
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  outline: -webkit-focus-ring-color auto 0;
}

/* // 滚动条样式
 ::-webkit-scrollbar {width
   height: 10px;heightheightheightheightheightheightheightheightheightheightheightheightheightheightheightheightheightheight
 }

 !*定义滚动条轨道 内阴影+圆角*!
 ::-webkit-scrollbar-track {
   border-radius: 10px;border-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radius
   background-color: rgba($color: #fff, $alpha: 70%);background-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-color
 }

 !*定义滑块 内阴影+圆角*!
 ::-webkit-scrollbar-thumb {
   border-radius: 10px;border-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radiusborder-radius
   -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadow-webkit-box-shadowbox-shadow
   background-color: rgb(0 0 0 / 30%);background-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-color

   &:hover {
     background-color: rgb(0 0 0 / 53%);background-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-colorbackground-color
     cursor: pointer;cursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursorcursor
   }
 } */

```

## scss样式变量

新建文件：根目录\\src\\style\\variable.scss

```scss
// 主题色
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$error-color: #f56c6c;
$info-color: #909399;
// 文字颜色
$main-text-color1: #000;
$main-text-color2: #333;
$main-text-color3: #444;
$sub-text-color1: #666;
$sub-text-color2: #777;
$sub-text-color3: #888;
$sub-text-color4: #999;
$light-text-color1: #aaa;
$light-text-color2: #bbb;
$light-text-color3: #ccc;
// 边框颜色
$border-color1: #eee;
$border-color2: #e0e0e0;
$border-color3: #e5e5e5;
$border-color4: #f0f0f0;
$border-color5: #f5f5f5;

// flex居中
@mixin flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 绝对居中
@mixin absolute-center() {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// 超出宽度的文本省略号
@mixin ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行文本溢出省略号
@mixin line-clamp-2() {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 多行文本溢出省略号
@mixin line-clamp($num) {
  display: -webkit-box;
  -webkit-line-clamp: $num;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 滚动条
@mixin scrollbar($height: 0, $width: 8px) {
  @if $height!=0 {
    height: $height;
  }

  overflow: hidden auto;

  &::-webkit-scrollbar {
    width: $width;
    position: absolute;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    transition: all 0.5s;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: rgb(114 114 114 / 50%);
    }
  }
}
```

## scss封装

新建文件：根目录\\src\\style\\index.scss

```scss
@use '@/styles/reset';
```

修改文件：根目录\\src\\main.js

```js
// ...其他配置
import '@/styles/index.scss'
```
