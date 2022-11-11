# Start
Make sure TypeScript is installed:
https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html

Compile project:
`tsc`

# Ideas
Query everything from layer1 where the size of the geometry is less than 100

`select * from layer1 where geometry.size < 100`

Query everything from layer1 where the size of the geometry is less than 100 and the type of the geometry is a polygon

`select * from layer1 where geometry.size < 100 and geometry.type == polygon`

Query everything from layer1 where adress of the feature equals "broadway"

`select * from layer1 where adress == "broadway"`

Query everything from layer1 where adress of the feature equals "broadway" but the feature shouldn't be a multipolygon

`select * from layer1 where adress == "broadway" and geometry.type != multipolygon`

Query every point from layer1 that intersects with dangerzone polygons of layer2

`select * from layer1 where geometry.type == "point" and Intersection(layer2.geometry.type == polygon && layer2.zoneType == "dangerzone")`

Query every point from layer1 that intersects with dangerzone polygons of layer2 and give selection a buffer of 30 and save it in variable x

`select * as x from layer1 where geometry.type == "point" and Intersection(layer2.geometry.type == polygon && layer2.zoneType == "dangerzone") apply Buffer(30)`

```
Keywords
select
from
where
*
polygon
multipolygon
point
line
function names = Intersection, Buffer
and
or
==
!=
<
<=
>
>=
"
```


https://css-tricks.com/lets-create-a-tiny-programming-language/