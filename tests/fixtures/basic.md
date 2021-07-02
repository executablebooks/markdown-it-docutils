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
<aside class="admonition "><div class="admonition-title">A <strong>Title</strong></div><div class="admonition-body"><p>Some <em>content</em></p>
<div></aside>
.

directive-nested-admonition
.
````{note} This is a note
```{warning} This is a nested warning
```
````
.
<aside class="admonition note"><div class="admonition-title">Note</div><div class="admonition-body"><p>This is a note</p>
<aside class="admonition warning"><div class="admonition-title">Warning</div><div class="admonition-body"><p>This is a nested warning</p>
<div></aside><div></aside>
.
