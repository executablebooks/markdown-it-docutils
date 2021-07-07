directive-unknown
.
```{unknown} argument
content
```
.
<aside class="directive-unhandled">
<header><mark>unknown</mark><code> argument</code></header>
<pre>content
</pre></aside>
.

directive-admonition
.
```{admonition} A **Title**
Some *content*
```
.
<aside class="admonition "><p class="admonition-title">A <strong>Title</strong></p><div class="admonition-body"><p>Some <em>content</em></p>
</div></aside>
.

directive-nested-admonition
.
````{note} This is a note
```{warning} This is a nested warning
```
````
.
<aside class="admonition note"><p class="admonition-title">Note</p><div class="admonition-body"><p>This is a note</p>
<aside class="admonition warning"><p class="admonition-title">Warning</p><div class="admonition-body"><p>This is a nested warning</p>
</div></aside></div></aside>
.

directive-image
.
```{image} https://via.placeholder.com/150
```
.
<img src="https://via.placeholder.com/150" alt="">
.

directive-image-options
.
```{image} https://via.placeholder.com/150
:align: center
:alt: some *alt*
:class: other
```
.
<img src="https://via.placeholder.com/150" alt="some alt" class="align-center other">
.

directive-figure
.
```{figure} https://via.placeholder.com/150
:align: center

A **caption**
```
.
<figure class="align-center"><img src="https://via.placeholder.com/150" alt="" class="align-center"><figcaption><p>A <strong>caption</strong></p>
</figcaption></figure>
.

directive-code
.
```{code}
a
```
.
<pre><code>a
</code></pre>
.

directive-code-language
.
```{code} python
a
```
.
<pre><code class="language-python">a
</code></pre>
.

directive-code-block
.
```{code-block}
a
```
.
<pre><code>a
</code></pre>
.

directive-code-block-language
.
```{code-block} python
a
```
.
<pre><code class="language-python">a
</code></pre>
.

directive-code-cell
.
```{code-cell}
a
```
.
<pre><code>a
</code></pre>
.

directive-code-cell-language
.
```{code-cell} python
:other: value

a
```
.
<pre><code class="language-python">a
</code></pre>
.
