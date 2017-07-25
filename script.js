/*
x = @n 8
x = @s how kbgerk kjebgerk kerjbge
s = @n 7l7l7
show @s jgihoer ieuwrbguri wkrgheri
show @n kwjre

*/


function token (type,name,value){

   var data = {
      "type":type,
      "name":name,
      "value":value
   }

   return data

}

var WHITE_SPACE = " ";

var NEWLINE = "\n";
var NL = "NEWLINE";
var ASSIGN = "=";
var PRINT = "show";
var COMMENT = "#";
var STRING = "@s";
var NUM = "@n";
var VAR = "@v"
var EOF= "<EOF>";

var KEYWORDS = [NEWLINE, ASSIGN, PRINT, COMMENT, STRING, NUM, VAR, EOF];
var REP = [NL, ASSIGN, PRINT, COMMENT, STRING, NUM, VAR, EOF];

var global_vars = {

}

function lexicalAnalyser(area_id){
   var sourceText = document.getElementById(area_id).value;
   var treatedString = sourceText+EOF;
   for(var i=0;i<KEYWORDS.length;i++){
      treatedString=treatedString.replace(KEYWORDS[i],WHITE_SPACE + REP[i] + WHITE_SPACE);
   }
   console.log("treatedStr ->",treatedString);
   var statements = treatedString.split(WHITE_SPACE);

   return statements.filter(Boolean);
}

function tokeniser(statements){
   var tokens = [];
   var ongoingString =[];

   console.log("statements ->",statements);
   //for(var j=0;j<statements.length;j++){
      //var currentStatement = statements[j];
      //console.log("currentStatement ",currentStatement);
      var words = statements;//currentStatement.split(" ");
      var isStringOn = false;

      console.log("words ->",words);
      for(var i=0;i<words.length;i++){
         var currentWord = words[i];
         console.log("currentWord ->",currentWord);
         var nextWord = words[i+1];
         var previousWord = words[i-1];

         if( REP.indexOf(nextWord) > -1  === true){

            if (isStringOn === true){
                var stringToAdd = ongoingString.join(' ');
                console.log("added string ->",stringToAdd);
               tokens.push(token("data","string",stringToAdd));
               ongoingString = [];
               isStringOn = false;
            }
         }

         if(currentWord === ASSIGN){
            tokens.push(token("data","var_name",previousWord));
            tokens.push(token("operator","equal","="));
         }else
         if(currentWord === STRING){
            //tokens.push(token("specifier","str_specifier","@s"));
            isStringOn = true;
         }else
         if(currentWord === NUM){
            //tokens.push(token("specifier","num_specifier","@n"))
            tokens.push(token("data","number",nextWord));
         }else
         if(currentWord === VAR){//var
            //tokens.push(token("specifier","var_specifier","@v"))
            tokens.push(token("data","var_name",nextWord));
         }
         if(currentWord === COMMENT){
            tokens.push(token("specifier","num_specifier","@n"));
         }else
         if(currentWord === NL){
            tokens.push(token("char","new_line","--"));
         }else
         if(currentWord === PRINT){
            tokens.push(token("output","print","--"));
         }else
         if(isStringOn === true && currentWord != STRING){
            ongoingString.push(currentWord);
         }
         console.log("str status, isStringOn ->",isStringOn,"ongoingString ->",ongoingString);
      }
   //}

   return tokens;
}

//type name value
function parser(tokens, output_id){
   console.log("*** parser entered ***");
   var output = document.getElementById(output_id).value;
   for(var i=0; i<tokens.length; i++){
      var currentToken= tokens[i];
      var nextToken=tokens[i+1];
      var previousToken=tokens[i-1];

      if(currentToken["name"] === "equal"){
         global_vars[previousToken["value"]] = nextToken["value"];
      }else
      if(currentToken["name"] === "print"){
         printStatements=[];

         var x =1;
         while(tokens[i+x]["name"] != "new_line"  && tokens[i+x]["name"] != undefined){
            console.log("t i+x",tokens[i+x]["name"]);
            if(tokens[i+x]["name"] == "new_line"){
               break;
            }
            if(tokens[i+x]["name"] === "var_name"){
               printStatements.push(global_vars["value"]);
            }else{
               printStatements.push(tokens[i+x]["value"]);
            }
            x++;
         }

         var stringToPrint = printStatements.join(" ");
         output+=(stringToPrint+NEWLINE);
      }
   }

}

function printToks(tokens, tok_id){
   for(var i=0;i<tokens.length;i++){
   var data = tokens[i];
      document.getElementById(tok_id).value+=(data["name"]+data["value"]+data["type"]+NEWLINE);
   }
}

document.getElementById ("comp-but").addEventListener ("click", aaa, false);

function aaa(){
   printToks(tokeniser(lexicalAnalyser("source")), "tokens");
   parser(tokeniser(lexicalAnalyser("source")), "output");
}

