image
.
```{image} https://via.placeholder.com/150
```
.
<img src="https://via.placeholder.com/150" alt="">
.

image with options
.
```{image} https://via.placeholder.com/150
:align: center
:alt: some *alt*
:class: other
```
.
<img src="https://via.placeholder.com/150" alt="some alt" class="align-center other">
.

basic figure
.
```{figure} https://jupyterbook.org/_static/logo.png
The Jupyter Book Logo!
```
.
<figure>
<img src="https://jupyterbook.org/_static/logo.png" alt="">
<figcaption>
<p>The Jupyter Book Logo!</p>
</figcaption>
</figure>
.

figure with options
.
```{figure} https://via.placeholder.com/150
:align: center
:alt: description

A **caption**
```
.
<figure class="align-center">
<img src="https://via.placeholder.com/150" alt="description" class="align-center">
<figcaption>
<p>A <strong>caption</strong></p>
</figcaption>
</figure>
.

named figure
.
```{figure} https://via.placeholder.com/150
:align: center
:name: placeholder

A **caption**
```
.
<figure class="align-center numbered" id="placeholder">
<img src="https://via.placeholder.com/150" alt="" class="align-center">
<figcaption number="1">
<p>A <strong>caption</strong></p>
</figcaption>
</figure>
.

named figure with no space between options
.
```{figure} https://jupyterbook.org/_static/logo.png
:name: test2
The Jupyter Book Logo!
```
.
<figure id="test2" class="numbered">
<img src="https://jupyterbook.org/_static/logo.png" alt="">
<figcaption number="1">
<p>The Jupyter Book Logo!</p>
</figcaption>
</figure>
.
