// --- support stream class -------

class Stream {

    _val: string;
    _pos: number = 0;

    constructor(val: string) {

        this._val = val;
    }

    public get peek(): string {
        return this._val.charAt(this._pos);
    }

    public next(): void {
        this._pos++;
    }

    public get atEnd(): boolean {
        return this._pos >= this._val.length;
    }

    public skipSeparators(): void {
        while (this.isSeparator(this.peek)) {
            this.next();
        }
    }

    private isSeparator(s: string): boolean {
        return s == " " || s == "\t" || s == "\r" || s == "\n";
    }

}



	class SExpReader
    {

       
		
		private isAddPrefixToSymbols:boolean = false;
		
		constructor()
		{
		}
		
		public parseSexp(str:string, isAddPrefixToSymbols:boolean = false):any {
			this.isAddPrefixToSymbols = isAddPrefixToSymbols;
			return this.readStream(new Stream(str));	
		}

		public serializeSexp(sexp:any, isAddPrefixToSymbols:boolean = false):string {
			this.isAddPrefixToSymbols = isAddPrefixToSymbols;
            return this.serialize(sexp);
		}
		
		private regAlnum:RegExp = /[^A-Za-z0-9\+\-\=\*\?\_]/g;
		
        private serialize(sexp: any): string {
            if (sexp instanceof Array) {
				var ar:string[] = [];
				for(var i:number = 0; i < (<any[]> sexp).length; i++) {
					ar.push(this.serialize((<any[]> sexp)[i]));
				}
				return "("+ar.join(" ")+")";
			} else {
                if (typeof sexp === "number") {
					return (<number> sexp).toString();
                }
                if (typeof sexp === "string") {
					// some comples cases
					var s:string = sexp;
					if(this.isAddPrefixToSymbols) { // we want process identifiers with __?
						if(s.substr(0,2) == "__") { // is this identifier?
							return s.substr(2);
						} else {
							s = this.strReplace("\\", "\\\\", s);
                            s = this.strReplace("\"", "\\\"", s);
							return '"'+s+'"';
						}
                    } else { // we don't want identifiers with __
                        if (s.match(this.regAlnum) !== null || s.length == 0) { // this is NOT only alpha-numerical string?
                            s = this.strReplace("\\", "\\\\", s);
                            s = this.strReplace("\"", "\\\"", s);
							return '"'+s+'"'; // return with quotes
						} else {
                            return s; // alpha-numerical string returns without quotes
						}
					}
				}
			}
			return "";
		}
		
		public strReplace(replaceFrom:string, replaceTo:string, content:string): string {
			var tArr:any[] = content.split(replaceFrom);
			
			return tArr.join(replaceTo);
		} 
		
		private readStream(stream:Stream):any{
			
			stream.skipSeparators();
			// comments ; to \n
			if(stream.peek == ";"){
				stream.next();
				
				while(stream.peek != "\n" && stream.peek != "\r" ){
					if(stream.atEnd){
						//throw new Error("Quote expected!");
						break;
					}
					stream.next();
				}
				
				stream.next();
				return this.readStream(stream);				
			}
			
			// ( - list
			if(stream.peek == "("){
				stream.next();
                return this.readListRest(stream);
			}
			// atom
            return this.readAtom(stream);
		}
	
		
		
		private readListRest(stream:Stream):any{
			
			stream.skipSeparators();
			
			if(stream.atEnd){
				throw new Error("missing ')'")
			}
			
			if(stream.peek == ")"){
				stream.next();
				return new Array();
			}
			
			var element:any;
			var restElement:any;
			
            element = this.readStream(stream);
			
			stream.skipSeparators();
			
			var lc:any[] = new Array();
			
			if(stream.peek == ")"){ // initialize last element of lsit
				stream.next();				
				lc[0] = element;
				return lc;
			}
			
            // not last element? 
            lc = this.readListRest(stream); // read list to the end to LC
            this.sexpConsToRest(element,lc); // and attach current element to the LC
			
			return lc;
			
		}
		
		public sexpConsToRest(first:any, rest:any):void {
			(<any[]> rest).splice(0,0,first);
		}
		
		
		private readAtom(stream:Stream):any{
			
			var buffer:string = "";
			
			stream.skipSeparators();
			
			
			
			// string
			if(stream.peek == "\""){
				stream.next();
				
				while(stream.peek != "\""){
					if(stream.atEnd){
						throw new Error("Quote expected!");
                    }
                    // quoted symbol
					if(stream.peek != "\\") {
						buffer += stream.peek;
						
					} else {
						// immediately add quoted symbol
						stream.next(); 
						buffer += stream.peek;
					}
					stream.next();
				}
				
				stream.next();
				
				
				return buffer;
			}
			
            while (!stream.atEnd && stream.peek != " " && stream.peek != "(" && stream.peek != ")" && stream.peek != "\t" && stream.peek != "\n" && stream.peek != "\r" ){
				buffer += stream.peek;
				stream.next();
			}
			
            // is number?
            if (!isNaN(parseFloat(buffer))) {
				var num:number = parseFloat(buffer);
				// if no . then integer
				if(buffer.indexOf(".") == -1){
                    return parseInt(buffer);
				}
				else{
					return num;
				} 
			}
			
			if(this.isAddPrefixToSymbols) {
				return "__"+ buffer;
			}
			
			return buffer;

				
		}

		
	}
