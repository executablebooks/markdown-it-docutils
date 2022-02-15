Testing named figures and numbered references
.
```{figure} https://via.placeholder.com/150
:name: test3

Fig 1
```

```{figure} https://via.placeholder.com/150
:name: test4

Fig 2
```
The reference to {ref}`test3` and {ref}`test4`.
{numref}`test3`
{numref}`test4`
{numref}`Hi 1 <test3>`
{numref}`Hi 2 <test4>`
{numref}`This is 1: %s <test3>`
{numref}`This is 2: %s <test4>`
{numref}`This is 2: {number} <test4>`
{numref}`test5`
{numref}`Not there %s <test5>`
{numref}`Not there {number} <test5>`
{numref}`Not there {number}`
.
<figure id="test3" class="numbered">
<img src="https://via.placeholder.com/150" alt="">
<figcaption number="1">
<p>Fig 1</p>
</figcaption>
</figure>
<figure id="test4" class="numbered">
<img src="https://via.placeholder.com/150" alt="">
<figcaption number="2">
<p>Fig 2</p>
</figcaption>
</figure>
<p>The reference to <a href="#test3" title="Fig 1">Fig 1</a> and <a href="#test4" title="Fig 2">Fig 2</a>.
<a href="#test3" title="Fig 1">Fig 1</a>
<a href="#test4" title="Fig 2">Fig 2</a>
<a href="#test3" title="Fig 1">Hi 1</a>
<a href="#test4" title="Fig 2">Hi 2</a>
<a href="#test3" title="Fig 1">This is 1: 1</a>
<a href="#test4" title="Fig 2">This is 2: 2</a>
<a href="#test4" title="Fig 2">This is 2: 2</a>
<span class="error">test5</span>
<span class="error">Not there &quot;test5&quot;</span>
<span class="error">Not there &quot;test5&quot;</span>
<span class="error">Not there {number}</span></p>
.
