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
<div></aside>
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
<div></aside><div></aside>
.

directive-image
.
```{image} https://via.placeholder.com/150
```
.
<img src="https://via.placeholder.com/150" alt="">
.
