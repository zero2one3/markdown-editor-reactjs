import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItTaskCheckbox from './markdown-it-task-checkbox'

const md: any = new MarkdownIt({
    breaks: true,   // 自动换行
    highlight: function (code, language) {      
        if (language && hljs.getLanguage(language)) {
          try {
            return `<pre><code class="hljs language-${language}">` +
                   hljs.highlight(code, { language  }).value +
                   '</code></pre>';
          } catch (__) {}
        }
    
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(code) + '</code></pre>';
    }
})
.use(MarkdownItTaskCheckbox ,{  // 任务列表插件
    disabled: true,
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'cbx_',
    ulClass: 'task-list',
    liClass: 'task-list-item'
})   
.use(require('markdown-it-sub'))  // 下标
.use(require('markdown-it-sup'))  // 上标
.use(require('markdown-it-footnote'))   // 脚标
.use(require('markdown-it-mark'))   // 标记
.use(require('markdown-it-ins'))   // 插入
// .use(require('markdown-it-images-preview'))    // 图片预览（似乎只是本地的图片）
.use(require('markdown-it-container'), 'spoiler', {   // 自定义块容器

  validate: function(params: string) {
    return params.trim().match(/^spoiler\s+(.*)$/);
  },

  render: function (tokens: any, idx: number) {
    var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';

    } else {
      // closing tag
      return '</details>\n';
    }
  }
})
.use(require('markdown-it-abbr'))    // 缩写注释
.use(require('markdown-it-toc'))     // 目录

export default md
