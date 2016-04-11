# sexp-parser-tsjs

S-expression parser for TypeScript&amp;JavaScript with sample HTML app

Parse S-expressions (https://en.wikipedia.org/wiki/S-expression) to array structure; also includes serialization.
Designed for use to make Domain-Specific Languages on S-expressions.

Parser support two modes, which differs in parsing identifiers:
* *isAddPrefixToSymbols = false* - standart, converts (1 (2 3) test "teststr" c) to [1,[2,3],"test","teststr","c"]
* *isAddPrefixToSymbols = true* - converts (1 (2 3) test "teststr" c) to [1,[2,3],"__test","teststr","__c"], add __ to unquoted identifiers. Allows differ identifiers from strings in interpreter.

Demo: http://d.janvarev.ru/sexp/sexp-parser-tsjs/

License: MIT
