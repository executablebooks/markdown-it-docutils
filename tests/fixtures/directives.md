unknown
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

image
.
```{image} https://via.placeholder.com/150
```
.
<img src="https://via.placeholder.com/150" alt="">
.

image-options
.
```{image} https://via.placeholder.com/150
:align: center
:alt: some *alt*
:class: other
```
.
<img src="https://via.placeholder.com/150" alt="some alt" class="align-center other">
.

figure
.
```{figure} https://via.placeholder.com/150
:align: center

A **caption**
```
.
<figure class="align-center"><img src="https://via.placeholder.com/150" alt="" class="align-center"><figcaption><p>A <strong>caption</strong></p>
</figcaption></figure>
.

code
.
```{code}
a
```
.
<pre><code>a
</code></pre>
.

code-language
.
```{code} python
a
```
.
<pre><code class="language-python">a
</code></pre>
.

code-block
.
```{code-block}
a
```
.
<pre><code>a
</code></pre>
.

code-block-language
.
```{code-block} python
a
```
.
<pre><code class="language-python">a
</code></pre>
.

code-cell
.
```{code-cell}
a
```
.
<pre><code>a
</code></pre>
.

code-cell-language
.
```{code-cell} python
:other: value

a
```
.
<pre><code class="language-python">a
</code></pre>
.

list-table
.
```{list-table}
*   - Row 1, Column 1
    - Row 1, Column 2
    - Row 1, Column 3
*   - Row 2, Column 1
    - Row 2, Column 2
    - Row 2, Column 3
*   - Row 3, Column 1
    - Row 3, Column 2
    - Row 3, Column 3
```
.
<table><tbody><tr><td>Row 1, Column 1</td><td>Row 1, Column 2</td><td>Row 1, Column 3</td></tr><tr><td>Row 2, Column 1</td><td>Row 2, Column 2</td><td>Row 2, Column 3</td></tr><tr><td>Row 3, Column 1</td><td>Row 3, Column 2</td><td>Row 3, Column 3</td></tr></tbody></table>
.

list-table-with-head
.
```{list-table}  Caption *text*
:header-rows: 1
:align: center
:class: myclass

*   - Head 1, Column 1
    - Head 1, Column 2
    - Head 1, Column 3
*   - Row 1, Column 1
    - Row 1, Column 2
    - Row 1, Column 3
*   - Row 2, Column 1
    - Row 2, Column 2
    - Row 2, **Column 3**
```
.
<table class="align-center myclass"><caption>Caption <em>text</em></caption><thead><tr><th>Head 1, Column 1</th><th>Head 1, Column 2</th><th>Head 1, Column 3</th></tr></thead><tbody><tr><td>Row 1, Column 1</td><td>Row 1, Column 2</td><td>Row 1, Column 3</td></tr><tr><td>Row 2, Column 1</td><td>Row 2, Column 2</td><td>Row 2, <strong>Column 3</strong></td></tr></tbody></table>
.
