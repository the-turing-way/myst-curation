(index)=
# Index

## Favourites Example

I have put my favourites into a curation [here](#cur-my-favourites).
Here is MyST Markdown,

```markdown
:::{curation} My Favourites
---
depth: 3
description: >
  My favourite things in this book.
  Chosen by **me**.
  This description _can_ contain **Markdown** formatting, which is processed by [MyST](https://mystmd.org).
label: cur-my-favourites
---
- item: animals/cats.md
  children:
    - item: '#sec-cats-moggy-ringwald'
- item: cinemas/prince_charles.md
- item: places/lundy.md
:::
```

And it looks like this.

:::{curation} My Favourites
---
depth: 3
description: >
  My favourite things in this book.
  Chosen by **me**.
  This description _can_ contain **Markdown** formatting, which is processed by [MyST](https://mystmd.org).
label: cur-my-favourites
---
- item: animals/cats.md
  children:
    - item: '#sec-cats-moggy-ringwald'
- item: cinemas/prince_charles.md
- item: places/lundy.md
- item: '#cur-nesting'
:::

## Nesting Example

You can nest items using the `children` key.

```markdown
:::{curation} Nesting
---
depth: 3
description: >
  A nesting example.
label: cur-nesting
---
- item: '#index'
  children:
    - item: '#index'
      children:
        - item: '#index'
    - item: '#index'
      children:
        - item: '#index'
          children:
            - item: '#index'
              children:
                - item: '#index'
                  children:
                    - item: '#index'
:::
```

:::{curation} Nesting
---
depth: 3
description: >
  A nesting example.
label: cur-nesting
---
- item: '#index'
  children:
    - item: '#index'
      children:
        - item: '#index'
    - item: '#index'
      children:
        - item: '#index'
          children:
            - item: '#index'
              children:
                - item: '#index'
                  children:
                    - item: '#index'
:::
