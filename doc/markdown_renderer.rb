require 'json'
require 'erb'

class MarkdownRenderer < Redcarpet::Render::HTML

  def preprocess(full_doc)
    replaced = ''
    full_doc.each_line do |line|
      replaced += line.gsub /^  /, ''
    end
    replaced
  end

  def block_code(code, language)
    
    if language == 'jade'
      language = 'slim'
    end
    formatter = Rouge::Formatters::HTML.new(inline_theme: 'github')
    
    if /^block/.match language
    
      lexer = Rouge::Lexer.find('html')
      
      matchData = /\{.+\}/.match language
      width = 'auto'
      maxWidth = 'auto'
      background = 'transparent'
      themeSwitchable = false
      themes = []
      
      if matchData
        j = JSON.parser.new matchData[0]
        hash = j.parse()
        if hash['background']
          background = hash['background']
        end
        if hash['width']
          width = hash['width']
        end
        if hash['maxWidth']
          maxWidth = hash['maxWidth']
        end
        if hash['themes']
          themeSwitchable = true
          themes = hash['themes']
        end
      end
      
      return <<CODE
<div class="sg-codeExpContanier">
  <div class="sg-codeOutput">
    <div class="sg-codeOutput__label">Example</div>
    <div class="sg-codeOutput__blockPlacer">
      #{code}
    </div>
  </div>
  <div class="sg-codeBlock"><pre><code>#{formatter.format lexer.lex(code)}</code></pre></div>
</div>
CODE
    end
    
    
    if language == 'issues'
      renderer = MarkdownRenderer.new
      markdown = Redcarpet::Markdown.new(renderer)
      output = markdown.render(code)
      return <<CODE
<div class="sg-issues">#{output}</div>
CODE
    end
    
    lexer = Rouge::Lexer.find(language)

    if lexer.nil?
      return code
    end
    
    return <<CODE
<div class="sg-codeExpContanier">
  <div class="sg-codeBlock">#{formatter.format lexer.lex(code)}</div>
</div>
CODE
    
  end
  
  #<code></code>
  
  def codespan(code)
    "<code class='sg-code'>#{code}</code>"
  end
  
end
