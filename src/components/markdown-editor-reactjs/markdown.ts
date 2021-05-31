import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

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
.use(require('markdown-it-task-checkbox'),{
    disabled: true,
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'cbx_',
    ulClass: 'task-list',
    liClass: 'task-list-item'
});   // 任务列表插件

export default md
