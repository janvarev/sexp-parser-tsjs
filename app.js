/// <reference path="SExpReader.ts" />
window.onload = function () {
    var el = document.getElementById('content');
    var sread = new SExpReader();
    var txtFrom = document.getElementById("txtFrom");
    var txtTo = document.getElementById("txtTo");
    var chkAddPrefix = document.getElementById("chkIsAddPrefix");
    var btn1 = document.getElementById("btnSexpToJSON");
    btn1.onclick = function () {
        var ar = sread.parseSexp(txtFrom.value, chkAddPrefix.checked);
        txtTo.value = JSON.stringify(ar);
    };
    var btn2 = document.getElementById("btnJSONToSexp");
    btn2.onclick = function () {
        var ar = JSON.parse(txtTo.value);
        txtFrom.value = sread.serializeSexp(ar, chkAddPrefix.checked);
    };
};
//# sourceMappingURL=app.js.map