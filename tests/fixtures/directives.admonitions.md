Admonition:
.
```{admonition} This is a **title**
An example of an admonition with custom _title_.
```
.
<aside class="admonition">
<header class="admonition-title">This is a <strong>title</strong></header>
<p>An example of an admonition with custom <em>title</em>.</p>
</aside>
.

Note on split lines:
.
```{note} An example
of an admonition on two lines.
```
.
<aside class="admonition note">
<header class="admonition-title">Note</header>
<p>An example
of an admonition on two lines.</p>
</aside>
.

[FIX] Note on a single line [See #154](https://github.com/executablebooks/MyST-Parser/issues/154)
.
```{danger} An example of an admonition on a single line.
```
.
<aside class="admonition danger">
<header class="admonition-title">Danger</header>
<p>An example of an admonition on a single line.</p>
</aside>
.

Admonition with overridding class name
.
```{admonition} This is a title
:class: tip
An example of a `tip` with a custom _title_.
```
.
<aside class="tip admonition">
<header class="admonition-title">This is a title</header>
<p>An example of a <code>tip</code> with a custom <em>title</em>.</p>
</aside>
.

nested-admonition
.
````{note} This is a note
```{warning} This is a nested warning
```
````
.
<aside class="admonition note">
<header class="admonition-title">Note</header>
<p>This is a note</p>
<aside class="admonition warning">
<header class="admonition-title">Warning</header>
<p>This is a nested warning</p>
</aside>
</aside>
.

`attention` admonition:
.
```{attention}
An example of a attention admonition.
```
.
<aside class="admonition attention">
<header class="admonition-title">Attention</header>
<p>An example of a attention admonition.</p>
</aside>
.

`caution` admonition:
.
```{caution}
An example of a caution admonition.
```
.
<aside class="admonition caution">
<header class="admonition-title">Caution</header>
<p>An example of a caution admonition.</p>
</aside>
.

`danger` admonition:
.
```{danger}
An example of a danger admonition.
```
.
<aside class="admonition danger">
<header class="admonition-title">Danger</header>
<p>An example of a danger admonition.</p>
</aside>
.

`error` admonition:
.
```{error}
An example of an error admonition.
```
.
<aside class="admonition error">
<header class="admonition-title">Error</header>
<p>An example of an error admonition.</p>
</aside>
.

`hint` admonition:
.
```{hint}
An example of a hint admonition.
```
.
<aside class="admonition hint">
<header class="admonition-title">Hint</header>
<p>An example of a hint admonition.</p>
</aside>
.

`important` admonition:
.
```{important}
An example of an important admonition.
```
.
<aside class="admonition important">
<header class="admonition-title">Important</header>
<p>An example of an important admonition.</p>
</aside>
.

`note` admonition:
.
```{note}
An example of a note admonition.
```
.
<aside class="admonition note">
<header class="admonition-title">Note</header>
<p>An example of a note admonition.</p>
</aside>
.

`tip` admonition:
.
```{tip}
An example of a tip admonition.
```
.
<aside class="admonition tip">
<header class="admonition-title">Tip</header>
<p>An example of a tip admonition.</p>
</aside>
.

`warning` admonition:
.
```{warning}
An example of a warning admonition.
```
.
<aside class="admonition warning">
<header class="admonition-title">Warning</header>
<p>An example of a warning admonition.</p>
</aside>
.

`see also` admonition:
.
```{seealso}
See other things here!
```
.
<aside class="admonition seealso">
<header class="admonition-title">See Also</header>
<p>See other things here!</p>
</aside>
.


`see also` admonition with class, bump title
.
```{seealso} Not a title
:class: tip
See other things here!
```
.
<aside class="tip admonition seealso">
<header class="admonition-title">See Also</header>
<p>Not a title
See other things here!</p>
</aside>
.


`see also` admonition with class, bump title new paragraph
.
```{seealso} Not a title
:class: tip

See other things here!
```
.
<aside class="tip admonition seealso">
<header class="admonition-title">See Also</header>
<p>Not a title</p>
<p>See other things here!</p>
</aside>
.
