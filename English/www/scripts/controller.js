function test() {
    Alert('function test()');
}

function hideAll() {
    //$("#frmStart").hide();
    $("#frmVerbs").hide();
    $("#frmWords").hide();
    $("#frmVerbs").hide();
    $("#frmList").hide();
}

function checkedValue(val) {
    if (val == 1)
        return "checked";
    else
        return "";
}

function addStrValue(value_text, value_text2, id, isChecked) {

    var value_t = "";
    if (value_text && value_text != "undefined")
        value_t = value_text;

    if (value_text2 && value_text2 != "undefined")
        value_t += (" - " + value_text2);

    var str = "<tr><td style='text-align:center'><input type='checkbox' style='zoom:4' onclick='onClickCheckBox(this);' value ='" + id + "' " + checkedValue(isChecked) + " ></td><td>" + value_t + "</td></tr>";
    $("#gridWords > tbody:last").after(str);
}

function getToastCountItems(itemsFound) {
    if (getSearchText() != "") {
        if (itemsFound > 0)
            window.plugins.toast.showShortBottom("There are " + itemsFound + " items");
        else
            window.plugins.toast.showShortBottom("Data didn't find");
    }
}

function setGridWordsBody(wordType) {
    $("#searchText").val("");
    clearTBody();
    currentWordType = wordType;
    var db = openDatabase();
    db.transaction(function (tx) {
        if (wordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            },function(tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (wordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + wordType + " order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function showCurrentForm(index) {
    hideAll();
    switch (index) {
        //case 0:
        //    $("#frmStart").show();
        //    break;
        case BTN_WORDS_PHRASES:
            $("#frmWords").show();
            break;
        case BTN_NEW_WORDS:
            setGridWordsBody(NEW);
            $("#frmList").show();
            break;
        case 0:
        case BTN_ALL_WORDS:
            setGridWordsBody(ALL);
            $("#frmList").show();
            break;
        case BTN_PHRASES:
            setGridWordsBody(PHRASES);
            $("#frmList").show();
            break;
        case BTN_ANY:
            setGridWordsBody(ANY);
            $("#frmList").show();
            break;
        case BTN_VERB:
            $("#frmVerbs").show();
            break;
        case BTN_VERBS:
            setGridWordsBody(VERB);
            $("#frmList").show();
            break;
        case BTN_VERBS_IRREG:
            setGridWordsBody(VERB_IRREG);
            $("#frmList").show();
            break;
        case BTN_HOUSE:
            setGridWordsBody(HOUSE);
            $("#frmList").show();
            break;
        case BTN_CLOTHING:
            setGridWordsBody(CLOTHING);
            $("#frmList").show();
            break;
        case BTN_FOOD:
            setGridWordsBody(FOOD);
            $("#frmList").show();
            break;
        case BTN_ADJECTIVE:
            setGridWordsBody(ADJECTIVE);
            $("#frmList").show();
            break;
        case BTN_OFFICE:
            setGridWordsBody(OFFICE);
            $("#frmList").show();
            break;
        case BTN_COLLOCATION:
            setGridWordsBody(COLLOCATION);
            $("#frmList").show();
            break;
        case BTN_TRANSPORT:
            setGridWordsBody(TRANSPORT);
            $("#frmList").show();
            break;
        case BTN_MONEY:
            setGridWordsBody(MONEY);
            $("#frmList").show();
            break;
        case BTN_NATURAL:
            setGridWordsBody(NATURAL);
            $("#frmList").show();
            break;
        case BTN_ANIMALS:
            setGridWordsBody(ANIMALS);
            $("#frmList").show();
            break;
        case BTN_REST:
            setGridWordsBody(REST);
            $("#frmList").show();
            break;
        case BTN_MEDICAL:
            setGridWordsBody(MEDICAL);
            $("#frmList").show();
            break;
        case BTN_IDIOM:
            setGridWordsBody(IDIOM);
            $("#frmList").show();
            break;
        case BTN_CRIME_PUNISHMENT:
            setGridWordsBody(CRIME_PUNISHMENT);
            $("#frmList").show();
            break;
        case BTN_PERSON_FAMILY:
            setGridWordsBody(PERSON_FAMILY);
            $("#frmList").show();
            break;
        case BTN_CHK_WORDS:
            setGridWordsBody(CHK);
            $("#frmList").show();
            break;
        case BTN_TONGUE_TWISTER:
            setGridWordsBody(TONGUE_TWISTER);
            $("#frmList").show();
            break;
        default:
    }
}

function onClickCheckBox(param) {
    var id = param.value;
    var isChecked = param.checked;

    var db = openDatabase();
    db.transaction(function (tx) {
        var chk = 0;
        if(isChecked == true)
            chk = 1;
        tx.executeSql("update words set is_checked = " + chk + " where id = " + id);
    });
}

function onClickButton(index) {
    currentForm = index;
    showCurrentForm(currentForm);
}

function clearTBody() {
    //$("#gridWords tbody tr").remove();
    //$("#gridWords").find("tr.body_caption, tr.body_caption_top").remove();
    //$("#tbodyid").empty();

    var table = document.getElementById("gridWords");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}


function getSearchText() {
    var str = $("#searchText").val().toLowerCase();
    return str;
}

function onClickButtonFind() {
    clearTBody();
    var db = openDatabase();
    db.transaction(function (tx) {
        if (currentWordType == ALL) {
            tx.executeSql("select * from vrows where (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (currentWordType == NEW) {
            tx.executeSql("select * from vrows where code = " + NEW + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else if (currentWordType == CHK) {
            tx.executeSql("select * from vrows where is_checked = 1 and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by id desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        } else {
            tx.executeSql("select * from vrows where code = " + currentWordType + " and (value_w like'%" + getSearchText() + "%' or value_w2 like'%" + getSearchText() + "%') order by value_w desc;", [], function (tx, res) {
                var cnt = res.rows.length;
                for (i = 0; i < cnt; i++) {
                    addStrValue(res.rows.item(i).value_w, res.rows.item(i).value_w2, res.rows.item(i).id, res.rows.item(i).is_checked);
                }
                getToastCountItems(cnt);
            }, function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
        }
    });
}

function onClickBack() {
    switch (currentForm) {
        case BTN_WORDS_PHRASES:
        case BTN_NEW_WORDS:
        case BTN_ALL_WORDS:
        case BTN_CHK_WORDS:
            currentForm = 0;
            showCurrentForm(currentForm);
            break;
        case BTN_PHRASES:
        case BTN_ANY:
        case BTN_VERB:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_VERBS_IRREG:
            currentForm = BTN_VERB;
            showCurrentForm(currentForm);
            break;
        case BTN_HOUSE:
        case BTN_CLOTHING:
        case BTN_FOOD:
        case BTN_ADJECTIVE:
        case BTN_OFFICE:
        case BTN_COLLOCATION:
        case BTN_TRANSPORT:
        case BTN_MONEY:
        case BTN_NATURAL:
        case BTN_ANIMALS:
        case BTN_REST:
        case BTN_MEDICAL:
        case BTN_IDIOM:
        case BTN_CRIME_PUNISHMENT:
        case BTN_PERSON_FAMILY:
            currentForm = BTN_WORDS_PHRASES;
            showCurrentForm(currentForm);
            break;
        default:
            navigator.app.exitApp();
    }
}